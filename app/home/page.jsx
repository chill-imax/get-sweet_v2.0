import HowItWorksSection from "@/components/ui/sections/HowItWorks";
import ContactUsSection from "@/components/ui/sections/Contact";
import CallToActionSection from "@/components/ui/sections/CTA";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/ui/sections/Hero";
import IntegrationsSection from "@/components/ui/sections/Integrations";
import PricingSection from "@/components/ui/sections/Pricing";
import StatsSection from "@/components/ui/sections/Stats";
import UseCasesSection from "@/components/ui/sections/UseCases";
import FeaturesSection from "@/components/ui/sections/WhyWorkWithUs";
import Header from "@/components/ui/Header";
import Image from "next/image";
import SecurityTrustSection from "@/components/ui/sections/Security";
import FloatingChatIcon from "@/components/ui/sections/FloatingChat";

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
      <SecurityTrustSection />
      <CallToActionSection />
      <ContactUsSection />
      <Footer />
      <FloatingChatIcon />
    </div>
  );
}
