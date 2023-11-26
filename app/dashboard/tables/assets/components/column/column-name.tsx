import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnNameProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, value: string) => void;
}

function ColumnName<TData>({ row, updateFunc }: ColumnNameProps<TData>) {
  const { expanded, isEditable } = useAssetExpandedState();
  const [value, setValue] = useState<string>(row.getValue("name"));
  const { assets } = useAssetStore();

  useEffect(() => {
    setValue(row.getValue("name"));
  }, [assets]);

  if (row.getValue("id") === expanded && isEditable)
    return (
      <Input
        id="name"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          updateFunc(row.getValue("id"), e.target.value);
        }}
        className="w-[120px] font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
      />
    );

  return (
    <div className="w-[120px] px-3 py-2 border border-transparent">
      <p>{value}</p>
    </div>
  );
}

export default ColumnName;
