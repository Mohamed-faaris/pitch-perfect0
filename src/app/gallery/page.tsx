"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn, ChevronLeft, ChevronRight, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

type MediaItem = {
  id: number;
  type: "image" | "video";
  url: string;
  thumbnail: string;
  title?: string;
};

// Dummy data - replace with actual API call
const dummyMedia: MediaItem[] = [
  { id: 1, type: "image", url: "", thumbnail: "", title: "Turf View 1" },
  { id: 2, type: "image", url: "", thumbnail: "", title: "Turf View 2" },
  { id: 3, type: "video", url: "", thumbnail: "", title: "Match Highlights" },
  { id: 4, type: "image", url: "", thumbnail: "", title: "Night View" },
  { id: 5, type: "image", url: "", thumbnail: "", title: "Facilities" },
  { id: 6, type: "image", url: "", thumbnail: "", title: "Ground View" },
  { id: 7, type: "video", url: "", thumbnail: "", title: "Stadium Tour" },
  { id: 8, type: "image", url: "", thumbnail: "", title: "Seating Area" },
];

export default function GalleryPage() {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const openMedia = (media: MediaItem, index: number) => {
    setSelectedMedia(media);
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
    setIsZoomed(false);
  };

  const goToPrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : dummyMedia.length - 1;
    setSelectedIndex(newIndex);
    setSelectedMedia(dummyMedia[newIndex]!);
    setIsZoomed(false);
  };

  const goToNext = () => {
    const newIndex = selectedIndex < dummyMedia.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedMedia(dummyMedia[newIndex]!);
    setIsZoomed(false);
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">Browse our turf photos and videos</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {dummyMedia.map((media, index) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="group relative aspect-square cursor-pointer overflow-hidden"
                onClick={() => openMedia(media, index)}
              >
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                {/* Placeholder */}
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  {media.type === "image" ? (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <Video className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>

                {/* Type indicator */}
                <div className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5">
                  {media.type === "image" ? (
                    <ImageIcon className="h-3 w-3" />
                  ) : (
                    <Video className="h-3 w-3" />
                  )}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {media.title}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Full-screen Viewer */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              onClick={closeMedia}
            >
              {/* Controls */}
              <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
                <div className="text-white">
                  <p className="text-sm font-medium">{selectedMedia.title}</p>
                  <p className="text-xs text-white/70">
                    {selectedIndex + 1} / {dummyMedia.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedMedia.type === "image" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(!isZoomed);
                      }}
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={closeMedia}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Media Display */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className={`relative ${isZoomed ? "h-full w-full" : "max-h-[80vh] max-w-[90vw]"}`}
                onClick={(e) => e.stopPropagation()}
              >
                {selectedMedia.type === "image" ? (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-muted ${
                      isZoomed ? "overflow-auto" : ""
                    }`}
                  >
                    <ImageIcon className="h-32 w-32 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-muted">
                    <Video className="h-32 w-32 text-muted-foreground" />
                  </div>
                )}
              </motion.div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                  <p className="text-sm text-white">
                    {selectedMedia.type === "image" ? "Tap to zoom" : "Video playback"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
