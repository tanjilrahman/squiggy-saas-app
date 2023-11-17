import { columns } from "../tables/assets/components/columns";
import { Asset } from "../tables/assets/data/schema";
import { useAssetStore } from "@/store/assetStore";
import { DataTableExpand } from "../tables/assets/components/data-table-expand";

export default function Assets() {
  const { assets } = useAssetStore();

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="hidden h-full flex-1 flex-col md:flex">
        <DataTableExpand data={assets} columns={columns} />
      </div>
    </div>
  );
}
