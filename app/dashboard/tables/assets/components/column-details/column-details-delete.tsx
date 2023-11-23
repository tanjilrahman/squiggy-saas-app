import { useAssetExpandedState } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React from "react";
import { DataTableRemove } from "../data-table-remove";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ColumnDetailsDeleteProps<TData> {
  row: Row<TData>;
  type: "income" | "cost";
  updateFunc: (assetId: string, columnId: string) => void;
}

function ColumnDetailsDelete<TData>({
  row,
  type,
  updateFunc,
}: ColumnDetailsDeleteProps<TData>) {
  const { expanded, isEditable } = useAssetExpandedState();

  const handleRemove = async () => {
    try {
      const response = await fetch("/api/delete-asset", {
        method: "POST",
        body: JSON.stringify({ type, itemId: row.getValue("id") }),
      });

      const { success, code } = await response.json();
      if (success) {
        console.log("success");
        updateFunc(expanded!, row.getValue("id"));
      }
      if (code === "NOT FOUND") {
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
