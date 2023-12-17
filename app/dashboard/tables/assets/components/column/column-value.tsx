import { FormatValueCurrency } from "@/components/FormatValueCurrency";
import { Input } from "@/components/ui/input";
import { formatNumericValue } from "@/lib/helperFunctions";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { useUserState } from "@/store/store";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";

interface ColumnValueProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, value: number) => void;
}

function ColumnValue<TData>({ row, updateFunc }: ColumnValueProps<TData>) {
  const [value, setValue] = useState<number>(row.getValue("value"));
  const { assets } = useAssetStore();
  const { user } = useUserState();
  const { expanded, isEditable } = useAssetExpandedState();

  useEffect(() => {
    setValue(row.getValue("value"));
  }, [assets]);

  if (row.getValue("id") === expanded && isEditable)
    return (
      <div className="flex items-center w-[150px]">
        <Input
          id="value"
          type="text"
          value={formatNumericValue(value)}
          onChange={(e) => {
            const numericValue = +e.target.value.replace(/\D/g, "");
            setValue(numericValue);
            updateFunc(row.getValue("id"), numericValue);
          }}
          className="flex-grow pr-0 text-right border-r-0 rounded-r-none disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
        />
        <div className="h-10 py-2 pl-2 pr-3 text-sm leading-relaxed border border-l-0 rounded-md rounded-l-none border-input bg-background ring-offset-background">
          {user?.currency.toUpperCase()}
        </div>
      </div>
    );

  return (
    <div className="w-[150px] px-3 py-2 border border-transparent text-right">
      <FormatValueCurrency number={value} />
    </div>
  );
}

export default ColumnValue;
