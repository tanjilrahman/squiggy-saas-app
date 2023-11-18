import { Input } from "@/components/ui/input";
import { formatValue2nd } from "@/lib/helperFunctions";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnValueProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, value: number) => void;
}

function ColumnValue<TData>({ row, updateFunc }: ColumnValueProps<TData>) {
  const [value, setValue] = useState<number>(row.getValue("value"));
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();

  useEffect(() => {
    setValue(row.getValue("value"));
  }, [assets]);

  if (row.getValue("id") === expanded)
    return (
      <Input
        id="value"
        type="text"
        value={!isEditable ? formatValue2nd(value) : value}
        disabled={row.getValue("id") === expanded && !isEditable}
        onChange={(e) => {
          const numericValue = +e.target.value.replace(/\D/g, "");
          setValue(numericValue);
          updateFunc(row.getValue("id"), numericValue);
        }}
        className=" disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
      />
    );

  return (
    <Input
      id="value"
      type="text"
      value={formatValue2nd(value)}
      disabled
      className=" disabled:opacity-100 disabled:bg-transparent disabled:border-transparent disabled:cursor-default"
    />
  );
}

export default ColumnValue;
