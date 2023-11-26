import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { DetailsYoyCombobox } from "./details-yoy-combobox";
import { DetailsYoyDialog } from "./details-yoy-dialog";
import { TrendingUp } from "lucide-react";
import { formatValue2nd } from "@/lib/helperFunctions";

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

  if (isEditable)
    return (
      <div className="flex items-center w-[200px]">
        <Input
          id="yoy"
          value={value}
          disabled={!isEditable}
          onChange={(e) => {
            setValue(+e.target.value);
            if (expanded)
              updateFunc(expanded, row.getValue("id"), +e.target.value);
          }}
          className={`${
            !isEditable ? "w-full" : "w-[100px]"
          } disabled:opacity-100 disabled:bg-transparent disabled:border-transparent border-r-0 rounded-r-none`}
        />
        <DetailsYoyCombobox disabled={!isEditable} />
        <DetailsYoyDialog>
          <TrendingUp className="h-5 w-5 ml-2 opacity-50 hover:opacity-100 cursor-pointer" />
        </DetailsYoyDialog>
      </div>
    );

  return (
    <div className="flex items-center w-[200px] px-3 py-2 border border-transparent">
      <p>{formatValue2nd(value)}</p>
      <TrendingUp className="h-5 w-5 ml-2 opacity-50" />
    </div>
  );
}

export default ColumnDetailsYoy;
