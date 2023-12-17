import { Button } from "@/components/ui/button";
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
import { PlusCircle, Route } from "lucide-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { AssetIn } from "../../data/schema";
import { AllocationTypeCombobox } from "../allocation-type-combobox";
import { Input } from "@/components/ui/input";
import { useNavState } from "@/store/store";
import { Asset } from "../../../assets/data/schema";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { FormatValueCurrency } from "@/components/FormatValueCurrency";

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
  const { assets, addAsset } = useAssetStore();
  const { plans } = usePlanStore();
  const { setNav } = useNavState();
  const { setActivePlans } = useCalculatedAssetStore();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<"absolute" | "cumulative">("absolute");
  const [allocation, setAllocation] = useState(100);
  const plan = plans.find((plan) => plan.id === planId);
  const action = plan?.actions.find((action) => action.id === columnId);

  const { setIsEditable, setExpanded } = useAssetExpandedState();

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

  const handleCreate = () => {
    setActivePlans(true);
    setNav("assets");

    const newAssetId = uuid();

    const newAsset: Asset = {
      id: newAssetId,
      action_asset: true,
      name: "",
      value: 0,
      category: "plan asset",
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
            commodi magnam recusandae dolorem quae.
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
                  <div className="col-span-1 flex items-center bg-secondary text-secondary-foreground h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                    {asset.action_asset && (
                      <Route className="h-4 w-4 mr-2 text-indigo-500" />
                    )}
                    {asset.name}
                  </div>
                  <div className="col-span-1 bg-secondary text-secondary-foreground h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                    <FormatValueCurrency number={asset.value} />
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
