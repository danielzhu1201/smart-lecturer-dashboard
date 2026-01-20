import { NextRequest, NextResponse } from "next/server";
import { getGenAIClient } from "@/lib/geminiClient";

/**
 * --- Lecture Navigator Blueprint Schema ---
 * {
 *   sections: [
 *     {
 *       title: string,
 *       subsections: [
 *         { title: string, timestamp: "MM:SS" }
 *       ]
 *     }
 *   ]
 * }
 */

type BlueprintSection = {
  title: string;
  subsections: { title: string; timestamp: string }[];
};
type Blueprint = { sections: BlueprintSection[] };

/**
/**
 * Basic runtime check for sections/subsections/timestamp structure & MM:SS format
 */
function isValidBlueprint(obj: any): obj is Blueprint {
  // Accept either MM:SS (e.g., 03:14) or HH:MM:SS (e.g., 01:03:14)
  const timestampRe = /^(?:\d{1,2}:\d{2}|\d{2}:\d{2}:\d{2})$/;

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
        !timestampRe.test(sub.timestamp)
      ) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Generates an LLM prompt for structured video summary.
 */
function makeLLMPrompt(youtubeUrl: string) {
  return `
You are an expert AI assistant that helps students navigate and learn from video lectures.
Your task is to watch and analyze the YouTube video at the URL provided below and produce a structured lecture “navigator”.

Here is the YouTube video to analyze(uploaded as a file already):
${youtubeUrl}

Your output MUST be a single valid JSON object with the following format (NO markdown, no explanations):

{
  "sections": [
    {
      "title": "Section Example",
      "subsections": [
        { "title": "Subsection Example 1", "timestamp": "00:00" },
        { "title": "Subsection Example 2", "timestamp": "03:14" }
      ]
    }
  ]
}

Strict Instructions:
- Output ONLY valid, parsable JSON in the above shape (no markdown formatting, no comments, no extra text).
- Each section must have a "title" string.
- Each subsection must have BOTH a "title" and a "timestamp" string field.
- All timestamps must be in "HH:MM:SS" (hours:minutes:seconds, zero-padded) and represent the starting point of the subsection in the video.
- Each section MUST have between 3 and 5 subsections. NEVER output more than 5 subsections in a section.
- If a section would naturally have more than 5 topics, MERGE adjacent small/related topics into broader subsections so it stays within the 5-subsection limit.
- Subsection titles should be short (3–8 words), concrete, and reflect what’s happening at that moment (concept, derivation, example, or recap).
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
        { status: 400 }
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
    let blueprint: unknown = null;
    try {
      // If Gemini adds markdown code block, remove it
      const cleaned = llmResponse.replace(/^[`\s]*json\s*|[`]+$/gim, "").trim();
      blueprint = JSON.parse(cleaned);
    } catch (jsonErr) {
      return NextResponse.json(
        { error: "Gemini response was not valid JSON", details: llmResponse },
        { status: 422 }
      );
    }

    if (!isValidBlueprint(blueprint)) {
      return NextResponse.json(
        {
          error: "LLM response did not match expected lecture navigator schema",
          details: blueprint,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ blueprint });
  } catch (err: any) {
    console.error("[process-video]", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message },
      { status: 500 }
    );
  }
}
