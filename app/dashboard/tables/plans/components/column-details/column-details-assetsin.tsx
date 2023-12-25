import { Button } from "@/components/ui/button";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAssetStore } from "@/store/assetStore";
import { DetailsAssetsInDialog } from "./details-assetsin-dialog";
import { formatValue } from "@/lib/helperFunctions";

interface ColumnDetailsAssetsInProps<TData> {
  row: Row<TData>;
}

function ColumnDetailsAssetsIn<TData>({
  row,
}: ColumnDetailsAssetsInProps<TData>) {
  const [assetsInIds, setAssetsInIds] = useState<string[]>(
    row.getValue("assetsIn")
  );
  const [status, setStatus] = useState<string | null>(null);
  const { removeAsset } = useAssetStore();
  const [estValue, setEstValue] = useState(0);
  const { plans, removeActionAssetInId, updateActionAssetIn } = usePlanStore();
  const { assets } = useAssetStore();
  const { expanded, isEditable } = usePlanExpandedState();

  useEffect(() => {
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
        removeActionAssetInId(expanded!, row.getValue("id"), assetId);
      }
      if (code === "NOT FOUND") {
        setStatus("ERROR");
        removeAsset(assetId);
        removeActionAssetInId(expanded!, row.getValue("id"), assetId);
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

    setEstValue(assetsInTotalValue);
  }, [assetsInIds]);

  return (
    <div className="w-[240px]">
      {assetsInIds?.map((assetId) => {
        const asset = assets.find((asset) => asset.id === assetId);
        const targetAsset = assets.find(
          (asset) =>
            asset.id ===
            assets.find((asset) => asset.id === assetId)?.action_asset
        );
        const assetInValue = (targetAsset?.value || 0) - asset?.value!;
        return (
          <div key={assetId} className="flex items-center space-x-2 mb-2">
            <div
              className={`${
                !isEditable && "border-transparent bg-transparent"
              } flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`}
            >
              {asset?.name}
              <span className="text-muted-foreground ml-1">
                ({formatValue(assetInValue)})
              </span>
            </div>
            {isEditable && (
              <Button
                disabled={!isEditable || status === "LOADING"}
                variant="outline"
                className="flex p-3 space-x-2 data-[state=open]:bg-muted ml-auto"
                onClick={() => handleRemoveWithAsset(assetId)}
              >
                {status === "LOADING" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        );
      })}

      {isEditable && (
        <div>
          <DetailsAssetsInDialog
            planId={expanded!}
            columnId={row.getValue("id")}
            updateFunc={updateActionAssetIn}
          >
            <Button variant="outline" className="w-full">
              <PlusCircle className="h-4 w-4 mr-1" /> Add Asset
            </Button>
          </DetailsAssetsInDialog>
          {assetsInIds.length > 0 && (
            <p className="mt-4 text-muted-foreground">
              Est. value: {formatValue(estValue)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ColumnDetailsAssetsIn;
