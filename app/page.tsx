"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { DashboardView } from "@/components/dashboard-view";
import { LoadingState } from "@/components/loading-state";

import { Blueprint, Flashcard } from "@/types/lecture-navigator";

export default function Home() {
  const [appState, setAppState] = useState<"initial" | "loading" | "active">(
    "initial",
  );
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcessVideo = async (url: string) => {
    setYoutubeUrl(url);
    setAppState("loading");
    setBlueprint(null);
    setFlashcards(null);
    setError(null);
    try {
      const res = await fetch("/api/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Processing failed");
      setBlueprint(data.blueprint);
      setFlashcards(data.flashcards);
      setAppState("active");
    } catch (e: any) {
      setError(e.message);
      setAppState("initial");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onProcessVideo={handleProcessVideo}
        disabled={appState === "loading"}
      />

      <main className="pt-20">
        {appState === "initial" && (
          <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-4xl font-bold text-balance">
                Transform Lectures into Learning
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Enter a YouTube URL above to analyze lecture content, generate
                study materials, and chat with an AI professor about the
                concepts.
              </p>
              {error && (
                <div className="text-red-500 text-sm pt-4">{error}</div>
              )}
            </div>
          </div>
        )}

        {appState === "loading" && <LoadingState />}

        {appState === "active" && blueprint && (
          <DashboardView
            youtubeUrl={youtubeUrl}
            blueprint={blueprint}
            sections={blueprint.sections}
            flashcards={flashcards}
          />
        )}
      </main>
    </div>
  );
}
