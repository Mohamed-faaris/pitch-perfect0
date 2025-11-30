"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { BookingConfirmation } from "~/components/booking-confirmation";

interface PaymentOptionsProps {
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
}

export function PaymentOptions({ selectedDate, selectedTimeSlot }: PaymentOptionsProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentType, setPaymentType] = useState<"advance" | "full" | null>(null);

  const isEnabled = selectedDate && selectedTimeSlot;

  const handlePayment = (type: "advance" | "full") => {
    setPaymentType(type);
    setShowConfirmation(true);
  };

  return (
    <>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Payment</h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 h-12"
            disabled={!isEnabled}
            onClick={() => handlePayment("advance")}
          >
            ₹100 Advance
          </Button>
          <Button
            className="flex-1 h-12"
            disabled={!isEnabled}
            onClick={() => handlePayment("full")}
          >
            ₹800 Full
          </Button>
        </div>
      </div>

      {showConfirmation && paymentType && (
        <BookingConfirmation
          selectedDate={selectedDate!}
          selectedTimeSlot={selectedTimeSlot!}
          paymentType={paymentType}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
}