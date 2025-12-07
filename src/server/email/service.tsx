import { WelcomeEmail } from "./templates/welcome";
import { AdminInvitationEmail } from "./templates/admin-invitation";
import { PasswordResetEmail } from "./templates/password-reset";
import { BookingConfirmationEmail } from "./templates/booking-confirmation";
import { renderEmailTemplate } from "./render";
import { sendEmail } from "./transporter";

export async function sendWelcomeEmail(email: string, firstName?: string) {
  const html = await renderEmailTemplate(
    <WelcomeEmail userFirstName={firstName} />,
  );

  return sendEmail({
    to: email,
    subject: "Welcome to Pitch Perfect!",
    html,
  });
}

export async function sendBookingConfirmation(
  email: string,
  options: {
    customerName: string;
    bookingIds: string[];
    timeSlots: Array<{
      date: string;
      from: string;
      to: string;
    }>;
    bookingType: string;
    totalAmount: number;
    amountPaid: number;
    paymentStatus: string;
    verificationCode: string;
  },
) {
  const html = await renderEmailTemplate(
    <BookingConfirmationEmail
      customerName={options.customerName}
      bookingIds={options.bookingIds}
      timeSlots={options.timeSlots}
      bookingType={options.bookingType}
      totalAmount={options.totalAmount}
      amountPaid={options.amountPaid}
      paymentStatus={options.paymentStatus}
      verificationCode={options.verificationCode}
    />,
  );

  return sendEmail({
    to: email,
    subject: "🎉 Your Booking at Pitch Perfect is Confirmed!",
    html,
  });
}

export async function sendAdminInvitationEmail(
  email: string,
  options: {
    adminName?: string;
    password?: string;
    role: "admin" | "superAdmin";
    loginUrl?: string;
    resetPasswordUrl?: string;
  },
) {
  const html = await renderEmailTemplate(
    <AdminInvitationEmail
      adminName={options.adminName}
      email={email}
      password={options.password}
      role={options.role}
      loginUrl={options.loginUrl}
      resetPasswordUrl={options.resetPasswordUrl}
    />,
  );

  return sendEmail({
    to: email,
    subject: "Welcome to Pitch Perfect Admin Panel",
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  options: {
    resetUrl: string;
    userName?: string;
  },
) {
  const html = await renderEmailTemplate(
    <PasswordResetEmail
      resetUrl={options.resetUrl}
      userName={options.userName}
    />,
  );

  return sendEmail({
    to: email,
    subject: "Reset Your Password",
    html,
  });
}
