import DashboardBody from "@/app/dashboard/components/DashboardBody";
import { db } from "@/db";
import { UserStateType } from "@/store/store";
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

  const dbUserObject: UserStateType = {
    currency: dbUser.currency,
    isPro: false,
  };

  const initialAssets = await db.asset.findMany({
    where: {
      userId: dbUser.id,
    },
    include: {
      incomes: true,
      costs: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const initialPlans = await db.plan.findMany({
    where: {
      userId: dbUser.id,
    },
    include: {
      actions: {
        include: {
          assetsIn: true,
          assetOut: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // const plans = await getPlans();

  return (
    <div className="mx-auto max-w-screen-xl">
      <DashboardBody
        // @ts-ignore
        initialAssets={initialAssets}
        // @ts-ignore
        initialPlans={initialPlans}
        dbUser={dbUserObject}
      />
    </div>
  );
}

export default Dashboard;
