"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Download, Calendar, Clock, CreditCard } from "lucide-react";

// Mock data - in real app, fetch from API
const mockBookings = [
  {
    id: "1",
    date: new Date(),
    time: "10:00 - 11:00",
    name: "John Doe",
    phone: "+1234567890",
    amount: 100,
    mode: "Advance",
    status: "Paid",
    verificationCode: "1234",
    bookingId: "BK001",
    isUpcoming: true,
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000), // Yesterday
    time: "14:00 - 15:00",
    name: "Jane Smith",
    phone: "+0987654321",
    amount: 800,
    mode: "Full",
    status: "Paid",
    verificationCode: "5678",
    bookingId: "BK002",
    isUpcoming: false,
  },
];

export default function ViewPage() {
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);

  return (
    <div className="min-h-screen pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <div className="space-y-4">
        {mockBookings.map((booking) => (
          <Card
            key={booking.id}
            className={`cursor-pointer transition-colors ${
              booking.isUpcoming ? "" : "opacity-60"
            }`}
            onClick={() => setSelectedBooking(booking)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{format(booking.date, "PPP")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>₹{booking.amount} ({booking.mode})</span>
                  </div>
                </div>
                <Badge variant={booking.isUpcoming ? "default" : "secondary"}>
                  {booking.isUpcoming ? "Upcoming" : "Past"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Date:</span>
                  <span>{format(selectedBooking.date, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Time:</span>
                  <span>{selectedBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Name:</span>
                  <span>{selectedBooking.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Phone:</span>
                  <span>{selectedBooking.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Amount:</span>
                  <span>₹{selectedBooking.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Mode:</span>
                  <span>{selectedBooking.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span>{selectedBooking.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Verification Code:</span>
                  <span className="font-bold text-blue-600">{selectedBooking.verificationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Booking ID:</span>
                  <span>{selectedBooking.bookingId}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedBooking(null)} className="flex-1">
                  Close
                </Button>
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}