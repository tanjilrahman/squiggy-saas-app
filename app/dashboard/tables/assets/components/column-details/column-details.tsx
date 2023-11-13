"use client";

import { ColumnDef } from "@tanstack/react-table";

import { categories } from "../../data/data";
import { Asset } from "../../data/schema";
import { DataTableColumnHeader } from "../data-table-column-header";
import { Input } from "@/components/ui/input";
import { DataTableCombobox } from "../tableUis/data-table-combobox";
import { useState } from "react";
import { useAssetStore } from "@/store/assetStore";

export const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<string>(row.getValue("name"));
      const { updateAssetName } = useAssetStore();
      return (
        <Input
          id="name"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            updateAssetName(row.getValue("id"), e.target.value);
          }}
          className="font-medium"
        />
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Value (USD)" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<number>(row.getValue("value"));
      const { updateAssetValue } = useAssetStore();
      return (
        <Input
          id="value"
          type="number"
          value={value}
          onChange={(e) => {
            setValue(+e.target.value);
            updateAssetValue(row.getValue("id"), +e.target.value);
          }}
        />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <DataTableCombobox
          parentId={null}
          type={"parent"}
          id={row.getValue("id")}
          categories={categories}
          category={row.getValue("category")}
        />
      );
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
      const [value, setValue] = useState<number>(row.getValue("yoy"));
      const { updateAssetYoy } = useAssetStore();
      return (
        <Input
          id="yoy"
          value={value}
          onChange={(e) => {
            setValue(+e.target.value);
            updateAssetYoy(row.getValue("id"), +e.target.value);
          }}
        />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Profit (USD)"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "roi",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="ROI (%)" />
    ),
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
];
