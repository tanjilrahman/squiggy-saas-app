"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/auth-callback", {
        method: "GET",
      });

      const { success } = await response.json();
      if (success) {
        router.push(origin ? `/${origin}` : "/dashboard");
      }
    } catch (err: any) {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    }
  };

  fetchData();

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
