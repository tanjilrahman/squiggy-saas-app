"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "../../data/schema";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableCombobox } from "../data-table-combobox";
import { types } from "../../data/data";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import ColumnDetailsName from "./column-details-name";
import ColumnDetailsValue from "./column-details-value";
import ColumnDetailsYoy from "./column-details-yoy";
import ColumnDetailsAdd from "./column-details-add";
import ColumnDetailsDelete from "./column-details-delete";

export const ColumnDetailsCosts: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { updateCostName } = useAssetStore();

      return <ColumnDetailsName row={row} updateFunc={updateCostName} />;
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const { updateCostValue } = useAssetStore();

      return <ColumnDetailsValue row={row} updateFunc={updateCostValue} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "yoy",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="YOY Change" />
    ),
    cell: ({ row }) => {
      const { updateCostYoy } = useAssetStore();
      return <ColumnDetailsYoy row={row} updateFunc={updateCostYoy} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const { expanded } = useAssetExpandedState();

      return (
        <DataTableCombobox
          parentId={expanded}
          type="cost"
          id={row.getValue("id")}
          categories={types}
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
      const { addCost } = useAssetStore();
      return <ColumnDetailsAdd type="cost" updateFunc={addCost} />;
    },
    cell: ({ row }) => {
      const { removeCost } = useAssetStore();

      return <ColumnDetailsDelete row={row} updateFunc={removeCost} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
