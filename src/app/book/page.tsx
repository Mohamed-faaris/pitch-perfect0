"use client"

import * as React from "react"
import DateScroller from "~/components/date-scroller"
import TimeSlots from "~/components/time-slots"
import { Button } from "~/components/ui/button"
import { Confetti } from "~/components/ui/confetti"

export default function BookPage() {
  const [dateIso, setDateIso] = React.useState("")
  const [slot, setSlot] = React.useState<string | undefined>(undefined)
  const [bookingType, setBookingType] = React.useState<"cricket" | "other">("other")

  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [altName, setAltName] = React.useState("")
  const [altPhone, setAltPhone] = React.useState("")

  const [confirm, setConfirm] = React.useState<any>(null)
  const confettiRef = React.useRef<HTMLCanvasElement | null>(null)

  const canPay = !!dateIso && !!slot && name.length > 1 && phone.length > 5

  const handlePay = (amount: number) => {
    if (!canPay) return
    const code = Math.floor(1000 + Math.random() * 9000)
    const booking = {
      id: Date.now().toString(36),
      date: dateIso,
      slot,
      amount,
      code,
      name,
      phone,
      email,
      altName,
      altPhone,
      type: bookingType,
      createdAt: new Date().toISOString(),
    }
    try {
      const existing = JSON.parse(localStorage.getItem("pp_bookings") || "[]")
      existing.push(booking)
      localStorage.setItem("pp_bookings", JSON.stringify(existing))
    } catch (e) {
      console.error(e)
    }
    setConfirm(booking)
    // small confetti burst
    try {
      // @ts-ignore
      confettiRef.current?.getContext && confettiRef.current?.getContext("2d")
    } catch (e) {}
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
    <div className="px-4 pt-6 pb-28">
      <h2 className="text-xl font-semibold">Booking</h2>

      <section className="mt-4">
        <DateScroller value={dateIso} onChange={(iso) => setDateIso(iso)} />
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-medium px-1">Choose a time</h3>
        <TimeSlots value={slot} onChange={(s) => setSlot(s)} />
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-medium">Type</h3>
        <div className="flex gap-3 mt-2">
          <label className={`flex-1 p-3 rounded border ${bookingType === "cricket" ? "border-primary" : "border-slate-200"}`}>
            <input className="mr-2" type="radio" name="type" checked={bookingType === "cricket"} onChange={() => setBookingType("cricket")} />
            Cricket
          </label>
          <label className={`flex-1 p-3 rounded border ${bookingType === "other" ? "border-primary" : "border-slate-200"}`}>
            <input className="mr-2" type="radio" name="type" checked={bookingType === "other"} onChange={() => setBookingType("other")} />
            Other
          </label>
        </div>
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-medium">Payment</h3>
        <div className="mt-2 flex gap-3">
          <Button variant="outline" onClick={() => handlePay(100)} disabled={!canPay}>
            ₹100 Advance
          </Button>
          <Button onClick={() => handlePay(800)} disabled={!canPay}>
            ₹800 Full
          </Button>
        </div>
      </section>

      <section className="mt-4">
        <h3 className="text-sm font-medium">Your details</h3>
        <div className="mt-2 space-y-2">
          <input className="w-full rounded border px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" placeholder="Alternate contact name" value={altName} onChange={(e) => setAltName(e.target.value)} />
          <input className="w-full rounded border px-3 py-2" placeholder="Alternate contact phone" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} />
        </div>
      </section>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirm(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-md shadow-lg">
            <Confetti manualstart ref={confettiRef} className="absolute inset-0 pointer-events-none" />
            <h3 className="text-lg font-semibold">Booking Confirmed</h3>
            <div className="mt-2 text-sm">
              <div><strong>Date:</strong> {new Date(confirm.date).toLocaleString()}</div>
              <div><strong>Slot:</strong> {confirm.slot}</div>
              <div><strong>Amount:</strong> ₹{confirm.amount}</div>
              <div><strong>Verification code:</strong> {confirm.code}</div>
              <div><strong>Name:</strong> {confirm.name}</div>
              <div className="mt-3 flex gap-2">
                <Button onClick={downloadTicket}>Download Ticket</Button>
                <Button variant="outline" onClick={() => setConfirm(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
