"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/useContext";
import { CompanyProvider } from "@/context/CompanyContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CompanyProvider>{children}</CompanyProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
