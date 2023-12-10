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

type ColumnDetailsDialogProps = {
  children: JSX.Element;
  planId: string;
  columnId: string;
  updateFunc: (planId: string, actionId: string, asset: string) => void;
};

export function DetailsAssetoutDialog({
  children,
  planId,
  columnId,
  updateFunc,
}: ColumnDetailsDialogProps) {
  const { assets } = useAssetStore();
  const { plans } = usePlanStore();
  const [open, setOpen] = useState(false);
  const plan = plans.find((plan) => plan.id === planId);
  const action = plan?.actions.find((action) => action.id === columnId);

  const handleAdd = (assetId: string) => {
    updateFunc(planId, columnId, assetId);
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
        <div className="flex space-x-2">
          <div className="flex-grow grid grid-cols-4 text-muted-foreground">
            <div className="col-span-2 px-2">Asset name</div>
            <div className="col-span-2 px-2">Value</div>
          </div>
          <div className="w-16"></div>
        </div>

        {assets.map((asset) => {
          const isAssetInColumn = action?.assetIns?.some(
            (item) => item.assetId === asset.id
          );

          if (!isAssetInColumn) {
            return (
              <div key={asset.id} className="flex space-x-2 items-center">
                <div className="flex-grow grid grid-cols-4 gap-2">
                  <div className="col-span-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                    {asset.name}
                  </div>
                  <div className="col-span-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                    {formatValue2nd(asset.value)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="p-3 space-x-2 data-[state=open]:bg-muted"
                  onClick={() => handleAdd(asset.id!)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            );
          }
        })}
      </DialogContent>
    </Dialog>
  );
}
