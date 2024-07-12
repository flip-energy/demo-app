"use client";

import SubmitButton from "@/components/submitButton";
import { supabase } from "@/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ConnectProps {
  deviceName: string;
  deviceType: string;
  nextUrl?: string;
}

const Connect = ({ deviceName, deviceType, nextUrl = "/" }: ConnectProps) => {
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleConnect = async () => {
    setIsFormSubmitting(true);

    const response = await fetch(
      `/api/connect/link?redirect_uri=${encodeURIComponent(
        nextUrl
      )}&device_type=${deviceType}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    router.push(data.link);
  };

  return (
    <SubmitButton isSubmitting={isFormSubmitting} onClick={handleConnect}>
      Connect my {deviceName}
    </SubmitButton>
  );
};

export default Connect;
