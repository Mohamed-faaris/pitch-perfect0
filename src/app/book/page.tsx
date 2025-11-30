"use client";

import { useState } from "react";
import { DateSelector } from "~/components/date-selector";
import { TimeSlots } from "~/components/time-slots";
import { PaymentOptions } from "~/components/payment-options";

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  return (
    <div className="min-h-screen pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6">Booking</h1>

      <div className="space-y-6">
        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <TimeSlots
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onTimeSlotSelect={setSelectedTimeSlot}
        />

        <PaymentOptions
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
        />
      </div>
    </div>
  );
}