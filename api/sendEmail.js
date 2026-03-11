import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { email, subject, templateType, otp, message } = req.body;

  // Dictionary of email templates
  const templates = {
    // 1. Simple OTP Template (from your prompt)
    otp_simple: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;color:#111827;">
  <h2 style="margin:0 0 12px 0;">Verify your email</h2>
  <p style="margin:0 0 16px 0;line-height:1.5;">
    We received a request to verify your email for <strong>AR Chat</strong>.
  </p>
  <div style="margin:18px 0;padding:16px;background:#f3f4f6;border-radius:10px;text-align:center;">
    <div style="font-size:28px;letter-spacing:6px;font-weight:700;">${otp}</div>
  </div>
  <p style="margin:0 0 10px 0;line-height:1.5;">
    This code expires in <strong>5 minutes</strong>. If you did not request this, you can safely ignore this email.
  </p>
  <p style="margin:18px 0 0 0;font-size:12px;color:#6b7280;">
    Sent by AR Chat to ${email}
  </p>
</div>`,

    // 2. Fancy OTP Template with Logo (from your prompt)
    otp_fancy: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:28px;border:1px solid #e5e7eb;border-radius:14px;background:#ffffff;color:#111827;">
  <!-- Logo -->
  <div style="text-align:center;margin-bottom:20px;">
    <img src="https://i.ibb.co/9mNkfJGp/Chat-GPT-Image-Mar-10-2026-12-44-55-PM.png" 
         alt="AR Chat Logo"
         style="height:60px;width:auto;">
  </div>
  <!-- Title -->
  <h2 style="margin:0 0 10px 0;text-align:center;font-size:22px;">
    Verify your email
  </h2>
  <p style="margin:0 0 20px 0;line-height:1.6;text-align:center;color:#374151;">
    We received a request to verify your email for  
    <strong>AR Chat</strong>.
  </p>
  <!-- OTP Card -->
  <div style="margin:22px 0;padding:22px;background:#f9fafb;border:1px dashed #d1d5db;border-radius:12px;text-align:center;">
    <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">
      Your verification code
    </p>
    <div style="font-size:34px;letter-spacing:8px;font-weight:700;color:#111827;">
      ${otp}
    </div>
  </div>
  <!-- Info -->
  <p style="margin:0 0 14px 0;line-height:1.6;text-align:center;color:#374151;">
    This code will expire in <strong>5 minutes</strong>.
  </p>
  <p style="margin:0 0 20px 0;line-height:1.6;text-align:center;color:#6b7280;">
    If you didn’t request this verification, you can safely ignore this email.
  </p>
  <!-- Divider -->
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
  <!-- Footer -->
  <p style="margin:0;text-align:center;font-size:12px;color:#9ca3af;">
    Sent by <strong>AR Chat</strong> to ${email}
  </p>
</div>`,

    // 3. Password Reset Template
    password_reset: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;color:#111827;">
  <h2 style="margin:0 0 12px 0;">Reset your password</h2>
  <p style="margin:0 0 16px 0;line-height:1.5;">
    We heard that you lost your <strong>AR Chat</strong> password. Sorry about that!
  </p>
  <p style="margin:0 0 16px 0;line-height:1.5;">
    But don't worry! You can use the following button to set a new password for your account:
  </p>
  <div style="text-align:center;margin:32px 0;">
    <a href="#" style="background-color:#0070f3;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">Reset Password</a>
  </div>
  <p style="margin:0 0 10px 0;line-height:1.5;font-size:14px;color:#6b7280;">
    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
  <p style="margin:0;text-align:center;font-size:12px;color:#9ca3af;">
    Sent by <strong>AR Chat</strong> to ${email}
  </p>
</div>`,

    // 4. Support / Reply to Problem Template
    support_reply: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;color:#111827;">
  <div style="text-align:center;margin-bottom:20px;">
    <img src="https://i.ibb.co/9mNkfJGp/Chat-GPT-Image-Mar-10-2026-12-44-55-PM.png" alt="AR Chat Logo" style="height:40px;width:auto;">
  </div>
  <h2 style="margin:0 0 12px 0;">Update on your request</h2>
  <p style="margin:0 0 16px 0;line-height:1.5;">Hi there,</p>
  <p style="margin:0 0 16px 0;line-height:1.5;">Our support team has reviewed your inquiry and left the following message:</p>
  
  <div style="margin:20px 0;padding:16px 20px;background:#f9fafb;border-left:4px solid #0070f3;border-radius:0 8px 8px 0;">
    <p style="margin:0;line-height:1.6;white-space:pre-wrap;color:#374151;">${message}</p>
  </div>
  
  <p style="margin:0 0 10px 0;line-height:1.5;">If you need further assistance or this didn't resolve your issue, simply reply directly to this email.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
  <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
    <strong>AR Chat Support Team</strong>
  </p>
</div>`,

    // 5. Fallback Custom Template
    custom: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#ffffff;color:#111827;">
  <h2 style="margin:0 0 12px 0;">${subject}</h2>
  <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${message}</p>
</div>`
  };

  // Determine which HTML string to use
  const htmlContent = templates[templateType] || templates.custom;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"AR Chat" <${process.env.GMAIL_USER}>`, // Makes sender name look professional
      to: email,
      subject: subject,
      html: htmlContent
    });

    res.status(200).json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ error: error.message });
  }
}