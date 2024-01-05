import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { YoyCombobox } from "./yoy-combobox";
import { YoyDialog } from "./yoy-dialog";
import { FormatValueCurrency } from "@/components/FormatValueCurrency";

interface ColumnYoyProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, value: number | null) => void;
}

function ColumnYoy<TData>({ row, updateFunc }: ColumnYoyProps<TData>) {
  const { expanded, isEditable } = useAssetExpandedState();
  const { assets } = useAssetStore();

  const asset = assets.find((asset) => asset.id === row.getValue("id"));

  const [value, setValue] = useState<number | null>(row.getValue("yoy"));
  const [mode, setMode] = useState(asset?.yoy_mode);
  const [yoyAdvanced, setYoyAdvanced] = useState<(number | null)[] | undefined>(
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
      updateFunc(row.getValue("id"), yoyAdvanced![0]);
    }
  }, [mode]);

  if (row.getValue("id") === expanded && isEditable)
    return (
      <div className="flex items-center w-[170px]">
        <Input
          id="yoy"
          type="number"
          placeholder="0"
          value={mode === "advanced" ? yoyAdvanced![0] || "" : value || ""}
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
          } disabled:opacity-100 border-r-0 rounded-r-none pr-0 text-right flex-grow`}
        />
        <YoyCombobox
          className="px-2 border-l-0 rounded-l-none"
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
    <div className="flex items-center w-[170px] px-3 py-2 border border-transparent justify-end ml-auto">
      {type === "%" ? (
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
        <TrendingUp className="w-5 h-5 ml-2 opacity-0" />
      )}
    </div>
  );
}

export default ColumnYoy;
