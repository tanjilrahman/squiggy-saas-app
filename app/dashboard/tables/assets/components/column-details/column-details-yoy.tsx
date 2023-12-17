import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { DetailsYoyCombobox } from "./details-yoy-combobox";
import { DetailsYoyDialog } from "./details-yoy-dialog";
import { TrendingUp } from "lucide-react";
import { FormatValueCurrency } from "@/components/FormatValueCurrency";

interface ColumnDetailsNameProps<TData> {
  row: Row<TData>;
  type: "income" | "cost";
  updateFunc: (assetId: string, columnId: string, value: number | null) => void;
}

function ColumnDetailsYoy<TData>({
  row,
  type,
  updateFunc,
}: ColumnDetailsNameProps<TData>) {
  const { assets } = useAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();

  const asset = assets.find((asset) => asset.id === expanded);
  const income = asset?.incomes.find((item) => item.id === row.getValue("id"));
  const cost = asset?.costs.find((item) => item.id === row.getValue("id"));

  const [value, setValue] = useState<number | null>(row.getValue("yoy"));
  const [mode, setMode] = useState(
    type === "income" ? income?.yoy_mode : cost?.yoy_mode
  );
  const [yoyAdvanced, setYoyAdvanced] = useState<(number | null)[] | undefined>(
    type === "income" ? income?.yoy_advanced : cost?.yoy_advanced
  );

  const [yoyType, setYoyType] = React.useState(
    type === "income" ? income?.yoy_type! : cost?.yoy_type!
  );

  useEffect(() => {
    setValue(row.getValue("yoy"));
    if (type === "income") {
      setYoyAdvanced(income?.yoy_advanced);
      setMode(income?.yoy_mode);
      setYoyType(income?.yoy_type!);
    } else {
      setYoyAdvanced(cost?.yoy_advanced);
      setMode(cost?.yoy_mode);
      setYoyType(cost?.yoy_type!);
    }
  }, [assets]);

  useEffect(() => {
    if (mode === "advanced") {
      updateFunc(expanded!, row.getValue("id"), yoyAdvanced![0]);
    }
  }, [mode]);

  if (isEditable)
    return (
      <div className="flex items-center w-[200px]">
        <Input
          id="yoy"
          type="number"
          value={mode === "advanced" ? yoyAdvanced![0] || "" : value || ""}
          disabled={!isEditable || mode === "advanced"}
          onChange={(e) => {
            setValue(+e.target.value);
            if (expanded)
              updateFunc(expanded, row.getValue("id"), +e.target.value);
          }}
          className={`${
            !yoyAdvanced &&
            "disabled:bg-transparent disabled:border-transparent"
          } ${
            !isEditable ? "w-full" : "w-[100px]"
          } disabled:opacity-100 border-r-0 rounded-r-none pr-0 text-right flex-grow`}
        />
        <DetailsYoyCombobox
          className="px-2 border-l-0 rounded-l-none"
          disabled={!isEditable}
          assetId={expanded!}
          itemId={row.getValue("id")}
          type={type}
        />
        <DetailsYoyDialog
          assetId={expanded!}
          itemId={row.getValue("id")}
          type={type}
        >
          <TrendingUp
            className={`${
              mode === "advanced" ? "opacity-100" : "opacity-50"
            } h-5 w-5 ml-2 cursor-pointer`}
          />
        </DetailsYoyDialog>
      </div>
    );

  return (
    <div className="flex items-center w-[200px] px-3 py-2 border border-transparent justify-end">
      {yoyType === "%" ? (
        <p>{mode === "advanced" ? yoyAdvanced![0] : value}%</p>
      ) : (
        <p>
          {mode === "advanced" ? (
            <FormatValueCurrency number={yoyAdvanced![0]} />
          ) : (
            <FormatValueCurrency number={value} />
          )}
        </p>
      )}
      {mode === "advanced" ? (
        <TrendingUp className="w-5 h-5 ml-2 opacity-100" />
      ) : (
        <div className="w-5 h-5 ml-2" />
      )}
    </div>
  );
}

export default ColumnDetailsYoy;
