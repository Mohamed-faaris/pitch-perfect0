"use client";

import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Download } from "lucide-react";

interface BookingConfirmationProps {
  selectedDate: Date;
  selectedTimeSlot: string;
  paymentType: "advance" | "full";
  onClose: () => void;
}

export function BookingConfirmation({
  selectedDate,
  selectedTimeSlot,
  paymentType,
  onClose,
}: BookingConfirmationProps) {
  // Generate a random 4-digit verification code
  const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const amount = paymentType === "advance" ? 100 : 800;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div>
              <span className="font-semibold">Date:</span> {format(selectedDate, "PPP")}
            </div>
            <div>
              <span className="font-semibold">Time:</span> {selectedTimeSlot}
            </div>
            <div>
              <span className="font-semibold">Amount Paid:</span> ₹{amount}
            </div>
            <div>
              <span className="font-semibold">Verification Code:</span>{" "}
              <span className="text-lg font-bold text-blue-600">{verificationCode}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}