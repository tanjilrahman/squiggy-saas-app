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

  if (row.getValue("id") === expanded)
    return (
      <Input
        id="name"
        disabled={!isEditable}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          updateFunc(row.getValue("id"), e.target.value);
        }}
        className="font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
      />
    );

  return (
    <Input
      id="name"
      disabled
      value={value}
      className="font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent disabled:cursor-default"
    />
  );
}

export default ColumnName;
