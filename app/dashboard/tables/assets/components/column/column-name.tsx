import { DashboardTooltip } from "@/components/tooltips/DashboardTooltip";
import { Input } from "@/components/ui/input";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { Row } from "@tanstack/react-table";
import { Route } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ColumnNameProps<TData> {
  row: Row<TData>;
  updateFunc: (assetId: string, value: string) => void;
}

function ColumnName<TData>({ row, updateFunc }: ColumnNameProps<TData>) {
  const { expanded, isEditable } = useAssetExpandedState();
  const [value, setValue] = useState<string>(row.getValue("name"));
  const { assets } = useAssetStore();

  const asset = assets.find((asset) => asset.id === row.getValue("id"));

  useEffect(() => {
    setValue(row.getValue("name"));
  }, [assets]);

  if (row.getValue("id") === expanded && isEditable) {
    return (
      <Input
        id="name"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          updateFunc(row.getValue("id"), e.target.value);
        }}
        className="w-[150px] font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
      />
    );
  }

  if (asset?.action_asset) {
    return (
      <div className="w-[150px] border border-transparent">
        <p className="px-[10px] py-2 rounded-lg bg-indigo-500/10 inline-flex items-center space-x-2">
          <DashboardTooltip
            icon={<Route className="w-4 h-4 text-indigo-500" />}
            text="Scenario asset"
          />

          <span>{value}</span>
        </p>
      </div>
    );
  } else {
    return (
      <div className="w-[150px] px-3 py-2 border border-transparent">
        <p>{value}</p>
      </div>
    );
  }
}

export default ColumnName;
