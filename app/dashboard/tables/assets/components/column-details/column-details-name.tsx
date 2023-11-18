import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnDetailsNameProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, columnId: string, value: string) => void;
}

function ColumnDetailsName<TData>({
  row,
  updateFunc,
}: ColumnDetailsNameProps<TData>) {
  const [value, setValue] = useState<string>(row.getValue("name"));
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();

  useEffect(() => {
    setValue(row.getValue("name"));
    console.log(assets.find((asset) => asset.id === "5")?.incomes);
  }, [assets]);

  return (
    <Input
      id="name"
      value={value}
      disabled={!isEditable}
      onChange={(e) => {
        setValue(e.target.value);
        if (expanded) updateFunc(expanded, row.getValue("id"), e.target.value);
      }}
      className="font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
    />
  );
}

export default ColumnDetailsName;
