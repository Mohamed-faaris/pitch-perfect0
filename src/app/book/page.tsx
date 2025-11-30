"use client"

import * as React from "react"
import confetti from "canvas-confetti"
import DateScroller from "~/components/date-scroller"
import TimeSlots from "~/components/time-slots"
import { Button } from "~/components/ui/button"
import { Toggle } from "~/components/ui/toggle"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

function fireConfetti() {
  const end = Date.now() + 3 * 1000
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]

  const frame = () => {
    if (Date.now() > end) return

    void confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    })
    void confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    })

    requestAnimationFrame(frame)
  }

  frame()
}

interface Booking {
  id: string
  date: string
  slot: string
  type: "cricket" | "football"
  amount: number
  code: number
  name: string
  phone: string
  email: string
  altName: string
  altPhone: string
  createdAt: string
}

export default function BookPage() {
  const [dateIso, setDateIso] = React.useState("")
  const [slot, setSlot] = React.useState<string | undefined>(undefined)
  const [bookingType, setBookingType] = React.useState<"cricket" | "football" | null>(null)
  const [paymentAmount, setPaymentAmount] = React.useState<100 | 800 | null>(null)

  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [altName, setAltName] = React.useState("")
  const [altPhone, setAltPhone] = React.useState("")

  const [confirm, setConfirm] = React.useState<Booking | null>(null)

  const dateSlotSelected = !!dateIso && !!slot
  const canPay =
    dateSlotSelected &&
    bookingType !== null &&
    paymentAmount !== null &&
    name.length > 1 &&
    phone.length > 5

  const handlePayNow = () => {
    if (!canPay || !paymentAmount) return

    const code = Math.floor(1000 + Math.random() * 9000)
    const booking: Booking = {
      id: Date.now().toString(36),
      date: dateIso,
      slot: slot ?? "",
      amount: paymentAmount,
      code,
      name,
      phone,
      email,
      altName,
      altPhone,
      type: bookingType ?? "cricket",
      createdAt: new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(localStorage.getItem("pp_bookings") ?? "[]") as Booking[]
      existing.push(booking)
      localStorage.setItem("pp_bookings", JSON.stringify(existing))
    } catch (e) {
      console.error(e)
    }

    setConfirm(booking)
    fireConfetti()
  }

  const downloadTicket = () => {
    if (!confirm) return
    const data = JSON.stringify(confirm, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ticket-${confirm.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="px-4 pt-4 pb-28">
      <h2 className="text-xl font-semibold">Booking</h2>

      {/* Date Selector */}
      <section className="mt-4">
        <Label className="text-sm">Select Date</Label>
        <DateScroller value={dateIso} onChange={(iso) => setDateIso(iso)} />
      </section>

      {/* Time Slots */}
      <section className="mt-4">
        <Label className="text-sm">Select Time</Label>
        <div className="mt-2">
          <TimeSlots value={slot} onChange={(s) => setSlot(s)} />
        </div>
      </section>

      {/* Type Toggle Group */}
      <section className="mt-4">
        <Label className="text-sm">Booking Type</Label>
        <div className="mt-2 flex gap-2">
          <Toggle
            pressed={bookingType === "cricket"}
            onPressedChange={() => setBookingType("cricket")}
            disabled={!dateSlotSelected}
            className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Cricket
          </Toggle>
          <Toggle
            pressed={bookingType === "football"}
            onPressedChange={() => setBookingType("football")}
            disabled={!dateSlotSelected}
            className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Football
          </Toggle>
        </div>
      </section>

      {/* Payment Toggle Group */}
      <section className="mt-4">
        <Label className="text-sm">Payment</Label>
        <div className="mt-2 flex gap-2">
          <Toggle
            pressed={paymentAmount === 100}
            onPressedChange={() => setPaymentAmount(100)}
            disabled={!dateSlotSelected}
            variant="outline"
            className="flex-1 data-[state=on]:border-primary data-[state=on]:text-primary"
          >
            ₹100 Advance
          </Toggle>
          <Toggle
            pressed={paymentAmount === 800}
            onPressedChange={() => setPaymentAmount(800)}
            disabled={!dateSlotSelected}
            className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            ₹800 Full
          </Toggle>
        </div>
      </section>

      {/* User Details */}
      <section className="mt-4">
        <Label className="text-sm">Your Details</Label>
        <div className="mt-2 space-y-3">
          <Input placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Alternate Contact Name" value={altName} onChange={(e) => setAltName(e.target.value)} />
          <Input placeholder="Alternate Contact Phone" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} />
        </div>
      </section>

      {/* Pay Now Button */}
      <section className="mt-6">
        <Button className="w-full" size="lg" onClick={handlePayNow} disabled={!canPay}>
          Pay Now {paymentAmount ? `₹${paymentAmount}` : ""}
        </Button>
      </section>

      {/* Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirm(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-xl p-4 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-center">🎉 Booking Confirmed!</h3>
            <div className="mt-4 text-sm space-y-2">
              <div><strong>Date:</strong> {new Date(confirm.date).toLocaleDateString()}</div>
              <div><strong>Slot:</strong> {confirm.slot}</div>
              <div><strong>Type:</strong> {confirm.type}</div>
              <div><strong>Amount Paid:</strong> ₹{confirm.amount}</div>
              <div className="text-xl text-center py-2">
                <strong>Verification Code:</strong>{" "}
                <span className="font-bold text-primary">{confirm.code}</span>
              </div>
              <div className="text-xs text-slate-500">Booking ID: {confirm.id}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" onClick={downloadTicket}>Download Ticket</Button>
              <Button className="flex-1" variant="outline" onClick={() => setConfirm(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
