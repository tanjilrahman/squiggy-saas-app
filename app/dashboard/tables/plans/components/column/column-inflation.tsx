import { Input } from "@/components/ui/input";
import { Row } from "@tanstack/react-table";
import { TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { InflationDialog } from "./inflation-dialog";

interface ColumnInflationProps<TData> {
  row: Row<TData>;
  updateFunc: (planId: string, value: number) => void;
}

function ColumnInflation<TData>({
  row,
  updateFunc,
}: ColumnInflationProps<TData>) {
  const { plans } = usePlanStore();
  const { expanded, isEditable } = usePlanExpandedState();
  const plan = plans.find((plan) => plan.id === row.getValue("id"));

  const [value, setValue] = useState<number>(row.getValue("inflation"));
  const [mode, setMode] = useState(plan?.inflation_mode);
  const [inflationAdvanced, setInflationAdvanced] = useState<
    number[] | undefined
  >(plan?.inflation_advanced);

  useEffect(() => {
    setValue(row.getValue("inflation"));
    setInflationAdvanced(plan?.inflation_advanced);
    setMode(plan?.inflation_mode);
  }, [plans]);

  useEffect(() => {
    if (mode === "advanced") {
      updateFunc(
        row.getValue("id"),
        inflationAdvanced![1] - inflationAdvanced![0]
      );
    }
  }, [mode]);

  if (row.getValue("id") === expanded && isEditable)
    return (
      <div className="flex items-center w-[120px]">
        <Input
          id="yoy"
          value={
            mode === "advanced"
              ? inflationAdvanced![1] - inflationAdvanced![0]
              : value
          }
          disabled={!isEditable || mode === "advanced"}
          onChange={(e) => {
            if (mode === "simple") {
              setValue(+e.target.value);
              updateFunc(row.getValue("id"), +e.target.value);
            }
          }}
          className={`${
            !inflationAdvanced &&
            "disabled:bg-transparent disabled:border-transparent"
          } ${!isEditable ? "w-full" : "w-[80px]"} disabled:opacity-100`}
        />
        <InflationDialog planId={expanded!}>
          <TrendingUp
            className={`${
              plan?.inflation_mode === "advanced" ? "opacity-100" : "opacity-50"
            } h-5 w-5 ml-2 cursor-pointer`}
          />
        </InflationDialog>
      </div>
    );
  return (
    <div className="flex items-center w-[120px] px-3 py-2 border border-transparent">
      {mode === "advanced" ? (
        <p>{inflationAdvanced![1] - inflationAdvanced![0]}%</p>
      ) : (
        <p>{value}%</p>
      )}
      {mode === "advanced" && (
        <TrendingUp className="opacity-100 h-5 w-5 ml-2" />
      )}
    </div>
  );
}

export default ColumnInflation;
