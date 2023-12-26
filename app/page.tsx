import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  if (userId) return redirect("/dashboard");
  return (
    <main className="text-center ">
      <h1>Landing page</h1>
    </main>
  );
}
