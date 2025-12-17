import { Suspense } from "react";
import CampaignsClient from "./CampaignsClient";

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
      <CampaignsClient />
    </Suspense>
  );
}
