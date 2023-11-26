import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import { BarChart, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { YoyCombobox } from "./yoy-combobox";
import { Button } from "@/components/ui/button";
import { YoyDialog } from "./yoy-dialog";
import { formatValue2nd } from "@/lib/helperFunctions";

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

  if (row.getValue("id") === expanded && isEditable)
    return (
      <div className="flex items-center w-[170px]">
        <Input
          id="yoy"
          value={!isEditable ? formatValue2nd(value) : value}
          disabled={!isEditable}
          onChange={(e) => {
            setValue(+e.target.value);
            updateFunc(row.getValue("id"), +e.target.value);
          }}
          className={`${
            !isEditable ? "w-full" : "w-[60px]"
          } disabled:opacity-100 disabled:bg-transparent disabled:border-transparent border-r-0 rounded-r-none`}
        />
        <YoyCombobox disabled={!isEditable} />
        <YoyDialog>
          <TrendingUp className="h-5 w-5 ml-2 opacity-50 hover:opacity-100 cursor-pointer" />
        </YoyDialog>
      </div>
    );

  return (
    <div className="flex items-center w-[170px] px-3 py-2 border border-transparent">
      <p>{formatValue2nd(value)}</p>
      <TrendingUp className="h-5 w-5 ml-2 opacity-50" />
    </div>
  );
}

export default ColumnYoy;
