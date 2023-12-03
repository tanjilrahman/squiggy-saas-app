import { usePlanStore } from "@/store/planStore";
import { columns } from "../tables/plans/components/columns";
import { DataTableExpand } from "../tables/plans/components/data-table-expand";

export default function Plans() {
  const { plans } = usePlanStore();

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="hidden h-full flex-1 flex-col md:flex">
        <DataTableExpand data={plans} columns={columns} />
      </div>
    </div>
  );
}
