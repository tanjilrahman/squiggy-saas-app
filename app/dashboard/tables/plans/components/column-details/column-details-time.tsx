import { Input } from "@/components/ui/input";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnDetailsTimeProps<TData> {
  row: Row<TData>;
  updateFunc: (planId: string, columnId: string, newTimeframe: number) => void;
}

function ColumnDetailsTime<TData>({
  row,
  updateFunc,
}: ColumnDetailsTimeProps<TData>) {
  const [value, setValue] = useState<number>(row.getValue("time"));
  const { plans } = usePlanStore();
  const { expanded, isEditable } = usePlanExpandedState();

  useEffect(() => {
    setValue(row.getValue("time"));
  }, [plans]);

  if (isEditable)
    return (
      <div className="flex items-center space-x-2 w-[60px]">
        <Input
          id="name"
          value={value}
          disabled={!isEditable}
          onChange={(e) => {
            setValue(+e.target.value);
            if (expanded)
              updateFunc(expanded, row.getValue("id"), +e.target.value);
          }}
          className="font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
        />
      </div>
    );

  return (
    <div className="w-[60px] px-3 py-2 border border-transparent">
      <p>{value}</p>
    </div>
  );
}

export default ColumnDetailsTime;
