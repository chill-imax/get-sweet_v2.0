"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function useRouteGuards({ pathname, router }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const user = session?.user;
    const hasSession = !!session;

    // SIN LOGIN → solo puede ver sign-in y landing
    if (!hasSession && pathname !== "/sign-in" && pathname !== "/sign-up") {
      router.replace("/sign-in");
      return;
    }

    // CON LOGIN
    if (user) {
      // NO TIENE ONBOARDING → no puede entrar al chat
      if (!user.onboardingCompleted && pathname === "/chat") {
        router.replace("/onboarding");
        return;
      }

      // YA TIENE ONBOARDING → no permitir llegar al onboarding
      if (user.onboardingCompleted && pathname === "/onboarding") {
        router.replace("/chat");
        return;
      }
    }
  }, [status, pathname, session]);
}
