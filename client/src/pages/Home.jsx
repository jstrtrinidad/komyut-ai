import Hero from "../components/home/Hero";
import RouteSearch from "../components/home/RouteSearch";
import Features from "../components/home/Features";
import PopularRoutes from "../components/home/PopularRoutes";
import AISection from "../components/home/AISection";
import Testimonials from "../components/home/Testimonials";
import StatsSection from "../components/home/StatsSection";
import AppPreview from "../components/home/AppPreview";
import CTASection from "../components/home/CTASection";
import HowItWorks from "../components/home/HowItWorks";
import LiveTraffic from "../components/home/LiveTraffic";

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <PopularRoutes />
      <AISection />
      <LiveTraffic />
      <Testimonials />
      <CTASection />
    </>
  );
}

export default Home;