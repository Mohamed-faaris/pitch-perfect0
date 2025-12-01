"use client";

import { Clock, Loader } from "lucide-react";

import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";

function formatSlotTime(from: string, to: string) {
  return `${from} – ${to}`;
}

function getPaymentLabel(status: string): string {
  if (status === "fullPaid") return "Full";
  if (status === "advance") return "Advance";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function BookingsPage() {
  const {
    data: bookings = [],
    isLoading,
    error,
  } = api.admin.bookingsList.useQuery({
    limit: 50,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20">
        <header>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            View bookings
          </p>
          <h1 className="text-2xl font-semibold">Bookings Timeline</h1>
        </header>
        <div className="flex items-center justify-center py-12">
          <Loader className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-20">
        <header>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            View bookings
          </p>
          <h1 className="text-2xl font-semibold">Bookings Timeline</h1>
        </header>
        <Card className="border-border/60 bg-destructive/10 text-destructive rounded-3xl p-4 text-center text-sm">
          Failed to load bookings. Please try again.
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <header>
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          View bookings
        </p>
        <h1 className="text-2xl font-semibold">Bookings Timeline</h1>
        <p className="text-muted-foreground text-sm">
          Share verification codes with players as they arrive.
        </p>
      </header>

      {bookings.length === 0 ? (
        <Card className="border-border/60 bg-card/60 text-muted-foreground rounded-3xl p-6 text-center text-sm">
          No bookings yet.
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking, index) => {
            const bookingCode = `PP-${booking.id.slice(-6).toUpperCase()}`;
            const slotTime = booking.slot
              ? formatSlotTime(booking.slot.from, booking.slot.to)
              : "N/A";
            const isLastItem = index === bookings.length - 1;

            return (
              <div key={booking.id} className="relative">
                {/* Timeline line */}
                {!isLastItem && (
                  <div className="bg-border/50 absolute top-12 left-5 h-6 w-0.5"></div>
                )}

                {/* Timeline item */}
                <div className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="relative flex flex-col items-center pt-1">
                    <div className="bg-primary h-3 w-3 rounded-full"></div>
                  </div>

                  {/* Content card */}
                  <Card className="border-border/60 bg-card/60 mb-2 flex-1 rounded-3xl p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-muted-foreground text-xs tracking-widest uppercase">
                            {bookingCode}
                          </p>
                          <p className="text-lg font-semibold">
                            {booking.phoneNumber}
                          </p>
                        </div>
                        <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
                          {getPaymentLabel(booking.status)}
                        </span>
                      </div>

                      {/* Time slot */}
                      <p className="text-muted-foreground text-sm">
                        {slotTime}
                      </p>

                      {/* Verification code */}
                      <div className="bg-muted/50 mt-3 rounded-2xl p-3">
                        <p className="text-muted-foreground text-xs tracking-wide uppercase">
                          Verification Code
                        </p>
                        <p className="mt-1 font-mono text-sm font-semibold">
                          {booking.verificationCode}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* 
      <Card className="border-border/60 bg-card/60 rounded-3xl p-4">
        <div className="flex items-center gap-3">
          <Clock className="bg-muted h-10 w-10 rounded-2xl p-2" />
          <div>
            <p className="text-sm font-semibold">Auto reminders</p>
            <p className="text-muted-foreground text-xs">
              Players get an SMS reminder 30 minutes before each slot.
            </p>
          </div>
        </div>
      </Card> */}
    </div>
  );
}
