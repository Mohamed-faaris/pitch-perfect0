"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"

export default function TicketModal({
  booking,
  onClose,
}: {
  booking: any
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
          <style>body{font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:20px;} .ticket{border:1px solid #ddd;padding:16px;border-radius:8px;max-width:520px;} h1{margin:0 0 8px 0} .row{margin:8px 0}</style>
        </head>
        <body>
          <div class="ticket">
            <h1>Pitch Perfect - Booking Ticket</h1>
            <div class="row"><strong>Booking ID:</strong> ${booking.id}</div>
            <div class="row"><strong>Name:</strong> ${booking.name}</div>
            <div class="row"><strong>Phone:</strong> ${booking.phone}</div>
            <div class="row"><strong>Date:</strong> ${new Date(booking.date).toLocaleString()}</div>
            <div class="row"><strong>Slot:</strong> ${booking.slot}</div>
            <div class="row"><strong>Amount:</strong> ₹${booking.amount}</div>
            <div class="row"><strong>Verification Code:</strong> ${booking.code}</div>
          </div>
        </body>
      </html>
    `
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => {
      w.print()
    }, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold">Booking Ticket</h3>
        <div className="mt-2 text-sm space-y-2">
          <div><strong>Date:</strong> {new Date(booking.date).toLocaleString()}</div>
          <div><strong>Slot:</strong> {booking.slot}</div>
          <div><strong>Name:</strong> {booking.name}</div>
          <div><strong>Phone:</strong> {booking.phone}</div>
          <div><strong>Amount:</strong> ₹{booking.amount}</div>
          <div><strong>Verification code:</strong> {booking.code}</div>
          <div><strong>Booking ID:</strong> {booking.id}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={downloadJSON}>Download JSON</Button>
          <Button variant="outline" onClick={printTicket}>Print / Save PDF</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}
