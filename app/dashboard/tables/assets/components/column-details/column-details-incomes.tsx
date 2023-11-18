"use client";

import { ColumnDef } from "@tanstack/react-table";
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
    cell: ({ row }) => {
      const { updateIncomeName } = useAssetStore();

      return <ColumnDetailsName row={row} updateFunc={updateIncomeName} />;
    },
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
    cell: ({ row }) => {
      const { updateIncomeValue } = useAssetStore();

      return <ColumnDetailsValue row={row} updateFunc={updateIncomeValue} />;
    },
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
    cell: ({ row }) => {
      const { updateIncomeYoy } = useAssetStore();
      return <ColumnDetailsYoy row={row} updateFunc={updateIncomeYoy} />;
    },
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
    cell: ({ row }) => {
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
    },
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
    header: ({ column }) => {
      const { addIncome } = useAssetStore();
      return <ColumnDetailsAdd type="income" updateFunc={addIncome} />;
    },
    cell: ({ row }) => {
      const { removeIncome } = useAssetStore();

      return <ColumnDetailsDelete row={row} updateFunc={removeIncome} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
