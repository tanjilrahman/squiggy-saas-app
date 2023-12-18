import { columns } from "../tables/assets/components/columns";
import { useAssetStore } from "@/store/assetStore";
import { DataTableExpand } from "../tables/assets/components/data-table-expand";
import { useCalculatedAssetStore } from "@/store/calculationStore";

export default function Assets() {
  const { assets } = useAssetStore();
  const { activePlans } = useCalculatedAssetStore();
  const pureAssets = assets.filter((asset) => !asset.action_asset);
  const assetsData = activePlans ? assets : pureAssets;
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="hidden h-full flex-1 flex-col md:flex">
        <DataTableExpand data={assetsData} columns={columns} />
      </div>
    </div>
  );
}
