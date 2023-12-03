import { usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnTimeframeProps<TData> {
  row: Row<TData>;
}

function ColumnTimeframe<TData>({ row }: ColumnTimeframeProps<TData>) {
  const [value, setValue] = useState<number[]>(row.getValue("timeframe"));
  const { plans } = usePlanStore();

  useEffect(() => {
    setValue(row.getValue("timeframe"));
  }, [plans]);

  return (
    <p>
      {value[0]} - {value[1]}
    </p>
  );
}

export default ColumnTimeframe;
