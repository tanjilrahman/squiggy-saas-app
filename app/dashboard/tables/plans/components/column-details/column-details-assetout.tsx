import { Button } from "@/components/ui/button";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAssetStore } from "@/store/assetStore";
import { DetailsAssetoutDialog } from "./details-assetout-dialog";
import { ActionAsset } from "../../data/schema";

interface ColumnDetailsAssetOutProps<TData> {
  row: Row<TData>;
}

function ColumnDetailsAssetOut<TData>({
  row,
}: ColumnDetailsAssetOutProps<TData>) {
  const [status, setStatus] = useState<string | null>(null);
  const [value, setValue] = useState<ActionAsset>(row.getValue("assetOut"));
  const [assetsInIds, setAssetsInIds] = useState<ActionAsset[]>(
    row.getValue("assetsIn")
  );
  const [tradeOff, setTradeOff] = useState(0);
  const { removeAsset } = useAssetStore();
  const { plans, removeActionAssetOutId, updateActionAssetOut } =
    usePlanStore();
  const { assets } = useAssetStore();
  const { expanded, isEditable } = usePlanExpandedState();
  const actionTime: number = row.getValue("time");

  const assetOut = assets.find((asset) => asset.id === value?.assetId);

  assetOut?.action_asset;
  useEffect(() => {
    setValue(row.getValue("assetOut"));
    setAssetsInIds(row.getValue("assetsIn"));
  }, [plans]);

  const handleRemoveActionAsset = async (actionAssetId: string) => {
    setStatus("LOADING");
    const assetId = assetOut?.action_asset ? assetOut.id : null;
    try {
      const response = await fetch("/api/delete-action-asset", {
        method: "POST",
        body: JSON.stringify({ actionAssetId, assetId }),
      });

      const { success, code } = await response.json();
      if (success) {
        console.log("success");
        setStatus("SUCCESS");
        assetId && removeAsset(assetId);
        removeActionAssetOutId(expanded!, row.getValue("id"));
      }
      if (code === "NOT FOUND") {
        setStatus("ERROR");
        assetId && removeAsset(assetId);
        removeActionAssetOutId(expanded!, row.getValue("id"));
      }
    } catch (err: any) {
      if (err.data?.code === "UNAUTHORIZED") {
        console.log("You don't have the access.");
        setStatus("ERROR");
      }
    }
  };

  useEffect(() => {
    const totalValue = assetsInIds?.reduce((sum, assetin) => {
      const assetValue = assets.find(
        (asset) => asset.id === assetin.assetId
      )?.value;
      const est =
        assetin?.type === "%"
          ? (assetValue || 0) * (assetin.allocation / 100)
          : assetin?.allocation;
      return est + sum;
    }, 0);

    const assetOut = assets.find((asset) => asset.id === value?.assetId);

    const allocation = assetOut?.action_asset ? 100 : value?.allocation;

    const assetOutValue =
      value?.type === "%"
        ? (assetOut?.value || 0) * (allocation / 100)
        : allocation;

    setTradeOff((assetOutValue / totalValue) * 100);
  }, [value, assetsInIds, assets]);

  return (
    <div className="w-[220px]">
      {value && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div
              className={`${
                !isEditable && "border-transparent bg-transparent"
              } flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`}
            >
              {assetOut?.name}
            </div>
            {isEditable && (
              <Button
                disabled={!isEditable}
                variant="outline"
                className="flex p-3 space-x-2 data-[state=open]:bg-muted ml-auto"
                onClick={() => handleRemoveActionAsset(value.id)}
              >
                {status === "LOADING" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          {isEditable && (
            <p className="mt-4 text-muted-foreground">
              Trade off: {tradeOff % 1 === 0 ? tradeOff : tradeOff.toFixed(1)}%
            </p>
          )}
        </div>
      )}

      {isEditable && !value && (
        <DetailsAssetoutDialog
          planId={expanded!}
          columnId={row.getValue("id")}
          updateFunc={updateActionAssetOut}
        >
          <Button
            variant="outline"
            className="w-full"
            disabled={!(actionTime > 0)}
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add Asset
          </Button>
        </DetailsAssetoutDialog>
      )}
    </div>
  );
}

export default ColumnDetailsAssetOut;
