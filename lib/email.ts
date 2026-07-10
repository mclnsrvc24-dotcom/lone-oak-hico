import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export async function sendLeadNotification(input: {
  leadName: string;
  leadEmail: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const resend = getClient();
  const to = process.env.NOTIFY_EMAIL;

  if (!resend || !to) {
    return {
      sent: false,
      reason: "RESEND_API_KEY or NOTIFY_EMAIL not configured",
    };
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "onboarding@resend.dev",
    to,
    replyTo: input.leadEmail,
    subject: input.subject,
    html: input.html,
  });

  return { sent: true };
}
