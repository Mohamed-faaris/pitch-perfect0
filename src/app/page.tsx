"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { addDays, format, startOfDay } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Download,
  Home as HomeIcon,
  Images,
  MapPin,
  PhoneCall,
  PlayCircle,
  Ticket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { ThemeToggle } from "~/components/theme-toggle";
import { cn } from "~/lib/utils";

type TabId = "home" | "view" | "book" | "gallery" | "contact";
type AskOption = "cricket" | "booking";
type PaymentOption = "advance" | "full";
type TimeSlot = { label: string; status: "available" | "unavailable" };
type DateItem = {
  key: string;
  date: Date;
  dayLabel: string;
  dayNumber: string;
  isToday: boolean;
};
type Booking = {
  id: string;
  bookingId: string;
  dateKey: string;
  displayDate: string;
  slotLabel: string;
  askType: AskOption;
  paymentMode: PaymentOption;
  amountPaid: number;
  name: string;
  phone: string;
  email?: string;
  alternateContactName: string;
  alternateContactNumber: string;
  verificationCode: string;
  status: "paid";
  startAt: Date;
  createdAt: Date;
};
type MediaItem = {
  id: string;
  type: "photo" | "video";
  src: string;
  caption: string;
  accent: string;
};

type UserDetails = {
  name: string;
  phone: string;
  email: string;
  alternateContactName: string;
  alternateContactNumber: string;
};

type NavItem = { id: TabId; label: string; icon: LucideIcon };

const SLOT_LABELS = [
  "05:00 AM - 06:00 AM",
  "06:00 AM - 07:00 AM",
  "07:00 AM - 08:00 AM",
  "08:00 AM - 09:00 AM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
  "07:00 PM - 08:00 PM",
  "08:00 PM - 09:00 PM",
] as const;

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "view", label: "View", icon: Ticket },
  { id: "book", label: "Book", icon: CalendarClock },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "contact", label: "Contact", icon: PhoneCall },
];

const instructionSlides = [
  {
    title: "Arrive 10 mins early",
    detail: "Warm-up area + hydration is ready for your squad.",
  },
  {
    title: "Carry non-marking shoes",
    detail: "Helps us preserve the turf and keeps your moves sharp.",
  },
  {
    title: "Split payments instantly",
    detail: "Use UPI / cards at the desk or pay full in one tap.",
  },
] as const;

const highlightCards = [
  {
    title: "Dynamic LED Lighting",
    stat: "Schedule friendly",
    image: "https://picsum.photos/seed/pitchperfect-led/400/400",
  },
  {
    title: "Fresh Shower Pods",
    stat: "2 private bays",
    image: "https://picsum.photos/seed/pitchperfect-shower/400/400",
  },
  {
    title: "Match Recording",
    stat: "1080p highlights",
    image: "https://picsum.photos/seed/pitchperfect-record/400/400",
  },
  {
    title: "Snack Station",
    stat: "Electrolytes + bites",
    image: "https://picsum.photos/seed/pitchperfect-cafe/400/400",
  },
] as const;

const galleryMedia: MediaItem[] = [
  {
    id: "media-1",
    type: "photo",
    src: "https://picsum.photos/seed/pp-photo-1/900/1200",
    caption: "Twilight box-cricket league",
    accent: "from-blue-500 via-blue-400 to-cyan-400",
  },
  {
    id: "media-2",
    type: "video",
    src: "https://picsum.photos/seed/pp-photo-2/900/1200",
    caption: "Power-hitting drills",
    accent: "from-purple-500 via-violet-400 to-fuchsia-400",
  },
  {
    id: "media-3",
    type: "photo",
    src: "https://picsum.photos/seed/pp-photo-3/900/1200",
    caption: "Corporate futsal finals",
    accent: "from-emerald-500 via-green-400 to-lime-400",
  },
  {
    id: "media-4",
    type: "photo",
    src: "https://picsum.photos/seed/pp-photo-4/900/1200",
    caption: "Weekend academy batch",
    accent: "from-orange-500 via-amber-400 to-yellow-400",
  },
  {
    id: "media-5",
    type: "video",
    src: "https://picsum.photos/seed/pp-photo-5/900/1200",
    caption: "Keeper skill cam",
    accent: "from-rose-500 via-pink-400 to-orange-400",
  },
  {
    id: "media-6",
    type: "photo",
    src: "https://picsum.photos/seed/pp-photo-6/900/1200",
    caption: "Floodlit five-a-side",
    accent: "from-slate-600 via-slate-500 to-slate-400",
  },
];

const contactNumbers = [
  { label: "Front Desk", value: "+91 90031 90031" },
  { label: "Operations", value: "+91 98400 22345" },
  { label: "Academy Lead", value: "+91 97909 44556" },
];

const languages = [
  { id: "en", label: "EN" as const },
  { id: "ta", label: "TA" as const },
];

const createRandomCode = () =>
  (1000 + Math.floor(Math.random() * 9000)).toString();

const createClientId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `pp-${Math.random().toString(36).slice(2, 10)}`;

const formatTicketDate = (date: Date) => format(date, "EEE, dd MMM");

const generateDateWindow = (): DateItem[] => {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index);
    return {
      key: format(date, "yyyy-MM-dd"),
      date,
      dayLabel: format(date, "EEE"),
      dayNumber: format(date, "dd"),
      isToday: index === 0,
    };
  });
};

const createSlotMap = (dates: DateItem[]): Record<string, TimeSlot[]> => {
  const map: Record<string, TimeSlot[]> = {};
  dates.forEach((entry, index) => {
    map[entry.key] = SLOT_LABELS.map((label, slotIdx) => ({
      label,
      status: (slotIdx + index) % 3 === 0 ? "unavailable" : "available",
    }));
  });
  return map;
};

const slotLabelToDate = (dateKey: string, slotLabel: string) => {
  const [startRange] = slotLabel.split(" - ");
  if (!startRange) {
    return new Date(dateKey);
  }
  const [timePart, meridian] = startRange.split(" ");
  if (!timePart) {
    return new Date(dateKey);
  }
  const [hoursStr = "0", minutesStr = "0"] = timePart.split(":");
  let hours = Number(hoursStr) % 12;
  if (meridian?.toLowerCase() === "pm") {
    hours += 12;
  }
  if (meridian?.toLowerCase() === "am" && Number(hoursStr) === 12) {
    hours = 0;
  }
  const minutes = Number(minutesStr) || 0;
  const iso = `${dateKey}T${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:00`;
  return new Date(iso);
};

const seedBookings = (): Booking[] => {
  const base = startOfDay(new Date());
  const buildBooking = (
    offset: number,
    slotLabel: string,
    overrides: Partial<Booking>
  ): Booking => {
    const date = addDays(base, offset);
    const dateKey = format(date, "yyyy-MM-dd");
    const startAt = slotLabelToDate(dateKey, slotLabel);
    return {
      id: createClientId(),
      bookingId: overrides.bookingId ?? `PP-${format(date, "MMdd")}`,
      dateKey,
      displayDate: formatTicketDate(startAt),
      slotLabel,
      askType: "cricket",
      paymentMode: "full",
      amountPaid: 800,
      name: "Aditya Kumar",
      phone: "+91 90000 90000",
      email: "team@pitchperfect.in",
      alternateContactName: "Squad Lead",
      alternateContactNumber: "+91 98888 98888",
      verificationCode: createRandomCode(),
      status: "paid",
      startAt,
      createdAt: new Date(),
      ...overrides,
    };
  };

  return [
    buildBooking(1, "07:00 PM - 08:00 PM", {
      bookingId: "PP-NEW1245",
      name: "Aditya Kumar",
      askType: "cricket",
      paymentMode: "full",
      amountPaid: 800,
    }),
    buildBooking(-2, "08:00 AM - 09:00 AM", {
      bookingId: "PP-OLD0933",
      name: "Riya Menon",
      askType: "booking",
      paymentMode: "advance",
      amountPaid: 100,
    }),
  ];
};

const triggerSideCannons = () => {
  const duration = 3000;
  const end = Date.now() + duration;
  const colors = ["#2563eb", "#38bdf8", "#a78bfa", "#fbbf24"];
  const frame = () => {
    if (Date.now() > end) return;
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors,
    });
    requestAnimationFrame(frame);
  };
  frame();
};

const emptyDetails: UserDetails = {
  name: "",
  phone: "",
  email: "",
  alternateContactName: "",
  alternateContactNumber: "",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [language, setLanguage] = useState<(typeof languages)[number]["id"]>(
    "en"
  );
  const [dateWindow] = useState<DateItem[]>(() => generateDateWindow());
  const slotMap = useMemo(() => createSlotMap(dateWindow), [dateWindow]);
  const [selectedDateKey, setSelectedDateKey] = useState(
    dateWindow[0]?.key ?? ""
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [askType, setAskType] = useState<AskOption | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentOption | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>(emptyDetails);
  const [bookings, setBookings] = useState<Booking[]>(() => seedBookings());
  const [focusedBooking, setFocusedBooking] = useState<Booking | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [mediaZoom, setMediaZoom] = useState(1);

  useEffect(() => {
    setSelectedSlot(null);
    setAskType(null);
    setPaymentMode(null);
  }, [selectedDateKey]);

  const availableSlots = slotMap[selectedDateKey] ?? [];
  const canToggleOptions = Boolean(selectedSlot);
  const isFormValid =
    userDetails.name.trim().length > 0 &&
    userDetails.phone.trim().length >= 10 &&
    userDetails.alternateContactName.trim().length > 0 &&
    userDetails.alternateContactNumber.trim().length >= 10;
  const payDisabled =
    !selectedSlot || !askType || !paymentMode || !isFormValid;

  const upcomingBookings = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((booking) => booking.startAt.getTime() >= now.getTime())
      .sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  }, [bookings]);

  const pastBookings = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((booking) => booking.startAt.getTime() < now.getTime())
      .sort((a, b) => b.startAt.getTime() - a.startAt.getTime());
  }, [bookings]);

  const handlePayNow = () => {
    if (payDisabled || !selectedSlot) return;

    const startAt = slotLabelToDate(selectedDateKey, selectedSlot);
    const verificationCode = createRandomCode();
    const newBooking: Booking = {
      id: createClientId(),
      bookingId: `PP-${format(startAt, "MMdd")}-${verificationCode}`,
      dateKey: selectedDateKey,
      displayDate: formatTicketDate(startAt),
      slotLabel: selectedSlot,
      askType: askType!,
      paymentMode: paymentMode!,
      amountPaid: paymentMode === "advance" ? 100 : 800,
      name: userDetails.name,
      phone: userDetails.phone,
      email: userDetails.email,
      alternateContactName: userDetails.alternateContactName,
      alternateContactNumber: userDetails.alternateContactNumber,
      verificationCode,
      status: "paid",
      startAt,
      createdAt: new Date(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    triggerSideCannons();
    setFocusedBooking(newBooking);
    setActiveTab("view");
    setUserDetails(emptyDetails);
    setSelectedSlot(null);
    setAskType(null);
    setPaymentMode(null);
  };

  const handleDetailChange = (field: keyof UserDetails, value: string) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  const openMedia = (index: number) => {
    setActiveMediaIndex(index);
    setMediaZoom(1);
  };

  const activeMedia =
    activeMediaIndex !== null ? galleryMedia[activeMediaIndex] : null;

  const swipeRef = useRef<number | null>(null);

  const handleSwipeStart = (value: number) => {
    swipeRef.current = value;
  };

  const handleSwipeEnd = (value: number) => {
    if (swipeRef.current === null) return;
    const delta = value - swipeRef.current;
    if (delta > 60) {
      setActiveMediaIndex((prev) =>
        prev === null ? prev : Math.max(0, prev - 1)
      );
    }
    if (delta < -60) {
      setActiveMediaIndex((prev) =>
        prev === null ? prev : Math.min(galleryMedia.length - 1, prev + 1)
      );
    }
    swipeRef.current = null;
  };

  const renderHomeTab = () => (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-muted-foreground">
              Pitch Perfect · {language.toUpperCase()}
            </p>
            <h1 className="text-2xl font-semibold">Turf Control Centre</h1>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl border bg-card/60 p-3">
          <div className="text-sm">
            <p className="text-muted-foreground">Language</p>
            <p className="font-semibold">
              {language === "en" ? "English" : "தமிழ்"} (dummy)
            </p>
          </div>
          <div className="flex rounded-full bg-muted p-1">
            {languages.map((option) => (
              <button
                key={option.id}
                onClick={() => setLanguage(option.id)}
                className={cn(
                  "rounded-full px-4 py-1 text-xs font-semibold transition",
                  language === option.id
                    ? "bg-background text-primary shadow"
                    : "text-muted-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <motion.div
        layout
        className="overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-500 to-purple-500 text-white shadow-lg"
      >
        <div className="relative flex flex-col gap-6 p-6">
          <div>
            <Badge className="bg-white/20 text-white" variant="secondary">
              Mobile first
            </Badge>
            <h2 className="mt-3 text-3xl font-semibold leading-tight">
              Game-ready bookings, in two taps.
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Block your slot, share squad details, clear payments and get a
              verification code instantly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setActiveTab("book")}
              className="flex-1 bg-white text-blue-600 hover:bg-white/90"
            >
              Book Now
            </Button>
            <Button
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              onClick={() => setActiveTab("view")}
            >
              View Tickets
            </Button>
          </div>
          <div className="relative h-36 overflow-hidden rounded-2xl bg-white/10">
            <Image
              src="https://picsum.photos/seed/pitchperfect-hero/640/360"
              alt="Pitch Perfect Turf"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </motion.div>

      <Card className="space-y-4">
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Location preview</CardTitle>
          <CardDescription>
            Anna Nagar · Chennai · Open 5 AM – Midnight
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-48 overflow-hidden rounded-2xl">
            <Image
              src="https://picsum.photos/seed/pitchperfect-map/640/400"
              alt="Pitch Perfect map preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-sm font-medium text-white">
              <MapPin className="size-4" />
              Pin dropped · Turf street
            </div>
          </div>
          <Button variant="outline" asChild className="w-full">
            <a
              href="https://maps.app.goo.gl/8pL1nUFsgsduVNBh6"
              target="_blank"
              rel="noreferrer noopener"
            >
              Open in Google Maps
            </a>
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Booking instructions</h3>
          <span className="text-xs uppercase text-muted-foreground">
            Swipe
          </span>
        </div>
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-1">
          {instructionSlides.map((slide, index) => (
            <Card
              key={slide.title}
              className="min-w-60 snap-start rounded-2xl border-blue-100 bg-blue-50/40 dark:border-blue-900/40 dark:bg-blue-950/40"
            >
              <CardContent className="space-y-3 p-4">
                <Badge variant="secondary">Step {index + 1}</Badge>
                <h4 className="text-sm font-semibold">{slide.title}</h4>
                <p className="text-xs text-muted-foreground">{slide.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">Turf highlights</h3>
        <div className="grid grid-cols-2 gap-3">
          {highlightCards.map((highlight) => (
            <div
              key={highlight.title}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm"
            >
              <div className="relative h-28">
                <Image
                  src={highlight.image}
                  alt={highlight.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-2 left-3 text-xs font-semibold text-white">
                  {highlight.stat}
                </p>
              </div>
              <p className="p-3 text-sm font-medium">{highlight.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderBookingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Header</p>
          <h2 className="text-xl font-semibold lowercase">booking</h2>
        </div>
        <Badge variant="secondary" className="text-xs">
          Elite slot control
        </Badge>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">
          Date selector
        </h3>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4">
          {dateWindow.map((entry) => {
            const isSelected = selectedDateKey === entry.key;
            return (
              <button
                key={entry.key}
                onClick={() => setSelectedDateKey(entry.key)}
                className={cn(
                  "flex min-w-[92px] flex-col items-center rounded-2xl border px-3 py-2 text-center transition",
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10"
                    : "border-transparent bg-muted/70 text-muted-foreground"
                )}
              >
                <span className="text-xs uppercase tracking-wide">
                  {entry.dayLabel}
                </span>
                <span className="text-xl font-semibold">{entry.dayNumber}</span>
                <span className="mt-1 flex items-center gap-1 text-[10px] font-medium uppercase">
                  {isSelected ? (
                    <span className="size-2 rounded-full bg-blue-500" />
                  ) : (
                    <span className="size-2 rounded-full bg-border" />
                  )}
                  {entry.isToday ? "Today" : format(entry.date, "MMM")}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Time slots
          </h3>
          <span className="text-xs text-muted-foreground">
            {availableSlots.filter((slot) => slot.status === "available")
              .length}{" "}
            open
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {availableSlots.map((slot) => {
            const isSelected = selectedSlot === slot.label;
            const disabled = slot.status === "unavailable";
            return (
              <button
                key={slot.label}
                disabled={disabled}
                onClick={() =>
                  !disabled ? setSelectedSlot(slot.label) : undefined
                }
                className={cn(
                  "flex flex-col rounded-2xl border px-3 py-2 text-left text-sm transition",
                  disabled &&
                    "border-dashed text-muted-foreground/70 opacity-50",
                  isSelected &&
                    "border-blue-500 text-blue-600 shadow-sm dark:bg-blue-500/5",
                  !disabled &&
                    !isSelected &&
                    "border-border bg-card hover:border-blue-200"
                )}
              >
                <span>{slot.label}</span>
                <span className="mt-1 flex items-center gap-1 text-xs">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      disabled ? "bg-muted-foreground/50" : "bg-blue-500"
                    )}
                  />
                  {disabled ? "Blocked" : "Available"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">
          ask
        </h3>
        <div className="flex gap-3">
          {(
            [
              { id: "cricket", label: "Cricket" },
              { id: "booking", label: "Booking" },
            ] as const
          ).map((option) => (
            <Button
              key={option.id}
              type="button"
              disabled={!canToggleOptions}
              onClick={() => setAskType(option.id)}
              variant={askType === option.id ? "default" : "outline"}
              className={cn("flex-1", !canToggleOptions && "opacity-40")}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase text-muted-foreground">
          Payment
        </h3>
        <div className="flex gap-3">
          {(
            [
              { id: "advance", label: "₹100 Advance", amount: 100 },
              { id: "full", label: "₹800 Full", amount: 800 },
            ] satisfies { id: PaymentOption; label: string; amount: number }[]
          ).map((option) => (
            <Button
              key={option.id}
              type="button"
              disabled={!canToggleOptions}
              variant={paymentMode === option.id ? "default" : "outline"}
              onClick={() => setPaymentMode(option.id)}
              className={cn("flex-1", !canToggleOptions && "opacity-40")}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </section>

      <Card className="space-y-4 p-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-base">User details</CardTitle>
          <CardDescription>
            Primary + alternate contact for quick confirmations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Captain name"
              value={userDetails.name}
              onChange={(event) =>
                handleDetailChange("name", event.target.value)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Number</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="+91 9xxx"
              value={userDetails.phone}
              onChange={(event) =>
                handleDetailChange("phone", event.target.value)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">
              Email <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="team@pitchperfect.in"
              value={userDetails.email}
              onChange={(event) =>
                handleDetailChange("email", event.target.value)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alt-name">Alternate contact name</Label>
            <Input
              id="alt-name"
              placeholder="Vice captain"
              value={userDetails.alternateContactName}
              onChange={(event) =>
                handleDetailChange("alternateContactName", event.target.value)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="alt-phone">Alternate number</Label>
            <Input
              id="alt-phone"
              type="tel"
              inputMode="numeric"
              placeholder="+91 9xxx"
              value={userDetails.alternateContactNumber}
              onChange={(event) =>
                handleDetailChange(
                  "alternateContactNumber",
                  event.target.value
                )
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button
        disabled={payDisabled}
        className="w-full py-6 text-base font-semibold"
        onClick={handlePayNow}
      >
        Pay Now &amp; Generate Code
      </Button>
    </div>
  );

  const renderViewTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Tickets &amp; receipts
          </p>
          <h2 className="text-xl font-semibold">Your bookings</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveTab("book")}
        >
          Book another
        </Button>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-blue-500" />
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Upcoming
          </h3>
        </div>
        {upcomingBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No upcoming slots. Book one now!
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <button
                key={booking.id}
                className="w-full rounded-2xl border border-dashed bg-muted/40 p-4 text-left transition hover:border-blue-500"
                onClick={() => setFocusedBooking(booking)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      {booking.displayDate}
                    </p>
                    <p className="text-lg font-semibold">{booking.slotLabel}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {booking.paymentMode === "advance" ? "Advance" : "Full"} · ₹
                    {booking.amountPaid}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{booking.name}</span>
                  <span>Code {booking.verificationCode}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveTab("book");
                      setSelectedDateKey(booking.dateKey);
                      setSelectedSlot(booking.slotLabel);
                      setAskType(booking.askType);
                      setPaymentMode(booking.paymentMode);
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      setFocusedBooking(booking);
                    }}
                  >
                    View ticket
                  </Button>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-muted-foreground/50" />
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Past
          </h3>
        </div>
        {pastBookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Past bookings will land here.
          </p>
        ) : (
          <div className="space-y-3">
            {pastBookings.map((booking) => (
              <button
                key={booking.id}
                onClick={() => setFocusedBooking(booking)}
                className="w-full rounded-2xl border bg-card/60 p-4 text-left transition hover:border-blue-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      {booking.displayDate}
                    </p>
                    <p className="text-lg font-semibold">{booking.slotLabel}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Paid · ₹{booking.amountPaid}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Code {booking.verificationCode} · {booking.bookingId}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderGalleryTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Turf moodboard
          </p>
          <h2 className="text-xl font-semibold">Gallery</h2>
        </div>
        <Badge variant="secondary">{galleryMedia.length} posts</Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {galleryMedia.map((media, index) => (
          <button
            key={media.id}
            onClick={() => openMedia(index)}
            className="relative aspect-3/4 overflow-hidden rounded-2xl border"
          >
            <Image
              src={media.src}
              alt={media.caption}
              fill
              className="object-cover transition duration-300 hover:scale-105"
            />
            <div
              className={cn(
                "absolute inset-0 bg-linear-to-t opacity-70",
                media.accent
              )}
            />
            <div className="absolute bottom-2 left-2 text-left text-xs font-semibold text-white">
              <p className="line-clamp-2">{media.caption}</p>
            </div>
            {media.type === "video" && (
              <PlayCircle className="absolute left-2 top-2 size-5 text-white drop-shadow" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-muted-foreground">
            Quick connect
          </p>
          <h2 className="text-xl font-semibold">Contact</h2>
        </div>
        <Badge variant="secondary">24x7</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Management</CardTitle>
          <CardDescription>
            Tap to call or share the contact instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {contactNumbers.map((contact) => (
            <div
              key={contact.value}
              className="flex items-center justify-between rounded-2xl bg-muted/60 p-3"
            >
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  {contact.label}
                </p>
                <p className="font-semibold">{contact.value}</p>
              </div>
              <Button asChild size="sm">
                <a href={`tel:${contact.value.replace(/\s/g, "")}`}>Call</a>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business hours</CardTitle>
          <CardDescription>
            WhatsApp us for off-hour slots and tournaments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Weekdays</span>
            <span className="font-semibold">05:00 – 23:00</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Weekends</span>
            <span className="font-semibold">05:00 – 00:00</span>
          </div>
          <iframe
            title="Pitch Perfect map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d971.5284225055057!2d80.2126!3d13.0831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265d3d05f1f0f%3A0x8625995f9ad49be8!2sAnna%20Nagar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            className="h-48 w-full rounded-2xl border-0"
            loading="lazy"
          />
          <Button asChild className="w-full">
            <a
              href="https://wa.me/919003190031?text=Hi%20Pitch%20Perfect%2C%20need%20a%20slot"
              target="_blank"
              rel="noreferrer noopener"
            >
              WhatsApp management
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return renderHomeTab();
      case "book":
        return renderBookingTab();
      case "view":
        return renderViewTab();
      case "gallery":
        return renderGalleryTab();
      case "contact":
        return renderContactTab();
      default:
        return null;
    }
  };

  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col gap-6 bg-background px-4 pb-28 pt-6 sm:max-w-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          {renderActiveTab()}
        </motion.div>
      </AnimatePresence>

      <nav className="fixed inset-x-0 bottom-3 z-30 mx-auto w-full max-w-md px-4 sm:max-w-lg">
        <div className="rounded-3xl border bg-card/95 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-5 gap-1 p-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex flex-col items-center rounded-2xl px-2 py-2 text-xs font-medium transition",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mb-1 size-5",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {focusedBooking && (
          <TicketModal
            key={focusedBooking.id}
            booking={focusedBooking}
            onClose={() => setFocusedBooking(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMedia && (
          <GalleryViewer
            key={activeMedia.id}
            media={activeMedia}
            index={activeMediaIndex as number}
            total={galleryMedia.length}
            zoom={mediaZoom}
            onZoomChange={setMediaZoom}
            onClose={() => setActiveMediaIndex(null)}
            onNavigate={(direction) =>
              setActiveMediaIndex((prev) => {
                if (prev === null) return prev;
                const next = prev + direction;
                if (next < 0 || next >= galleryMedia.length) return prev;
                return next;
              })
            }
            onTouchStart={handleSwipeStart}
            onTouchEnd={handleSwipeEnd}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type TicketModalProps = {
  booking: Booking;
  onClose: () => void;
};

function TicketModal({ booking, onClose }: TicketModalProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        backgroundColor: "hsl(0, 0%, 4%)",
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${booking.bookingId}-ticket.png`;
      link.click();
    } catch (error) {
      console.error("Ticket download failed", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={ticketRef}
        className="relative w-full max-w-sm rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-white/70">Pitch Perfect</p>
            <p className="text-2xl font-semibold">Entry pass</p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {booking.paymentMode === "advance" ? "Advance" : "Full"}
          </Badge>
        </div>
        <div className="mt-4 space-y-2 rounded-2xl bg-white/10 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Date</span>
            <span className="font-semibold">{booking.displayDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Time</span>
            <span className="font-semibold">{booking.slotLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Amount</span>
            <span className="font-semibold">₹{booking.amountPaid}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Mode</span>
            <span className="font-semibold">
              {booking.paymentMode === "advance" ? "Advance" : "Full"}
            </span>
          </div>
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <p className="flex items-center justify-between">
            <span>Name</span>
            <span className="font-semibold">{booking.name}</span>
          </p>
          <p className="flex items-center justify-between">
            <span>Phone</span>
            <span className="font-semibold">{booking.phone}</span>
          </p>
          <p className="flex items-center justify-between">
            <span>Verification</span>
            <span className="font-semibold">{booking.verificationCode}</span>
          </p>
          <p className="flex items-center justify-between">
            <span>Booking ID</span>
            <span className="font-semibold">{booking.bookingId}</span>
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <Button
            className="flex-1"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="mr-2 size-4" />
            {downloading ? "Preparing..." : "Download ticket"}
          </Button>
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

type GalleryViewerProps = {
  media: MediaItem;
  zoom: number;
  index: number;
  total: number;
  onZoomChange: (value: number) => void;
  onClose: () => void;
  onNavigate: (direction: number) => void;
  onTouchStart: (value: number) => void;
  onTouchEnd: (value: number) => void;
};

function GalleryViewer({
  media,
  zoom,
  index,
  total,
  onZoomChange,
  onClose,
  onNavigate,
  onTouchStart,
  onTouchEnd,
}: GalleryViewerProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="flex h-[80vh] w-full max-w-md flex-col gap-4 rounded-3xl bg-background/95 p-4"
        initial={{ y: 50, opacity: 0.8 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="relative flex-1 overflow-hidden rounded-2xl bg-black/70"
          onTouchStart={(event) => {
            const firstTouch = event.touches[0];
            if (firstTouch) {
              onTouchStart(firstTouch.clientX);
            }
          }}
          onTouchEnd={(event) => {
            const finalTouch = event.changedTouches[0];
            if (finalTouch) {
              onTouchEnd(finalTouch.clientX);
            }
          }}
        >
          <Image
            src={media.src}
            alt={media.caption}
            fill
            className="object-cover transition-transform"
            style={{ transform: `scale(${zoom})` }}
          />
          {media.type === "video" && (
            <PlayCircle className="absolute left-4 top-4 size-7 text-white" />
          )}
          <div className="absolute bottom-3 left-4 text-white">
            <p className="text-sm font-semibold">{media.caption}</p>
            <p className="text-xs text-white/70">
              {index + 1} / {total}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="zoom-slider">Zoom</Label>
          <input
            id="zoom-slider"
            type="range"
            min={1}
            max={2}
            step={0.1}
            value={zoom}
            aria-label="Zoom level"
            onChange={(event) => onZoomChange(Number(event.target.value))}
            className="accent-primary w-full"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            onClick={() => onNavigate(-1)}
            disabled={index === 0}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate(1)}
            disabled={index === total - 1}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
