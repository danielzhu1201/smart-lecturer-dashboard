import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import type { Blueprint } from "@/types/lecture-navigator";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function approxTokens(text: string) {
  // Very rough heuristic widely used for English text.
  // Good enough for logging/debugging, not billing-accurate.
  return Math.ceil(text.length / 4);
}

function stringifyForLog(value: unknown, maxChars = 20_000) {
  const str =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return str.length > maxChars
    ? str.slice(0, maxChars) + "\n…(truncated)"
    : str;
}

function blueprintToSystemMessage(blueprint: Blueprint): string {
  const outline = blueprint.sections
    .map((section) => {
      const subs = section.subsections
        .map((sub) => `- [${sub.timestamp}] ${sub.title}: ${sub.summary}`)
        .join("\n");
      return `Section: ${section.title}\n${subs}`;
    })
    .join("\n\n");

  return [
    "ROLE",
    "- You are a knowledgeable professor helping a student understand the current lecture.",
    "",
    "OBJECTIVE",
    "- Answer the student's questions using ONLY the lecture blueprint below as ground truth.",
    "",
    "GROUND TRUTH POLICY",
    "- If the blueprint does not contain enough information to answer, say so and ask a clarifying question.",
    "- Do not invent topics, claims, or timestamps that are not supported by the blueprint.",
    "",
    "CITATIONS / TIMESTAMPS",
    "- When referencing a specific part of the lecture, ALWAYS include a clickable timestamp in HH:MM:SS format.",
    "- The timestamp must appear verbatim in your response, e.g. 00:12:34.",
    "",
    "LECTURE BLUEPRINT",
    outline,
  ].join("\n");
}

export async function POST(req: Request) {
  const {
    messages,
    blueprint,
  }: { messages: UIMessage[]; blueprint: Blueprint } = await req.json();

  const trimmedUiMessages = messages.length > 4 ? messages.slice(-3) : messages;

  const system = blueprintToSystemMessage(blueprint);
  const fullModelMessages = await convertToModelMessages(messages);
  const modelMessages =
    trimmedUiMessages === messages
      ? fullModelMessages
      : await convertToModelMessages(trimmedUiMessages);

  // Debug logging for exactly what we send to the LLM + approximate token counts.
  if (process.env.NODE_ENV !== "production") {
    const systemTokens = approxTokens(system);
    const fullPerMessage = fullModelMessages.map((m: any, idx: number) => {
      const content =
        typeof m.content === "string" ? m.content : JSON.stringify(m.content);

      return {
        index: idx,
        role: m.role,
        approxTokens: approxTokens(content),
      };
    });
    const fullTotalTokens =
      systemTokens + fullPerMessage.reduce((sum, m) => sum + m.approxTokens, 0);

    const perMessage = modelMessages.map((m: any, idx: number) => {
      const content =
        typeof m.content === "string" ? m.content : JSON.stringify(m.content);

      return {
        index: idx,
        role: m.role,
        approxTokens: approxTokens(content),
      };
    });
    const totalTokens =
      systemTokens + perMessage.reduce((sum, m) => sum + m.approxTokens, 0);

    console.log("[chat] uiMessages.count:", messages.length);
    console.log("[chat] uiMessages.trimmedCount:", trimmedUiMessages.length);
    console.log("[chat] approxTokens.total.full:", fullTotalTokens);
    console.log("[chat] approxTokens.total.trimmed:", totalTokens);
    console.log(
      "[chat] approxTokens.total.saved:",
      fullTotalTokens - totalTokens,
    );

    console.log("[chat] LLM payload.system:\n" + stringifyForLog(system));
    console.log(
      "[chat] LLM payload.messages:\n" + stringifyForLog(modelMessages),
    );
    console.log("[chat] approxTokens.system:", systemTokens);
    console.log("[chat] approxTokens.perMessage:", perMessage);
    console.log("[chat] approxTokens.total:", totalTokens);
  }

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
