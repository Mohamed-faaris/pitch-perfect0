"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"

const MEDIA = [
  { type: "image", src: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=600&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=600&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=600&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=600&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=600&auto=format&fit=crop" },
  { type: "image", src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=600&auto=format&fit=crop" },
]

export default function GalleryPage() {
  const [viewerIndex, setViewerIndex] = React.useState<number | null>(null)

  const openViewer = (index: number) => setViewerIndex(index)
  const closeViewer = () => setViewerIndex(null)

  const goNext = () => {
    if (viewerIndex !== null) {
      setViewerIndex((viewerIndex + 1) % MEDIA.length)
    }
  }

  const goPrev = () => {
    if (viewerIndex !== null) {
      setViewerIndex((viewerIndex - 1 + MEDIA.length) % MEDIA.length)
    }
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (viewerIndex === null) return
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "Escape") closeViewer()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  })

  return (
    <div className="px-4 pt-4 pb-28">
      <h2 className="text-xl font-semibold">Gallery</h2>

      {/* Thumbnail Grid */}
      <div className="mt-4 grid grid-cols-3 gap-1">
        {MEDIA.map((m, i) => (
          <button
            key={i}
            onClick={() => openViewer(i)}
            className="aspect-square overflow-hidden rounded bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.src} alt={`gallery-${i}`} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Fullscreen Viewer */}
      {viewerIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-white text-sm">{viewerIndex + 1} / {MEDIA.length}</span>
            <Button size="sm" variant="ghost" className="text-white" onClick={closeViewer}>
              ✕
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MEDIA[viewerIndex]!.src}
              alt={`view-${viewerIndex}`}
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />

            {/* Swipe / tap zones */}
            <button
              className="absolute left-0 top-0 bottom-0 w-1/3 focus:outline-none"
              onClick={goPrev}
              aria-label="Previous"
            />
            <button
              className="absolute right-0 top-0 bottom-0 w-1/3 focus:outline-none"
              onClick={goNext}
              aria-label="Next"
            />
          </div>

          <div className="flex justify-center gap-4 p-4">
            <Button size="sm" variant="outline" className="text-white border-white" onClick={goPrev}>
              ← Prev
            </Button>
            <Button size="sm" variant="outline" className="text-white border-white" onClick={goNext}>
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
