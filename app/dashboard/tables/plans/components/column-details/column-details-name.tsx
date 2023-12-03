import { Input } from "@/components/ui/input";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnDetailsNameProps<TData> {
  row: Row<TData>;
  updateFunc: (planId: string, columnId: string, value: string) => void;
}

function ColumnDetailsName<TData>({
  row,
  updateFunc,
}: ColumnDetailsNameProps<TData>) {
  const [value, setValue] = useState<string>(row.getValue("name"));
  const { plans } = usePlanStore();
  const { expanded, isEditable } = usePlanExpandedState();

  useEffect(() => {
    setValue(row.getValue("name"));
  }, [plans]);

  return (
    <Input
      id="name"
      value={value}
      disabled={!isEditable}
      onChange={(e) => {
        setValue(e.target.value);
        if (expanded) updateFunc(expanded, row.getValue("id"), e.target.value);
      }}
      className="font-medium w-[120px] disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
    />
  );
}

export default ColumnDetailsName;
