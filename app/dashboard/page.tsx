import DashboardBody from "@/app/dashboard/components/DashboardBody";
import MenuBar from "@/app/dashboard/components/MenuBar";
import { promises as fs } from "fs";
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

  return (
    <div>
      <div className="mx-auto max-w-screen-xl">
        <div className="mx-auto max-w-screen-md text-center mb-6 lg:mb-8">
          <MenuBar />
        </div>

        <DashboardBody data={assets} />
      </div>
    </div>
  );
}

export default Dashboard;
