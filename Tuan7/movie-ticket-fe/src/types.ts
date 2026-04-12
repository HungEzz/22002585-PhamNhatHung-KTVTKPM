/** Các type dưới đây là “hợp đồng” gợi ý — nhóm backend có thể bổ sung field nhưng nên giữ các field chính. */

export type AuthUser = {
  id: string;
  username: string;
};

export type Movie = {
  id: string;
  title: string;
  description?: string;
  durationMinutes?: number;
};

export type BookingStatus =
  | "PENDING"
  | "PAYMENT_PENDING"
  | "COMPLETED"
  | "PAID"
  | "FAILED"
  | "BOOKING_FAILED"
  | string;

export type Booking = {
  id: string;
  movieId: string;
  userId?: string;
  seatCount?: number;
  seats?: string[];
  status: BookingStatus;
  message?: string;
  createdAt?: string;
};

export function isTerminalBookingStatus(s: BookingStatus): boolean {
  const u = String(s).toUpperCase();
  return (
    u === "COMPLETED" ||
    u === "PAID" ||
    u === "FAILED" ||
    u === "BOOKING_FAILED"
  );
}
