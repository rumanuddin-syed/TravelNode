import nodemailer from "nodemailer";

export const sendOTPEmail = async (to, otp) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family: 'Poppins', sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 16px;">
      <h2 style="color: #B71C1C;">🔐 Password Reset Request</h2>
      <p>Your OTP for resetting your password is:</p>
      <div style="font-size: 32px; font-weight: bold; background: #f5f5f5; display: inline-block; padding: 10px 20px; border-radius: 12px; letter-spacing: 4px;">${otp}</div>
      <p>This OTP is valid for <strong>10 minutes</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr style="margin: 20px 0;" />
      <p style="color: #777;">TravelNode – Your Adventure Awaits</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"TravelNode Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset OTP",
    html,
  });
};