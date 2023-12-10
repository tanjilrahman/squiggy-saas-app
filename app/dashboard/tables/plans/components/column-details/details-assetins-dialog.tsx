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
import { AssetIn } from "../../data/schema";
import { AllocationTypeCombobox } from "../allocation-type-combobox";
import { Input } from "@/components/ui/input";

type ColumnDetailsDialogProps = {
  children: JSX.Element;
  planId: string;
  columnId: string;
  updateFunc: (planId: string, actionId: string, asset: AssetIn) => void;
};

export function DetailsAssetinsDialog({
  children,
  planId,
  columnId,
  updateFunc,
}: ColumnDetailsDialogProps) {
  const { assets } = useAssetStore();
  const { plans } = usePlanStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<"absolute" | "cumulative">("absolute");
  const [allocation, setAllocation] = useState(100);
  const plan = plans.find((plan) => plan.id === planId);
  const action = plan?.actions.find((action) => action.id === columnId);

  const handleAdd = (assetId: string) => {
    const assetIns: AssetIn = {
      id: uuid(),
      assetId,
      allocation: allocation,
      type: value,
    };
    updateFunc(planId, columnId, assetIns);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Available Assets</DialogTitle>
          <DialogDescription>
            Do you really want to delete this record? This process cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2">
          <div className="flex-grow grid grid-cols-4 text-muted-foreground">
            <div className="col-span-1 px-2">Asset name</div>
            <div className="col-span-1 px-2">Value</div>
            <div className="px-2">Allocation(%)</div>
            <div className="px-2">Type</div>
          </div>
          <div className="w-16"></div>
        </div>

        {assets.map((asset) => {
          const isAssetInColumn = action?.assetIns?.some(
            (item) => item.assetId === asset.id
          );

          const isAssetOutColumn = action?.assetOut === asset.id;

          if (!isAssetInColumn && !isAssetOutColumn) {
            return (
              <div key={asset.id} className="flex space-x-2 items-center">
                <div className="flex-grow grid grid-cols-4 gap-2">
                  <div className="col-span-1 bg-secondary text-secondary-foreground h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                    {asset.name}
                  </div>
                  <div className="col-span-1 bg-secondary text-secondary-foreground h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                    {formatValue2nd(asset.value)}
                  </div>
                  <Input
                    id="name"
                    value={allocation}
                    onChange={(e) => {
                      setAllocation(+e.target.value);
                    }}
                    className="font-medium disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
                  />
                  <AllocationTypeCombobox value={value} setValue={setValue} />
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

          return null;
        })}
      </DialogContent>
    </Dialog>
  );
}
