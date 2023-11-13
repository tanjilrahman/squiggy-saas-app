import { DataTable } from "../tables/assets/components/data-table";
import { columns } from "../tables/assets/components/columns";
import { Asset } from "../tables/assets/data/schema";
import { useAssetStore } from "@/store/assetStore";

export default function Assets() {
  const { assets } = useAssetStore();

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <DataTable data={assets} columns={columns} />
      </div>
    </div>
  );
}
