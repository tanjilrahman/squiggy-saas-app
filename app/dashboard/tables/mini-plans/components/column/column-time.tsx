import { usePlanStore, useSelectedMiniPlanStore } from "@/store/planStore";
import { Row, Table } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnTimeProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

function ColumnTime<TData>({ table, row }: ColumnTimeProps<TData>) {
  const [value, setValue] = useState<number>(row.getValue("time"));

  const { setStartTime } = useSelectedMiniPlanStore();
  const { plans } = usePlanStore();

  useEffect(() => {
    setValue(row.getValue("time"));
  }, [plans]);

  useEffect(() => {
    if (table.getFilteredSelectedRowModel().rows.length == 0) {
      return setStartTime(null);
    }
    row.getIsSelected() && setStartTime(value);
    console.log(value);
  }, [table.getFilteredSelectedRowModel()]);

  return <p>{value}</p>;
}

export default ColumnTime;
