import { NextRequest, NextResponse } from "next/server";
import { createLead, listLeads, updateLeadStatus } from "@/lib/db";
import { sendLeadNotification } from "@/lib/email";
import { buildGoogleCalendarLink } from "@/lib/calendar";
import { LAWN_SERVICES, HOUSE_WASH_SERVICES } from "@/lib/pricing";
import { apiError } from "@/lib/api";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET() {
  try {
    const leads = await listLeads();
    return NextResponse.json({ leads });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ["name", "email", "service_category", "service_type"];
    for (const field of required) {
      if (!body[field] || typeof body[field] !== "string") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!["lawn", "house_wash"].includes(body.service_category)) {
      return NextResponse.json(
        { error: "Invalid service_category" },
        { status: 400 }
      );
    }

    const validServiceTypes =
      body.service_category === "lawn"
        ? Object.keys(LAWN_SERVICES)
        : Object.keys(HOUSE_WASH_SERVICES);
    if (!validServiceTypes.includes(body.service_type)) {
      return NextResponse.json(
        { error: "Invalid service_type" },
        { status: 400 }
      );
    }

    // The database is a bonus (customer history, dashboard) — it's optional.
    // Emailing the owner is the actual point of this form, so it must not
    // depend on the database being set up.
    let leadId: number | null = null;
    try {
      const lead = await createLead({
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        service_category: body.service_category,
        service_type: body.service_type,
        frequency: body.frequency,
        preferred_date: body.preferred_date,
        preferred_time_window: body.preferred_time_window,
        notes: body.notes,
      });
      leadId = lead.id;
    } catch (err) {
      console.error("Skipping lead storage (database not set up yet)", err);
    }

    const serviceLabel =
      body.service_category === "lawn"
        ? LAWN_SERVICES[body.service_type as keyof typeof LAWN_SERVICES].label
        : HOUSE_WASH_SERVICES[
            body.service_type as keyof typeof HOUSE_WASH_SERVICES
          ].label;

    const calendarLink = buildGoogleCalendarLink({
      title: `Consultation: ${body.name} — ${serviceLabel}`,
      details: [
        `Service: ${serviceLabel}`,
        body.frequency ? `Frequency: ${body.frequency}` : null,
        `Phone: ${body.phone ?? "n/a"}`,
        `Email: ${body.email}`,
        body.preferred_time_window
          ? `Preferred window: ${body.preferred_time_window}`
          : null,
        body.notes ? `Notes: ${body.notes}` : null,
        leadId ? `Lead #${leadId} — view in dashboard` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      location: [body.address, body.city].filter(Boolean).join(", "),
      date: body.preferred_date,
    });

    let emailSent = false;
    try {
      const result = await sendLeadNotification({
        leadName: body.name,
        leadEmail: body.email,
        subject: `New consultation request — ${body.name} (${serviceLabel})`,
        html: `
          <h2>New consultation request</h2>
          <p><strong>${escapeHtml(body.name)}</strong> — ${escapeHtml(serviceLabel)}${
          body.frequency ? ` (${escapeHtml(body.frequency)})` : ""
        }</p>
          <p>Email: ${escapeHtml(body.email)}<br/>Phone: ${escapeHtml(body.phone ?? "n/a")}</p>
          <p>Address: ${escapeHtml([body.address, body.city].filter(Boolean).join(", ") || "n/a")}</p>
          <p>Preferred: ${escapeHtml(body.preferred_date ?? "no date given")} ${escapeHtml(
          body.preferred_time_window ?? ""
        )}</p>
          ${body.notes ? `<p>Notes: ${escapeHtml(body.notes)}</p>` : ""}
          <p><a href="${calendarLink}">Add to Google Calendar</a></p>
        `,
      });
      emailSent = result.sent;
      if (!result.sent) {
        console.error("Email not sent:", result.reason);
      }
    } catch (err) {
      console.error("Failed to send lead notification email", err);
    }

    return NextResponse.json({ leadId, calendarLink, emailSent });
  } catch (err) {
    return apiError(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body.id !== "number" || typeof body.status !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    await updateLeadStatus(body.id, body.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err);
  }
}
