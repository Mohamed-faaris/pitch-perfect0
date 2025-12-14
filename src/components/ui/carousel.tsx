"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, PanInfo, useMotionValue } from "motion/react";

interface CarouselSlide {
  id: string;
  src: string;
  alt: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number;
  scrollable?: boolean;
}

export function Carousel({
  slides,
  autoPlayInterval = 4000,
  scrollable = false,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (scrollable) return;

    const timer = setInterval(() => {
      if (!dragging) {
        setCurrent((prev) => (prev + 1) % slides.length);
      }
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval, scrollable, dragging]);

  useEffect(() => {
    if (scrollable) return;
    x.set(-current * containerWidth);
  }, [current, containerWidth, scrollable]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragging(false);
    const currentX = x.get();
    const newIndex = Math.round(-currentX / containerWidth);
    const clampedIndex = Math.max(0, Math.min(slides.length - 1, newIndex));
    setCurrent(clampedIndex);
    x.set(-clampedIndex * containerWidth);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    if (!scrollable) {
      x.set(-index * containerWidth);
    }
  };

  if (!slides || slides.length === 0) return null;

  // If scrollable, observe scroll position and update `current`
  useEffect(() => {
    if (!scrollable) return;
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const width = el.clientWidth || 1;
        const idx = Math.round(el.scrollLeft / width);
        setCurrent(Math.max(0, Math.min(slides.length - 1, idx)));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [slides.length, scrollable]);

  return (
    <div className="bg-muted relative w-full overflow-hidden rounded-2xl">
      <div
        ref={containerRef}
        className={
          scrollable
            ? "relative flex h-56 w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth"
            : "relative h-56 w-full overflow-hidden"
        }
        style={
          scrollable ? ({ WebkitOverflowScrolling: "touch" } as any) : undefined
        }
      >
        {scrollable ? (
          slides.map((slide) => (
            <div
              key={slide.id}
              className="relative h-56 w-full shrink-0 snap-center"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover"
                draggable={false}
                priority
              />
            </div>
          ))
        ) : (
          <motion.div
            className="flex h-56"
            style={{
              width: containerWidth * slides.length,
              x,
            }}
            drag="x"
            dragConstraints={{
              left: -(slides.length - 1) * containerWidth,
              right: 0,
            }}
            onDragStart={() => setDragging(true)}
            onDragEnd={handleDragEnd}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="relative h-56 w-full shrink-0"
                style={{ width: containerWidth }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  draggable={false}
                  priority
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Dots indicator */}
        <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const el = containerRef.current;
                if (scrollable && el) {
                  el.scrollTo({
                    left: index * el.clientWidth,
                    behavior: "smooth",
                  });
                } else {
                  goToSlide(index);
                }
              }}
              className={`h-2 w-2 rounded-full transition-all ${
                index === current
                  ? "w-6 bg-white"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
