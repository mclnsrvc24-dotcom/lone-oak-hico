// Builds a Google Calendar "quick add event" link, prefilled with a lead's
// requested details. Opening it while signed into loneoakhico@yahoo.com adds
// (or lets you edit before saving) the event directly on that Google
// Calendar — no OAuth app, no token expiry, works today.

function toGCalDate(date: string): string {
  // date is 'YYYY-MM-DD'; treat as an all-day-ish 1 hour placeholder slot.
  return date.replace(/-/g, "");
}

export function buildGoogleCalendarLink(input: {
  title: string;
  details: string;
  location?: string;
  date?: string | null; // 'YYYY-MM-DD'
}): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    details: input.details,
  });

  if (input.location) params.set("location", input.location);

  if (input.date) {
    const d = toGCalDate(input.date);
    params.set("dates", `${d}/${d}`);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
