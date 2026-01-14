"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";

interface ProfessorChatProps {
  onSeek?: (seconds: number) => void;
}

interface Message {
  id: string;
  text: string;
}

export function ProfessorChat({ onSeek }: ProfessorChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // Handle message send (user only, no backend/api call)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, text: input.trim() },
    ]);
    setInput("");
    // TODO: Integrate Gemini chat here in the future. Call Gemini API and append assistant messages.
  };

  return (
    <Card className="h-[550px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Professor Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8">
              Ask questions about the lecture content...
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-lg px-4 py-2 bg-primary text-primary-foreground">
                <div className="text-sm whitespace-pre-wrap">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
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
