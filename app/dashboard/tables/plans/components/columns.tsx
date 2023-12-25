"use client";

import { v4 as uuid } from "uuid";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTableRemove } from "./data-table-remove";
import ColumnName from "./column/column-name";
import { Plan } from "../data/schema";
import {
  usePlanExpandedState,
  usePlanStore,
  useSelectedPlanStore,
} from "@/store/planStore";
import ColumnInflation from "./column/column-inflation";
import ColumnNote from "./column/column-note";
import { CustomRadio } from "@/components/ui/custom-radio";
import { useAssetStore } from "@/store/assetStore";

function NameCell<TData>({ row }: { row: Row<TData> }) {
  const { updatePlanName } = usePlanStore();

  return <ColumnName row={row} updateFunc={updatePlanName} />;
}

function NoteCell<TData>({ row }: { row: Row<TData> }) {
  const { updatePlanNote } = usePlanStore();

  return <ColumnNote row={row} updateFunc={updatePlanNote} />;
}

function SelectCell<TValue extends Plan>({
  table,
  row,
}: {
  table: Table<TValue>;
  row: Row<TValue>;
}) {
  const { setSelectedPlan } = useSelectedPlanStore();
  useEffect(() => {
    const selectedAssets = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);
    setSelectedPlan(selectedAssets[0]);
  }, [table.getFilteredSelectedRowModel()]);

  return (
    <CustomRadio
      checked={row.getIsSelected()}
      onCheckedChange={(value) => {
        table.resetRowSelection(false);
        row.toggleSelected(!!value);
      }}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  );
}

function InflationCell<TData>({ row }: { row: Row<TData> }) {
  const { updatePlanInflation } = usePlanStore();
  return <ColumnInflation row={row} updateFunc={updatePlanInflation} />;
}

function StatusCell<TData>({ row }: { row: Row<TData> }) {
  const [status, setStatus] = useState("");
  const { plans } = usePlanStore();
  const plan = plans.find((plan) => plan.id === row.getValue("id"));
  // row.original.profit = profit;
  // useEffect(() => {
  //   setProfit(calculateProfit(asset!));
  //   row.original.profit = profit;
  // }, [assets]);
  return (
    <div className="flex w-[60px] space-x-2">
      <span className="truncate font-medium">Ok</span>
    </div>
  );
}

function DetailsHeader() {
  const { addPlan } = usePlanStore();
  const { setIsEditable, setExpanded } = usePlanExpandedState();

  const handleAddPlan = () => {
    const newPlanId = uuid();

    const newPlan: Plan = {
      id: newPlanId,
      name: "",
      note: "",
      inflation: 0,
      inflation_advanced: [],
      inflation_mode: "simple",
      status: "",
      actions: [],
    };

    addPlan(newPlan);
    setExpanded(newPlanId);
    setIsEditable(true);
  };

  return (
    <Button
      variant="outline"
      className="flex space-x-1 h-8 px-2 data-[state=open]:bg-muted ml-auto"
      onClick={handleAddPlan}
    >
      <PlusCircle className="h-4 w-4" />
      <span>Add Plan</span>
    </Button>
  );
}

function DetailsCell<TData>({ row }: { row: Row<TData> }) {
  const { expanded, isEditable, setIsEditable, setExpanded } =
    usePlanExpandedState();
  const { plans, removePlan } = usePlanStore();
  const { removeAsset } = useAssetStore();

  const plan = plans.find((plan) => expanded === plan.id);

  const assetsInIds = plan?.actions.map((action) => action.assetsIn).flat();
  const assetsOutIds = plan?.actions.map((action) => action.assetOut);
  const combinedAssetIds =
    assetsInIds && assetsOutIds && assetsInIds.concat(assetsOutIds);

  const handleRemove = async () => {
    try {
      const response = await fetch("/api/delete-plan", {
        method: "POST",
        body: JSON.stringify({
          planId: row.getValue("id"),
          assetIds: combinedAssetIds,
        }),
      });

      const { success, code } = await response.json();
      if (success) {
        console.log("success");
        removePlan(row.getValue("id"));
        combinedAssetIds?.forEach((assetId) => removeAsset(assetId));
        setExpanded(null);
        setIsEditable(false);
      }
      if (code === "NOT FOUND") {
        removePlan(row.getValue("id"));
        setExpanded(null);
        setIsEditable(false);
      }
    } catch (err: any) {
      if (err.data?.code === "UNAUTHORIZED") {
        console.log("You don't have the access.");
      }
    }
  };

  return (
    <div className="flex space-x-2 justify-end ml-auto items-center">
      <div
        className={`${
          expanded !== row.getValue("id") && "opacity-0"
        } flex space-x-2`}
      >
        <Button
          disabled={expanded !== row.getValue("id")}
          variant={isEditable ? "ghost" : "outline"}
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted mx-auto"
          onClick={() => setIsEditable(!isEditable)}
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Pencil</span>
        </Button>
        <DataTableRemove handleRemove={handleRemove}>
          <Button
            disabled={expanded !== row.getValue("id")}
            variant="outline"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted mx-auto"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Trash</span>
          </Button>
        </DataTableRemove>
      </div>
      <Button
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted ml-auto"
        onClick={() => {
          if (expanded === row.getValue("id")) {
            setExpanded(null);
            setIsEditable(false);
          } else {
            setExpanded(row.getValue("id"));
            setIsEditable(false);
          }
        }}
      >
        {expanded === row.getValue("id") ? (
          <ChevronUp className="h-4 w-8" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<Plan>[] = [
  {
    id: "select",
    // header: SelectHeader,
    cell: SelectCell,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Task"
        className="hidden p-0 m-0"
      />
    ),
    cell: ({ row }) => <div className="hidden p-0 m-0" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
        className="translate-x-3"
      />
    ),
    cell: NameCell,
  },
  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Note"
        className="translate-x-3"
      />
    ),
    cell: NoteCell,
  },
  {
    accessorKey: "inflation",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Inflation"
        className="translate-x-3"
      />
    ),
    cell: InflationCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: StatusCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "details",
    header: DetailsHeader,
    cell: DetailsCell,
  },
];
