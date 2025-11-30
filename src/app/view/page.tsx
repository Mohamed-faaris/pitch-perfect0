"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Download, X, Search, IndianRupee } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

interface Booking {
  id: string;
  createdAt: Date;
  amountPaid: number;
  totalAmount: number;
  status: string;
  timeSlot: {
    date: string;
    from: string;
    to: string;
  } | null;
  phoneNumber: string;
}

export default function ViewPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchedNumber, setSearchedNumber] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings if number is entered
  const { data: bookings } = api.booking.getByNumber.useQuery(
    { number: searchedNumber },
    { enabled: !!searchedNumber }
  );

  const handleSearch = () => {
    if (phoneNumber.length >= 10) {
      setSearchedNumber(phoneNumber);
    }
  };

  // Mock data if no backend data (for demo purposes)
  const displayBookings: Booking[] = bookings && bookings.length > 0 ? (bookings as unknown as Booking[]) : [
    {
      id: "mock-1",
      createdAt: new Date(),
      amountPaid: 10000,
      totalAmount: 80000,
      status: "advancePaid",
      timeSlot: {
        date: "2025-12-01",
        from: "18:00:00",
        to: "19:00:00",
      },
      phoneNumber: "9876543210",
    },
    {
      id: "mock-2",
      createdAt: new Date(Date.now() - 86400000),
      amountPaid: 80000,
      totalAmount: 80000,
      status: "fullPaid",
      timeSlot: {
        date: "2025-11-29",
        from: "07:00:00",
        to: "08:00:00",
      },
      phoneNumber: "9876543210",
    }
  ];

  const upcomingBookings = displayBookings.filter(b => new Date(b.timeSlot?.date ?? "").getTime() >= Date.now());
  const pastBookings = displayBookings.filter(b => new Date(b.timeSlot?.date ?? "").getTime() < Date.now());

  return (
    <div className="pb-24 pt-4 min-h-screen bg-background">
      <h1 className="px-4 text-2xl font-bold mb-4">My Bookings</h1>

      {/* Search Bar */}
      <div className="px-4 mb-6 flex gap-2">
        <Input
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="tel"
        />
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-4 space-y-6">
        {/* Upcoming Bookings */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Upcoming</h2>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onClick={() => setSelectedBooking(booking)} 
                isUpcoming
              />
            ))}
            {upcomingBookings.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No upcoming bookings</p>
            )}
          </div>
        </div>

        {/* Past Bookings */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-muted-foreground">Past</h2>
          <div className="space-y-3">
            {pastBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onClick={() => setSelectedBooking(booking)} 
              />
            ))}
            {pastBookings.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No past bookings</p>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-primary p-6 text-primary-foreground text-center relative">
                <h2 className="text-2xl font-bold">Booking Ticket</h2>
                <p className="text-sm opacity-80">Pitch Perfect Turf</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setSelectedBooking(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold">{selectedBooking.timeSlot?.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-semibold">{selectedBooking.timeSlot?.from?.slice(0, 5)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Booking ID</p>
                    <p className="font-mono text-xs">{selectedBooking.id.slice(0, 8)}...</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant={selectedBooking.status === "fullPaid" ? "default" : "secondary"}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Amount Paid</span>
                    <span className="font-bold flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {selectedBooking.amountPaid / 100}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Amount</span>
                    <span className="font-bold flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {selectedBooking.totalAmount / 100}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-center text-muted-foreground mb-4">
                    Show this ticket at the venue entry.
                  </p>
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" variant="outline">
                      <Download className="h-4 w-4" /> PDF
                    </Button>
                    {new Date(selectedBooking.timeSlot?.date ?? "").getTime() >= Date.now() && (
                       <Button className="flex-1" variant="secondary">
                         Reschedule
                       </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BookingCard({ booking, onClick, isUpcoming }: { booking: Booking, onClick: () => void, isUpcoming?: boolean }) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md active:scale-98",
        !isUpcoming && "opacity-70 grayscale-[0.5]"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg",
            isUpcoming ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            {new Date(booking.timeSlot?.date ?? "").getDate()}
          </div>
          <div>
            <h3 className="font-semibold">{booking.timeSlot?.date}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {booking.timeSlot?.from?.slice(0, 5)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={booking.status === "fullPaid" ? "default" : "outline"}>
            {booking.status === "fullPaid" ? "Paid" : "Advance"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


