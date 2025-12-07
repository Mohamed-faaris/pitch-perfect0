"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type BookingType = "cricket" | "football" | "cricket&football";
export type PaymentOption = "advance" | "full";

export type BookingCustomer = {
  name: string;
  number: string;
  email?: string;
  alternateContactName: string;
  alternateContactNumber: string;
  language: "en" | "ta";
};

export type StoredBooking = {
  id: string;
  slotId: string;
  date: string; // YYYY-MM-DD
  from: string; // HH:mm
  to: string; // HH:mm
  bookingType: BookingType;
  paymentOption: PaymentOption;
  amountPaid: number;
  totalAmount: number;
  verificationCode: string;
  bookingCode: string;
  createdAt: string;
  customer: BookingCustomer;
  notes?: string;
  rescheduled?: boolean;
};

const STORAGE_KEY = "pitch-perfect-bookings";

const randomId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const computeStatus = (booking: StoredBooking) => {
  const slotDate = new Date(`${booking.date}T${booking.to}:00`);
  return slotDate.getTime() >= Date.now() ? "upcoming" : "past";
};

type BookingsContextValue = {
  bookings: StoredBooking[];
  addBooking: (booking: StoredBooking) => void;
  rescheduleBooking: (
    id: string,
    payload: Pick<StoredBooking, "date" | "from" | "to" | "slotId">,
  ) => void;
  clearAll: () => void;
  getStatus: (booking: StoredBooking) => "upcoming" | "past";
};

const BookingsContext = createContext<BookingsContextValue | undefined>(
  undefined,
);

export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<StoredBooking[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw) as StoredBooking[];
      setBookings(parsed);
    } catch (error) {
      console.error("Failed to read bookings from storage", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error("Failed to persist bookings", error);
    }
  }, [bookings, hydrated]);

  const addBooking = useCallback((booking: StoredBooking) => {
    setBookings((prev) => {
      const next = [...prev, { ...booking, id: booking.id || randomId() }];
      return next;
    });
  }, []);

  const rescheduleBooking = useCallback<
    BookingsContextValue["rescheduleBooking"]
  >((id, payload) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              ...payload,
              rescheduled: true,
            }
          : booking,
      ),
    );
  }, []);

  const clearAll = useCallback(() => {
    setBookings([]);
  }, []);

  const value = useMemo<BookingsContextValue>(() => {
    return {
      bookings,
      addBooking,
      rescheduleBooking,
      clearAll,
      getStatus: computeStatus,
    };
  }, [bookings, addBooking, rescheduleBooking, clearAll]);

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context) {
    throw new Error("useBookings must be used within BookingsProvider");
  }
  return context;
}

export function createBookingRecord(
  partial: Omit<StoredBooking, "id" | "createdAt" | "bookingCode"> & {
    id?: string;
    bookingCode?: string;
  },
): StoredBooking {
  const id = partial.id ?? randomId();
  const bookingCode =
    partial.bookingCode ?? `PP-${Date.now().toString().slice(-6)}`;
  return {
    ...partial,
    id,
    bookingCode,
    createdAt: new Date().toISOString(),
  };
}
