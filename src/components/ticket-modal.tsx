"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"

interface Booking {
  id: string
  date: string
  slot: string
  type: string
  amount: number
  code: number
  name: string
  phone: string
}

export default function TicketModal({
  booking,
  onClose,
}: {
  booking: Booking
  onClose: () => void
}) {
  const downloadJSON = () => {
    const data = JSON.stringify(booking, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ticket-${booking.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printTicket = () => {
    const w = window.open("", "_blank", "width=600,height=800")
    if (!w) return
    const html = `
      <html>
        <head>
          <title>Ticket ${booking.id}</title>
          <style>body{font-family: system-ui, sans-serif; padding:20px;} .ticket{border:1px solid #ddd;padding:16px;border-radius:8px;max-width:400px;} h1{margin:0 0 8px 0;font-size:18px} .row{margin:8px 0;font-size:14px}</style>
        </head>
        <body>
          <div class="ticket">
            <h1>Pitch Perfect - Booking Ticket</h1>
            <div class="row"><strong>Booking ID:</strong> ${booking.id}</div>
            <div class="row"><strong>Name:</strong> ${booking.name}</div>
            <div class="row"><strong>Phone:</strong> ${booking.phone}</div>
            <div class="row"><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</div>
            <div class="row"><strong>Slot:</strong> ${booking.slot}</div>
            <div class="row"><strong>Type:</strong> ${booking.type}</div>
            <div class="row"><strong>Amount:</strong> ₹${booking.amount}</div>
            <div class="row"><strong>Verification Code:</strong> <span style="font-size:20px;font-weight:bold">${booking.code}</span></div>
          </div>
        </body>
      </html>
    `
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-t-xl p-4 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-semibold">Booking Ticket</h3>
        <div className="mt-3 text-sm space-y-2">
          <div><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</div>
          <div><strong>Slot:</strong> {booking.slot}</div>
          <div><strong>Type:</strong> {booking.type}</div>
          <div><strong>Name:</strong> {booking.name}</div>
          <div><strong>Phone:</strong> {booking.phone}</div>
          <div><strong>Amount:</strong> ₹{booking.amount}</div>
          <div className="text-lg"><strong>Verification code:</strong> <span className="font-bold text-primary">{booking.code}</span></div>
          <div className="text-xs text-slate-500">Booking ID: {booking.id}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={downloadJSON}>Download</Button>
          <Button size="sm" variant="outline" onClick={printTicket}>Print PDF</Button>
          <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
