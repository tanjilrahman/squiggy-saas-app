import { Button } from "@/components/ui/button";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAssetStore } from "@/store/assetStore";
import { DetailsAssetoutDialog } from "./details-assetout-dialog";

interface ColumnDetailsAssetOutProps<TData> {
  row: Row<TData>;
}

function ColumnDetailsAssetOut<TData>({
  row,
}: ColumnDetailsAssetOutProps<TData>) {
  const [value, setValue] = useState<string>(row.getValue("assetOut"));
  const { removeAsset } = useAssetStore();
  const [status, setStatus] = useState<string | null>(null);
  const [assetsInIds, setAssetsInIds] = useState<string[]>(
    row.getValue("assetsIn")
  );
  const [tradeOff, setTradeOff] = useState(0);

  const { plans, removeActionAssetOutId, updateActionAssetOut } =
    usePlanStore();
  const { assets } = useAssetStore();
  const { expanded, isEditable } = usePlanExpandedState();

  const assetOut = assets.find((asset) => asset.id === value);

  useEffect(() => {
    setValue(row.getValue("assetOut"));
    setAssetsInIds(row.getValue("assetsIn"));
  }, [plans]);

  const handleRemoveWithAsset = async (assetId: string) => {
    setStatus("LOADING");
    try {
      const response = await fetch("/api/delete-asset", {
        method: "POST",
        body: JSON.stringify({ assetId }),
      });

      const { success, code } = await response.json();
      if (success) {
        console.log("success");
        setStatus("SUCCESS");
        removeAsset(assetId);
        removeActionAssetOutId(expanded!, row.getValue("id"), value);
      }
      if (code === "NOT FOUND") {
        setStatus("ERROR");
        removeAsset(assetId);
        removeActionAssetOutId(expanded!, row.getValue("id"), value);
      }
    } catch (err: any) {
      if (err.data?.code === "UNAUTHORIZED") {
        console.log("You don't have the access.");
        setStatus("ERROR");
      }
    }
  };

  useEffect(() => {
    const assetsInTotalValue = assetsInIds.reduce((sum, assetId) => {
      const asset = assets.find((a) => a.id === assetId);
      const actionAssetId = asset?.action_asset;
      const targetAsset = assets.find((a) => a.id === actionAssetId);
      const assetInValue = (targetAsset?.value || 0) - (asset?.value || 0);

      return sum + assetInValue;
    }, 0);

    const targetOutAsset = assets.find(
      (asset) => asset.id === assetOut?.action_asset
    );

    setTradeOff(
      (((assetOut?.value || 0) - (targetOutAsset?.value || 0)) /
        assetsInTotalValue) *
        100
    );
  }, [value, assetsInIds]);

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
                disabled={!isEditable || status === "LOADING"}
                variant="outline"
                className="flex p-3 space-x-2 data-[state=open]:bg-muted ml-auto"
                onClick={() => handleRemoveWithAsset(value)}
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
          <Button variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-1" /> Add Asset
          </Button>
        </DetailsAssetoutDialog>
      )}
    </div>
  );
}

export default ColumnDetailsAssetOut;
