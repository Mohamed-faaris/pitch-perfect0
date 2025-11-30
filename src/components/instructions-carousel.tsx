"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

const instructions = [
  "Select your preferred date from the available slots.",
  "Choose a time slot that suits your schedule.",
  "Enter your details and select payment option.",
  "Complete payment and receive confirmation.",
];

export function InstructionsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % instructions.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + instructions.length) % instructions.length);
  };

  return (
    <div className="bg-card rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">How to Book</h2>
      <div className="relative">
        <div className="h-20 flex items-center justify-center text-center">
          <p className="text-sm">{instructions[currentIndex]}</p>
        </div>
        <div className="flex justify-between mt-2">
          <Button variant="outline" size="sm" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} / {instructions.length}
          </span>
          <Button variant="outline" size="sm" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}