"use client";

import React, { useRef } from "react";
import ReactPlayer from "react-player";
import { LectureNavigator } from "@/components/lecture-navigator";
import { ProfessorChat } from "@/components/professor-chat";
import { StudyTools } from "@/components/study-tools";

import { BlueprintSection } from "@/types/lecture-navigator";

interface DashboardViewProps {
  youtubeUrl: string;
  sections?: BlueprintSection[]; // new prop
}

export function DashboardView({ youtubeUrl, sections }: DashboardViewProps) {
  // Use `any` to avoid TypeScript issues with ReactPlayer refs; see react-player docs for details.
  const playerRef = useRef<any>(null);

  const handleSeek = (seconds: number) => {
    if (playerRef.current.seekTo) {
      playerRef.current.seekTo(seconds, "seconds");
    } else {
      // Fallback to native property
      playerRef.current.currentTime = seconds;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Video and Study Tools */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <ReactPlayer
              ref={playerRef}
              src={youtubeUrl}
              width="100%"
              height="100%"
              controls
            />
          </div>
          <StudyTools />
        </div>

        {/* Right Sidebar - Navigator and Chat */}
        <div className="lg:col-span-1 space-y-6">
          <LectureNavigator onSeek={handleSeek} sections={sections} />
          <ProfessorChat onSeek={handleSeek} />
        </div>
      </div>
    </div>
  );
}
