// app/chat/brand-details/page.jsx
import { Suspense } from "react";
import BrandDetailsClient from "./BrandDetailsClient";

export default function BrandDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
      <BrandDetailsClient />
    </Suspense>
  );
}
