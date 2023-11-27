"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Asset } from "../../data/schema";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableCombobox } from "../data-table-combobox";
import { CostTypes } from "../../data/data";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import ColumnDetailsName from "./column-details-name";
import ColumnDetailsValue from "./column-details-value";
import ColumnDetailsYoy from "./column-details-yoy";
import ColumnDetailsAdd from "./column-details-add";
import ColumnDetailsDelete from "./column-details-delete";

function CostsNameCell<TData>({ row }: { row: Row<TData> }) {
  const { updateCostName } = useAssetStore();
  return <ColumnDetailsName row={row} updateFunc={updateCostName} />;
}

function CostsValueCell<TData>({ row }: { row: Row<TData> }) {
  const { updateCostValue } = useAssetStore();
  return (
    <ColumnDetailsValue row={row} type="cost" updateFunc={updateCostValue} />
  );
}

function CostsYoyCell<TData>({ row }: { row: Row<TData> }) {
  const { updateCostYoy } = useAssetStore();
  return <ColumnDetailsYoy row={row} type="cost" updateFunc={updateCostYoy} />;
}

function CostsTypeCell<TData>({ row }: { row: Row<TData> }) {
  const { expanded, isEditable } = useAssetExpandedState();

  return (
    <DataTableCombobox
      disabled={!isEditable}
      parentId={expanded}
      type="cost"
      id={row.getValue("id")}
      categories={CostTypes}
      category={row.getValue("type")}
    />
  );
}

function CostsAddCell<TData>({ row }: { row: Row<TData> }) {
  const { removeCost } = useAssetStore();

  return <ColumnDetailsDelete type="cost" row={row} updateFunc={removeCost} />;
}

function CostsAddHeader() {
  const { addCost } = useAssetStore();
  return <ColumnDetailsAdd type="cost" updateFunc={addCost} />;
}

export const ColumnDetailsCosts: ColumnDef<Asset>[] = [
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
    cell: CostsNameCell,
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
    cell: CostsValueCell,
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
    cell: CostsYoyCell,
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
    cell: CostsTypeCell,
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
    header: CostsAddHeader,
    cell: CostsAddCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
