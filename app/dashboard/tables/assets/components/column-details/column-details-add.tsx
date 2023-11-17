import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import React from "react";
import { IncomeCost } from "../../data/schema";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type ColumnDetailsAddProps = {
  type: "income" | "cost";
  updateFunc: (assetId: string, value: IncomeCost) => void;
};

function ColumnDetailsAdd({ type, updateFunc }: ColumnDetailsAddProps) {
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();
  const newIncomeId = (
    assets.find((asset) => asset.id === expanded)?.incomes.length! + 1
  ).toString();

  const newCostId = (
    assets.find((asset) => asset.id === expanded)?.costs.length! + 1
  ).toString();

  const handleAdd = () => {
    const newItem: IncomeCost = {
      id: type === "income" ? newIncomeId : newCostId,
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
      className="flex space-x-1 h-8 px-2 data-[state=open]:bg-muted ml-auto"
      onClick={handleAdd}
    >
      <PlusCircle className="h-4 w-4" />
      <span>Add {type === "income" ? "Income" : "Cost"}</span>
    </Button>
  );
}

export default ColumnDetailsAdd;
