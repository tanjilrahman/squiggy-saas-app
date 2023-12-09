import { Button } from "@/components/ui/button";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Row } from "@tanstack/react-table";
import { PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAssetStore } from "@/store/assetStore";
import { AssetIn } from "../../data/schema";
import { DetailsAssetinsDialog } from "./details-assetins-dialog";

interface ColumnDetailsAssetsInProps<TData> {
  row: Row<TData>;
}

function ColumnDetailsAssetsIn<TData>({
  row,
}: ColumnDetailsAssetsInProps<TData>) {
  const [value, setValue] = useState<AssetIn[]>(row.getValue("assetIns"));
  const { plans, removeActionAssetInId, updateActionAssetIn } = usePlanStore();
  const { assets } = useAssetStore();
  const { expanded, isEditable } = usePlanExpandedState();

  useEffect(() => {
    setValue(row.getValue("assetIns"));
  }, [plans]);

  return (
    <div className="w-[200px]">
      {value?.map((item) => {
        const asset = assets.find((asset) => asset.id === item.assetId);
        return (
          <div key={item.assetId} className="flex items-center space-x-2 mb-2">
            <div
              className={`${
                !isEditable && "border-transparent bg-transparent"
              } flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`}
            >
              {asset?.name}
              <span className="text-muted-foreground ml-1">
                ({item.allocation}%)
              </span>
            </div>
            {isEditable && (
              <Button
                disabled={!isEditable}
                variant="outline"
                className="flex p-3 space-x-2 data-[state=open]:bg-muted ml-auto"
                onClick={() =>
                  removeActionAssetInId(
                    expanded!,
                    row.getValue("id"),
                    item.assetId
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}

      {isEditable && (
        <DetailsAssetinsDialog
          planId={expanded!}
          columnId={row.getValue("id")}
          updateFunc={updateActionAssetIn}
        >
          <Button variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-1" /> Add Asset
          </Button>
        </DetailsAssetinsDialog>
      )}
    </div>
  );
}

export default ColumnDetailsAssetsIn;
