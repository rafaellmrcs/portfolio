import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  let data;
  try {
    data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return sendJson(res, 400, { error: "Invalid JSON" });
  }

  const name = (data?.name || "").trim();
  const email = (data?.email || "").trim().replace(/(\r|\n)/g, "");
  const service = (data?.service || "").trim();
  const message = (data?.message || "").trim();

  // honeypot (optional)
  if (data?.company) {
    return sendJson(res, 200, { ok: true });
  }

  if (!name || !email || !service || !message) {
    return sendJson(res, 400, { error: "All fields are required." });
  }

  try {
    await resend.emails.send({
       from: "RM-Portfolio <onboarding@resend.dev>", // no domain verification needed
      to: process.env.TO_EMAIL,
      replyTo: email,
      subject: `New Inquiry — ${service}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Service: ${service}\n\n` +
        `Message:\n${message}\n`,
    });

    return sendJson(res, 200, { ok: true });
  } catch (err) {
    return sendJson(res, 500, { error: "Email failed to send." });
  }
}
