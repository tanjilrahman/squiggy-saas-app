import { Input } from "@/components/ui/input";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnNoteProps<TData> {
  row: Row<TData>;
  updateFunc: (planId: string, value: string) => void;
}

function ColumnNote<TData>({ row, updateFunc }: ColumnNoteProps<TData>) {
  const { expanded, isEditable } = usePlanExpandedState();
  const [value, setValue] = useState<string>(row.getValue("note"));
  const { plans } = usePlanStore();

  useEffect(() => {
    setValue(row.getValue("note"));
  }, [plans]);

  if (row.getValue("id") === expanded && isEditable)
    return (
      <Input
        id="note"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          updateFunc(row.getValue("id"), e.target.value);
        }}
        className="w-[420px] font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
      />
    );

  return (
    <div className="w-[420px] px-3 py-2 border border-transparent">
      <p>{value}</p>
    </div>
  );
}

export default ColumnNote;
