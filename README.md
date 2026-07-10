# Lone Oak Home Improvement Co. — Website & Ops Dashboard

Next.js 15 (App Router) + TypeScript + Tailwind CSS. Built for deployment on
Vercel via GitHub. Covers lawn care & house washing in the Killeen –
Pflugerville – Temple, TX area.

## What's here

- **Public site** (`app/page.tsx`) — homepage with services, full pricing
  sheet, service area, and a gallery placeholder.
- **Booking flow** (`app/request-service`) — customer picks a service +
  plan (weekly/bi-weekly/monthly), submits contact info and a preferred
  consultation time. Creates a `lead` in the database and emails
  `loneoakhico@yahoo.com` with a one-click **Add to Google Calendar** link
  prefilled with the details.
- **Photo upload** (`app/upload-photos`) — customers upload property photos
  straight from their phone. Files go directly to Vercel Blob storage
  (bypasses the ~4.5MB serverless body-size limit), then get linked to
  their lead/customer record.
- **Dashboard** (`app/dashboard`) — internal ops tool:
  - **Overview** — quick counts (new leads, active customers, TikTok
    backlog).
  - **Leads** — every consultation request, status tracker, one-click
    "+ Calendar" link, and "Convert to customer" once scheduled.
  - **Customers** — full CRM: contact info, plan, agreed price, notes,
    service history log, and uploaded property photos per customer.
  - **TikTok** — content tracker: idea backlog → planned → filmed →
    posted, with a bank of starter ideas to tap when you're stuck.
  - **Pricing Sheet** — the full rate card for quick reference on calls.

## Why booking is a request form, not live calendar booking

Real-time booking straight onto your Google Calendar requires a Google
Cloud OAuth app. Until that app is verified with a real domain, Google
expires refresh tokens every 7 days, which would silently break booking.
Instead, the site sends you a request with a **pre-filled Google Calendar
quick-add link** — one click while signed into `loneoakhico@yahoo.com`
adds it to your calendar, and you can adjust the time before saving. Zero
OAuth risk, works today. If you outgrow this later, swapping in a Cal.com
embed (free, syncs to Google Calendar, no OAuth code to maintain) is the
next easy step up.

## ⚠️ No dashboard authentication (by design, for now)

Per your call, `/dashboard` currently has **no login** — anyone with the
URL can see leads, customer contact info, and property photos. That's fine
while the URL is private, but:
- Don't link to `/dashboard` from the public site or share the URL casually.
- Add basic protection whenever you're ready — the fastest option is a
  single shared password via Next.js middleware (a ~15-line change); ask
  me for it when you want it.

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Visit `http://localhost:3000`. The dashboard is at `/dashboard`.

## Environment variables

All set in `.env.local` for local dev, and in Vercel Project Settings →
Environment Variables for production.

| Variable | Where to get it |
|---|---|
| `POSTGRES_URL` | Vercel dashboard → your project → **Storage** → **Create Database** → Postgres. Vercel injects this automatically once connected; copy it into `.env.local` for local dev. |
| `BLOB_READ_WRITE_TOKEN` | Vercel dashboard → your project → **Storage** → **Create Database** → Blob. |
| `RESEND_API_KEY` | Free account at [resend.com](https://resend.com) (3,000 emails/month free) → API key. |
| `NOTIFY_EMAIL` | `loneoakhico@yahoo.com` — where new lead notifications go. |
| `EMAIL_FROM` | Until you verify a domain in Resend, use `onboarding@resend.dev` (their shared test sender). Once you have a domain, verify it in Resend and switch this to a branded address. |

## Database setup

After creating the Postgres database in Vercel and pulling
`POSTGRES_URL` into `.env.local`, run the schema once:

```bash
npm run db:init
```

This creates `leads`, `customers`, `service_history`, `property_photos`,
and `tiktok_posts` tables (see `db/schema.sql`). Safe to re-run — every
statement is `CREATE TABLE IF NOT EXISTS`.

## Deploying (GitHub → Vercel)

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In Vercel: **New Project** → import `lone-oak-hico` → it auto-detects Next.js.
3. Before the first deploy, add the environment variables above, and
   provision Postgres + Blob storage from the **Storage** tab (this
   auto-populates `POSTGRES_URL` / `BLOB_READ_WRITE_TOKEN` for you).
4. Deploy, then run `npm run db:init` once **locally** with the production
   `POSTGRES_URL` (or run the statements in `db/schema.sql` directly from
   the Vercel Postgres query console) to set up tables.
5. You'll get a `*.vercel.app` URL immediately. Add a custom domain later
   under Project Settings → Domains.

## Pricing logic

All rates live in `lib/pricing.ts`, taken directly from your rate sheet:

- Basic mow, mow+edge+blow, weed eating, leaf cleanup, bush trimming, and
  mulch installation — flat ranges.
- **Weekly** plans are automatically quoted 10–15% cheaper per visit than
  the base (bi-weekly) rate.
- **Monthly** plans are automatically quoted at the **overgrown-cut**
  rate (1.5×–2×) instead of the base mow rate, since a month of Central
  Texas grass growth usually needs it — this is called out to the customer
  on the booking form itself so there's no surprise at consultation.
- House washing tiers (small single-story / ~2,000 sq ft / large 2-story)
  plus add-ons (heavy stain/mold, gutter whitening, driveway, sidewalks,
  patio) are all in the same file.

Change any number in `lib/pricing.ts` and it updates everywhere — public
pricing table, booking form estimate, and the dashboard reference sheet.

## Things intentionally left as placeholders

- **Gallery photos** (`components/Gallery.tsx`) — labeled placeholder
  tiles by category. Swap in real before/after shots into `public/gallery/`
  and update the component whenever you have photos ready.
- **Domain-based email sending** — see Resend setup above.
- **Dashboard auth** — see the warning above.

## A note on `@vercel/postgres`

Vercel has deprecated the `@vercel/postgres` package in favor of Neon's own
SDK (`@neondatabase/serverless`), since Vercel Postgres now runs on Neon
under the hood. The package used here still works fine and the connection
string format is unchanged, but if Vercel removes it down the line, `lib/db.ts`
is the only file that would need updating to swap the client.
