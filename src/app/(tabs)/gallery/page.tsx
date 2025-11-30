"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "~/components/ui/button";

const mediaSources = Array.from({ length: 12 }).map((_, index) => {
  const id = index + 1;
  return {
    id: `gallery-${id}`,
    thumbnail: `https://picsum.photos/seed/turf-${id}/400/400`,
    full: `https://picsum.photos/seed/turf-${id}/900/1600`,
    label: `Pitch angle ${id}`,
  };
});

export default function GalleryPage() {
  const [active, setActive] = useState<(typeof mediaSources)[number] | null>(
    null,
  );
  const [zoomed, setZoomed] = useState(false);

  const columns = useMemo(() => {
    const grouped: (typeof mediaSources)[] = [[], [], []];
    mediaSources.forEach((item, index) => {
      grouped[index % 3]?.push(item);
    });
    return grouped;
  }, []);

  return (
    <div className="space-y-6 pb-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Highlight reel
        </p>
        <h1 className="text-2xl font-semibold">Gallery</h1>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {columns.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex flex-col gap-2">
            {column.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item);
                  setZoomed(false);
                }}
                aria-label={`View ${item.label}`}
                className="overflow-hidden rounded-2xl focus:outline-none"
              >
                <Image
                  src={item.thumbnail}
                  alt={item.label}
                  width={400}
                  height={400}
                  className="aspect-square w-full object-cover transition hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layout
              className="relative flex w-full max-w-md flex-col items-stretch gap-3"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="relative overflow-hidden rounded-3xl">
                <motion.div
                  animate={{ scale: zoomed ? 1.25 : 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Image
                    src={active.full}
                    alt={active.label}
                    width={900}
                    height={1200}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <Button
                    variant="ghost"
                    onClick={() => setActive(null)}
                    className="rounded-full bg-black/40 text-white"
                  >
                    Close
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setZoomed((value) => !value)}
                    className="rounded-full bg-black/40 text-white"
                  >
                    {zoomed ? "Reset" : "Zoom"}
                  </Button>
                </div>
              </div>
              <div className="rounded-3xl bg-background/90 p-4 text-sm text-muted-foreground">
                <p className="text-foreground">{active.label}</p>
                <p>Swipe or tap to explore the field from every angle.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
