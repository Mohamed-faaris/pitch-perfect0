"use client"

import * as React from "react"

type Slot = {
  id: string
  label: string
  available: boolean
}

function generateSlots(): Slot[] {
  const slots: Slot[] = []
  for (let h = 6; h <= 21; h++) {
    const label = `${h}:00 - ${h + 1}:00`
    const id = `${h}:00`
    // simple availability rule: even hours available, odd hours unavailable (demo)
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
    <div className="grid grid-cols-2 gap-2">
      {slots.map((s) => {
        const selected = value === s.id
        return (
          <button
            key={s.id}
            onClick={() => s.available && onChange(s.id)}
            disabled={!s.available}
            className={`rounded-lg p-3 text-sm text-left transition-all border ${
              s.available
                ? selected
                  ? "border-primary text-primary bg-primary/5 font-medium"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                : "bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-100 dark:border-slate-700 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2">
              {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
              <span>{s.label}</span>
            </div>
            {!s.available && <div className="text-xs mt-1">Booked</div>}
          </button>
        )
      })}
    </div>
  )
}
