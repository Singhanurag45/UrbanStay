import axios from "axios";

type SendOtpEmailInput = {
  email: string;
  firstName: string;
  otp: string;
};

type SendWelcomeEmailInput = {
  email: string;
  firstName: string;
};

type SendBookingConfirmationEmailInput = {
  email: string;
  firstName: string;
  hotelName: string;
  city: string;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
};

const getBrevoApiKey = () =>
  process.env.BREVO_API_KEY || process.env.Brevo_API_KEY;

const getBrevoSenderEmail = () =>
  process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM;

const getBrevoSenderName = () => process.env.BREVO_SENDER_NAME || "UrbanStay";

export const sendSignupOtpEmail = async ({
  email,
  firstName,
  otp,
}: SendOtpEmailInput) => {
  const apiKey = getBrevoApiKey();
  const senderEmail = getBrevoSenderEmail();

  if (!apiKey) {
    throw new Error("Brevo API key is not configured");
  }

  if (!senderEmail) {
    throw new Error("Brevo sender email is not configured");
  }

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        email: senderEmail,
        name: getBrevoSenderName(),
      },
      to: [
        {
          email,
          name: firstName,
        },
      ],
      subject: "Your UrbanStay verification code",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 16px;">Verify your UrbanStay account</h2>
          <p>Hi ${firstName},</p>
          <p>Use the code below to complete your signup:</p>
          <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; padding: 16px 20px; background: #e2e8f0; display: inline-block; border-radius: 12px; margin: 12px 0;">
            ${otp}
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this code, you can ignore this email.</p>
        </div>
      `,
      textContent: `Hi ${firstName}, your UrbanStay verification code is ${otp}. It expires in 10 minutes.`,
    },
    {
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
    },
  );
};

export const sendWelcomeEmail = async ({
  email,
  firstName,
}: SendWelcomeEmailInput) => {
  const apiKey = getBrevoApiKey();
  const senderEmail = getBrevoSenderEmail();

  if (!apiKey || !senderEmail) {
    return;
  }

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        email: senderEmail,
        name: getBrevoSenderName(),
      },
      to: [
        {
          email,
          name: firstName,
        },
      ],
      subject: "Welcome to UrbanStay",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 16px;">Welcome to UrbanStay</h2>
          <p>Hi ${firstName},</p>
          <p>Your account has been verified successfully. You can now log in and start booking stays with UrbanStay.</p>
        </div>
      `,
      textContent: `Hi ${firstName}, your UrbanStay account has been verified successfully.`,
    },
    {
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
    },
  );
};

export const sendBookingConfirmationEmail = async ({
  email,
  firstName,
  hotelName,
  city,
  checkIn,
  checkOut,
  totalCost,
}: SendBookingConfirmationEmailInput) => {
  const apiKey = getBrevoApiKey();
  const senderEmail = getBrevoSenderEmail();

  if (!apiKey || !senderEmail) {
    return;
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
    }).format(date);

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        email: senderEmail,
        name: getBrevoSenderName(),
      },
      to: [
        {
          email,
          name: firstName,
        },
      ],
      subject: "Your UrbanStay booking is confirmed",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 16px;">Booking confirmed</h2>
          <p>Hi ${firstName},</p>
          <p>Your booking at <strong>${hotelName}</strong> in <strong>${city}</strong> is confirmed.</p>
          <p><strong>Check-in:</strong> ${formatDate(checkIn)}<br />
          <strong>Check-out:</strong> ${formatDate(checkOut)}<br />
          <strong>Total paid:</strong> INR ${totalCost}</p>
          <p>We look forward to hosting you.</p>
        </div>
      `,
      textContent: `Hi ${firstName}, your booking at ${hotelName} in ${city} is confirmed. Check-in ${formatDate(checkIn)}, check-out ${formatDate(checkOut)}, total paid INR ${totalCost}.`,
    },
    {
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
    },
  );
};
