"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

interface TimeSlotsProps {
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (slotId: string) => void;
}

export function TimeSlots({
  selectedDate,
  selectedTimeSlot,
  onTimeSlotSelect,
}: TimeSlotsProps) {
  const [bookingType, setBookingType] = useState<"cricket" | "booking">("booking");

  const dateString = selectedDate?.toISOString().split("T")[0];
  const { data: slots, isLoading } = api.timeSlot.getAllByDate.useQuery(
    { date: dateString ?? "" },
    { enabled: !!dateString }
  );

  if (!selectedDate) {
    return (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Select Time Slot</h2>
        <p className="text-muted-foreground">Please select a date first</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Time Slot</h2>
        <RadioGroup
          value={bookingType}
          onValueChange={(value) => setBookingType(value as "cricket" | "booking")}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cricket" id="cricket" />
            <Label htmlFor="cricket">Cricket</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="booking" id="booking" />
            <Label htmlFor="booking">Booking</Label>
          </div>
        </RadioGroup>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {slots?.map((slot) => {
            const isAvailable = slot.status === "available";
            const isSelected = selectedTimeSlot === slot.id.toString();
            return (
              <button
                key={slot.id}
                onClick={() => isAvailable && onTimeSlotSelect(slot.id.toString())}
                disabled={!isAvailable}
                className={cn(
                  "p-3 rounded-lg border text-center transition-colors",
                  isAvailable
                    ? isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                <div className="text-sm font-medium">
                  {slot.from.slice(0, 5)} - {slot.to.slice(0, 5)}
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}