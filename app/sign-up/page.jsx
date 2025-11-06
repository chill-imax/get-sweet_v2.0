"use client"
import { Mail, Lock, ArrowLeft, User, Check } from "lucide-react";
import Image from "next/image";
import logo from "../../public/icons/logogetsweet.png";
import { useState } from "react";



const GOOGLE_ICON_URL = "https://www.svgrepo.com/show/475656/google-color.svg";

export default function SignUp() {
    const [agreedToTerms, setAgreedToTerms] = useState(false);


    const handleBackToHome = () => {
    console.log("Navegando de vuelta a la página de inicio...");
    window.location.href = '/';
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreedToTerms) {
      console.log("Formulario de registro enviado...");
    } else {
      console.log("Debe aceptar los términos para continuar.");
    }
  };




  return (
    <section 
      className="relative flex justify-center items-center min-h-screen pt-16 pb-16 md:pt-24 md:pb-24" 
      style={{
        background: 'radial-gradient(circle at center top, #ffffff 0%, #ffffff 20%, #f3e8ff 50%, #d8b4fe 100%)',
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
          Create Your Account
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Start your 14-day free trial
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
          <span className="px-3 text-sm text-gray-400">Or register with email</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <form className="space-y-4 text-left">
          <div>
            <label className="text-sm text-gray-700 font-medium">Full name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="text-gray-800 w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700 font-medium">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
              <input
                id="email"
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
                id="password"
                type="pasword"
                placeholder="••••••••"
                className="text-gray-800 w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium">Confirm your password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-purple-400" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="text-gray-800 w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-150"
              />
            </div>

          {/* --- CHECKBOX TÉRMINOS Y CONDICIONES --- */}
          <div className="flex items-start mt-4">
            <input
              id="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="hidden" 
            />
            
        
            <label htmlFor="terms" className="flex items-center cursor-pointer">
              <div 
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 border-2 
                  ${agreedToTerms 
                    ? 'bg-purple-600 border-purple-600' 
                    : 'bg-white border-gray-300 hover:border-purple-400'
                  }`}
              >
                {agreedToTerms && <Check className="h-3 w-3 text-white" />}
              </div>
              
          
              <span className="ml-3 text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" className="text-purple-600 hover:text-purple-700 font-medium transition duration-150">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy-policy" className="text-purple-600 hover:text-purple-700 font-medium transition duration-150">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>
          {/* --- FIN CHECKBOX --- */}

          </div>

          <button 
            type="submit"
            className="w-full bg-linear-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 hover:shadow-lg transition duration-300 text-white font-semibold py-3 rounded-lg shadow-md mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6">

          Already have an account?{" "}
          <a href="/sign-in" className="text-purple-600 hover:underline font-medium">
            Sign in
          </a>
        </p>

        
      </div>
      <div className="absolute bottom-10 sm:bottom-16">
        <p className="text-[11px] text-gray-500/70 mt-6 text-center">
          No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
}
