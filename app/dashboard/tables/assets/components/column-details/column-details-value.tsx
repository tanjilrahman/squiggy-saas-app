import { Input } from "@/components/ui/input";
import { formatValue2nd } from "@/lib/helperFunctions";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnDetailsNameProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, columnId: string, value: number) => void;
}

function ColumnDetailsValue<TData>({
  row,
  updateFunc,
}: ColumnDetailsNameProps<TData>) {
  const [value, setValue] = useState<number>(row.getValue("value"));
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();
  useEffect(() => {
    setValue(row.getValue("value"));
  }, [assets]);
  return (
    <Input
      id="value"
      type="text"
      value={!isEditable ? formatValue2nd(value) : value}
      disabled={!isEditable}
      onChange={(e) => {
        const numericValue = +e.target.value.replace(/\D/g, "");
        setValue(numericValue);
        if (expanded) updateFunc(expanded, row.getValue("id"), numericValue);
      }}
      className="disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
    />
  );
}

export default ColumnDetailsValue;
