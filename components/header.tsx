"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GraduationCap, Play } from "lucide-react"

interface HeaderProps {
  onProcessVideo: (url: string) => void
  disabled?: boolean
}

export function Header({ onProcessVideo, disabled }: HeaderProps) {
  const [url, setUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onProcessVideo(url)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center gap-4 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold">Smart Lecturer</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 max-w-2xl mx-auto gap-2">
          <Input
            type="url"
            placeholder="Enter YouTube URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={disabled || !url.trim()} size="default">
            <Play className="mr-2 h-4 w-4" />
            Process Video
          </Button>
        </form>
      </div>
    </header>
  )
}
