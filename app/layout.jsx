import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Asegúrate de que esta ruta apunte a tu archivo de contexto real
import { AuthProvider } from "@/context/useContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get Sweet AI",
  description:
    "Automate 100% of your social media content with GetSweet.AI. Create posts, schedule publications, and easily edit with our AI. Start generating quality content today!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Ya no necesitamos GoogleOAuthProvider aquí.
            Tu AuthProvider interno ya maneja la sesión de NextAuth (Google) 
            y tu estado local (Email/Pass).
        */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
