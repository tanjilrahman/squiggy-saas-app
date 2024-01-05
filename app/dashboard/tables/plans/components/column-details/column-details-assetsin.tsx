import { Button } from "@/components/ui/button";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAssetStore } from "@/store/assetStore";
import { DetailsAssetsInDialog } from "./details-assetsin-dialog";
import { formatValue } from "@/lib/helperFunctions";
import { ActionAsset } from "../../data/schema";

interface ColumnDetailsAssetsInProps<TData> {
  row: Row<TData>;
}

function ColumnDetailsAssetsIn<TData>({
  row,
}: ColumnDetailsAssetsInProps<TData>) {
  const [status, setStatus] = useState<string | null>(null);
  const [value, setValue] = useState<ActionAsset[]>(row.getValue("assetsIn"));
  const [estValue, setEstValue] = useState(100);
  const { plans, removeActionAssetInId, updateActionAssetIn } = usePlanStore();
  const { assets } = useAssetStore();
  const { expanded, isEditable } = usePlanExpandedState();
  const actionTime: number = row.getValue("time");

  useEffect(() => {
    setValue(row.getValue("assetsIn"));
  }, [plans]);

  useEffect(() => {
    const totalValue = value?.reduce((sum, assetin) => {
      const assetValue = assets.find(
        (asset) => asset.id === assetin.assetId
      )?.value;
      const est =
        assetin?.type === "%"
          ? (assetValue || 0) * (assetin.allocation / 100)
          : assetin?.allocation;
      return est + sum;
    }, 0);

    setEstValue(totalValue);
  }, [value, plans]);

  const handleRemoveActionAsset = async (actionAssetId: string) => {
    setStatus("LOADING");
    try {
      const response = await fetch("/api/delete-action-asset", {
        method: "POST",
        body: JSON.stringify({ actionAssetId }),
      });

      const { success, code } = await response.json();
      if (success) {
        console.log("success");
        setStatus("SUCCESS");
        removeActionAssetInId(expanded!, row.getValue("id"), actionAssetId);
      }
      if (code === "NOT FOUND") {
        setStatus("ERROR");
        removeActionAssetInId(expanded!, row.getValue("id"), actionAssetId);
      }
    } catch (err: any) {
      if (err.data?.code === "UNAUTHORIZED") {
        console.log("You don't have the access.");
        setStatus("ERROR");
      }
    }
  };

  return (
    <div className="w-[240px]">
      {value?.map((item) => {
        const asset = assets.find((asset) => asset.id === item.assetId);
        return (
          <div key={item.id} className="flex items-center space-x-2 mb-2">
            <div
              className={`${
                !isEditable && "border-transparent bg-transparent"
              } flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`}
            >
              {asset?.name}

              {item.type === "%" && (
                <span className="text-muted-foreground ml-1">
                  {formatValue(((asset?.value || 0) * item.allocation) / 100)}
                </span>
              )}
              {item.type === "fixed" && (
                <span className="text-muted-foreground ml-1">
                  ({formatValue(item.allocation)})
                </span>
              )}
            </div>
            {isEditable && (
              <Button
                disabled={!isEditable}
                variant="outline"
                className="flex p-3 space-x-2 data-[state=open]:bg-muted ml-auto"
                onClick={() => handleRemoveActionAsset(item.id)}
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
            <Button
              variant="outline"
              className="w-full"
              disabled={!(actionTime > 0)}
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Asset
            </Button>
          </DetailsAssetsInDialog>
          {value?.length > 0 && (
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
