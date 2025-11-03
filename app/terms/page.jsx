"use client";

import Footer from "@/components/sections/Footer";
import TermsOfService from "@/components/sections/TermsService";
import Header from "@/components/ui/Header";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <TermsOfService />
      <Footer />
    </main>
  );
}
