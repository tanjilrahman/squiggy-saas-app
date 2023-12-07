import React, { useEffect, useState } from "react";
import { DataTable } from "../tables/assets/components/data-table";
import { usePlanStore } from "@/store/planStore";
import { columns } from "../tables/mini-plans/components/columns";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

function MiniPlans() {
  const { plans } = usePlanStore();
  const [withPlans, setWithPlans] = useState(true);

  const actionsArray = plans.map((plan) => plan.actions || []).flat();

  return (
    <div className="mx-auto w-full ">
      <div className="mb-4 flex justify-between items-center">
        <p className="font-medium text-xl">Plans</p>
        <Switch
          checked={withPlans}
          onCheckedChange={() => setWithPlans(!withPlans)}
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
