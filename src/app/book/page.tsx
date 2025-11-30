"use client";

import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, X, Download } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";
import { triggerConfettiSideCannons } from "~/lib/confetti";

interface BookingData {
  date: string;
  time: string;
  amount: number;
  verificationCode: string;
  name: string;
  number: string;
  email: string;
  alternateContactName: string;
  alternateContactNumber: string;
}

interface TimeSlot {
  id: number;
  from: string;
  to: string;
  date: string;
  status: "available" | "booked" | "unavailable" | "bookingInProgress";
}

export default function BookPage() {
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingType, setBookingType] = useState<"cricket" | "booking">("cricket");
  const [paymentType, setPaymentType] = useState<"advance" | "full">("full");
  
  const [userDetails, setUserDetails] = useState({
    name: "",
    number: "",
    email: "",
    alternateContactName: "",
    alternateContactNumber: "",
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  // Fetch slots
  const { data: slots, isLoading: isLoadingSlots } = api.timeSlot.getAllByDate.useQuery({
    date: format(selectedDate, "yyyy-MM-dd"),
  });

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = 
    selectedSlot && 
    userDetails.name && 
    userDetails.number && 
    userDetails.alternateContactName && 
    userDetails.alternateContactNumber;

  const handlePayment = () => {
    if (!selectedSlot) return;
    
    // Mock payment and booking
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const newBooking: BookingData = {
      date: format(selectedDate, "dd MMM yyyy"),
      time: selectedSlot, // In real app, find slot time from ID or object
      amount: paymentType === "advance" ? 100 : 800,
      verificationCode,
      ...userDetails,
    };
    
    setBookingData(newBooking);
    setShowConfirmation(true);
    triggerConfettiSideCannons();
  };

  return (
    <div className="pb-24 pt-4">
      <h1 className="px-4 text-2xl font-bold mb-4">Booking</h1>

      {/* Date Selector */}
      <div className="mb-6 overflow-x-auto scrollbar-hide px-4">
        <div className="flex gap-4 min-w-max">
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null); // Reset slot on date change
                }}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg transition-all",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
              >
                <span className={cn("text-xs uppercase", isSelected && "font-bold")}>
                  {format(date, "EEE")}
                </span>
                <span className={cn(
                  "text-lg font-bold mt-1 relative",
                  isSelected && "after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                )}>
                  {format(date, "d")}
                </span>
                {isSelected && <div className="h-0.5 w-full bg-primary mt-2" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Time</h3>
        {isLoadingSlots ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {(slots as unknown as TimeSlot[])?.map((slot) => {
              const isAvailable = slot.status === "available";
              const isSelected = selectedSlot === slot.from; // Using 'from' as ID for now
              
              return (
                <button
                  key={slot.id}
                  disabled={!isAvailable}
                  onClick={() => isAvailable && setSelectedSlot(slot.from)}
                  className={cn(
                    "py-2 px-1 rounded-md border text-sm font-medium transition-all relative",
                    !isAvailable && "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
                    isAvailable && !isSelected && "bg-background border-input hover:border-primary",
                    isSelected && "border-primary text-primary bg-primary/5"
                  )}
                >
                  {slot.from.slice(0, 5)}
                  {isSelected && (
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
            {(!slots || slots.length === 0) && (
              <p className="col-span-3 text-center text-muted-foreground text-sm">
                No slots available for this date.
              </p>
            )}
          </div>
        )}
      </div>


      {/* Ask (Booking Type) */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Type</h3>
        <RadioGroup 
          value={bookingType} 
          onValueChange={(v) => setBookingType(v as "cricket" | "booking")}
          className="flex gap-4"
          disabled={!selectedSlot}
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

      {/* Payment Type */}
      <div className="px-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Payment</h3>
        <div className="flex gap-4">
          <Button
            variant={paymentType === "advance" ? "default" : "outline"}
            onClick={() => setPaymentType("advance")}
            disabled={!selectedSlot}
            className="flex-1"
          >
            ₹100 Advance
          </Button>
          <Button
            variant={paymentType === "full" ? "default" : "outline"}
            onClick={() => setPaymentType("full")}
            disabled={!selectedSlot}
            className="flex-1"
          >
            ₹800 Full
          </Button>
        </div>
      </div>

      {/* User Details */}
      <div className="px-4 mb-8 space-y-4">
        <h3 className="text-lg font-semibold">Your Details</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={userDetails.name} 
              onChange={handleInputChange} 
              placeholder="Enter your name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="number">Phone Number</Label>
            <Input 
              id="number" 
              name="number" 
              value={userDetails.number} 
              onChange={handleInputChange} 
              placeholder="Enter phone number"
              type="tel"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input 
              id="email" 
              name="email" 
              value={userDetails.email} 
              onChange={handleInputChange} 
              placeholder="Enter email"
              type="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alternateContactName">Alternate Contact Name</Label>
            <Input 
              id="alternateContactName" 
              name="alternateContactName" 
              value={userDetails.alternateContactName} 
              onChange={handleInputChange} 
              placeholder="Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alternateContactNumber">Alternate Contact Number</Label>
            <Input 
              id="alternateContactNumber" 
              name="alternateContactNumber" 
              value={userDetails.alternateContactNumber} 
              onChange={handleInputChange} 
              placeholder="Number"
              type="tel"
            />
          </div>
        </div>
      </div>

      {/* Pay Now Button */}
      <div className="px-4">
        <Button 
          className="w-full text-lg py-6" 
          size="lg"
          disabled={!isFormValid}
          onClick={handlePayment}
        >
          Pay Now
        </Button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && bookingData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-xl bg-background p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary">Booking Confirmed!</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowConfirmation(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center py-4">
                  <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-12 w-12 text-green-600" />
                  </div>
                </div>
                
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold">{bookingData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold">{bookingData.time?.slice(0, 5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-semibold">₹{bookingData.amount}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-muted-foreground">Verification Code</span>
                    <span className="font-mono text-xl font-bold tracking-widest text-primary">
                      {bookingData.verificationCode}
                    </span>
                  </div>
                </div>

                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" /> Download Ticket
                </Button>
                
                <Button className="w-full" onClick={() => setShowConfirmation(false)}>
                  Done
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

