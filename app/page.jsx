import HowItWorksSection from "@/components/sections/HowItWorks";
import ContactUsSection from "@/components/sections/Contact";
import CallToActionSection from "@/components/sections/CTA";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/sections/Hero";
import IntegrationsSection from "@/components/sections/Integrations";
import PricingSection from "@/components/sections/Pricing";
import StatsSection from "@/components/sections/Stats";
import UseCasesSection from "@/components/sections/UseCases";
import FeaturesSection from "@/components/sections/WhyWorkWithUs";
import Header from "@/components/ui/Header";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <Header />
    <HeroSection />
    <StatsSection />
    <FeaturesSection />
    <HowItWorksSection />
    <UseCasesSection />
    <IntegrationsSection />
    {/* <TestimonialsSection /> */}
    <PricingSection />
    <CallToActionSection />
    <ContactUsSection />  
    <Footer />
   </div>
  );
}
