"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Network } from "lucide-react"
import { StudySnaps } from "@/components/study-snaps"
import { KnowledgeMap } from "@/components/knowledge-map"

export function StudyTools() {
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [showKnowledgeMap, setShowKnowledgeMap] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => setShowFlashcards(!showFlashcards)}
            variant={showFlashcards ? "default" : "outline"}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {showFlashcards ? "Hide" : "Generate"} Study Snaps
          </Button>

          <Button
            onClick={() => setShowKnowledgeMap(!showKnowledgeMap)}
            variant={showKnowledgeMap ? "default" : "outline"}
            className="gap-2"
          >
            <Network className="h-4 w-4" />
            {showKnowledgeMap ? "Hide" : "Generate"} Knowledge Map
          </Button>
        </div>

        {showFlashcards && (
          <div>
            <h3 className="text-sm font-semibold mb-4">Study Snaps</h3>
            <StudySnaps />
          </div>
        )}

        {showKnowledgeMap && (
          <div>
            <h3 className="text-sm font-semibold mb-4">Knowledge Map</h3>
            <KnowledgeMap />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
