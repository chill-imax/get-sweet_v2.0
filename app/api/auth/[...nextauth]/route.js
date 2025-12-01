import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  // 1. Configuración de proveedores
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // 2. Estrategia de sesión (JWT es obligatorio para esta arquitectura)
  session: {
    strategy: "jwt",
  },

  // 3. Páginas personalizadas (Opcional, pero recomendado)
  pages: {
    signIn: "/sign-in", // Si algo falla, vuelve a tu login
    error: "/sign-in",
  },

  // 4. CALLBACKS: El corazón de la integración
  callbacks: {
    /* PASO A: SIGN IN 
       Se ejecuta cuando Google dice "OK". 
       Aquí enviamos el token de Google a TU backend para validarlo.
    */
    async signIn({ user, account }) {
      if (account.provider === "google") {
        // --- AQUÍ ESTÁ EL TOKEN PARA POSTMAN ---
        console.log("🔥 TOKEN DE GOOGLE (COPIA ESTO PARA POSTMAN):");
        console.log(account.id_token);
        console.log("------------------------------------------------");

        try {
          const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
          console.log("📡 Intentando conectar con:", backendUrl);

          const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: account.id_token,
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          // Si el backend dice que NO (ej: 400, 401, 500)
          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              "❌ TU BACKEND RECHAZÓ LA CONEXIÓN:",
              response.status
            );
            console.error("Mensaje del backend:", errorText);
            return false; // Esto es lo que te deja en /sign-in
          }

          const data = await response.json();
          console.log("✅ Login Exitoso en Backend. Token recibido.");

          user.backendToken = data.token;
          user.dbId = data.user._id;

          return true; // Esto te redirige a /thank-u o Home
        } catch (error) {
          console.error("❌ ERROR CRÍTICO DE CONEXIÓN (FETCH FAILED):");
          console.error(error);
          return false;
        }
      }
      return true;
    },

    /* PASO B: JWT
       Se ejecuta inmediatamente después del login y cada vez que se usa la sesión.
       Aquí persistimos los datos que vienen del paso anterior (signIn).
    */
    async jwt({ token, user }) {
      // Si "user" existe, significa que es el momento justo después del login
      if (user) {
        token.accessToken = user.backendToken; // Guardamos TU token en el JWT de NextAuth
        token.id = user.dbId;
      }
      return token;
    },

    /* PASO C: SESSION
       Se ejecuta cuando llamas a useSession() en el frontend.
       Aquí exponemos el token para que el cliente lo pueda usar.
    */
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
