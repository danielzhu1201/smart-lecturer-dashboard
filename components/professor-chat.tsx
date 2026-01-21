"use client";

import type React from "react";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import type { Blueprint } from "@/types/lecture-navigator";

interface ProfessorChatProps {
  onSeek?: (seconds: number) => void;
  blueprint?: Blueprint;
}

export function ProfessorChat({ onSeek, blueprint }: ProfessorChatProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { messages, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const lastMessage = messages[messages.length - 1];
  const lastTextLength =
    lastMessage?.parts
      ?.filter((p) => p.type === "text")
      .map((p: any) => p.text)
      .join("")?.length ?? 0;
  const scrollKey = `${lastMessage?.id ?? "none"}:${lastTextLength}:${isLoading}`;

  // Keep the latest message visible as the conversation grows.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [scrollKey]);

  const TypingIndicator = () => (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-lg px-4 py-2 bg-muted text-foreground">
        <div className="flex items-center gap-1 h-5">
          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.2s]" />
          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.1s]" />
          <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      await sendMessage(
        { text: input },
        {
          body: {
            blueprint,
          },
        },
      );
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      // TODO: Show user-friendly error message
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[550px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Professor Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col gap-4">
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-4 pr-2">
          {messages.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8">
              Ask questions about the lecture content...
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.parts?.map((part, i) =>
                      part.type === "text" ? (
                        <span key={`${message.id}-${i}`}>{part.text}</span>
                      ) : null,
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the lecture..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
