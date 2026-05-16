import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Lookbook from "@/components/sections/Lookbook";
import Booking from "@/components/sections/Booking";
import PromoBanner from "@/components/sections/PromoBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoBanner />
      <About />
      <Services />
      <Lookbook />
      <Booking />
    </>
  );
}
