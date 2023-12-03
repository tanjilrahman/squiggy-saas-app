import { Input } from "@/components/ui/input";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnNameProps<TData> {
  row: Row<TData>;
  updateFunc: (planId: string, value: string) => void;
}

function ColumnName<TData>({ row, updateFunc }: ColumnNameProps<TData>) {
  const { expanded, isEditable } = usePlanExpandedState();
  const [value, setValue] = useState<string>(row.getValue("name"));
  const { plans } = usePlanStore();

  useEffect(() => {
    setValue(row.getValue("name"));
  }, [plans]);

  if (row.getValue("id") === expanded && isEditable)
    return (
      <Input
        id="name"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          updateFunc(row.getValue("id"), e.target.value);
        }}
        className="w-[180px] font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
      />
    );

  return (
    <div className="w-[180px] px-3 py-2 border border-transparent">
      <p>{value}</p>
    </div>
  );
}

export default ColumnName;
