import { usePlanStore } from "@/store/planStore";
import { columns } from "../tables/mini-plans/components/columns";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { DataTable } from "../tables/mini-plans/components/data-table";

function MiniPlans() {
  const { plans } = usePlanStore();
  const { activePlans, barChartActive, setActivePlans } =
    useCalculatedAssetStore();

  const actionsArray = plans.map((plan) => plan.actions || []).flat();

  return (
    <div className="mx-auto w-full ">
      <div className="mb-4 flex justify-between items-center">
        <p className="font-medium text-xl">Plans</p>
        <Switch
          checked={activePlans}
          disabled={barChartActive}
          onCheckedChange={() => setActivePlans(!activePlans)}
        />
      </div>
      <div className="hidden flex-1 flex-col md:flex">
        <ScrollArea type="always" className="h-[408px] rounded-md border">
          <DataTable data={actionsArray} columns={columns} />
        </ScrollArea>
      </div>
    </div>
  );
}

export default MiniPlans;
