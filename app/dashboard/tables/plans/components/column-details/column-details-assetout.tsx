import { Button } from "@/components/ui/button";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAssetStore } from "@/store/assetStore";
import { DetailsAssetoutDialog } from "./details-assetout-dialog";
import { formatValue } from "@/lib/helperFunctions";
import { AssetIn } from "../../data/schema";

interface ColumnDetailsAssetsOutProps<TData> {
  row: Row<TData>;
}

function ColumnDetailsAssetsOut<TData>({
  row,
}: ColumnDetailsAssetsOutProps<TData>) {
  const [value, setValue] = useState<string>(row.getValue("assetOut"));
  const [assetInValue, setAssetInValue] = useState<AssetIn[]>(
    row.getValue("assetIns")
  );
  const [tradeOff, setTradeOff] = useState(0);

  const { plans, removeActionAssetOutId, updateActionAssetOut } =
    usePlanStore();
  const { assets } = useAssetStore();
  const { expanded, isEditable } = usePlanExpandedState();

  const asset = assets.find((asset) => asset.id === value);

  useEffect(() => {
    setValue(row.getValue("assetOut"));
    setAssetInValue(row.getValue("assetIns"));
  }, [plans]);

  useEffect(() => {
    const totalValue = assetInValue.reduce((sum, assetin) => {
      const assetValue = assets.find(
        (asset) => asset.id === assetin.assetId
      )?.value;
      const est = (assetValue || 0) * (assetin.allocation / 100);
      return est + sum;
    }, 0);
    setTradeOff(((asset?.value || 0) / totalValue) * 100);
  }, [value, assetInValue]);

  return (
    <div className="w-[200px]">
      {value && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div
              className={`${
                !isEditable && "border-transparent bg-transparent"
              } flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`}
            >
              {asset?.name}
            </div>
            {isEditable && (
              <Button
                disabled={!isEditable}
                variant="outline"
                className="flex p-3 space-x-2 data-[state=open]:bg-muted ml-auto"
                onClick={() =>
                  removeActionAssetOutId(expanded!, row.getValue("id"), value)
                }
              >
                <Trash2 className="h-4 w-4" />
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

export default ColumnDetailsAssetsOut;
