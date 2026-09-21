import nodemailer from "nodemailer";
import type { Order, Enquiry } from "@/lib/data";

// Standard SMTP Transporter configuration
export function getTransporter() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_HOST_USER || process.env.GMAIL_USER;
  const rawPass = process.env.SMTP_PASS || process.env.EMAIL_HOST_PASSWORD || process.env.GMAIL_APP_PASSWORD;

  if (!user || !rawPass) {
    return null;
  }

  const pass = rawPass.trim().replace(/\s+/g, "");
  const isSecure = port === 465 || process.env.SMTP_SECURE === "true" || process.env.EMAIL_USE_SSL === "true";

  return nodemailer.createTransport({
    host,
    port,
    secure: isSecure,
    auth: {
      user: user.trim(),
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export function getSender(): string {
  const user = process.env.SMTP_USER || process.env.EMAIL_HOST_USER || process.env.GMAIL_USER || "planthealthsol@gmail.com";
  return (
    process.env.EMAIL_FROM ||
    process.env.SMTP_FROM ||
    `"Plant Health Solutions" <${user.trim()}>`
  );
}

// Base HTML wrapper with Plant Health Solutions branding
function baseEmailTemplate(title: string, bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f4; margin: 0; padding: 0; color: #1c2b1f; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2ece0; }
    .header { background: #18361e; padding: 28px 24px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff; }
    .header p { margin: 6px 0 0; font-size: 12px; color: #a8d672; }
    .content { padding: 32px 28px; line-height: 1.6; font-size: 14px; color: #2d3748; }
    .otp-box { background: #eaf5e6; border: 2px dashed #4f8a3c; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #18361e; font-family: monospace; }
    .btn { display: inline-block; background: #234f2e; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: bold; font-size: 14px; margin: 16px 0; }
    .footer { background: #f8faf7; padding: 20px 24px; text-align: center; font-size: 11px; color: #718096; border-top: 1px solid #edf2ed; }
    .footer a { color: #234f2e; text-decoration: none; font-weight: 600; }
    .table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
    .table th { background: #f0f6ee; padding: 8px 12px; text-align: left; font-weight: 600; color: #18361e; }
    .table td { padding: 10px 12px; border-bottom: 1px solid #edf2ed; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌱 PLANT HEALTH SOLUTIONS</h1>
      <p>Agricultural Research & Bio Inputs Manufacturer · Tidagundi</p>
    </div>
    <div class="content">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>Plant Health Solutions Pvt. Ltd.<br>Horticulture Research & Extension Center, NH-52, Tidagundi, Vijayapura, Karnataka 586119</p>
      <p>Need support? Call <a href="tel:+919175955009">+91 91759 55009</a> or email <a href="mailto:planthealthsol@gmail.com">planthealthsol@gmail.com</a></p>
      <p>© ${new Date().getFullYear()} Plant Health Solutions. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1. Send 2-Step Verification OTP Email (for Registration & Login)
 */
export async function sendOtpEmail({
  email,
  name,
  otp,
  type,
}: {
  email: string;
  name?: string;
  otp: string;
  type: "login" | "registration";
}): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const isReg = type === "registration";
  const title = isReg
    ? "Verify Your Email - Plant Health Solutions"
    : "Your Login Security Code - Plant Health Solutions";

  const body = `
    <p>Namaste <strong>${name || "Farmer Friend"}</strong>,</p>
    <p>Use the 6-digit verification code below to complete your ${
      isReg ? "account registration" : "secure account login"
    } on <strong>Plant Health Solutions</strong>:</p>

    <div class="otp-box">
      <div style="font-size: 11px; text-transform: uppercase; color: #4f8a3c; font-weight: 700; margin-bottom: 6px;">2-Step Verification Code</div>
      <div class="otp-code">${otp}</div>
      <div style="font-size: 11px; color: #718096; margin-top: 6px;">Valid for 10 minutes · Do not share this code with anyone</div>
    </div>

    <p style="font-size: 12px; color: #718096;">
      If you did not request this verification code, please ignore this email or contact our support team immediately.
    </p>
  `;

  const html = baseEmailTemplate(title, body);

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`\n========================================`);
    console.log(`[EMAIL SIMULATION] To: ${email}`);
    console.log(`[EMAIL TYPE] 2-Step OTP (${type})`);
    console.log(`[OTP CODE] >>> ${otp} <<<`);
    console.log(`========================================\n`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: getSender(),
      to: email,
      subject: `${otp} is your Plant Health Solutions security code`,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("sendOtpEmail SMTP error:", err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * 2. Send Welcome Email after successful registration
 */
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const title = "Welcome to Plant Health Solutions";
  const body = `
    <h2 style="color: #18361e; margin-top: 0;">Namaste & Welcome, ${name}! 🌱</h2>
    <p>Thank you for creating your account with <strong>Plant Health Solutions Pvt. Ltd.</strong></p>
    <p>As an onsite incubatee of the University of Horticultural Sciences, Bagalkot, we manufacture high-potency bio-fertilizers, bio-fungicides, organic manures, and water-soluble micronutrients to maximize your crop yields sustainably.</p>

    <div style="background: #f8faf7; border-left: 4px solid #4f8a3c; padding: 14px 18px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin: 0 0 6px; font-size: 14px; color: #18361e;">What You Get With Your Account:</h3>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #4a5568;">
        <li>Fast doorstep delivery across all taluks & villages in India.</li>
        <li>100% genuine ICAR-tested microbial bio-inputs.</li>
        <li>Free soil test report consultation by Tidagundi agronomists.</li>
        <li>Live carrier consignment tracking & GST Tax Invoices.</li>
      </ul>
    </div>

    <p style="text-align: center;">
      <a href="https://planthealthsolutions.in/shop" class="btn">Explore Bio Inputs Catalogue</a>
    </p>

    <p>Need customized dosage or spray recommendations for your crop? Call our field helpline at <strong>+91 91759 55009</strong> or message us on WhatsApp.</p>
  `;

  const html = baseEmailTemplate(title, body);
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Welcome email queued for ${email} (${name})`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: getSender(),
      to: email,
      subject: `Welcome to Plant Health Solutions, ${name}! 🌱`,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("sendWelcomeEmail SMTP error:", err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * 3. Send Order Confirmation Email
 */
export async function sendOrderConfirmationEmail(
  order: Order
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const title = `Order Confirmation #${order.id}`;

  const itemsRows = order.items
    .map(
      (item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${item.name}</strong> ${item.unit ? `(${item.unit})` : ""}</td>
        <td style="text-align: center;">${item.qty}</td>
        <td style="text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
        <td style="text-align: right; font-weight: bold;">₹${(
          item.price * item.qty
        ).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  const body = `
    <h2 style="color: #18361e; margin-top: 0;">Order Confirmed! 🎉</h2>
    <p>Namaste <strong>${order.customer}</strong>, thank you for your order with Plant Health Solutions.</p>
    <p>We have received your order <strong>#${order.id}</strong> placed on <strong>${order.date}</strong>.</p>

    <div style="background: #f8faf7; border: 1px solid #e2ece0; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <div style="font-size: 12px; text-transform: uppercase; font-weight: bold; color: #4f8a3c;">Delivery Address:</div>
      <div style="font-weight: 600; color: #18361e; margin-top: 4px;">${order.customer} (${order.phone})</div>
      <div style="font-size: 13px; color: #4a5568;">${order.address}</div>
      <div style="font-size: 12px; color: #718096; margin-top: 6px;">Payment Method: <strong>${order.payment}</strong> · Status: <strong>${order.paymentStatus || "Paid"}</strong></div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Product</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="text-align: right; font-weight: bold;">Subtotal:</td>
          <td style="text-align: right; font-weight: bold;">₹${order.subtotal.toLocaleString("en-IN")}</td>
        </tr>
        ${
          order.discount > 0
            ? `<tr>
            <td colspan="4" style="text-align: right; color: #4f8a3c;">Discount:</td>
            <td style="text-align: right; color: #4f8a3c;">- ₹${order.discount.toLocaleString("en-IN")}</td>
          </tr>`
            : ""
        }
        <tr>
          <td colspan="4" style="text-align: right;">Freight / Shipping:</td>
          <td style="text-align: right;">${order.shipping ? `₹${order.shipping}` : "FREE"}</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align: right;">GST (5%):</td>
          <td style="text-align: right;">₹${order.tax.toLocaleString("en-IN")}</td>
        </tr>
        <tr style="font-size: 15px; color: #18361e;">
          <td colspan="4" style="text-align: right; font-weight: 900;">Grand Total:</td>
          <td style="text-align: right; font-weight: 900;">₹${order.total.toLocaleString("en-IN")}</td>
        </tr>
      </tfoot>
    </table>

    <p style="text-align: center; margin-top: 24px;">
      <a href="https://planthealthsolutions.in/orders/${order.id}" class="btn">View Tax Invoice & Track Order</a>
    </p>
  `;

  const html = baseEmailTemplate(title, body);
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Order confirmation sent for Order #${order.id} to ${order.email}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: getSender(),
      to: order.email,
      subject: `Order #${order.id} Confirmed - Plant Health Solutions`,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("sendOrderConfirmationEmail error:", err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * 4. Send Order Status Update Email
 */
export async function sendOrderStatusEmail(
  order: Order,
  oldStatus?: string
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const title = `Order #${order.id} Status Update: ${order.status}`;

  const body = `
    <h2 style="color: #18361e; margin-top: 0;">Order Status Update 🚚</h2>
    <p>Namaste <strong>${order.customer}</strong>,</p>
    <p>Your order <strong>#${order.id}</strong> has been updated to: <span style="display: inline-block; background: #eaf5e6; color: #18361e; font-weight: bold; padding: 4px 12px; border-radius: 9999px; border: 1px solid #4f8a3c;">${order.status}</span></p>

    <div style="background: #f8faf7; border: 1px solid #e2ece0; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <div style="font-size: 12px; color: #718096;">Logistics Courier: <strong>${order.courier || "VRL Logistics / DTDC Express"}</strong></div>
      <div style="font-size: 13px; color: #18361e; font-family: monospace; font-weight: bold; margin-top: 4px;">Waybill Tracking ID: ${order.trackingNumber || `PHS-TRK-${order.id.slice(-6)}`}</div>
      <div style="font-size: 12px; color: #718096; margin-top: 4px;">Estimated Delivery: <strong>${order.estimatedDelivery || "3 - 5 business days"}</strong></div>
    </div>

    <p style="text-align: center;">
      <a href="https://planthealthsolutions.in/orders/${order.id}" class="btn">Track Consignment Live</a>
    </p>
  `;

  const html = baseEmailTemplate(title, body);
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Order status update (${order.status}) sent to ${order.email}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: getSender(),
      to: order.email,
      subject: `Update on Order #${order.id}: ${order.status} - Plant Health Solutions`,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("sendOrderStatusEmail error:", err);
    return { success: false, error: (err as Error).message };
  }
}

/**
 * 5. Send Enquiry Submission Acknowledgment Email
 */
export async function sendEnquiryConfirmationEmail(
  enquiry: Enquiry
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const title = `Enquiry Received - Plant Health Solutions`;

  const body = `
    <h2 style="color: #18361e; margin-top: 0;">We Received Your Enquiry! 📝</h2>
    <p>Namaste <strong>${enquiry.name}</strong>,</p>
    <p>Thank you for reaching out to Plant Health Solutions regarding <strong>&ldquo;${enquiry.subject}&rdquo;</strong>.</p>
    <p>Our agricultural scientists and field advisory team at Tidagundi research center have received your message:</p>

    <div style="background: #f8faf7; border-left: 4px solid #4f8a3c; padding: 14px 18px; border-radius: 8px; margin: 20px 0; font-style: italic; color: #2d3748;">
      &ldquo;${enquiry.message}&rdquo;
    </div>

    <p>One of our agronomists will review your request and get back to you via phone (<strong>${enquiry.phone}</strong>) or email within 24 hours.</p>

    <p>For urgent crop disease identification or soil test reports, you can also call us directly at <strong>+91 91759 55009</strong>.</p>
  `;

  const html = baseEmailTemplate(title, body);
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[EMAIL SIMULATION] Enquiry acknowledgment sent to ${enquiry.email}`);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({
      from: getSender(),
      to: enquiry.email,
      subject: `Enquiry Received: ${enquiry.subject} - Plant Health Solutions`,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error("sendEnquiryConfirmationEmail error:", err);
    return { success: false, error: (err as Error).message };
  }
}
