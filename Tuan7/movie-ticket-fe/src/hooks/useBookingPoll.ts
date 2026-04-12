import { useEffect, useState } from "react";
import type { Booking } from "../types";
import { isTerminalBookingStatus } from "../types";
import * as api from "../api/client";

export function useBookingPoll(bookingId: string | null, intervalMs = 2000) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setBooking(null);
      setError(null);
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setInterval>;

    const tick = async () => {
      try {
        const b = await api.fetchBookingById(bookingId);
        if (cancelled) return;
        setBooking(b);
        setError(null);
        if (isTerminalBookingStatus(b.status)) {
          clearInterval(timer);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Lỗi tải booking");
      }
    };

    void tick();
    timer = setInterval(() => void tick(), intervalMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [bookingId, intervalMs]);

  return { booking, error };
}
