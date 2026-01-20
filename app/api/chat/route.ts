import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system:
      "You are a knowledgeable professor. Help answer all questions regarding the current video lecture as clearly and accurately as possible.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
