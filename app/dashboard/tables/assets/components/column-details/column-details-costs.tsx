"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Asset } from "../../data/schema";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableCombobox } from "../tableUis/data-table-combobox";
import { types } from "../../data/data";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useAssetStore } from "@/store/assetStore";
import { useSearchParams } from "next/navigation";

export const ColumnDetailsCosts: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader sort={false} column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<string>(row.getValue("name"));
      const { updateCostName } = useAssetStore();
      const searchParams = useSearchParams();
      const assetId = searchParams.get("edit-asset");
      return (
        <Input
          id="name"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (assetId)
              updateCostName(assetId, row.getValue("id"), e.target.value);
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
      const { updateCostValue } = useAssetStore();
      const searchParams = useSearchParams();
      const assetId = searchParams.get("edit-asset");
      return (
        <Input
          id="value"
          type="number"
          value={value}
          onChange={(e) => {
            setValue(+e.target.value);
            if (assetId)
              updateCostValue(assetId, row.getValue("id"), +e.target.value);
          }}
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
      const { updateCostYoy } = useAssetStore();
      const searchParams = useSearchParams();
      const assetId = searchParams.get("edit-asset");
      return (
        <Input
          id="yoy"
          value={value}
          onChange={(e) => {
            setValue(+e.target.value);
            if (assetId)
              updateCostYoy(assetId, row.getValue("id"), +e.target.value);
          }}
        />
      );
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
      const searchParams = useSearchParams();
      const assetId = searchParams.get("edit-asset");
      return (
        <DataTableCombobox
          parentId={assetId}
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
    accessorKey: "add",
    header: ({ column }) => (
      <Button
        variant="outline"
        className="flex space-x-1 h-8 px-2 data-[state=open]:bg-muted"
      >
        <PlusCircle className="h-4 w-4" />
        <span>Add</span>
      </Button>
    ),
    cell: ({ row }) => (
      <Button
        variant="secondary"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted mx-auto"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Trash</span>
      </Button>
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
