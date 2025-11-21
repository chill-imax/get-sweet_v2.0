import HowItWorksSection from "@/components/ui/sections/HowItWorks";
import ContactUsSection from "@/components/ui/sections/Contact";
import CallToActionSection from "@/components/ui/sections/CTA";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/ui/sections/Hero";
import IntegrationsSection from "@/components/ui/sections/Integrations";
import PricingSection from "@/components/ui/sections/Pricing";
import StatsSection from "@/components/ui/sections/Stats";
import Header from "@/components/ui/Header";
import Image from "next/image";
import SecurityTrustSection from "@/components/ui/sections/Security";
import FloatingChatIcon from "@/components/ui/sections/FloatingChat";
import CustomSystemSection from "@/components/ui/sections/CustomSystem";
import TestimonialsSection from "@/components/ui/sections/Testimonials";
import WhyWorkWithUs from "@/components/ui/sections/WhyWorkWithUs";
import CaseStudiesTeaser from "@/components/ui/sections/CaseStudieTeaser";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSection />

      <HowItWorksSection />
      <WhyWorkWithUs />
      <CustomSystemSection />
      <StatsSection />
      <IntegrationsSection />
      <CaseStudiesTeaser />
      <PricingSection />
      <SecurityTrustSection />
      <TestimonialsSection />
      <CallToActionSection />
      <Footer />
      <FloatingChatIcon />
    </div>
  );
}
