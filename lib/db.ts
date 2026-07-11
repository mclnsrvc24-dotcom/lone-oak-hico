import { sql } from "@vercel/postgres";

// Postgres DATE columns come back from the driver as JS Date objects, not
// strings, even though every consumer (calendar links, JSX, JSON) expects
// 'YYYY-MM-DD'. Normalize once here so the rest of the app can trust the
// string types declared below.
function normalizeDate<T extends Record<string, unknown>>(
  row: T,
  field: keyof T
): T {
  const value = row[field];
  if (value instanceof Date) {
    return { ...row, [field]: value.toISOString().slice(0, 10) };
  }
  return row;
}

export type Lead = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  service_category: string;
  service_type: string;
  frequency: string | null;
  preferred_date: string | null;
  preferred_time_window: string | null;
  notes: string | null;
  status: "new" | "contacted" | "scheduled" | "converted" | "declined";
  customer_id: number | null;
};

export type Customer = {
  id: number;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  service_category: string | null;
  plan: string | null;
  agreed_price: number | null;
  notes: string | null;
  active: boolean;
};

export type ServiceHistoryEntry = {
  id: number;
  customer_id: number;
  service_date: string;
  service_type: string;
  price_charged: number | null;
  notes: string | null;
  created_at: string;
};

export type PropertyPhoto = {
  id: number;
  customer_id: number | null;
  lead_id: number | null;
  url: string;
  caption: string | null;
  uploaded_at: string;
};

export type TikTokPost = {
  id: number;
  created_at: string;
  planned_date: string | null;
  idea: string;
  caption: string | null;
  status: "idea" | "planned" | "filmed" | "posted";
  post_url: string | null;
  notes: string | null;
};

// ---- Leads ----

export async function createLead(input: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  service_category: string;
  service_type: string;
  frequency?: string;
  preferred_date?: string;
  preferred_time_window?: string;
  notes?: string;
}): Promise<Lead> {
  const { rows } = await sql<Lead>`
    INSERT INTO leads (
      name, email, phone, address, city, service_category, service_type,
      frequency, preferred_date, preferred_time_window, notes
    ) VALUES (
      ${input.name}, ${input.email}, ${input.phone ?? null}, ${input.address ?? null},
      ${input.city ?? null}, ${input.service_category}, ${input.service_type},
      ${input.frequency ?? null}, ${input.preferred_date ?? null},
      ${input.preferred_time_window ?? null}, ${input.notes ?? null}
    )
    RETURNING *
  `;
  return normalizeDate(rows[0], "preferred_date");
}

export async function listLeads(): Promise<Lead[]> {
  const { rows } = await sql<Lead>`
    SELECT * FROM leads ORDER BY created_at DESC
  `;
  return rows.map((row) => normalizeDate(row, "preferred_date"));
}

export async function updateLeadStatus(
  id: number,
  status: Lead["status"]
): Promise<void> {
  await sql`UPDATE leads SET status = ${status} WHERE id = ${id}`;
}

export async function convertLeadToCustomer(leadId: number): Promise<Customer> {
  const { rows: leadRows } = await sql<Lead>`
    SELECT * FROM leads WHERE id = ${leadId}
  `;
  const lead = leadRows[0];
  if (!lead) throw new Error("Lead not found");

  const { rows: customerRows } = await sql<Customer>`
    INSERT INTO customers (
      name, email, phone, address, city, service_category, plan, notes
    ) VALUES (
      ${lead.name}, ${lead.email}, ${lead.phone}, ${lead.address}, ${lead.city},
      ${lead.service_category}, ${lead.frequency}, ${lead.notes}
    )
    RETURNING *
  `;
  const customer = customerRows[0];

  await sql`
    UPDATE leads SET status = 'converted', customer_id = ${customer.id}
    WHERE id = ${leadId}
  `;

  await sql`
    UPDATE property_photos SET customer_id = ${customer.id}
    WHERE lead_id = ${leadId}
  `;

  return customer;
}

// ---- Customers ----

export async function listCustomers(): Promise<Customer[]> {
  const { rows } = await sql<Customer>`
    SELECT * FROM customers ORDER BY created_at DESC
  `;
  return rows;
}

export async function getCustomer(id: number): Promise<Customer | null> {
  const { rows } = await sql<Customer>`
    SELECT * FROM customers WHERE id = ${id}
  `;
  return rows[0] ?? null;
}

export async function updateCustomer(
  id: number,
  input: Partial<
    Pick<
      Customer,
      | "name"
      | "email"
      | "phone"
      | "address"
      | "city"
      | "service_category"
      | "plan"
      | "agreed_price"
      | "notes"
      | "active"
    >
  >
): Promise<void> {
  const allowedFields = new Set([
    "name",
    "email",
    "phone",
    "address",
    "city",
    "service_category",
    "plan",
    "agreed_price",
    "notes",
    "active",
  ]);
  const fields = (Object.keys(input) as (keyof typeof input)[]).filter((f) =>
    allowedFields.has(f)
  );
  if (fields.length === 0) return;

  for (const field of fields) {
    await sql.query(`UPDATE customers SET ${field} = $1 WHERE id = $2`, [
      input[field],
      id,
    ]);
  }
}

// ---- Service history ----

export async function listServiceHistory(
  customerId: number
): Promise<ServiceHistoryEntry[]> {
  const { rows } = await sql<ServiceHistoryEntry>`
    SELECT * FROM service_history
    WHERE customer_id = ${customerId}
    ORDER BY service_date DESC
  `;
  return rows.map((row) => normalizeDate(row, "service_date"));
}

export async function addServiceHistoryEntry(input: {
  customer_id: number;
  service_date: string;
  service_type: string;
  price_charged?: number;
  notes?: string;
}): Promise<ServiceHistoryEntry> {
  const { rows } = await sql<ServiceHistoryEntry>`
    INSERT INTO service_history (customer_id, service_date, service_type, price_charged, notes)
    VALUES (${input.customer_id}, ${input.service_date}, ${input.service_type},
      ${input.price_charged ?? null}, ${input.notes ?? null})
    RETURNING *
  `;
  return normalizeDate(rows[0], "service_date");
}

// ---- Photos ----

export async function addPropertyPhoto(input: {
  customer_id?: number;
  lead_id?: number;
  url: string;
  caption?: string;
}): Promise<PropertyPhoto> {
  const { rows } = await sql<PropertyPhoto>`
    INSERT INTO property_photos (customer_id, lead_id, url, caption)
    VALUES (${input.customer_id ?? null}, ${input.lead_id ?? null}, ${input.url}, ${input.caption ?? null})
    RETURNING *
  `;
  return rows[0];
}

export async function listPhotosForCustomer(
  customerId: number
): Promise<PropertyPhoto[]> {
  const { rows } = await sql<PropertyPhoto>`
    SELECT * FROM property_photos
    WHERE customer_id = ${customerId}
    ORDER BY uploaded_at DESC
  `;
  return rows;
}

export async function listUnassignedPhotos(): Promise<PropertyPhoto[]> {
  const { rows } = await sql<PropertyPhoto>`
    SELECT * FROM property_photos
    WHERE customer_id IS NULL
    ORDER BY uploaded_at DESC
  `;
  return rows;
}

// ---- TikTok content tracker ----

export async function listTikTokPosts(): Promise<TikTokPost[]> {
  const { rows } = await sql<TikTokPost>`
    SELECT * FROM tiktok_posts
    ORDER BY
      CASE WHEN planned_date IS NULL THEN 1 ELSE 0 END,
      planned_date ASC,
      created_at DESC
  `;
  return rows.map((row) => normalizeDate(row, "planned_date"));
}

export async function createTikTokPost(input: {
  idea: string;
  caption?: string;
  planned_date?: string;
  status?: TikTokPost["status"];
  notes?: string;
}): Promise<TikTokPost> {
  const { rows } = await sql<TikTokPost>`
    INSERT INTO tiktok_posts (idea, caption, planned_date, status, notes)
    VALUES (${input.idea}, ${input.caption ?? null}, ${input.planned_date ?? null},
      ${input.status ?? "idea"}, ${input.notes ?? null})
    RETURNING *
  `;
  return normalizeDate(rows[0], "planned_date");
}

export async function updateTikTokPost(
  id: number,
  input: Partial<
    Pick<TikTokPost, "idea" | "caption" | "planned_date" | "status" | "post_url" | "notes">
  >
): Promise<void> {
  const allowedFields = new Set([
    "idea",
    "caption",
    "planned_date",
    "status",
    "post_url",
    "notes",
  ]);
  const fields = (Object.keys(input) as (keyof typeof input)[]).filter((f) =>
    allowedFields.has(f)
  );
  if (fields.length === 0) return;

  for (const field of fields) {
    await sql.query(`UPDATE tiktok_posts SET ${field} = $1 WHERE id = $2`, [
      input[field],
      id,
    ]);
  }
}

export async function deleteTikTokPost(id: number): Promise<void> {
  await sql`DELETE FROM tiktok_posts WHERE id = ${id}`;
}
