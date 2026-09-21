import nodemailer from "nodemailer";

async function testSmtp() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_HOST_USER || process.env.GMAIL_USER;
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_HOST_PASSWORD || process.env.GMAIL_APP_PASSWORD;

  console.log("Testing SMTP with configuration:");
  console.log({
    host,
    port,
    user,
    passLength: rawPass ? rawPass.length : 0,
    secure: port === 465,
  });

  if (!user || !rawPass) {
    console.error("Missing SMTP_USER or SMTP_PASS in environment.");
    return;
  }

  const pass = rawPass.trim().replace(/\s+/g, "");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: user.trim(),
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("Verifying SMTP connection...");
    const verified = await transporter.verify();
    console.log("✅ SMTP Server connection verified successfully!", verified);
  } catch (err) {
    console.error("❌ SMTP Verification error:", err);
  }
}

testSmtp();
