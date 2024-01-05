import { FormatValueCurrency } from "@/components/FormatValueCurrency";
import { Button } from "@/components/ui/button";
import { v4 as uuid } from "uuid";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { usePlanStore } from "@/store/planStore";
import { Loader2, PlusCircle, Route } from "lucide-react";
import { useState } from "react";
import { Asset } from "../../../assets/data/schema";
import { Input } from "@/components/ui/input";
import { formatNumericValue } from "@/lib/helperFunctions";
import { AllocationTypeCombobox } from "../allocation-type-combobox";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { useCarousel } from "@/components/ui/carousel";
import { ActionAsset } from "../../data/schema";

type ColumnDetailsDialogProps = {
  children: JSX.Element;
  planId: string;
  columnId: string;
  updateFunc: (planId: string, actionId: string, asset: ActionAsset) => void;
};

export function DetailsAssetoutDialog({
  children,
  planId,
  columnId,
  updateFunc,
}: ColumnDetailsDialogProps) {
  const { scrollPrev } = useCarousel();
  const { assets, addAsset } = useAssetStore();
  const { plans } = usePlanStore();
  const { setActivePlans } = useCalculatedAssetStore();
  const { setIsEditable, setExpanded } = useAssetExpandedState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<"%" | "fixed">("fixed");
  const [status] = useState<string | null>(null);
  const [allocation, setAllocation] = useState(0);
  const plan = plans.find((plan) => plan.id === planId);
  const action = plan?.actions.find((action) => action.id === columnId);

  const handleAdd = (assetId: string, isActionAsset?: boolean) => {
    const actionAsset: ActionAsset = {
      id: uuid(),
      allocation: isActionAsset ? 0 : allocation,
      assetId: assetId,
      type: isActionAsset ? "%" : value,
    };
    updateFunc(planId, columnId, actionAsset);
    setOpen(false);
  };

  const handleCreate = () => {
    setActivePlans(true);
    setOpen(false);
    scrollPrev();

    const newAssetId = uuid();

    handleAdd(newAssetId, true);

    const newAsset: Asset = {
      id: newAssetId,
      action_asset: action?.time || 0,
      name: "",
      value: 0,
      category: "",
      note: "",
      additions: 0,
      allocation: "",
      yoy: 0,
      yoy_advanced: [],
      yoy_type: "fixed",
      yoy_mode: "simple",
      profit: 0,
      roi: 0,
      incomes: [],
      costs: [],
    };

    addAsset(newAsset);
    setExpanded(newAssetId);
    setIsEditable(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Available Assets</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
            commodi magnam.
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

          if (!isAssetInColumn) {
            return (
              <div key={asset.id} className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 w-[200px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                  {asset.action_asset && (
                    <Route className="w-4 h-4 mr-2 text-indigo-500" />
                  )}
                  {asset.name}
                </div>
                <div className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 w-[150px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
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
                    className="pr-0 text-right border-r-0 rounded-r-none"
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
                  disabled={status === "LOADING"}
                >
                  {status === "LOADING" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <PlusCircle className="w-4 h-4 mr-1" />
                  )}
                  Add
                </Button>
              </div>
            );
          }
        })}
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate}>Create new asset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
