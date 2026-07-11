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

    const serviceLabel =
      body.service_category === "lawn"
        ? LAWN_SERVICES[body.service_type as keyof typeof LAWN_SERVICES].label
        : HOUSE_WASH_SERVICES[
            body.service_type as keyof typeof HOUSE_WASH_SERVICES
          ].label;

    const calendarLink = buildGoogleCalendarLink({
      title: `Consultation: ${lead.name} — ${serviceLabel}`,
      details: [
        `Service: ${serviceLabel}`,
        lead.frequency ? `Frequency: ${lead.frequency}` : null,
        `Phone: ${lead.phone ?? "n/a"}`,
        `Email: ${lead.email}`,
        lead.preferred_time_window
          ? `Preferred window: ${lead.preferred_time_window}`
          : null,
        lead.notes ? `Notes: ${lead.notes}` : null,
        `Lead #${lead.id} — view in dashboard`,
      ]
        .filter(Boolean)
        .join("\n"),
      location: [lead.address, lead.city].filter(Boolean).join(", "),
      date: lead.preferred_date,
    });

    try {
      await sendLeadNotification({
        leadName: lead.name,
        leadEmail: lead.email,
        subject: `New consultation request — ${lead.name} (${serviceLabel})`,
        html: `
          <h2>New consultation request</h2>
          <p><strong>${escapeHtml(lead.name)}</strong> — ${escapeHtml(serviceLabel)}${
          lead.frequency ? ` (${escapeHtml(lead.frequency)})` : ""
        }</p>
          <p>Email: ${escapeHtml(lead.email)}<br/>Phone: ${escapeHtml(lead.phone ?? "n/a")}</p>
          <p>Address: ${escapeHtml([lead.address, lead.city].filter(Boolean).join(", ") || "n/a")}</p>
          <p>Preferred: ${escapeHtml(lead.preferred_date ?? "no date given")} ${escapeHtml(
          lead.preferred_time_window ?? ""
        )}</p>
          ${lead.notes ? `<p>Notes: ${escapeHtml(lead.notes)}</p>` : ""}
          <p><a href="${calendarLink}">Add to Google Calendar</a></p>
        `,
      });
    } catch (err) {
      console.error("Failed to send lead notification email", err);
    }

    return NextResponse.json({ leadId: lead.id, calendarLink });
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
