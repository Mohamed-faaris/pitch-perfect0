"use client";

import { format, addDays } from "date-fns";
import { cn } from "~/lib/utils";

interface DateSelectorProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateSelect }: DateSelectorProps) {
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Select Date</h2>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dates.map((date) => {
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg border min-w-20 transition-colors",
                isSelected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              <span className={cn("text-sm font-medium", isSelected && "font-bold")}>
                {format(date, "EEE")}
              </span>
              <span className={cn("text-lg font-bold", isSelected && "text-blue-600")}>
                {format(date, "d")}
              </span>
              {isSelected && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
              )}
              {isSelected && (
                <div className="w-full h-0.5 bg-blue-500 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}