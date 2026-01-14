import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  // Mock AI responses with interactive citations
  const userMessage = messages[messages.length - 1]?.parts.find((p) => p.type === "text")?.text || ""

  // Detect if this is the first message or a simple query
  const mockResponse = generateMockResponse(userMessage)

  const result = streamText({
    model: "openai/gpt-5-mini",
    prompt: [
      {
        role: "system",
        content: `You are an AI professor helping students understand lecture content. 
        Always include timestamp citations in your responses using the format [MM:SS] when referencing specific parts of the lecture.
        Be educational, clear, and encouraging. Use timestamps from the lecture blueprint.
        Example timestamps: [2:15], [8:45], [16:10], [23:45], [32:00]`,
      },
      ...prompt,
    ],
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] Chat aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}

function generateMockResponse(query: string): string {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("supervised") || lowerQuery.includes("learning")) {
    return `Great question! Supervised learning is covered extensively in the lecture. Let me break it down:

At [2:15], the professor introduces the concept of machine learning and its core types. Supervised learning specifically involves learning from labeled data - meaning we have input-output pairs to train on.

The lecture then dives deeper at [8:45] explaining regression problems (predicting continuous values) and at [12:20] covering classification problems (predicting categories).

A key concept mentioned at [16:10] is the importance of splitting data into training and test sets to evaluate model performance properly.

Would you like me to explain any of these concepts in more detail?`
  }

  if (lowerQuery.includes("gradient") || lowerQuery.includes("descent")) {
    return `Gradient descent is a fundamental optimization algorithm! The professor explains this beautifully:

At [23:45], the core concept is introduced: gradient descent iteratively adjusts model parameters to minimize the cost function by following the direction of steepest descent.

The lecture emphasizes at [28:15] why feature scaling is crucial - it ensures gradient descent converges faster and more reliably.

Think of it like hiking down a mountain in fog - you can only see your immediate surroundings, so you take steps in the direction that goes down most steeply. Eventually, you reach the valley (minimum).

Want to explore the mathematical details or see how it applies to linear regression?`
  }

  // Default response
  return `That's an interesting question! Let me point you to the relevant sections:

The lecture covers this topic across several sections. I'd recommend reviewing:
- [2:15] for foundational concepts
- [12:20] for practical applications
- [23:45] for the mathematical framework

Which aspect would you like me to elaborate on?`
}
