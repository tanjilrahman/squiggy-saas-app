"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import ColumnDetailsName from "./column-details-name";
import ColumnDetailsAdd from "./column-details-add";
import ColumnDetailsDelete from "./column-details-delete";
import { usePlanStore } from "@/store/planStore";
import { Plan } from "../../data/schema";
import { useState } from "react";
import { formatValue, formatValue2nd } from "@/lib/helperFunctions";
import ColumnDetailsTimeframe from "./column-details-timeframe";
import ColumnDetailsAssetsIn from "./column-details-assetin";
import ColumnDetailsAssetsOut from "./column-details-assetout";

function ActionNameCell<TData>({ row }: { row: Row<TData> }) {
  const { updateActionName } = usePlanStore();

  return <ColumnDetailsName row={row} updateFunc={updateActionName} />;
}

function ActionTimeframeCell<TData>({ row }: { row: Row<TData> }) {
  const { updateActionTimeframe } = usePlanStore();

  return (
    <ColumnDetailsTimeframe row={row} updateFunc={updateActionTimeframe} />
  );
}

function ActionAssetsInCell<TData>({ row }: { row: Row<TData> }) {
  return <ColumnDetailsAssetsIn row={row} />;
}

function ActionAssetsOutCell<TData>({ row }: { row: Row<TData> }) {
  return <ColumnDetailsAssetsOut row={row} />;
}

function ActionValueCell<TData>({ row }: { row: Row<TData> }) {
  const [value, setValue] = useState(0);
  const { plans } = usePlanStore();
  const plan = plans.find((plan) => plan.id === row.getValue("id"));
  // row.original.profit = profit;
  // useEffect(() => {
  //   setProfit(calculateProfit(asset!));
  //   row.original.profit = profit;
  // }, [assets]);
  return (
    <div className="flex w-[80px] px-3 py-2 border border-transparent">
      <span className="truncate font-medium">{formatValue(value)}</span>
    </div>
  );
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
    <div className="flex w-[60px] px-3 py-2 border border-transparent">
      <span className="truncate font-medium">Ok</span>
    </div>
  );
}

function ActionAddCell<TData>({ row }: { row: Row<TData> }) {
  const { removeAction } = usePlanStore();

  return <ColumnDetailsDelete row={row} updateFunc={removeAction} />;
}

function ActionAddHeader() {
  const { addAction } = usePlanStore();
  return <ColumnDetailsAdd updateFunc={addAction} />;
}

export const ColumnDetails: ColumnDef<Plan>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Name"
        className="translate-x-3"
      />
    ),
    cell: ActionNameCell,
  },
  {
    accessorKey: "timeframe",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Timeframe"
        className="translate-x-3"
      />
    ),
    cell: ActionTimeframeCell,
  },
  {
    accessorKey: "assetIns",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Assets in"
        className="translate-x-3"
      />
    ),
    cell: ActionAssetsInCell,
  },
  {
    accessorKey: "assetOuts",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Assets out"
        className="translate-x-3"
      />
    ),
    cell: ActionAssetsOutCell,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Value"
        className="translate-x-3"
      />
    ),
    cell: ActionValueCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Status"
        className="translate-x-3"
      />
    ),
    cell: StatusCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    accessorKey: "add",
    header: ActionAddHeader,
    cell: ActionAddCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
