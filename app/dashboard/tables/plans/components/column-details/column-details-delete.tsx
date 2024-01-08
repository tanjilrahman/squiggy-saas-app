import { Row } from "@tanstack/react-table";
import React from "react";
import { DataTableRemove } from "../data-table-remove";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { usePlanExpandedState } from "@/store/planStore";
import { ActionAsset } from "../../data/schema";
import { useAssetStore } from "@/store/assetStore";

interface ColumnDetailsDeleteProps<TData> {
  row: Row<TData>;
  updateFunc: (planId: string, columnId: string) => void;
}

function ColumnDetailsDelete<TData>({
  row,
  updateFunc,
}: ColumnDetailsDeleteProps<TData>) {
  const { assets, removeAsset } = useAssetStore();
  const { expanded, isEditable } = usePlanExpandedState();

  const handleRemove = async () => {
    const assetOut: ActionAsset = row.getValue("assetOut");
    const assetOutAsset = assets.find((asset) => asset.id === assetOut.assetId);

    const plannedAssetId = assetOutAsset?.action_asset
      ? assetOutAsset.id
      : null;

    try {
      const response = await fetch("/api/delete-plan", {
        method: "POST",
        body: JSON.stringify({
          type: "action",
          itemId: row.getValue("id"),
          assetIds: [plannedAssetId],
        }),
      });

      const { success, code } = await response.json();
      if (success) {
        console.log("success");
        plannedAssetId && removeAsset(plannedAssetId);
        updateFunc(expanded!, row.getValue("id"));
      }
      if (code === "NOT FOUND") {
        plannedAssetId && removeAsset(plannedAssetId);
        updateFunc(expanded!, row.getValue("id"));
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
