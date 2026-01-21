import { NextRequest, NextResponse } from "next/server";
import { getGenAIClient } from "@/lib/geminiClient";

type BlueprintSection = {
  title: string;
  subsections: { title: string; timestamp: string; summary: string }[];
};
type Blueprint = { sections: BlueprintSection[] };

type Flashcard = {
  question: string;
  answer: string;
};

type ProcessVideoPayload = {
  blueprint: Blueprint;
  flashcards: Flashcard[];
};

/**
 * Basic runtime check for sections/subsections/timestamp structure & MM:SS format
 */
function isValidBlueprint(obj: any): obj is Blueprint {
  // Enforce HH:MM:SS (e.g., 01:03:14) only
  const timestampRe = /^\d{2}:\d{2}:\d{2}$/;

  if (!obj || typeof obj !== "object" || !Array.isArray(obj.sections)) {
    return false;
  }
  for (const section of obj.sections) {
    if (
      typeof section.title !== "string" ||
      !Array.isArray(section.subsections)
    )
      return false;
    for (const sub of section.subsections) {
      if (
        typeof sub.title !== "string" ||
        typeof sub.timestamp !== "string" ||
        !timestampRe.test(sub.timestamp) ||
        typeof sub.summary !== "string" ||
        sub.summary.trim().length === 0
      ) {
        return false;
      }
    }
  }
  return true;
}

function isValidFlashcards(obj: any): obj is Flashcard[] {
  if (!Array.isArray(obj) || obj.length !== 20) return false;
  for (const card of obj) {
    if (!card || typeof card !== "object") return false;
    if (typeof card.question !== "string" || card.question.trim().length === 0)
      return false;
    if (typeof card.answer !== "string" || card.answer.trim().length === 0)
      return false;
  }
  return true;
}

/**
 * Generates an LLM prompt for structured video summary.
 */
function makeLLMPrompt(youtubeUrl: string) {
  return `
You are an expert AI assistant that helps students navigate and learn from video lectures.
Your task is to watch and analyze the YouTube video at the URL provided below and produce:
1) a structured lecture “navigator” (blueprint)
2) 20 Quizlet-style flashcards (question/answer)

Here is the YouTube video to analyze(uploaded as a file already):
${youtubeUrl}

Your output MUST be a single valid JSON object with the following format (NO markdown, no explanations):

{
  "blueprint": {
    "sections": [
      {
        "title": "Section Example",
        "subsections": [
          { "title": "Subsection Example 1", "timestamp": "00:00:00", "summary": "3–5 sentences summarizing what is covered in this subsection." },
          { "title": "Subsection Example 2", "timestamp": "00:03:14", "summary": "3–5 sentences summarizing what is covered in this subsection." }
        ]
      }
    ]
  },
  "flashcards": [
    { "question": "Question 1", "answer": "Answer 1" }
  ]
}

Strict Instructions:
- Output ONLY valid, parsable JSON in the above shape (no markdown formatting, no comments, no extra text).
- The top-level object MUST have exactly two keys: "blueprint" and "flashcards".

Blueprint rules:
- The "blueprint" value MUST match this schema:
  { "sections": [ { "title": string, "subsections": [ { "title": string, "timestamp": string, "summary": string } ] } ] }
- Each section must have a "title" string.
- Each subsection must have BOTH a "title" and a "timestamp" string field.
- Each subsection MUST also include a "summary" string field.
- Each "summary" must be 3–5 complete sentences (plain text). It should concisely explain the key ideas, definitions, and/or example(s) covered in that subsection.
- Do not use bullet points in summaries. Do not mention that you are an AI. Do not refer to "the video"; summarize the content directly.
- All timestamps MUST be in "HH:MM:SS" (hours:minutes:seconds, zero-padded) and represent the starting point of the subsection in the video.
- Timestamp formatting MUST be strictly zero-padded to 2 digits per field:
  - 53 seconds => "00:00:53" (NOT "00:53:00")
  - 5 minutes 2 seconds => "00:05:02"
  - 1 hour 3 minutes 14 seconds => "01:03:14"
- Timestamps must be valid clock values (MM and SS must be 00–59).
- Timestamps should be monotonically increasing within the lecture timeline.
- Each section MUST have between 3 and 5 subsections. NEVER output more than 5 subsections in a section.
- If a section would naturally have more than 5 topics, MERGE adjacent small/related topics into broader subsections so it stays within the 5-subsection limit.
- Subsection titles should be short (3–8 words), concrete, and reflect what’s happening at that moment (concept, derivation, example, or recap).

Flashcard rules:
- "flashcards" MUST be an array of exactly 20 items.
- Each item must be: { "question": string, "answer": string }
- Questions should be short and test understanding of the lecture.
- Answers should be concise (prefer 1–3 sentences). Use plain text only.
- Do not reference timestamps in flashcards.

- If exact timestamp is uncertain, make your most reasonable guess based on video flow.
- Do not include any non-JSON text, explanations, markdown, or notes.
`;
}
/**
 * Next.js Route Handler: although not directly used in this file,
 * the POST function must be exported and discovered by Next.js routing.
 * eslint-disable-next-line @typescript-eslint/no-unused-vars
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const youtubeUrl: string = body.youtubeUrl;
    if (!youtubeUrl || typeof youtubeUrl !== "string") {
      return NextResponse.json(
        { error: "Missing youtubeUrl" },
        { status: 400 },
      );
    }

    const prompt = makeLLMPrompt(youtubeUrl);

    console.log("[process-video] Sending prompt to Gemini: ", prompt);

    const geminiClient = getGenAIClient();

    // Define the video as a part of the content
    const videoPart = {
      fileData: {
        fileUri: youtubeUrl,
        mimeType: "video/mp4", // Use video/mp4 for YouTube URLs in the API
      },
    };

    console.log("[process-video] Sending video part to Gemini: ", videoPart);

    // Send both parts to the model
    const result = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [videoPart, prompt],
    });
    const llmResponse = (await result.text) || "";

    console.log("[process-video] LLM Response:", llmResponse);

    // Try to parse and validate the JSON response
    let payload: unknown = null;
    try {
      // If Gemini adds markdown code block, remove it
      const cleaned = llmResponse.replace(/^[`\s]*json\s*|[`]+$/gim, "").trim();
      payload = JSON.parse(cleaned);
    } catch (jsonErr) {
      return NextResponse.json(
        { error: "Gemini response was not valid JSON", details: llmResponse },
        { status: 422 },
      );
    }

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Gemini response was not a JSON object", details: payload },
        { status: 422 },
      );
    }

    const maybePayload = payload as any;
    const blueprint = maybePayload.blueprint;
    const flashcards = maybePayload.flashcards;

    if (!isValidBlueprint(blueprint)) {
      return NextResponse.json(
        {
          error: "LLM response did not match expected lecture navigator schema",
          details: blueprint,
        },
        { status: 422 },
      );
    }

    if (!isValidFlashcards(flashcards)) {
      return NextResponse.json(
        {
          error: "LLM response did not match expected flashcards schema",
          details: flashcards,
        },
        { status: 422 },
      );
    }

    const response: ProcessVideoPayload = { blueprint, flashcards };
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("[process-video]", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message },
      { status: 500 },
    );
  }
}
