"use client"

import * as React from "react"
import TicketModal from "~/components/ticket-modal"
import RescheduleModal from "~/components/reschedule-modal"
import { Button } from "~/components/ui/button"

export default function ViewPage() {
  const [bookings, setBookings] = React.useState<any[]>([])
  const [selected, setSelected] = React.useState<any | null>(null)
  const [rescheduleBooking, setRescheduleBooking] = React.useState<any | null>(null)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("pp_bookings") || "[]"
      const parsed = JSON.parse(raw)
      // sort by createdAt desc
      parsed.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1))
      setBookings(parsed)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const now = Date.now()
  const upcoming = bookings.filter((b) => new Date(b.date).getTime() >= now)
  const past = bookings.filter((b) => new Date(b.date).getTime() < now)

  return (
    <div className="px-4 pt-6 pb-28">
      <h2 className="text-xl font-semibold">Your Bookings</h2>

      <section className="mt-4">
        <h3 className="text-sm font-medium">Upcoming</h3>
        {upcoming.length === 0 && <div className="text-sm text-slate-500 mt-2">No upcoming bookings</div>}
        <div className="mt-2 space-y-3">
          {upcoming.map((b) => (
            <div key={b.id} className="p-3 rounded border bg-white/60 opacity-70">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{new Date(b.date).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-600">{b.slot}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setSelected(b)}>View</Button>
                  <Button variant="ghost" onClick={() => setRescheduleBooking(b)}>Reschedule</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-medium">Past</h3>
        {past.length === 0 && <div className="text-sm text-slate-500 mt-2">No past bookings</div>}
        <div className="mt-2 space-y-3">
          {past.map((b) => (
            <div key={b.id} className="p-3 rounded border bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{new Date(b.date).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-600">{b.slot}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setSelected(b)}>View</Button>
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
            // update local state bookings
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))
            setRescheduleBooking(null)
          }}
        />
      )}
    </div>
  )
}
