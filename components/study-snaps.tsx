"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockFlashcards } from "@/lib/mock-data"

export function StudySnaps() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % mockFlashcards.length)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + mockFlashcards.length) % mockFlashcards.length)
  }

  const currentCard = mockFlashcards[currentIndex]

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative w-full h-64 cursor-pointer perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute w-full h-full backface-hidden rounded-lg border-2 border-primary bg-card p-8 flex items-center justify-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="text-center space-y-4">
                <div className="text-xs font-semibold text-primary uppercase tracking-wide">Question</div>
                <p className="text-lg font-medium text-balance">{currentCard.question}</p>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute w-full h-full backface-hidden rounded-lg border-2 border-accent bg-card p-8 flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="text-center space-y-4">
                <div className="text-xs font-semibold text-accent uppercase tracking-wide">Answer</div>
                <p className="text-base text-balance">{currentCard.answer}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Click to flip • {currentIndex + 1} / {mockFlashcards.length}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={handlePrevious} disabled={mockFlashcards.length <= 1}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <Button variant="outline" size="sm" onClick={handleNext} disabled={mockFlashcards.length <= 1}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
