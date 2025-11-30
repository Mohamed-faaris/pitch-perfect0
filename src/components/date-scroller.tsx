"use client"

import * as React from "react"

function formatDay(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: "short" })
}

function formatDate(date: Date) {
  return date.getDate()
}

export default function DateScroller({
  days = 7,
  value,
  onChange,
}: {
  days?: number
  value: string
  onChange: (iso: string) => void
}) {
  const [dates] = React.useState(() => {
    const arr: Date[] = []
    const today = new Date()
    for (let i = 0; i < days; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      arr.push(d)
    }
    return arr
  })

  React.useEffect(() => {
    if (!value) onChange(dates[0]!.toISOString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-1 py-2">
        {dates.map((d) => {
          const iso = d.toISOString()
          const selected = value === iso
          return (
            <button
              key={iso}
              onClick={() => onChange(iso)}
              className={`flex flex-col items-center min-w-16 rounded-lg px-3 py-2 transition-all ${
                selected
                  ? "font-semibold text-primary border-b-2 border-primary bg-primary/5"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <span className="text-xs">{formatDay(d)}</span>
              <span className="text-lg">{formatDate(d)}</span>
              <span className={`mt-1 h-1 w-1 rounded-full ${selected ? "bg-primary" : "bg-transparent"}`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
