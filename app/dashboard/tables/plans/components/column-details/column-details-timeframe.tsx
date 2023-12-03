import { Input } from "@/components/ui/input";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnDetailsTimeframeProps<TData> {
  row: Row<TData>;
  updateFunc: (
    planId: string,
    columnId: string,
    newTimeframe: number[]
  ) => void;
}

function ColumnDetailsTimeframe<TData>({
  row,
  updateFunc,
}: ColumnDetailsTimeframeProps<TData>) {
  const [value, setValue] = useState<number[]>(row.getValue("timeframe"));
  const { plans } = usePlanStore();
  const { expanded, isEditable } = usePlanExpandedState();

  useEffect(() => {
    setValue(row.getValue("timeframe"));
  }, [plans]);

  if (isEditable)
    return (
      <div className="flex items-center space-x-2 w-[120px]">
        <Input
          id="name"
          value={value[0]}
          disabled={!isEditable}
          onChange={(e) => {
            setValue([+e.target.value, value[1]]);
            if (expanded)
              updateFunc(expanded, row.getValue("id"), [
                +e.target.value,
                value[1],
              ]);
          }}
          className="font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
        />
        <span>-</span>
        <Input
          id="name"
          value={value[1]}
          disabled={!isEditable}
          onChange={(e) => {
            setValue([value[0], +e.target.value]);
            if (expanded)
              updateFunc(expanded, row.getValue("id"), [
                value[0],
                +e.target.value,
              ]);
          }}
          className="font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
        />
      </div>
    );

  return (
    <div className="w-[120px] px-3 py-2 border border-transparent">
      <p>
        {value[0]} - {value[1]}
      </p>
    </div>
  );
}

export default ColumnDetailsTimeframe;
