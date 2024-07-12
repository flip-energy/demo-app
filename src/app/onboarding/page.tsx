"use client";

import { useCurrentUser } from "@/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const OnboardingIndexPage = () => {
  useCurrentUser({ requireUser: true });
  const router = useRouter();

  useEffect(() => {
    router.push("/onboarding/address");
  }, [router]);

  return null;
};

export default OnboardingIndexPage;
