"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
import { mockBlueprint } from "@/lib/mock-data";

interface LectureNavigatorProps {
  onSeek: (seconds: number) => void;
}

export function LectureNavigator({ onSeek }: LectureNavigatorProps) {
  const handleTimestampClick = (timestamp: string) => {
    const [minutes, seconds] = timestamp.split(":").map(Number);
    const totalSeconds = minutes * 60 + seconds;
    onSeek(totalSeconds);
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Lecture Navigator
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <Accordion type="single" collapsible className="w-full">
          {mockBlueprint.sections.map((section, idx) => (
            <AccordionItem key={idx} value={`section-${idx}`}>
              <AccordionTrigger className="text-sm font-semibold">
                {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pl-2">
                  {section.subsections.map((subsection, subIdx) => (
                    <div key={subIdx} className="flex items-start gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs font-mono text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() =>
                          handleTimestampClick(subsection.timestamp)
                        }
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {subsection.timestamp}
                      </Button>
                      <span className="text-sm flex-1 pt-1">
                        {subsection.title}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
