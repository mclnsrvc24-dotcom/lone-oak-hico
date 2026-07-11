import { notFound } from "next/navigation";
import {
  getCustomer,
  listServiceHistory,
  listPhotosForCustomer,
} from "@/lib/db";
import CustomerEditForm from "@/components/dashboard/CustomerEditForm";
import ServiceHistoryPanel from "@/components/dashboard/ServiceHistoryPanel";
import PhotoGrid from "@/components/dashboard/PhotoGrid";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customerId = Number(id);
  const customer = await getCustomer(customerId);
  if (!customer) notFound();

  const [history, photos] = await Promise.all([
    listServiceHistory(customerId),
    listPhotosForCustomer(customerId),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-800 text-forest-dark">
        {customer.name}
      </h1>
      <p className="mt-1 text-ink/60">
        Customer since {new Date(customer.created_at).toLocaleDateString()}
      </p>
      
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <CustomerEditForm customer={customer} />
        <ServiceHistoryPanel customerId={customer.id} history={history} />
      </div>

      <div className="mt-6 rounded-xl border border-forest-dark/10 bg-white p-6">
        <h2 className="font-display text-lg font-700 text-forest-dark">
          Property photos
        </h2>
        <div className="mt-4">
          <PhotoGrid photos={photos} />
        </div>
      </div>
    </div>
  );
}
