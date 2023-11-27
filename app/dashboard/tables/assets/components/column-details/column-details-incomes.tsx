"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Asset } from "../../data/schema";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableCombobox } from "../data-table-combobox";
import { IncomeTypes } from "../../data/data";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import ColumnDetailsName from "./column-details-name";
import ColumnDetailsValue from "./column-details-value";
import ColumnDetailsYoy from "./column-details-yoy";
import ColumnDetailsAdd from "./column-details-add";
import ColumnDetailsDelete from "./column-details-delete";

function IncomesNameCell<TData>({ row }: { row: Row<TData> }) {
  const { updateIncomeName } = useAssetStore();

  return <ColumnDetailsName row={row} updateFunc={updateIncomeName} />;
}

function IncomesValueCell<TData>({ row }: { row: Row<TData> }) {
  const { updateIncomeValue } = useAssetStore();

  return (
    <ColumnDetailsValue
      row={row}
      type="income"
      updateFunc={updateIncomeValue}
    />
  );
}

function IncomesYoyCell<TData>({ row }: { row: Row<TData> }) {
  const { updateIncomeYoy } = useAssetStore();
  return (
    <ColumnDetailsYoy row={row} type="income" updateFunc={updateIncomeYoy} />
  );
}

function IncomesTypeCell<TData>({ row }: { row: Row<TData> }) {
  const { expanded, isEditable } = useAssetExpandedState();

  return (
    <DataTableCombobox
      disabled={!isEditable}
      parentId={expanded}
      type="income"
      id={row.getValue("id")}
      categories={IncomeTypes}
      category={row.getValue("type")}
    />
  );
}

function IncomesAddCell<TData>({ row }: { row: Row<TData> }) {
  const { removeIncome } = useAssetStore();

  return (
    <ColumnDetailsDelete type="income" row={row} updateFunc={removeIncome} />
  );
}

function IncomesAddHeader() {
  const { addIncome } = useAssetStore();
  return <ColumnDetailsAdd type="income" updateFunc={addIncome} />;
}

export const ColumnDetailsIncomes: ColumnDef<Asset>[] = [
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
    cell: IncomesNameCell,
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
    cell: IncomesValueCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "yoy",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="YOY Change"
        className="translate-x-3"
      />
    ),
    cell: IncomesYoyCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Type"
        className="translate-x-4"
      />
    ),
    cell: IncomesTypeCell,
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
    header: IncomesAddHeader,
    cell: IncomesAddCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
