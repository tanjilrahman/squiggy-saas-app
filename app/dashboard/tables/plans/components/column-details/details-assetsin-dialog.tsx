import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAssetStore } from "@/store/assetStore";
import { usePlanStore } from "@/store/planStore";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { AllocationTypeCombobox } from "../allocation-type-combobox";
import { Input } from "@/components/ui/input";
import { FormatValueCurrency } from "@/components/FormatValueCurrency";
import { formatNumericValue } from "@/lib/helperFunctions";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { ActionAsset } from "../../data/schema";

type ColumnDetailsDialogProps = {
  children: JSX.Element;
  planId: string;
  columnId: string;
  updateFunc: (planId: string, actionId: string, asset: ActionAsset) => void;
};

export function DetailsAssetsInDialog({
  children,
  planId,
  columnId,
  updateFunc,
}: ColumnDetailsDialogProps) {
  const { assets } = useAssetStore();
  const { plans } = usePlanStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<"%" | "fixed">("fixed");
  const [allocation, setAllocation] = useState(0);
  const plan = plans.find((plan) => plan.id === planId);
  const action = plan?.actions.find((action) => action.id === columnId);

  const handleAdd = (assetId: string) => {
    const assetsIn: ActionAsset = {
      id: uuid(),
      assetId,
      allocation: allocation,
      type: value,
    };
    updateFunc(planId, columnId, assetsIn);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Available Assets</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
            commodi magnam recusandae dolorem quae.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 text-muted-foreground">
          <div className="w-[200px] px-2">Asset name</div>
          <div className="w-[150px] px-2">Value</div>
          <div className="px-2">Allocation</div>
        </div>

        {assets.map((asset) => {
          const isAssetInColumn = action?.assetsIn?.some(
            (item) => item.assetId === asset.id
          );
          // const actionAssets = assets.map((asset) => asset.action_asset);
          // const isActionAsset = actionAssets.includes(asset.id);
          const isAssetOutColumn = action?.assetOut?.assetId === asset.id;

          if (!isAssetInColumn && !isAssetOutColumn) {
            return (
              <div key={asset.id} className="flex space-x-2 items-center">
                <div className="flex items-center bg-secondary text-secondary-foreground h-10 w-[200px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                  {asset.name}
                </div>
                <div className="bg-secondary text-secondary-foreground h-10 w-[150px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                  <FormatValueCurrency number={asset.value} />
                </div>
                <div className="flex items-center w-[150px]">
                  <Input
                    id="value"
                    type="text"
                    value={formatNumericValue(allocation)}
                    onChange={(e) => {
                      const numericValue = +e.target.value.replace(/\D/g, "");
                      setAllocation(numericValue);
                    }}
                    className="pr-0 text-right border-r-0 rounded-r-none disabled:opacity-100 disabled:bg-transparent disabled:border-transparent "
                  />
                  <AllocationTypeCombobox
                    className="px-2 border-l-0 rounded-l-none"
                    value={value}
                    setValue={setValue}
                  />
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
