"use client";

import { useState } from "react";
import { format, isPast, parseISO } from "date-fns";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { motion } from "motion/react";
import { api } from "~/trpc/react";
import { Calendar, Clock, Download, CreditCard, Shield, Loader2 } from "lucide-react";

type Booking = {
  id: string;
  phoneNumber: string;
  timeSlotId: number;
  status: string;
  amountPaid: number;
  totalAmount: number;
  verificationCode: string;
  bookingType: string;
  createdAt: Date;
  updatedAt: Date | null;
  timeSlot: {
    from: string;
    to: string;
    date: string;
    status: string;
  } | null;
};

export default function ViewPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchedNumber, setSearchedNumber] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading } = api.booking.getByNumber.useQuery(
    { number: searchedNumber },
    { enabled: !!searchedNumber }
  );

  const handleSearch = () => {
    setSearchedNumber(phoneNumber);
  };

  const upcomingBookings = bookings.filter(
    (b) => b.timeSlot && !isPast(parseISO(b.timeSlot.date))
  );

  const pastBookings = bookings.filter(
    (b) => b.timeSlot && isPast(parseISO(b.timeSlot.date))
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      fullPaid: "default",
      advancePaid: "secondary",
      fullPending: "outline",
      advancePending: "outline",
      wontCome: "destructive",
      paymentFailed: "destructive",
    };

    return (
      <Badge variant={variants[status] ?? "outline"}>
        {status.replace(/([A-Z])/g, " $1").trim()}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your bookings</p>
        </div>

        {/* Search Section */}
        {!searchedNumber && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Phone Number</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} className="w-full" disabled={!phoneNumber}>
                View My Bookings
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bookings Display */}
        {searchedNumber && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing bookings for <span className="font-medium text-foreground">{searchedNumber}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchedNumber("");
                  setPhoneNumber("");
                }}
              >
                Change
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No bookings found</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcomingBookings.length})
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Past ({pastBookings.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4 mt-4">
                  {upcomingBookings.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No upcoming bookings</p>
                      </CardContent>
                    </Card>
                  ) : (
                    upcomingBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className="cursor-pointer transition-all hover:shadow-md"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <span className="font-medium">
                                    {booking.timeSlot &&
                                      format(parseISO(booking.timeSlot.date), "PPP")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <span className="text-sm">
                                    {booking.timeSlot?.from} - {booking.timeSlot?.to}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="capitalize">
                                    {booking.bookingType}
                                  </Badge>
                                  {getStatusBadge(booking.status)}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                  ₹{booking.amountPaid / 100}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  of ₹{booking.totalAmount / 100}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4 mt-4">
                  {pastBookings.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No past bookings</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pastBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className="cursor-pointer opacity-70 transition-all hover:opacity-100"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium text-muted-foreground">
                                    {booking.timeSlot &&
                                      format(parseISO(booking.timeSlot.date), "PPP")}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {booking.timeSlot?.from} - {booking.timeSlot?.to}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="capitalize">
                                    {booking.bookingType}
                                  </Badge>
                                  {getStatusBadge(booking.status)}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-muted-foreground">
                                  ₹{booking.amountPaid / 100}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  of ₹{booking.totalAmount / 100}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            )}
          </>
        )}

        {/* Booking Details Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Your complete booking information
              </DialogDescription>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-4 py-4">
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {selectedBooking.timeSlot &&
                        format(parseISO(selectedBooking.timeSlot.date), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="font-medium">
                      {selectedBooking.timeSlot?.from} - {selectedBooking.timeSlot?.to}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sport</span>
                    <Badge variant="outline" className="capitalize">
                      {selectedBooking.bookingType}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount Paid</span>
                    <span className="font-medium">
                      ₹{selectedBooking.amountPaid / 100}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="font-medium">
                      ₹{selectedBooking.totalAmount / 100}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payment Status</span>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>

                <div className="rounded-lg bg-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Verification Code</span>
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      {selectedBooking.verificationCode}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Booking ID</span>
                    <span className="font-mono">{selectedBooking.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Booked on</span>
                    <span>{format(new Date(selectedBooking.createdAt), "PPP p")}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {selectedBooking.timeSlot &&
                    !isPast(parseISO(selectedBooking.timeSlot.date)) && (
                      <Button variant="outline" className="flex-1">
                        Reschedule
                      </Button>
                    )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
