// Lone Oak Home Improvement Co. — rate sheet
// Middle-market pricing for the Killeen / Pflugerville / Temple, TX triangle.
// Ranges are starting points for quotes; exact price is set per property at
// consultation and stored on the customer record.

export type PriceRange = { min: number; max: number };

export const SERVICE_AREA = {
  cities: ["Killeen, TX", "Pflugerville, TX", "Temple, TX"],
  blurb:
    "Serving the Killeen – Pflugerville – Temple corridor and everything in between, Central Texas.",
};

export const LAWN_SERVICES: Record<
  string,
  { label: string; range: PriceRange; unit?: string; note?: string }
> = {
  basic_mow: {
    label: "Basic Mow Only",
    range: { min: 35, max: 45 },
  },
  mow_edge_blow: {
    label: "Mow + Edge + Blow",
    range: { min: 45, max: 60 },
  },
  overgrown_first_cut: {
    label: "Overgrown First Cut",
    range: { min: 1.5, max: 2 },
    unit: "× normal price",
    note: "Applies to first-time cuts on overgrown lots and to any lapsed monthly service.",
  },
  weed_eating_only: {
    label: "Weed Eating Only",
    range: { min: 25, max: 40 },
  },
  leaf_cleanup: {
    label: "Leaf Cleanup",
    range: { min: 50, max: 150 },
  },
  bush_trimming: {
    label: "Bush Trimming",
    range: { min: 5, max: 20 },
    unit: "per bush",
    note: "Depends on bush size.",
  },
  mulch_installation: {
    label: "Mulch Installation",
    range: { min: 60, max: 100 },
    unit: "per cubic yard, installed",
  },
};

export type Frequency = "weekly" | "biweekly" | "monthly" | "one_time";

export const FREQUENCY_INFO: Record<
  Frequency,
  { label: string; note: string }
> = {
  weekly: {
    label: "Weekly",
    note: "10–15% cheaper per visit than bi-weekly.",
  },
  biweekly: {
    label: "Bi-Weekly",
    note: "Standard per-visit rate.",
  },
  monthly: {
    label: "Monthly",
    note: "Typically priced at the Overgrown First Cut rate (1.5×–2× normal) since Central Texas grass regrowth after 4 weeks usually needs it.",
  },
  one_time: {
    label: "One-Time / As Needed",
    note: "Standard per-visit rate, or overgrown rate if applicable.",
  },
};

const WEEKLY_DISCOUNT_MIN = 0.1;
const WEEKLY_DISCOUNT_MAX = 0.15;

/**
 * Estimate a per-visit price range for a lawn service at a given frequency.
 * Weekly gets the 10-15% per-visit discount off the base (bi-weekly) range;
 * monthly is quoted at the overgrown-cut multiplier instead of the base
 * range, since a month of Central Texas growth usually requires it.
 */
export function estimateLawnPrice(
  serviceKey: keyof typeof LAWN_SERVICES,
  frequency: Frequency
): PriceRange {
  const service = LAWN_SERVICES[serviceKey];
  const base = service.range;

  if (frequency === "monthly" && serviceKey !== "overgrown_first_cut") {
    const overgrown = LAWN_SERVICES.overgrown_first_cut.range;
    return {
      min: Math.round(base.min * overgrown.min),
      max: Math.round(base.max * overgrown.max),
    };
  }

  if (frequency === "weekly") {
    return {
      min: Math.round(base.min * (1 - WEEKLY_DISCOUNT_MAX)),
      max: Math.round(base.max * (1 - WEEKLY_DISCOUNT_MIN)),
    };
  }

  return base;
}

export const HOUSE_WASH_SERVICES: Record<
  string,
  { label: string; range: PriceRange; note?: string }
> = {
  small_single_story: {
    label: "Small Single-Story Home",
    range: { min: 275, max: 325 },
  },
  avg_2000_sqft: {
    label: "Average 2,000 sq ft Home",
    range: { min: 350, max: 450 },
  },
  large_two_story: {
    label: "Large 2-Story Home",
    range: { min: 450, max: 650 },
  },
};

export const HOUSE_WASH_ADDONS: Record<
  string,
  { label: string; range: PriceRange }
> = {
  heavy_stain_mold: {
    label: "Heavily Stained or Mold-Covered Homes",
    range: { min: 75, max: 200 },
  },
  gutter_whitening: {
    label: "Gutter Whitening",
    range: { min: 100, max: 200 },
  },
  driveway_cleaning: {
    label: "Driveway Cleaning",
    range: { min: 125, max: 250 },
  },
  sidewalks: {
    label: "Sidewalks",
    range: { min: 50, max: 100 },
  },
  patio: {
    label: "Patio",
    range: { min: 75, max: 200 },
  },
};

export function formatRange(range: PriceRange, unit?: string): string {
  const isMultiplier = unit === "× normal price";
  const fmt = (n: number) => (isMultiplier ? n.toString() : `$${n}`);
  return `${fmt(range.min)}–${fmt(range.max)}${unit ? ` ${unit}` : ""}`;
}
