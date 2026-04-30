const nodemailer = require("nodemailer");

const DEFAULT_STUDIO_EMAIL = "vowsandveilsinquiry@gmail.com";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  let raw = "";

  for await (const chunk of req) {
    raw += chunk;
  }

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return Object.fromEntries(new URLSearchParams(raw));
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getDeliveryErrorMessage(error) {
  const code = String(error?.code || "").toUpperCase();
  const responseCode = Number(error?.responseCode || 0);
  const responseText = String(error?.response || error?.message || "").toLowerCase();

  if (
    code === "EAUTH" ||
    responseCode === 535 ||
    responseText.includes("badcredentials") ||
    responseText.includes("invalid login") ||
    responseText.includes("username and password not accepted")
  ) {
    return "Email login failed on Vercel. Update GMAIL_USER and GMAIL_APP_PASSWORD for the deployed project, then redeploy.";
  }

  if (code === "ECONNECTION" || code === "ETIMEDOUT") {
    return "The email service could not be reached right now. Please try again in a moment.";
  }

  return "We could not deliver your inquiry right now. Please try again in a moment.";
}

function readRuntimeConfig() {
  return {
    smtpUser: String(process.env.GMAIL_USER || DEFAULT_STUDIO_EMAIL).trim(),
    smtpPass: String(process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "").trim(),
    contactRecipient: String(process.env.CONTACT_EMAIL_TO || DEFAULT_STUDIO_EMAIL).trim(),
  };
}

function buildTransporter({ smtpUser, smtpPass }) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

function getHealthPayload(config) {
  return {
    success: true,
    provider: "gmail",
    configured: Boolean(config.smtpUser && config.smtpPass && config.contactRecipient),
    gmailUser: config.smtpUser || "",
    recipient: config.contactRecipient || "",
    hasAppPassword: Boolean(config.smtpPass),
  };
}

module.exports = async function handler(req, res) {
  const runtimeConfig = readRuntimeConfig();

  if (req.method === "GET") {
    return sendJson(res, 200, getHealthPayload(runtimeConfig));
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return sendJson(res, 405, {
      success: false,
      message: "Method not allowed.",
    });
  }

  const body = await readBody(req);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const weddingDate = String(body["wedding-date"] || "").trim();
  const budget = String(body.budget || "").trim();
  const guestCount = String(body["guest-count"] || "").trim();
  const venueStyle = String(body["venue-style"] || "").trim();
  const message = String(body.message || "").trim();
  const honey = String(body.website || body._honey || "").trim();

  if (honey) {
    return sendJson(res, 200, {
      success: true,
      message: "Inquiry received.",
    });
  }

  if (!name || !email || !weddingDate || !budget || !message) {
    return sendJson(res, 400, {
      success: false,
      message: "Please complete all required fields.",
    });
  }

  if (!isValidEmail(email)) {
    return sendJson(res, 400, {
      success: false,
      message: "Enter a valid email address.",
    });
  }

  const { smtpUser, smtpPass, contactRecipient } = runtimeConfig;

  if (!smtpUser || !contactRecipient || !smtpPass) {
    return sendJson(res, 503, {
      success: false,
      message: "Email delivery is not configured yet on the deployed site. Add GMAIL_USER, GMAIL_APP_PASSWORD, and CONTACT_EMAIL_TO in Vercel, then redeploy.",
    });
  }

  const transporter = buildTransporter(runtimeConfig);

  const subject = `New Vows & Veil inquiry from ${name}`;
  const submittedAt = new Date().toLocaleString("en-PH", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; color: #2e211d; line-height: 1.6;">
      <h2 style="margin-bottom: 16px;">New wedding inquiry</h2>
      <p style="margin: 0 0 16px;">A new inquiry was submitted through the Vows &amp; Veil website.</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tr><td style="padding: 10px; border: 1px solid #e7dbce;"><strong>Name</strong></td><td style="padding: 10px; border: 1px solid #e7dbce;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #e7dbce;"><strong>Email</strong></td><td style="padding: 10px; border: 1px solid #e7dbce;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #e7dbce;"><strong>Wedding date</strong></td><td style="padding: 10px; border: 1px solid #e7dbce;">${escapeHtml(weddingDate)}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #e7dbce;"><strong>Budget</strong></td><td style="padding: 10px; border: 1px solid #e7dbce;">${escapeHtml(budget)}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #e7dbce;"><strong>Guest count</strong></td><td style="padding: 10px; border: 1px solid #e7dbce;">${escapeHtml(guestCount || "Not provided")}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #e7dbce;"><strong>Venue style</strong></td><td style="padding: 10px; border: 1px solid #e7dbce;">${escapeHtml(venueStyle || "Not provided")}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #e7dbce;"><strong>Message</strong></td><td style="padding: 10px; border: 1px solid #e7dbce; white-space: pre-wrap;">${escapeHtml(message)}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #e7dbce;"><strong>Submitted</strong></td><td style="padding: 10px; border: 1px solid #e7dbce;">${escapeHtml(submittedAt)}</td></tr>
      </table>
    </div>
  `;

  const text = [
    "New wedding inquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Wedding date: ${weddingDate}`,
    `Budget: ${budget}`,
    `Guest count: ${guestCount || "Not provided"}`,
    `Venue style: ${venueStyle || "Not provided"}`,
    `Submitted: ${submittedAt}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    await transporter.verify();

    await transporter.sendMail({
      from: `"Vows & Veil Website" <${smtpUser}>`,
      to: contactRecipient,
      replyTo: `${name} <${email}>`,
      subject,
      text,
      html,
    });

    return sendJson(res, 200, {
      success: true,
      message: "Your inquiry was sent successfully.",
    });
  } catch (error) {
    console.error("Inquiry delivery failed:", error);

    return sendJson(res, 502, {
      success: false,
      message: getDeliveryErrorMessage(error),
    });
  }
};
