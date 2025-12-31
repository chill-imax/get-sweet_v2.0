"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { AuthProvider } from "@/context/useContext";
import { CompanyProvider } from "@/context/CompanyContext";
import { ToastProvider } from "@/context/ToastContext";
import { useEffect } from "react";

function TokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accessToken) {
      localStorage.setItem("userToken", session.user.accessToken);
    } else if (session === null) {
    }
  }, [session]);

  return null;
}

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <TokenSync />
      <AuthProvider>
        <ToastProvider>
          <CompanyProvider>{children}</CompanyProvider>
        </ToastProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
