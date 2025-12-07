import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface BookingConfirmationEmailProps {
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
}

export const BookingConfirmationEmail = ({
  customerName = "Customer",
  bookingIds: _bookingIds = [],
  timeSlots = [],
  bookingType = "cricket",
  totalAmount = 800,
  amountPaid = 800,
  paymentStatus = "Full Payment",
  verificationCode = "1234",
}: BookingConfirmationEmailProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  return (
    <Html>
      <Head />
      <Preview>Your booking at Pitch Perfect is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🎉 Booking Confirmed!</Heading>

          <Text style={text}>Hi {customerName},</Text>

          <Text style={text}>
            Great news! Your booking at <strong>Pitch Perfect</strong> has been
            confirmed.
          </Text>

          <Section style={detailsSection}>
            <Heading as="h2" style={h2}>
              Booking Details
            </Heading>

            <Text style={detailText}>
              <strong>Verification Code:</strong>{" "}
              <span style={verificationCodeStyle}>{verificationCode}</span>
            </Text>

            <Text style={detailText}>
              <strong>Sport:</strong>{" "}
              {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)}
            </Text>

            <Text style={detailText}>
              <strong>Payment Status:</strong> {paymentStatus}
            </Text>

            <Text style={detailText}>
              <strong>Amount Paid:</strong> {formatAmount(amountPaid)}
            </Text>

            {amountPaid < totalAmount && (
              <Text style={detailText}>
                <strong>Remaining Amount:</strong>{" "}
                {formatAmount(totalAmount - amountPaid)}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={slotsSection}>
            <Heading as="h2" style={h2}>
              Your Time Slots
            </Heading>

            {timeSlots.map((slot, index) => (
              <Section key={index} style={slotCard}>
                <Text style={slotDate}>{formatDate(slot.date)}</Text>
                <Text style={slotTime}>
                  {formatTime(slot.from)} - {formatTime(slot.to)}
                </Text>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={infoSection}>
            <Text style={text}>
              <strong>Important:</strong> Please arrive 10 minutes before your
              scheduled time. Show your verification code{" "}
              <strong>{verificationCode}</strong> at the reception.
            </Text>

            {amountPaid < totalAmount && (
              <Text style={warningText}>
                ⚠️ Please pay the remaining amount of{" "}
                <strong>{formatAmount(totalAmount - amountPaid)}</strong> at the
                venue.
              </Text>
            )}
          </Section>

          <Text style={text}>
            If you have any questions or need to make changes, please contact
            us.
          </Text>

          <Text style={footer}>
            Thank you for choosing Pitch Perfect!
            <br />
            See you on the field! 🏏⚽
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const h1 = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "16px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "0 40px",
};

const detailsSection = {
  padding: "0 40px",
  margin: "24px 0",
};

const detailText = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "8px 0",
};

const verificationCodeStyle = {
  backgroundColor: "#f0f0f0",
  padding: "4px 12px",
  borderRadius: "4px",
  fontSize: "20px",
  fontWeight: "bold" as const,
  color: "#0070f3",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 40px",
};

const slotsSection = {
  padding: "0 40px",
  margin: "24px 0",
};

const slotCard = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "16px",
  margin: "12px 0",
  border: "1px solid #e6ebf1",
};

const slotDate = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 8px 0",
};

const slotTime = {
  color: "#666",
  fontSize: "16px",
  margin: "0",
};

const infoSection = {
  padding: "0 40px",
  margin: "24px 0",
};

const warningText = {
  color: "#f59e0b",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "12px",
  backgroundColor: "#fffbeb",
  borderRadius: "8px",
  border: "1px solid #fef3c7",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "32px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

export default BookingConfirmationEmail;
