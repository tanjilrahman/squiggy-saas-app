"use client";

import { ColumnDef } from "@tanstack/react-table";
import { categories } from "../data/data";
import { Asset } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import {
  useAssetExpandedState,
  useAssetStore,
  useSelectedAssetStore,
} from "@/store/assetStore";
import { Button } from "@/components/ui/button";
import { DataTableCombobox } from "./data-table-combobox";
import { formatValue2nd } from "@/lib/helperFunctions";
import { DataTableRemove } from "./data-table-remove";
import ColumnName from "./column/column-name";
import ColumnValue from "./column/column-value";
import ColumnYoy from "./column/column-yoy";

export const columns: ColumnDef<Asset>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const { setSelectedAssets } = useSelectedAssetStore();
      useEffect(() => {
        const selectedAssets = table
          .getFilteredSelectedRowModel()
          .rows.map((row) => row.original);
        setSelectedAssets(selectedAssets);
      }, [table.getFilteredSelectedRowModel().rows.length]);
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      );
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
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
    cell: ({ row }) => {
      const { updateAssetName } = useAssetStore();

      return <ColumnName row={row} updateFunc={updateAssetName} />;
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Category"
        className="translate-x-4"
      />
    ),
    cell: ({ row }) => {
      const { expanded, isEditable } = useAssetExpandedState();

      if (row.getValue("id") === expanded)
        return (
          <DataTableCombobox
            disabled={!isEditable}
            id={row.getValue("id")}
            categories={categories}
            category={row.getValue("category")}
          />
        );

      return (
        <DataTableCombobox
          disabled={row.getValue("id") !== expanded}
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
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Value"
        className="translate-x-3"
      />
    ),
    cell: ({ row }) => {
      const { updateAssetValue } = useAssetStore();
      return <ColumnValue row={row} updateFunc={updateAssetValue} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "yoy",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="YOY Change"
        className="translate-x-3"
      />
    ),
    cell: ({ row }) => {
      const { updateAssetYoy } = useAssetStore();
      return <ColumnYoy row={row} updateFunc={updateAssetYoy} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profit" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] space-x-2">
          <span className="truncate font-medium">
            {formatValue2nd(row.getValue("profit"))}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "roi",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ROI" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("roi")}%</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "details",
    header: ({ column }) => {
      const { assets, addAsset } = useAssetStore();
      const { setIsEditable, setExpanded } = useAssetExpandedState();
      const newAssetId = (assets[0]?.id ? +assets[0]?.id + 1 : 1).toString();

      const newAsset: Asset = {
        id: newAssetId,
        name: "",
        value: 0,
        category: "",
        note: "",
        yoy: 0,
        profit: 0,
        roi: 0,
        incomes: [],
        costs: [],
      };
      const handleAddAsset = () => {
        addAsset(newAsset);
        setExpanded(newAssetId);
        setIsEditable(true);
      };

      return (
        <Button
          variant="outline"
          className="flex space-x-1 h-8 px-2 data-[state=open]:bg-muted ml-auto"
          onClick={handleAddAsset}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Asset</span>
        </Button>
      );
    },
    cell: ({ row }) => {
      const { expanded, isEditable, setIsEditable, setExpanded } =
        useAssetExpandedState();
      const { removeAsset } = useAssetStore();

      const handleRemove = () => {
        removeAsset(row.getValue("id"));
        setExpanded(null);
        setIsEditable(false);
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
                console.log(row.getValue("id"));
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
    },
  },
];
