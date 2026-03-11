import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { email, subject, message } = req.body;

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      html: `<h2>Email Test</h2><p>${message}</p>`
    });

    res.status(200).json({ message: "Email sent successfully!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}