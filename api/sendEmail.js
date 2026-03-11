import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // We only need email and otp now. Subject and Template are fixed.
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required." });
  }

  // Much improved, highly aesthetic premium OTP Template matching AR Chats blue color theme
  const htmlContent = `
    <div style="background-color: #f6f6f8; padding: 40px 20px; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://i.ibb.co/9mNkfJGp/Chat-GPT-Image-Mar-10-2026-12-44-55-PM.png" alt="AR CHATS" style="width: 72px; height: 72px; border-radius: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
        </div>
        
        <!-- Title -->
        <h2 style="color: #111827; font-size: 26px; font-weight: 800; text-align: center; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.5px;">Verify your identity</h2>
        
        <!-- Body Text -->
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 32px; padding: 0 10px;">
          Thanks for choosing <strong>AR CHATS</strong>. To securely complete your registration, please use the verification code below.
        </p>
        
        <!-- OTP Card Container -->
        <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 28px 20px; text-align: center; margin-bottom: 32px;">
          <p style="color: #2b4bee; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 12px;">Your Verification Code</p>
          <div style="color: #0f172a; font-size: 42px; font-weight: 900; letter-spacing: 10px;">${otp}</div>
        </div>
        
        <!-- Security Info -->
        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; text-align: center; margin-bottom: 0;">
          This code will securely expire in <strong>5 minutes</strong>. If you did not request this code, you can safely ignore this email.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 24px;">
        <p style="color: #9ca3af; font-size: 12px; font-weight: 500;">Securely sent by AR CHATS</p>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"AR CHATS Secure" <${process.env.GMAIL_USER}>`, 
      to: email,
      subject: "Your AR CHATS Verification Code",
      html: htmlContent
    });

    res.status(200).json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ error: error.message });
  }
}