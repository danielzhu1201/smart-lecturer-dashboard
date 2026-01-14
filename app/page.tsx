"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { DashboardView } from "@/components/dashboard-view"
import { LoadingState } from "@/components/loading-state"

export default function Home() {
  const [appState, setAppState] = useState<"initial" | "loading" | "active">("initial")
  const [youtubeUrl, setYoutubeUrl] = useState("")

  const handleProcessVideo = (url: string) => {
    setYoutubeUrl(url)
    setAppState("loading")

    // 2-second loading state as specified
    setTimeout(() => {
      setAppState("active")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onProcessVideo={handleProcessVideo} disabled={appState === "loading"} />

      <main className="pt-20">
        {appState === "initial" && (
          <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-4xl font-bold text-balance">Transform Lectures into Learning</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Enter a YouTube URL above to analyze lecture content, generate study materials, and chat with an AI
                professor about the concepts.
              </p>
            </div>
          </div>
        )}

        {appState === "loading" && <LoadingState />}

        {appState === "active" && <DashboardView youtubeUrl={youtubeUrl} />}
      </main>
    </div>
  )
}
