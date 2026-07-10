import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoUploadForm from "@/components/PhotoUploadForm";

export const metadata = {
  title: "Upload Property Photos | Lone Oak Home Improvement Co.",
};

export default async function UploadPhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string; customer?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl font-800 text-forest-dark md:text-4xl">
          Upload Property Photos
        </h1>
        <p className="mt-2 text-ink/70">
          A few photos of the yard or exterior help us quote accurately
          before the consultation.
        </p>
        <div className="mt-10">
          <PhotoUploadForm leadId={params.lead} customerId={params.customer} />
        </div>
      </main>
      <Footer />
    </>
  );
}
