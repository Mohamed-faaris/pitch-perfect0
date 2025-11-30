"use client"

import * as React from "react"
import TicketModal from "~/components/ticket-modal"
import RescheduleModal from "~/components/reschedule-modal"
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
  email: string
  altName: string
  altPhone: string
  createdAt: string
}

export default function ViewPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [selected, setSelected] = React.useState<Booking | null>(null)
  const [rescheduleBooking, setRescheduleBooking] = React.useState<Booking | null>(null)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("pp_bookings") ?? "[]"
      const parsed = JSON.parse(raw) as Booking[]
      parsed.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      setBookings(parsed)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const now = Date.now()
  const upcoming = bookings.filter((b) => new Date(b.date).getTime() >= now)
  const past = bookings.filter((b) => new Date(b.date).getTime() < now)

  return (
    <div className="px-4 pt-4 pb-28">
      <h2 className="text-xl font-semibold">Your Bookings</h2>

      <section className="mt-4">
        <h3 className="text-sm font-medium text-slate-500">Upcoming</h3>
        {upcoming.length === 0 && <div className="text-sm text-slate-400 mt-2">No upcoming bookings</div>}
        <div className="mt-2 space-y-3">
          {upcoming.map((b) => (
            <div key={b.id} className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50 opacity-70">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{new Date(b.date).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{b.slot} · {b.type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelected(b)}>View</Button>
                  <Button size="sm" variant="ghost" onClick={() => setRescheduleBooking(b)}>Reschedule</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-medium text-slate-500">Past</h3>
        {past.length === 0 && <div className="text-sm text-slate-400 mt-2">No past bookings</div>}
        <div className="mt-2 space-y-3">
          {past.map((b) => (
            <div key={b.id} className="p-3 rounded-lg border bg-white dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{new Date(b.date).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{b.slot} · {b.type}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelected(b)}>View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && <TicketModal booking={selected} onClose={() => setSelected(null)} />}
      {rescheduleBooking && (
        <RescheduleModal
          booking={rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onSave={(updated) => {
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)))
            setRescheduleBooking(null)
          }}
        />
      )}
    </div>
  )
}
