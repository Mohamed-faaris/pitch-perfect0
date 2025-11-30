"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

const galleryItems = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  src: `https://placehold.co/600x800/random?text=Photo+${i + 1}`,
  alt: `Gallery Image ${i + 1}`,
}));

export default function GalleryPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedId !== null) {
      setSelectedId((selectedId + 1) % galleryItems.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedId !== null) {
      setSelectedId((selectedId - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  const selectedItem = selectedId !== null ? galleryItems[selectedId] : null;

  return (
    <div className="pb-24 pt-4 min-h-screen bg-background">
      <h1 className="px-4 text-2xl font-bold mb-4">Gallery</h1>
      
      <div className="grid grid-cols-3 gap-1">
        {galleryItems.map((item) => (
          <motion.div
            key={item.id}
            layoutId={`gallery-${item.id}`}
            className="relative aspect-square cursor-pointer overflow-hidden bg-muted"
            onClick={() => setSelectedId(item.id)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform hover:scale-110"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
              onClick={() => setSelectedId(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-50"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <motion.div
              layoutId={`gallery-${selectedItem.id}`}
              className="relative h-full w-full max-h-[80vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedItem.src}
                alt={selectedItem.alt}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

