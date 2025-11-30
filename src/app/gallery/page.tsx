"use client";

import { useState } from "react";
import Image from "next/image";

// Mock gallery data
const mockGallery = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? "video" : "image",
  url: `https://picsum.photos/300/300?random=${i}`,
  thumbnail: `https://picsum.photos/150/150?random=${i}`,
}));

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<typeof mockGallery[0] | null>(null);

  return (
    <div className="min-h-screen pb-16 p-4">
      <h1 className="text-2xl font-bold mb-6">Gallery</h1>

      <div className="grid grid-cols-3 gap-1">
        {mockGallery.map((item) => (
          <div
            key={item.id}
            className="aspect-square cursor-pointer overflow-hidden rounded-lg relative"
            onClick={() => setSelectedItem(item)}
          >
            <Image
              src={item.thumbnail}
              alt={`Gallery item ${item.id}`}
              fill
              className="object-cover hover:scale-105 transition-transform"
            />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="relative max-w-full max-h-full p-4">
            <Image
              src={selectedItem.url}
              alt={`Gallery item ${selectedItem.id}`}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}