"use client";

import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import logo from "../../public/icons/logogetsweet.png";
import { useState } from "react";
import { useAuth } from "@/context/useContext";
import { GoogleLoginBtn } from "@/components/auth/GoogleLogin";
import { useRouter } from "next/navigation";
import api from "@/app/api/auth/axios"; // ✅ Importamos Axios

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Por favor, ingresa tu email y contraseña.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Axios: POST limpio y directo
      const response = await api.post("/api/v1/auth/login", {
        email,
        password,
      });

      const data = response.data; // Axios entrega la data aquí

      console.log("🔥 Login Exitoso:", data);

      // Buscamos el objeto de usuario (ajustar según tu backend)
      const userData = data.user || data.data?.user || data;

      // Actualizar Contexto + LocalStorage (asumiendo que tu función login maneja ambos)
      login(
        {
          id: userData._id || userData.id,
          name: userData.fullName || userData.name,
          email: userData.email,
          role: userData.role,
          ...userData,
        },
        data.token
      );

      router.push("/chat");
    } catch (err) {
      console.error("Error en el login:", err);
      // ✅ Manejo de error estandarizado de Axios
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "No se pudo conectar al servidor.";
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <section
      className="relative flex justify-center items-center min-h-screen pt-16 pb-16 md:pt-24 md:pb-24"
      style={{
        background:
          "radial-gradient(circle at center top, #ffffff 0%, #ffffff 30%, #f3e8ff 70%, #d8b4fe 100%)",
      }}
    >
      <button
        onClick={handleBackToHome}
        className="absolute top-8 left-4 md:top-12 md:left-26
                    flex items-center gap-2 text-sm font-medium text-purple-900
                    hover:text-purple-600 transition duration-150 p-4 
                    hover-shadow-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center mx-4 my-8">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3">
            <Image
              src={logo}
              alt="Sweet AI Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to continue to Get Sweet AI
        </p>

        <GoogleLoginBtn label="Continue with Google" />

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">
            Or login with email
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form className="space-y-4 text-left" onSubmit={handleLogin}>
          <div>
            <label className="text-sm text-gray-700 font-medium">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-gray-800 w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-gray-800 w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2 bg-red-50 p-2 rounded border border-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full transition duration-300 text-white font-semibold py-3 rounded-lg shadow-md mt-6 ${
              loading
                ? "bg-gray-400 cursor-not-allowed flex items-center justify-center"
                : "bg-linear-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 hover:shadow-lg"
            }`}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <a
            href="/sign-up"
            className="text-purple-600 hover:underline font-medium"
          >
            Sign up for free
          </a>
        </p>
      </div>
    </section>
  );
}
