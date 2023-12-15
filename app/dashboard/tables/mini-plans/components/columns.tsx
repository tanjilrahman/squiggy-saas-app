"use client";

import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { useState } from "react";
import { usePlanStore } from "@/store/planStore";
import { Action } from "../../plans/data/schema";
import ColumnName from "./column/column-name";
import ColumnTimeframe from "./column/column-timeframe";
import { formatValue } from "@/lib/helperFunctions";

function ActionNameCell<TData>({ row }: { row: Row<TData> }) {
  return <ColumnName row={row} />;
}

function ActionTimeframeCell<TData>({
  table,
  row,
}: {
  table: Table<TData>;
  row: Row<TData>;
}) {
  return <ColumnTimeframe row={row} table={table} />;
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
  return <p className="truncate font-medium">{formatValue(value)}</p>;
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
  return <p className="truncate font-medium">Ok</p>;
}

export const columns: ColumnDef<Action>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Task"
        className="hidden p-0 m-0"
      />
    ),
    cell: ({ row }) => <div className="p-0 m-0" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Action" />
    ),
    cell: ActionNameCell,
  },
  {
    accessorKey: "timeframe",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Timeframe" />
    ),
    cell: ActionTimeframeCell,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Value" />
    ),
    cell: ActionValueCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Status" />
    ),
    cell: StatusCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
