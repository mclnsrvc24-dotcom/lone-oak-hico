import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PricingTable from "@/components/PricingTable";
import ServiceArea from "@/components/ServiceArea";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <PricingTable />
        <ServiceArea />
        <Gallery />
        <About />
      </main>
      <Footer />
    </>
  );
}
