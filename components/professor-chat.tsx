"use client";

import type React from "react";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Clock } from "lucide-react";

interface ProfessorChatProps {
  onSeek?: (seconds: number) => void;
}

export function ProfessorChat({ onSeek }: ProfessorChatProps) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleTimestampClick = (timestamp: string) => {
    if (!onSeek) return;
    const [minutes, seconds] = timestamp.split(":").map(Number);
    const totalSeconds = minutes * 60 + seconds;
    onSeek(totalSeconds);
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Professor Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8">
              Ask questions about the lecture content...
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.parts.map((part, idx) => {
                    if (part.type === "text") {
                      // Check for timestamp patterns in assistant messages
                      if (message.role === "assistant") {
                        const timestampRegex = /\[(\d{1,2}:\d{2})\]/g;
                        const text = part.text;
                        const parts = [];
                        let lastIndex = 0;
                        let match;

                        while ((match = timestampRegex.exec(text)) !== null) {
                          // Add text before timestamp
                          if (match.index > lastIndex) {
                            parts.push(text.slice(lastIndex, match.index));
                          }
                          // Add timestamp button
                          const timestamp = match[1];
                          parts.push(
                            <Button
                              key={`ts-${idx}-${match.index}`}
                              variant="secondary"
                              size="sm"
                              className="h-6 px-2 mx-1 text-xs font-mono inline-flex items-center"
                              onClick={() => handleTimestampClick(timestamp)}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {timestamp}
                            </Button>
                          );
                          lastIndex = match.index + match[0].length;
                        }

                        // Add remaining text
                        if (lastIndex < text.length) {
                          parts.push(text.slice(lastIndex));
                        }

                        return (
                          <div key={idx}>{parts.length > 0 ? parts : text}</div>
                        );
                      }
                      return <div key={idx}>{part.text}</div>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}

          {status === "streaming" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the lecture..."
            disabled={status !== "ready"}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={status !== "ready" || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
