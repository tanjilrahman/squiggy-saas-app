import DashboardBody from "@/app/dashboard/components/DashboardBody";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import path from "path";

// Simulate a database read for tasks.
async function getAssets() {
  const data = await fs.readFile(
    path.join(process.cwd(), "/app/dashboard/tables/assets/data/assets.json")
  );

  const assets = JSON.parse(data.toString());

  return assets;
}

async function Dashboard() {
  const assets = await getAssets();
  const { userId } = auth();

  if (!userId) return redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) return redirect("/auth-callback?origin=dashboard");

  return (
    <div className="mx-auto max-w-screen-xl">
      <DashboardBody data={assets} />
    </div>
  );
}

export default Dashboard;
