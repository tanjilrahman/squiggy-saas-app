import { useCalculatedAssetStore } from "@/store/calculationStore";
import { useAreaChartDataStore } from "@/store/chartStore";
import { usePlanStore, useSelectedMiniPlanStore } from "@/store/planStore";
import { Row, Table } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnTimeframeProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

function ColumnTimeframe<TData>({ table, row }: ColumnTimeframeProps<TData>) {
  const [value, setValue] = useState<number[]>(row.getValue("timeframe"));

  const { setStartTime } = useSelectedMiniPlanStore();
  const { plans } = usePlanStore();

  useEffect(() => {
    setValue(row.getValue("timeframe"));
  }, [plans]);

  useEffect(() => {
    if (table.getFilteredSelectedRowModel().rows.length == 0) {
      return setStartTime(null);
    }
    row.getIsSelected() && setStartTime(value[0]);
  }, [table.getFilteredSelectedRowModel()]);

  return (
    <p>
      {value[0]} - {value[1]}
    </p>
  );
}

export default ColumnTimeframe;
