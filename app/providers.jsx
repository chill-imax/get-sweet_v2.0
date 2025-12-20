"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/useContext";
import { CompanyProvider } from "@/context/CompanyContext";
import { ToastProvider } from "@/context/ToastContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ToastProvider>
          <CompanyProvider>{children}</CompanyProvider>
        </ToastProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
