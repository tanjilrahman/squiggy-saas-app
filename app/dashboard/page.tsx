import DashboardBody from "@/app/dashboard/components/DashboardBody";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import path from "path";

// Simulate a database read for tasks.
// async function getPlans() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "/app/dashboard/tables/plans/data/plans.json")
//   );

//   const plans = JSON.parse(data.toString());

//   return plans;
// }

async function Dashboard() {
  const { userId } = auth();

  if (!userId) return redirect("/auth-callback?origin=dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!dbUser) return redirect("/auth-callback?origin=dashboard");

  const assets = await db.asset.findMany({
    where: {
      userId: dbUser.id,
    },
    include: {
      incomes: true,
      costs: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const plans = await db.plan.findMany({
    where: {
      userId: dbUser.id,
    },
    include: {
      actions: {
        include: {
          assetIns: true,
          assetOuts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // const plans = await getPlans();

  return (
    <div className="mx-auto max-w-screen-xl">
      {/* @ts-ignore */}
      <DashboardBody assets={assets} plans={plans} />
    </div>
  );
}

export default Dashboard;
