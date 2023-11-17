import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnDetailsNameProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, columnId: string, value: number) => void;
}

function ColumnDetailsYoy<TData>({
  row,
  updateFunc,
}: ColumnDetailsNameProps<TData>) {
  const [value, setValue] = useState<number>(row.getValue("yoy"));
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();
  useEffect(() => {
    setValue(row.getValue("yoy"));
  }, [assets]);
  return (
    <Input
      id="yoy"
      value={value}
      disabled={!isEditable}
      onChange={(e) => {
        setValue(+e.target.value);
        if (expanded) updateFunc(expanded, row.getValue("id"), +e.target.value);
      }}
      className="disabled:opacity-100 disabled:bg-transparent"
    />
  );
}

export default ColumnDetailsYoy;
