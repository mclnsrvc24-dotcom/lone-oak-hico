import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequestServiceForm from "@/components/RequestServiceForm";

export const metadata = {
  title: "Request a Consultation | Lone Oak Home Improvement Co.",
};

export default function RequestServicePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-800 text-forest-dark md:text-4xl">
          Request a Consultation
        </h1>
        <p className="mt-2 text-ink/70">
          Pick a service and let us know when works for a quick visit. We
          confirm final pricing and scheduling once we see the property.
        </p>
        <div className="mt-10">
          <RequestServiceForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
