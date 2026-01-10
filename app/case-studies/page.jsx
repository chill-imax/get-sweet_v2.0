import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import { CaseStudiesPage } from "@/components/ui/sections/CaseStudies";
import FloatingChatIcon from "@/components/ui/sections/FloatingChat";

export default function CaseStudies() {
  return (
    <div>
      <Header />
      <CaseStudiesPage />
      <Footer />
      <FloatingChatIcon />
    </div>
  );
}
