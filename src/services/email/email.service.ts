import { Resend } from "resend";

import { env } from "../../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendPasswordResetOtp(email: string, otp: string) {
  // DEBUG - before sending
  console.log("========== RESEND DEBUG ==========");
  console.log("To:", email);
  console.log("From:", env.RESEND_FROM_EMAIL);
  console.log("API Key:", env.RESEND_API_KEY ? "FOUND" : "MISSING");
  console.log("OTP:", otp);
  console.log("=================================");

  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [email],
    subject: "Your Luminous password reset code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); text-align: center;">
            <h1 style="margin: 0 0 30px 0; font-size: 38px; font-weight: 800; color: #21AF85; letter-spacing: -1px;">
              Luminous AI
            </h1>
            <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #374151;">
              Password Reset Request
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #6b7280;">
              We received a request to reset the password for your Luminous account. Use the verification code below to proceed.
            </p>
            <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 32px 0;">
              <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">
                Verification Code
              </p>
              <div style="font-size: 42px; font-weight: 700; color: #111827; letter-spacing: 12px; font-family: monospace;">
                ${otp}
              </div>
            </div>
            <p style="margin: 0 0 24px 0; font-size: 15px; color: #6b7280;">
              This code will expire in <span style="font-weight: 600; color: #374151;">10 minutes</span>.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
            <p style="margin: 0; font-size: 14px; color: #9ca3af;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }

  return data;
}
