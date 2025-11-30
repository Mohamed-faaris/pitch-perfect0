"use client"

import * as React from "react"
import DateScroller from "~/components/date-scroller"
import TimeSlots from "~/components/time-slots"
import { Button } from "~/components/ui/button"

export default function RescheduleModal({
  booking,
  onClose,
  onSave,
}: {
  booking: any
  onClose: () => void
  onSave: (updated: any) => void
}) {
  const [dateIso, setDateIso] = React.useState<string>(booking.date)
  const [slot, setSlot] = React.useState<string | undefined>(booking.slot)

  const handleSave = () => {
    const updated = { ...booking, date: dateIso, slot }
    try {
      const raw = localStorage.getItem("pp_bookings") || "[]"
      const list = JSON.parse(raw)
      const idx = list.findIndex((b: any) => b.id === booking.id)
      if (idx !== -1) {
        list[idx] = updated
        localStorage.setItem("pp_bookings", JSON.stringify(list))
      }
    } catch (e) {
      console.error(e)
    }
    onSave(updated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-lg p-4 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold">Reschedule Booking</h3>
        <div className="mt-3">
          <label className="text-sm font-medium">Pick new date</label>
          <DateScroller value={dateIso} onChange={(iso) => setDateIso(iso)} />
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium">Pick new time</label>
          <TimeSlots value={slot} onChange={(s) => setSlot(s)} />
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleSave} disabled={!dateIso || !slot}>Save</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  )
}
