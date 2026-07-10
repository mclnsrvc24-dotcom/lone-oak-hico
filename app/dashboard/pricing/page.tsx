import PricingTable from "@/components/PricingTable";

export default function DashboardPricingPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-800 text-forest-dark">
        Pricing Reference
      </h1>
      <p className="mt-1 text-ink/60">
        Same rate sheet shown on the public site — quick reference while on a
        call or at a consultation.
      </p>
      <div className="mt-6 rounded-xl bg-white">
        <PricingTable />
      </div>
    </div>
  );
}
