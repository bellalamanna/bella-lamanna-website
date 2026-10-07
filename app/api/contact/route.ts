import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL = "Bella.lamannaa@gmail.com";
const FROM_DISPLAY = "Isabella Lamanna Website <onboarding@resend.dev>";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    // ── Parse body ──────────────────────────────────────────────────────────
    const body = await request.json();
    const { name, email, company, projectType, message, website } = body as {
      name?: string;
      email?: string;
      company?: string;
      projectType?: string;
      message?: string;
      website?: string;
    };

    // ── 1. Required field check ─────────────────────────────────────────────
    if (!name || !email || !message || !projectType) {
      return NextResponse.json(
        { error: "Name, email, project type, and message are required." },
        { status: 400 }
      );
    }

    // ── 2. Email format + length caps ───────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const limits = {
      name: 200,
      email: 320, // RFC 5321 max
      company: 200,
      projectType: 100,
      message: 5000,
    };

    const fields = { name, email, company: company || "", projectType, message };
    for (const [field, value] of Object.entries(fields)) {
      if (value && value.length > limits[field as keyof typeof limits]) {
        return NextResponse.json(
          { error: `${field} exceeds maximum length.` },
          { status: 400 }
        );
      }
    }

    // ── 3. Honeypot — bots fill this field, humans never see it ─────────────
    if (website && website.length > 0) {
      // Pretend success so the bot doesn't retry.
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // ── Metadata-only log (no PII / message contents) ───────────────────────
    console.log("[Contact Form Submission]", {
      timestamp: new Date().toISOString(),
      projectType,
      hasCompany: Boolean(company),
    });

    // ── 4. Resend (only runs when API key is present) ───────────────────────
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeCompany = escapeHtml(company || "—");
      const safeProjectType = escapeHtml(projectType);
      const safeMessage = escapeHtml(message);

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="color: #ED77B4; margin-bottom: 4px;">New Collaboration Inquiry</h2>
          <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Submitted via Isabella Lamanna's website</p>
          <hr style="border: none; border-top: 1px solid rgba(240, 141, 185, 0.25); margin: 20px 0;" />

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; width: 140px; vertical-align: top; color: #374151;">Name</td>
              <td style="padding: 8px 0; color: #111827;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; vertical-align: top; color: #374151;">Email</td>
              <td style="padding: 8px 0; color: #111827;"><a href="mailto:${encodeURIComponent(email)}" style="color: #ED77B4;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; vertical-align: top; color: #374151;">Company / Brand</td>
              <td style="padding: 8px 0; color: #111827;">${safeCompany}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; vertical-align: top; color: #374151;">Project Type</td>
              <td style="padding: 8px 0; color: #111827;">${safeProjectType}</td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid rgba(240, 141, 185, 0.25); margin: 20px 0;" />

          <p style="font-weight: 600; color: #374151; margin-bottom: 8px;">Message</p>
          <p style="color: #111827; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `;

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_DISPLAY,
          to: TO_EMAIL,
          reply_to: email,
          subject: `[Website Inquiry] ${projectType} — ${name}${company ? ` @ ${company}` : ""}`,
          html: emailHtml,
        }),
      });

      if (!resendRes.ok) {
        const err = await resendRes.text();
        console.error("[Resend error]", err);
        throw new Error("Resend delivery failed");
      }
    } else {
      // No API key: fail loudly so visitors use email instead of losing the message
      console.error("[Contact] RESEND_API_KEY not set. Message NOT delivered.");
      return NextResponse.json(
        { error: "Our form is temporarily unavailable. Please email Bella.lamannaa@gmail.com directly." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email directly." },
      { status: 500 }
    );
  }
}
