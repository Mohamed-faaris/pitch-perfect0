"use client";

import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { motion } from "motion/react";
import { api } from "~/trpc/react";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";

type TimeSlot = {
  id: number;
  from: string;
  to: string;
  date: string;
  status: "available" | "booked" | "unavailable" | "bookingInProgress";
};

type BookingType = "cricket" | "football";
type PaymentType = "advance" | "full";

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingType, setBookingType] = useState<BookingType | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    alternateContactName: "",
    alternateContactNumber: "",
  });

  // Get available dates (today + next 6 days = 7 days total)
  const availableDates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Fetch time slots for selected date
  const { data: timeSlots = [], isLoading } = api.timeSlot.getByDate.useQuery({
    date: format(selectedDate, "yyyy-MM-dd"),
  });

  // Create customer mutation
  const createCustomer = api.customer.create.useMutation();

  // Create booking mutation
  const createBooking = api.booking.create.useMutation({
    onSuccess: (data) => {
      setBookingDetails(data);
      setShowConfirmation(true);
      
      // Trigger confetti
      const end = Date.now() + 3 * 1000;
      const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
    },
  });

  const isFormValid =
    selectedDate &&
    selectedSlot &&
    bookingType &&
    paymentType &&
    formData.name &&
    formData.number &&
    formData.alternateContactName &&
    formData.alternateContactNumber;

  const handlePayNow = async () => {
    if (!isFormValid || !selectedSlot || !bookingType || !paymentType) return;

    try {
      // First create/update customer
      await createCustomer.mutateAsync({
        name: formData.name,
        number: formData.number,
        email: formData.email || undefined,
        alternateContactName: formData.alternateContactName,
        alternateContactNumber: formData.alternateContactNumber,
      });

      // Then create booking
      await createBooking.mutateAsync({
        number: formData.number,
        timeSlotId: selectedSlot.id,
        bookingType,
        paymentType,
      });
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Booking</h1>
          <p className="text-muted-foreground">Select your slot and details</p>
        </div>

        {/* Date Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="flex gap-3 pb-4">
                {availableDates.map((date) => {
                  const isSelected = isSameDay(date, selectedDate);
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={`flex min-w-[80px] flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground">
                        {format(date, "EEE")}
                      </span>
                      <span className={`text-lg font-bold ${isSelected ? "text-primary" : ""}`}>
                        {format(date, "dd")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(date, "MMM")}
                      </span>
                      {isSelected && (
                        <div className="mt-1 h-1 w-1 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle>Available Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot: TimeSlot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isAvailable = slot.status === "available";

                  return (
                    <button
                      key={slot.id}
                      onClick={() => isAvailable && setSelectedSlot(slot)}
                      disabled={!isAvailable}
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        !isAvailable
                          ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                          : isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {slot.from} - {slot.to}
                      </div>
                      {isSelected && <div className="mt-1 h-1 w-1 mx-auto rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </div>
            )}
            {!isLoading && timeSlots.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No slots available for this date
              </p>
            )}
          </CardContent>
        </Card>

        {/* Booking Type & Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Type */}
            <div className="space-y-3">
              <Label>Sport</Label>
              <RadioGroup
                value={bookingType || ""}
                onValueChange={(value) => setBookingType(value as BookingType)}
                disabled={!selectedDate || !selectedSlot}
                className="flex gap-3"
              >
                <div className="flex-1">
                  <RadioGroupItem value="cricket" id="cricket" className="peer sr-only" />
                  <Label
                    htmlFor="cricket"
                    className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${
                      bookingType === "cricket"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    Cricket
                  </Label>
                </div>
                <div className="flex-1">
                  <RadioGroupItem value="football" id="football" className="peer sr-only" />
                  <Label
                    htmlFor="football"
                    className={`flex cursor-pointer items-center justify-center rounded-lg border-2 p-3 transition-all peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${
                      bookingType === "football"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    Football
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Type */}
            <div className="space-y-3">
              <Label>Payment</Label>
              <div className="flex gap-3">
                <Button
                  variant={paymentType === "advance" ? "default" : "outline"}
                  onClick={() => setPaymentType("advance")}
                  disabled={!selectedDate || !selectedSlot}
                  className="flex-1"
                >
                  ₹100 Advance
                </Button>
                <Button
                  variant={paymentType === "full" ? "default" : "outline"}
                  onClick={() => setPaymentType("full")}
                  disabled={!selectedDate || !selectedSlot}
                  className="flex-1"
                >
                  ₹800 Full
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Details */}
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Phone Number *</Label>
              <Input
                id="number"
                type="tel"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altName">Alternate Contact Name *</Label>
              <Input
                id="altName"
                value={formData.alternateContactName}
                onChange={(e) =>
                  setFormData({ ...formData, alternateContactName: e.target.value })
                }
                placeholder="Enter alternate contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altNumber">Alternate Contact Number *</Label>
              <Input
                id="altNumber"
                type="tel"
                value={formData.alternateContactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, alternateContactNumber: e.target.value })
                }
                placeholder="Enter alternate contact number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pay Now Button */}
        <Button
          onClick={handlePayNow}
          disabled={!isFormValid || createBooking.isPending}
          className="w-full"
          size="lg"
        >
          {createBooking.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Confirmed! 🎉</DialogTitle>
              <DialogDescription>
                Your turf has been booked successfully
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {bookingDetails && format(new Date(bookingDetails.date), "PPP")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">
                  {bookingDetails?.from} - {bookingDetails?.to}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-medium">
                  ₹{bookingDetails ? bookingDetails.amountPaid / 100 : 0}
                </span>
              </div>
              <div className="flex justify-between items-center rounded-lg bg-primary/10 p-4">
                <span className="text-muted-foreground">Verification Code:</span>
                <span className="text-2xl font-bold text-primary">
                  {bookingDetails?.verificationCode}
                </span>
              </div>
            </div>
            <Button onClick={() => setShowConfirmation(false)} className="w-full">
              View My Bookings
            </Button>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
