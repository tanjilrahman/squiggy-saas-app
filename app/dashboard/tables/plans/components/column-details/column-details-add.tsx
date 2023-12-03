import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuid } from "uuid";
import { Action } from "../../data/schema";
import { usePlanExpandedState } from "@/store/planStore";

type ColumnDetailsAddProps = {
  className?: string;
  updateFunc: (planId: string, value: Action) => void;
};

function ColumnDetailsAdd({ className, updateFunc }: ColumnDetailsAddProps) {
  const { expanded, isEditable } = usePlanExpandedState();

  const handleAdd = () => {
    const newItem: Action = {
      id: uuid(),
      name: "",
      timeframe: [0, 0],
      assetIns: [],
      assetOuts: [],
      value: 0,
      status: "",
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
      <span>Add Action</span>
    </Button>
  );
}

export default ColumnDetailsAdd;
