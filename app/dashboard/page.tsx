import DashboardBody from "@/app/dashboard/components/DashboardBody";
import { db } from "@/db";
import { auth } from "@clerk/nextjs";
import { promises as fs } from "fs";
import { redirect } from "next/navigation";
import path from "path";

// Simulate a database read for tasks.
// async function getAssets() {
//   const data = await fs.readFile(
//     path.join(process.cwd(), "/app/dashboard/tables/assets/data/assets.json")
//   );

//   const assets = JSON.parse(data.toString());

//   return assets;
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

  // const assets = await getAssets();

  // await db.asset.create({
  //   data: {
  //     User: {
  //       connect: {
  //         id: dbUser.id,
  //       },
  //     },
  //     name: "Asset 5",
  //     value: 1000000,
  //     category: "real estate",
  //     note: "This is a note on the asset.",
  //     yoy: 10,
  //     profit: 50000,
  //     roi: 5,

  //     incomes: {
  //       createMany: {
  //         data: [
  //           {
  //             name: "Rent",
  //             value: 60000,
  //             yoy: 8,
  //             type: "passive",
  //           },
  //           {
  //             name: "Dividends",
  //             value: 10000,
  //             yoy: 15,
  //             type: "mixed",
  //           },
  //         ],
  //       },
  //     },
  //     costs: {
  //       createMany: {
  //         data: [
  //           {
  //             name: "Maintenance",
  //             value: 10000,
  //             yoy: 10,
  //             type: "sustain",
  //           },
  //         ],
  //       },
  //     },
  //   },
  // });

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

  return (
    <div className="mx-auto max-w-screen-xl">
      <DashboardBody data={assets} />
    </div>
  );
}

export default Dashboard;
