import { Row } from "@tanstack/react-table";
import React from "react";
import { DataTableRemove } from "../data-table-remove";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { useAssetStore } from "@/store/assetStore";

interface ColumnDetailsDeleteProps<TData> {
  row: Row<TData>;
  updateFunc: (planId: string, columnId: string) => void;
}

function ColumnDetailsDelete<TData>({
  row,
  updateFunc,
}: ColumnDetailsDeleteProps<TData>) {
  const { plans } = usePlanStore();
  const { expanded, isEditable } = usePlanExpandedState();
  const { removeAsset } = useAssetStore();

  const handleRemove = async () => {
    const actionId: string = row.getValue("id");
    const plan = plans.find((plan) => expanded === plan.id);
    const action = plan?.actions.find((action) => actionId === action.id);
    const assetIds = action?.assetsIn;

    if (action?.assetOut) {
      assetIds?.push(action.assetOut);
    }

    try {
      const response = await fetch("/api/delete-plan", {
        method: "POST",
        body: JSON.stringify({ type: "action", itemId: actionId, assetIds }),
      });

      const { success, code } = await response.json();
      if (success) {
        console.log("success");
        assetIds?.forEach((assetId) => removeAsset(assetId));
        updateFunc(expanded!, actionId);
      }
      if (code === "NOT FOUND") {
        updateFunc(expanded!, actionId);
      }
    } catch (err: any) {
      if (err.data?.code === "UNAUTHORIZED") {
        console.log("You don't have the access.");
      }
    }
  };

  return (
    <DataTableRemove handleRemove={handleRemove}>
      <Button
        disabled={!isEditable}
        variant="secondary"
        className="flex p-3 space-x-2 data-[state=open]:bg-muted ml-auto"
      >
        <Trash2 className="h-4 w-4" />
        <span className="">Delete</span>
      </Button>
    </DataTableRemove>
  );
}

export default ColumnDetailsDelete;
