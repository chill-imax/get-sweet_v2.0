"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/useContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
