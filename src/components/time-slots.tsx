"use client"

import * as React from "react"

type Slot = {
  id: string
  label: string
  available: boolean
}

function generateSlots(): Slot[] {
  const slots: Slot[] = []
  // generate hourly slots from 6:00 to 21:00
  for (let h = 6; h <= 21; h++) {
    const label = `${h}:00 - ${h + 1}:00`
    const id = `${h}:00`
    // simple availability rule: even hours available, odd hours unavailable
    const available = h % 2 === 0
    slots.push({ id, label, available })
  }
  return slots
}

export default function TimeSlots({
  value,
  onChange,
}: {
  value?: string
  onChange: (id: string) => void
}) {
  const [slots] = React.useState<Slot[]>(() => generateSlots())

  return (
    <div className="px-4">
      <div className="grid grid-cols-3 gap-3">
        {slots.map((s) => {
          const selected = value === s.id
          return (
            <button
              key={s.id}
              onClick={() => s.available && onChange(s.id)}
              className={`rounded-md p-3 text-sm text-left transition-shadow border ${
                s.available
                  ? selected
                    ? "border-primary text-primary bg-white"
                    : "bg-white border-slate-200"
                  : "bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed"
              }`}
            >
              <div className="font-medium">{s.label}</div>
              {!s.available && <div className="text-xs mt-1">Unavailable</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
