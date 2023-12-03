import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatValue2nd } from "@/lib/helperFunctions";
import { useAssetStore } from "@/store/assetStore";
import { usePlanStore } from "@/store/planStore";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { AssetInOut } from "../../data/schema";

type ColumnDetailsDialogProps = {
  children: JSX.Element;
  planId: string;
  columnId: string;
  type: "assetIns" | "assetOuts";
  updateFunc: (planId: string, actionId: string, asset: AssetInOut) => void;
};

export function ColumnDetailsDialog({
  children,
  planId,
  columnId,
  type,
  updateFunc,
}: ColumnDetailsDialogProps) {
  const { assets } = useAssetStore();
  const { plans } = usePlanStore();
  const [open, setOpen] = useState(false);
  const plan = plans.find((plan) => plan.id === planId);
  const action = plan?.actions.find((action) => action.id === columnId);

  const handleAdd = (assetId: string) => {
    const assetIns: AssetInOut = {
      id: uuid(),
      assetId,
      allocation: 100,
      type: "absolute",
    };
    updateFunc(planId, columnId, assetIns);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Available Assets</DialogTitle>
          <DialogDescription>
            Do you really want to delete this record? This process cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-5 text-muted-foreground">
          <div className="col-span-2 px-2">Asset name</div>
          <div className="col-span-2 px-2">Value</div>
        </div>
        {assets.map((asset) => {
          const isAssetInColumn = action?.[type]?.some(
            (item) => item.assetId === asset.id
          );

          if (!isAssetInColumn) {
            return (
              <div
                key={asset.id}
                className="grid grid-cols-5 items-center gap-2"
              >
                <div className="col-span-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {asset.name}
                </div>
                <div className="col-span-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {formatValue2nd(asset.value)}
                </div>
                <Button
                  variant="secondary"
                  className="col-span-1 p-3 space-x-2 data-[state=open]:bg-muted"
                  onClick={() => handleAdd(asset.id!)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            );
          }

          return null; // or you can omit this line as null is returned by default
        })}
      </DialogContent>
    </Dialog>
  );
}
