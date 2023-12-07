import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { YoyCombobox } from "./yoy-combobox";
import { YoyDialog } from "./yoy-dialog";
import { formatValue2nd } from "@/lib/helperFunctions";
import { useCalculatedAssetStore } from "@/store/calculationStore";

interface ColumnYoyProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, value: number) => void;
}

function ColumnYoy<TData>({ row, updateFunc }: ColumnYoyProps<TData>) {
  const { expanded, isEditable } = useAssetExpandedState();
  const { assets } = useAssetStore();
  const { calculatedAssets } = useCalculatedAssetStore();

  const calcAssetAll = calculatedAssets.find(
    (year) => year[0].id === row.getValue("id")
  );

  const asset = assets.find((asset) => asset.id === row.getValue("id"));

  const [value, setValue] = useState<number>(row.getValue("yoy"));
  const [mode, setMode] = useState(asset?.yoy_mode);
  const [yoyAdvanced, setYoyAdvanced] = useState<number[] | undefined>(
    asset?.yoy_advanced
  );
  const [type, setType] = useState(asset?.yoy_type!);

  useEffect(() => {
    setValue(row.getValue("yoy"));
    setType(asset?.yoy_type!);
    setYoyAdvanced(asset?.yoy_advanced);
    setMode(asset?.yoy_mode);
  }, [assets]);

  useEffect(() => {
    if (mode === "advanced") {
      updateFunc(row.getValue("id"), yoyAdvanced![1] - yoyAdvanced![0]);
    }
  }, [mode]);

  if (row.getValue("id") === expanded && isEditable)
    return (
      <div className="flex items-center w-[170px]">
        <Input
          id="yoy"
          value={
            mode === "advanced" ? yoyAdvanced![1] - yoyAdvanced![0] : value
          }
          disabled={!isEditable || mode === "advanced"}
          onChange={(e) => {
            if (mode === "simple") {
              setValue(+e.target.value);
              updateFunc(row.getValue("id"), +e.target.value);
            }
          }}
          className={`${
            !yoyAdvanced &&
            "disabled:bg-transparent disabled:border-transparent"
          } ${
            !isEditable ? "w-full" : "w-[60px]"
          } disabled:opacity-100 border-r-0 rounded-r-none`}
        />
        <YoyCombobox
          className="border-l-0 rounded-l-none px-2"
          disabled={!isEditable}
          assetId={expanded!}
        />
        <YoyDialog assetId={expanded!}>
          <TrendingUp
            className={`${
              asset?.yoy_mode === "advanced" ? "opacity-100" : "opacity-50"
            } h-5 w-5 ml-2 cursor-pointer`}
          />
        </YoyDialog>
      </div>
    );
  return (
    <div className="flex items-center w-[170px] px-3 py-2 border border-transparent">
      {/* {type === "fixed" ? (
        mode === "advanced" ? (
          <p>{formatValue2nd(yoyAdvanced![1] - yoyAdvanced![0])}</p>
        ) : (
          <p>{formatValue2nd(value)}</p>
        )
      ) : mode === "advanced" ? (
        <p>{yoyAdvanced![1] - yoyAdvanced![0]}%</p>
      ) : (
        <p>{formatValue2nd(value * asset?.value!)}</p>
      )} */}
      <p>
        {formatValue2nd((calcAssetAll && calcAssetAll[0].yoy_increase) || 0)}
      </p>
      {mode === "advanced" && (
        <TrendingUp className="opacity-100 h-5 w-5 ml-2" />
      )}
    </div>
  );
}

export default ColumnYoy;
