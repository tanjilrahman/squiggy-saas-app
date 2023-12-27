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
  const { scrollPrev } = useCarousel();
  const { assets, addAsset } = useAssetStore();
  const { plans } = usePlanStore();
  const { setActivePlans } = useCalculatedAssetStore();
  const { setIsEditable, setExpanded } = useAssetExpandedState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<"%" | "fixed">("%");
  const [status, setStatus] = useState<string | null>(null);
  const [allocation, setAllocation] = useState(100);
  const plan = plans.find((plan) => plan.id === planId);
  const action = plan?.actions.find((action) => action.id === columnId);

  const handleAddd = (assetId: string) => {
    updateFunc(planId, columnId, assetId);
    setOpen(false);
  };

  const handleAdd = async (assetId: string) => {
    const targetAsset = assets.find((asset) => assetId === asset.id);

    let targetAllocation = 0;

    if (value === "%") {
      targetAllocation = allocation / 100 + 1;
    } else {
      targetAllocation = allocation / targetAsset!.value + 1;
    }

    const newAssetId = uuid();

    if (targetAsset && targetAsset.id !== targetAsset.action_asset) {
      const newIncomes = targetAsset.incomes.map((income) => ({
        ...income,
        id: uuid(),
        value:
          income.value_mode === "fixed"
            ? income.value * targetAllocation
            : income.value,
        yoy:
          income.yoy_type === "fixed"
            ? income.yoy || 0 * targetAllocation
            : income.yoy,
      }));

      const newCosts = targetAsset.costs.map((cost) => ({
        ...cost,
        id: uuid(),
        value:
          cost.value_mode === "fixed"
            ? cost.value * targetAllocation
            : cost.value,
        yoy:
          cost.yoy_type === "fixed"
            ? cost.yoy || 0 * targetAllocation
            : cost.yoy,
      }));

      const newAsset: Asset = {
        ...targetAsset,
        id: newAssetId,
        action_asset: targetAsset.id,
        name: targetAsset.name + " copy",
        value: targetAsset.value * targetAllocation,
        yoy:
          targetAsset.yoy_type === "fixed"
            ? targetAsset.yoy || 0 * targetAllocation
            : targetAsset.yoy,
        incomes: newIncomes,
        costs: newCosts,
      };

      setStatus("LOADING");

      try {
        const response = await fetch("/api/update-asset", {
          method: "POST",
          body: JSON.stringify(newAsset),
        });

        const { success } = await response.json();
        if (success) {
          console.log("SUCCESS - Asset created");
          setStatus("SUCCESS");
          addAsset(newAsset);
          updateFunc(planId, columnId, newAssetId);
          setOpen(false);
        } else {
          setStatus("ERROR");
        }
      } catch (err: any) {
        if (err.data?.code === "UNAUTHORIZED") {
          console.log("You don't have the access.");
        } else {
          console.log(err);
        }
        setStatus("ERROR");
      }
    } else if (targetAsset && targetAsset.id === targetAsset.action_asset) {
      updateFunc(planId, columnId, assetId);
      console.log(assetId);
      setOpen(false);
    }
  };

  const handleCreate = () => {
    setActivePlans(true);
    setOpen(false);
    scrollPrev();

    const newAssetId = uuid();

    const newAsset: Asset = {
      id: newAssetId,
      action_asset: newAssetId,
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
            (item) => item === asset.id
          );

          const actionAssets = assets.map((asset) => asset.action_asset);
          const isActionAsset = actionAssets.includes(asset.id);

          if (
            !isAssetInColumn &&
            (asset.id === asset.action_asset || !isActionAsset)
          ) {
            return (
              <div key={asset.id} className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 w-[200px] rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
                  {asset.action_asset === asset.id && (
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
                    disabled={asset.id === asset.action_asset}
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
                    disabled={asset.id === asset.action_asset}
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
