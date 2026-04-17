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

export const sendWelcomeEmail = async (to) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family: 'Poppins', sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 16px;">
      <h2 style="color: #0b9e6f;">🎉 Welcome to TravelNode!</h2>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>We're thrilled to have you! You'll be the first to know about our newest tours, exclusive deals, and travel inspiration.</p>
      <hr style="margin: 20px 0;" />
      <p style="color: #777;">TravelNode – Your Adventure Awaits</p>
      <p style="color: #999; font-size: 12px; margin-top: 20px;">
         To unsubscribe, please click <a href="http://localhost:3050/api/subscribe/unsubscribe/${to}">here</a>.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"TravelNode Newsletter" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to TravelNode Newsletter!",
    html,
  });
};

export const sendNewTourEmail = async (toEmails, tourDetails) => {
  if (!toEmails || toEmails.length === 0) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 16px;">
      <img src="${tourDetails.photo}" alt="${tourDetails.title}" style="width: 100%; height: auto; border-radius: 12px; max-height: 300px; object-fit: cover;" />
      <h2 style="color: #0b9e6f;">New Tour Discovered: ${tourDetails.title}! 🌍</h2>
      <p>We just added a fantastic new destination to our catalog!</p>
      <p><strong>Location:</strong> ${tourDetails.city}</p>
      <p><strong>Price:</strong> $${tourDetails.price}</p>
      <p><em>${tourDetails.desc ? tourDetails.desc.substring(0, 100) : ""}...</em></p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5173/tours/${tourDetails._id}" style="background-color: #0b9e6f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Tour Details</a>
      </div>
      <hr style="margin: 20px 0;" />
      <p style="color: #777;">TravelNode – Your Adventure Awaits</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"TravelNode Discoveries" <${process.env.EMAIL_USER}>`,
    bcc: toEmails.join(","),
    subject: `New Adventure Awaits: ${tourDetails.title}!`,
    html,
  });
};