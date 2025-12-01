import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in", error: "/sign-in" },

  callbacks: {
    // 1. SIGN IN
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: account.id_token,
                email: user.email,
                name: user.name,
                image: user.image,
              }),
            }
          );

          if (!response.ok) return false;

          const data = await response.json();

          user.backendToken = data.token;
          user.dbId = data.user._id;
          user.onboardingCompleted = data.user.onboardingCompleted;

          return true;
        } catch (error) {
          console.error("Error Google Auth:", error);
          return false;
        }
      }
      return true;
    },

    // 2. JWT (AQUÍ ESTÁ EL CAMBIO CLAVE) 🟢
    async jwt({ token, user, trigger, session }) {
      // Caso A: Primer inicio de sesión
      if (user) {
        token.accessToken = user.backendToken;
        token.id = user.dbId;
        token.onboardingCompleted = user.onboardingCompleted;
      }

      // Caso B: Actualización manual desde el cliente (updateOnboarding)
      if (trigger === "update" && session?.onboardingCompleted) {
        token.onboardingCompleted = session.onboardingCompleted;
      }

      return token;
    },

    // 3. SESSION
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.onboardingCompleted = token.onboardingCompleted;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
