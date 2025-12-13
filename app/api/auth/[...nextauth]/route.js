import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in", error: "/sign-in" },

  callbacks: {
    /** -------------------------------------------------
     * SIGNIN: solo autentica con el backend
     --------------------------------------------------*/
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const tokenGoogle = account.id_token;

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: tokenGoogle }),
            }
          );

          if (!res.ok) return false;

          const data = await res.json();

          user.backendToken = data.token;
          user.dbId = data.user._id;
          user.onboardingCompleted = data.user.onboardingCompleted;
          user.role = data.user.role;

          return true;
        } catch (err) {
          console.error("Google Auth Error:", err);
          return false;
        }
      }

      return true;
    },

    /** -------------------------------------------------
     * JWT: guarda todo lo necesario en el token
     --------------------------------------------------*/
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.backendToken;
        token.id = user.dbId;
        token.onboardingCompleted = user.onboardingCompleted;
        token.role = user.role;
      }

      if (trigger === "update" && session?.user?.onboardingCompleted) {
        token.onboardingCompleted = session.user.onboardingCompleted;
      }

      return token;
    },

    /** -------------------------------------------------
     * SESSION: expone los datos al frontend
     --------------------------------------------------*/
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.onboardingCompleted = token.onboardingCompleted;
      session.user.role = token.role;
      return session;
    },

    /** -------------------------------------------------
     * REDIRECT 
     --------------------------------------------------*/
    async redirect({ baseUrl, url }) {
      // Si la redirección es interna de NextAuth, dejarla pasar
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      return url;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
