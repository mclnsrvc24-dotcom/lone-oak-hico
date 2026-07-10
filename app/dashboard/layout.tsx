import DashboardNav from "@/components/dashboard/DashboardNav";

// Every dashboard page reads live data from Postgres — never statically
// prerender these at build time (there's no DB connection available then).
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Lone Oak Home Improvement Co.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bone">
      <DashboardNav />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
