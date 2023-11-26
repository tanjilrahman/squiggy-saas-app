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

  if (row.getValue("id") === expanded && isEditable)
    return (
      <Input
        id="value"
        type="text"
        value={value}
        onChange={(e) => {
          const numericValue = +e.target.value.replace(/\D/g, "");
          setValue(numericValue);
          updateFunc(row.getValue("id"), numericValue);
        }}
        className="w-[150px] disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
      />
    );

  return (
    <div className="w-[150px] px-3 py-2 border border-transparent">
      <p>{formatValue2nd(value)}</p>
    </div>
  );
}

export default ColumnValue;
