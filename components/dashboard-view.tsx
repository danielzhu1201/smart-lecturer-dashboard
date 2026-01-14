"use client";

import React, { useRef } from "react";
import ReactPlayer from "react-player";
import { LectureNavigator } from "@/components/lecture-navigator";
import { ProfessorChat } from "@/components/professor-chat";
import { StudyTools } from "@/components/study-tools";

interface DashboardViewProps {
  youtubeUrl: string;
}

export function DashboardView({ youtubeUrl }: DashboardViewProps) {
  const playerRef = useRef<ReactPlayer | null>(null);

  const handleSeek = (seconds: number) => {
    // @ts-ignore: ReactPlayer type doesn't always include seekTo on ref, but method exists
    playerRef.current?.seekTo(seconds, "seconds");
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Video and Study Tools */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <ReactPlayer
              ref={playerRef}
              url={youtubeUrl}
              width="100%"
              height="100%"
              controls
              config={{
                youtube: {
                  playerVars: { showinfo: 1 },
                },
              }}
            />
          </div>
          <StudyTools />
        </div>

        {/* Right Sidebar - Navigator and Chat */}
        <div className="lg:col-span-1 space-y-6">
          <LectureNavigator onSeek={handleSeek} />
          <ProfessorChat onSeek={handleSeek} />
        </div>
      </div>
    </div>
  );
}
