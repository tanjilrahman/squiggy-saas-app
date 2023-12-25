"use client";

import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { useEffect, useState } from "react";
import { usePlanStore } from "@/store/planStore";
import { Action } from "../../plans/data/schema";
import ColumnName from "./column/column-name";
import ColumnTime from "./column/column-time";
import { formatValue } from "@/lib/helperFunctions";

function ActionNameCell<TData>({ row }: { row: Row<TData> }) {
  return <ColumnName row={row} />;
}

function ActionTimeCell<TData>({
  table,
  row,
}: {
  table: Table<TData>;
  row: Row<TData>;
}) {
  return <ColumnTime row={row} table={table} />;
}

function ActionValueCell<TData>({ row }: { row: Row<TData> }) {
  const [value, setValue] = useState<number>(row.getValue("value"));
  const { plans } = usePlanStore();
  useEffect(() => {
    setValue(row.getValue("value"));
  }, [plans]);
  return <p className="truncate font-medium">{formatValue(value)}</p>;
}

function StatusCell<TData>({ row }: { row: Row<TData> }) {
  const [status, setStatus] = useState<string>(row.getValue("status"));
  const { plans } = usePlanStore();
  useEffect(() => {
    setStatus(row.getValue("status"));
  }, [plans]);
  return <p className="truncate font-medium">{status}</p>;
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
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Time" />
    ),
    cell: ActionTimeCell,
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
