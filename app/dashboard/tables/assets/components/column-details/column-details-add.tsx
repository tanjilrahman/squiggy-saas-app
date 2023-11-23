import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import React from "react";
import { IncomeCost } from "../../data/schema";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuid } from "uuid";

type ColumnDetailsAddProps = {
  className?: string;
  type: "income" | "cost";
  updateFunc: (assetId: string, value: IncomeCost) => void;
};

function ColumnDetailsAdd({
  className,
  type,
  updateFunc,
}: ColumnDetailsAddProps) {
  const { expanded, isEditable } = useAssetExpandedState();

  const handleAdd = async () => {
    const newItem: IncomeCost = {
      id: uuid(),
      name: "",
      type: "",
      value: 0,
      yoy: 0,
    };

    // try {
    //   const response = await fetch("/api/create-incomecost", {
    //     method: "POST",
    //     body: JSON.stringify({ type, assetId: expanded, newItem }),
    //   });

    //   const { success } = await response.json();
    //   if (success) {
    //     console.log("success");

    //   }
    // } catch (err: any) {
    //   if (err.data?.code === "UNAUTHORIZED") {
    //     console.log("You don't have the access.");
    //   }
    // }
    updateFunc(expanded!, newItem);
  };

  return (
    <Button
      disabled={!isEditable}
      variant="outline"
      className={cn(
        "flex space-x-1 w-32 h-8 px-2 data-[state=open]:bg-muted ml-auto",
        className
      )}
      onClick={handleAdd}
    >
      <PlusCircle className="h-4 w-4" />
      <span>Add {type === "income" ? "Income" : "Cost"}</span>
    </Button>
  );
}

export default ColumnDetailsAdd;
