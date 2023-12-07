import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { DetailsYoyCombobox } from "./details-yoy-combobox";
import { DetailsYoyDialog } from "./details-yoy-dialog";
import { TrendingUp } from "lucide-react";
import { formatValue2nd } from "@/lib/helperFunctions";
import { useCalculatedAssetStore } from "@/store/calculationStore";

interface ColumnDetailsNameProps<TData> {
  row: Row<TData>;
  type: "income" | "cost";
  updateFunc: (assetId: string, columnId: string, value: number) => void;
}

function ColumnDetailsYoy<TData>({
  row,
  type,
  updateFunc,
}: ColumnDetailsNameProps<TData>) {
  const { assets } = useAssetStore();
  const { calculatedAssets } = useCalculatedAssetStore();
  const { expanded, isEditable } = useAssetExpandedState();

  const calcAssetAll = calculatedAssets.find((year) => year[0].id === expanded);
  const calcIncome =
    calcAssetAll &&
    calcAssetAll[0].incomes.find((item) => item.id === row.getValue("id"));
  const calcCost =
    calcAssetAll &&
    calcAssetAll[0].costs.find((item) => item.id === row.getValue("id"));

  const asset = assets.find((asset) => asset.id === expanded);
  const income = asset?.incomes.find((item) => item.id === row.getValue("id"));
  const cost = asset?.costs.find((item) => item.id === row.getValue("id"));

  const [value, setValue] = useState<number>(row.getValue("yoy"));
  const [mode, setMode] = useState(
    type === "income" ? income?.yoy_mode : cost?.yoy_mode
  );
  const [yoyAdvanced, setYoyAdvanced] = useState<number[] | undefined>(
    type === "income" ? income?.yoy_advanced : cost?.yoy_advanced
  );

  useEffect(() => {
    setValue(row.getValue("yoy"));
    if (type === "income") {
      setYoyAdvanced(income?.yoy_advanced);
      setMode(income?.yoy_mode);
    } else {
      setYoyAdvanced(cost?.yoy_advanced);
      setMode(cost?.yoy_mode);
    }
  }, [assets]);

  useEffect(() => {
    if (mode === "advanced") {
      updateFunc(
        expanded!,
        row.getValue("id"),
        yoyAdvanced![1] - yoyAdvanced![0]
      );
    }
  }, [mode]);

  if (isEditable)
    return (
      <div className="flex items-center w-[200px]">
        <Input
          id="yoy"
          value={
            mode === "advanced" ? yoyAdvanced![1] - yoyAdvanced![0] : value
          }
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
          } disabled:opacity-100 border-r-0 rounded-r-none`}
        />
        <DetailsYoyCombobox
          className="border-l-0 rounded-l-none px-2"
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
    <div className="flex items-center w-[200px] px-3 py-2 border border-transparent">
      {type === "income" ? (
        <p>{formatValue2nd(calcIncome?.yoy_increase || 0)}</p>
      ) : (
        <p>{formatValue2nd(calcCost?.yoy_increase || 0)}</p>
      )}
      {mode === "advanced" && (
        <TrendingUp className="opacity-100 h-5 w-5 ml-2" />
      )}
    </div>
  );
}

export default ColumnDetailsYoy;
