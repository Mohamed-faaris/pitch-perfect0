import { env } from "~/env";

type PaymentSuccessNotificationInput = {
  orderId: string;
  transactionId?: string;
  paymentStatus?: string;
  customer: {
    name: string;
    number: string;
    email?: string | null;
  };
  bookingType: string;
  paymentType: string;
  totalAmount: number;
  amountPaid: number;
  verificationCode: string;
  bookings: Array<{
    id: string;
    amountPaid: number;
    totalAmount: number;
    status: string;
    timeSlot: {
      date: string;
      from: string;
      to: string;
    };
  }>;
};

const formatMoney = (value: number) => `₹${(value / 100).toFixed(2)}`;

export async function sendPaymentSuccessNotification(
  input: PaymentSuccessNotificationInput,
) {
  if (!env.NTFY_TOPIC) return;

  const body = [
    "Payment success",
    `Order ID: ${input.orderId}`,
    `Transaction ID: ${input.transactionId ?? "N/A"}`,
    `Payment Status: ${input.paymentStatus ?? "N/A"}`,
    `Customer: ${input.customer.name}`,
    `Phone: ${input.customer.number}`,
    `whatsapp: https://wa.me/${input.customer.number}?text=${encodeURIComponent(
      `Hello ${input.customer.name}, your payment for order ${input.orderId} was successful!\n\nDetails:\n- Amount Paid: ${formatMoney(input.amountPaid)}\n- Total Amount: ${formatMoney(input.totalAmount)}\n- Booking Type: ${input.bookingType}\n- Payment Type: ${input.paymentType}\n\nThank you for choosing Pitch Perfect!`,
    )}`,
    `Email: ${input.customer.email ?? "N/A"}`,
    `Booking Type: ${input.bookingType}`,
    `Payment Type: ${input.paymentType}`,
    `Total Amount: ${formatMoney(input.totalAmount)}`,
    `Amount Paid: ${formatMoney(input.amountPaid)}`,
    `Verification Code: ${input.verificationCode}`,
    "",
    "Bookings:",
    ...input.bookings.map(
      (booking) =>
        `- ${booking.timeSlot.date} ${booking.timeSlot.from}-${booking.timeSlot.to} | Booking ID: ${booking.id} | Status: ${booking.status} | Amount Paid: ${formatMoney(booking.amountPaid)} | Total: ${formatMoney(booking.totalAmount)}`,
    ),
  ].join("\n");

  const response = await fetch(
    `https://ntfy.sh/${encodeURIComponent(env.NTFY_TOPIC)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        Title: "Payment success",
        Tags: "heavy_check_mark,money_with_wings",
      },
      body,
    },
  );

  if (!response.ok) {
    throw new Error(`ntfy notification failed with status ${response.status}`);
  }
}
