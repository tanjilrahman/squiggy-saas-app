import LandingPage from "@/components/LandingPage";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  if (userId) return redirect("/dashboard");
  return (
    <main className="text-center ">
      <LandingPage />
      {/* <div className="flex items-center justify-center mt-4">
        <Link href="/hc">
          <Button variant="link">Help center</Button>
        </Link>
        <Link href="/tos">
          <Button variant="link">Terms & conditions</Button>
        </Link>
        <Link href="/privacy">
          <Button variant="link">Privacy policy</Button>
        </Link>
      </div> */}
    </main>
  );
}
