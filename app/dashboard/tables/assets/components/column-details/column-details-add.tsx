import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import React from "react";
import { IncomeCost } from "../../data/schema";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();

  const newId = (items: "incomes" | "costs") => {
    const item = assets.find((asset) => asset.id === expanded)?.[items];

    if (item?.length! > 0) {
      return (+item![0].id! + 1).toString();
    } else return "1";
  };

  const handleAdd = () => {
    const newItem: IncomeCost = {
      id: type === "income" ? newId("incomes") : newId("costs"),
      name: "",
      type: "",
      value: 0,
      yoy: 0,
    };
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
