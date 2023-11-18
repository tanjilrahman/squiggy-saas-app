import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import { BarChart } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ColumnYoyProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, value: number) => void;
}

function ColumnYoy<TData>({ row, updateFunc }: ColumnYoyProps<TData>) {
  const [value, setValue] = useState<number>(row.getValue("yoy"));
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();

  useEffect(() => {
    setValue(row.getValue("yoy"));
  }, [assets]);

  if (row.getValue("id") === expanded)
    return (
      <Input
        id="yoy"
        value={value}
        disabled={!isEditable}
        onChange={(e) => {
          setValue(+e.target.value);
          updateFunc(row.getValue("id"), +e.target.value);
        }}
        className=" disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
      />
    );

  return (
    <Input
      id="yoy"
      value={value}
      disabled
      className=" disabled:opacity-100 disabled:bg-transparent disabled:border-transparent disabled:cursor-default"
    />
  );
}

export default ColumnYoy;
