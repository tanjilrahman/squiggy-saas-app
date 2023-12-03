import { usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnNameProps<TData> {
  row: Row<TData>;
}

function ColumnName<TData>({ row }: ColumnNameProps<TData>) {
  const [value, setValue] = useState<string>(row.getValue("name"));
  const { plans } = usePlanStore();

  useEffect(() => {
    setValue(row.getValue("name"));
  }, [plans]);

  return <p className="py-2 ">{value}</p>;
}

export default ColumnName;
