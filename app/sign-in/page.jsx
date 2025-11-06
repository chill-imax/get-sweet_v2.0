"use client"
import { Mail, Lock, ArrowLeft } from "lucide-react";
import Image from "next/image";
import logo from "../../public/icons/logogetsweet.png";



const GOOGLE_ICON_URL = "https://www.svgrepo.com/show/475656/google-color.svg";

export default function SignIn() {
    const handleBackToHome = () => {
    console.log("Navegando de vuelta a la página de inicio...");
    window.location.href = '/';
  };


  return (
    <section 
      className="relative flex justify-center items-center min-h-screen pt-16 pb-16 md:pt-24 md:pb-24" 
      style={{
        background: 'radial-gradient(circle at center top, #ffffff 0%, #ffffff 30%, #f3e8ff 70%, #d8b4fe 100%)',
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
        {/* Header */}
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

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to continue to Get Sweet AI
        </p>

        {/* Google Sign-In */}
        <button
          className="w-full mb-4 flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 hover:shadow-lg transition duration-150 py-2.5 rounded-lg text-gray-700 font-semibold shadow-sm"
        >
          <Image
            src={GOOGLE_ICON_URL}
            alt="Google"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">Or continue with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <form className="space-y-4 text-left">
          <div>
            <label className="text-sm text-gray-700 font-medium">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="text-gray-800 w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="text-gray-800 w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150"
              />
            </div>
            <div className="text-right mt-2">
              <a
                href="#"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium transition duration-150"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-linear-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 hover:shadow-lg transition duration-300 text-white font-semibold py-3 rounded-lg shadow-md mt-6"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-purple-600 hover:underline font-medium">
            Sign up for free
          </a>
        </p>

        
      </div>
      <div className="absolute bottom-4 sm:bottom-10">
        <p className="text-[11px] text-gray-400/70 mt-6 text-center">
          Protected by enterprise-grade security
        </p>
      </div>
    </section>
  );
}