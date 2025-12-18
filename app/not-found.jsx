"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoveLeft, Home, Ghost } from "lucide-react"; // O el icono que prefieras

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
        {/* Icono Animado / Ilustración */}
        <div className="relative w-24 h-24 mx-auto bg-purple-50 rounded-full flex items-center justify-center">
          <Ghost className="w-12 h-12 text-purple-600" />
          <div className="absolute top-0 right-0 w-6 h-6 bg-red-400 rounded-full border-4 border-white animate-bounce" />
        </div>

        {/* Textos */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-semibold text-gray-800">
            Page not found
          </h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Oops! The page you are looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {/* Opción 1: Volver Atrás (Intenta ir al historial) */}
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <MoveLeft className="w-4 h-4" />
            Go Back
          </button>

          {/* Opción 2: Ir a Ruta Segura (Dashboard o Home) */}
          <Link
            href="/" // O cambialo a "/chat" si es tu vista principal
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>

      {/* Footer discreto */}
      <p className="mt-8 text-xs text-gray-400">
        Sweet AI © {new Date().getFullYear()}
      </p>
    </div>
  );
}
