import { Suspense } from "react";
import ManagerIntroClient from "./ManagerIntroClient";

console.log("ManagerIntroClient import is:", ManagerIntroClient);

export default function ManagerIntroPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading…</div>}>
      <ManagerIntroClient />
    </Suspense>
  );
}
