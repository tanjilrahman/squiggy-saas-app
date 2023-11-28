import { Input } from "@/components/ui/input";
import { formatValue2nd } from "@/lib/helperFunctions";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { DetailsValueCombobox } from "./details-value-combobox";

interface ColumnDetailsNameProps<TData> {
  row: Row<TData>;
  type: "income" | "cost";
  updateFunc: (assetId: string, columnId: string, value: number) => void;
}

function ColumnDetailsValue<TData>({
  row,
  type,
  updateFunc,
}: ColumnDetailsNameProps<TData>) {
  const [value, setValue] = useState<number>(row.getValue("value"));
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();
  const asset = assets.find((asset) => asset.id === expanded);
  const income = asset?.incomes.find((item) => item.id === row.getValue("id"));
  const cost = asset?.costs.find((item) => item.id === row.getValue("id"));

  const [itemType, setItemType] = useState(
    type === "income" ? income?.value_mode : cost?.value_mode
  );

  useEffect(() => {
    setValue(row.getValue("value"));
    if (type === "income") {
      setItemType(income?.value_mode!);
    } else {
      setItemType(cost?.value_mode!);
    }
  }, [assets]);

  if (isEditable)
    return (
      <div className="flex items-center w-[200px]">
        <Input
          id="value"
          type="text"
          value={!isEditable ? formatValue2nd(value) : value}
          disabled={!isEditable}
          onChange={(e) => {
            const numericValue = +e.target.value.replace(/\D/g, "");
            setValue(numericValue);
            if (expanded)
              updateFunc(expanded, row.getValue("id"), numericValue);
          }}
          className="disabled:opacity-100 disabled:bg-transparent disabled:border-transparent border-r-0 rounded-r-none"
        />
        <DetailsValueCombobox
          className="border-l-0 rounded-l-none px-2"
          disabled={!isEditable}
          assetId={expanded!}
          itemId={row.getValue("id")}
          type={type}
        />
      </div>
    );

  return (
    <div className="flex items-center w-[200px] px-3 py-2 border border-transparent">
      {itemType === "fixed" ? (
        <p>{formatValue2nd(value)}</p>
      ) : (
        <p>{formatValue2nd(value * asset?.value!)}</p>
      )}
    </div>
  );
}

export default ColumnDetailsValue;
