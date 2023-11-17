"use client";

import { ColumnDef } from "@tanstack/react-table";
import { categories } from "../data/data";
import { Asset } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart,
  ChevronDown,
  ChevronUp,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  useAssetExpandedState,
  useAssetStore,
  useSelectedAssetStore,
} from "@/store/assetStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableCombobox } from "./data-table-combobox";
import { formatValue2nd } from "@/lib/helperFunctions";
import { DataTableRemove } from "./data-table-remove";

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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { expanded, isEditable } = useAssetExpandedState();
      const [value, setValue] = useState<string>(row.getValue("name"));
      const { assets, updateAssetName } = useAssetStore();

      useEffect(() => {
        setValue(row.getValue("name"));
      }, [assets]);

      if (row.getValue("id") === expanded)
        return (
          <Input
            id="name"
            disabled={row.getValue("id") === expanded && !isEditable}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              updateAssetName(row.getValue("id"), e.target.value);
            }}
            className="font-medium disabled:opacity-100 disabled:bg-transparent"
          />
        );

      return (
        <div className="flex w-[140px] font-semibold items-center">
          <span>{row.getValue("name")}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const { expanded, isEditable } = useAssetExpandedState();
      const category = categories.find(
        (category) => category.value === row.getValue("category")
      );

      if (!category) {
        return null;
      }

      if (row.getValue("id") === expanded)
        return (
          <DataTableCombobox
            parentId={null}
            type={"parent"}
            id={row.getValue("id")}
            categories={categories}
            category={row.getValue("category")}
          />
        );

      return (
        <div className="flex w-[160px] items-center">
          {category.icon && (
            <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{category.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<number>(row.getValue("value"));
      const { assets, updateAssetValue } = useAssetStore();
      const { expanded, isEditable } = useAssetExpandedState();

      useEffect(() => {
        setValue(row.getValue("value"));
      }, [assets]);

      if (row.getValue("id") === expanded)
        return (
          <Input
            id="value"
            type="text"
            value={
              row.getValue("id") === expanded && !isEditable
                ? formatValue2nd(value)
                : value
            }
            disabled={row.getValue("id") === expanded && !isEditable}
            onChange={(e) => {
              const numericValue = +e.target.value.replace(/\D/g, "");
              setValue(numericValue);
              updateAssetValue(row.getValue("id"), numericValue);
            }}
            className=" disabled:opacity-100 disabled:bg-transparent"
          />
        );

      return (
        <div className="flex w-[150px] items-center">
          <span>{formatValue2nd(row.getValue("value"))}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "yoy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="YOY Change" />
    ),
    cell: ({ row }) => {
      const [value, setValue] = useState<number>(row.getValue("yoy"));
      const { assets, updateAssetYoy } = useAssetStore();
      const { expanded, isEditable } = useAssetExpandedState();

      useEffect(() => {
        setValue(row.getValue("yoy"));
      }, [assets]);

      if (row.getValue("id") === expanded)
        return (
          <Input
            id="yoy"
            value={value}
            disabled={row.getValue("id") === expanded && !isEditable}
            onChange={(e) => {
              setValue(+e.target.value);
              updateAssetYoy(row.getValue("id"), +e.target.value);
            }}
            className=" disabled:opacity-100 disabled:bg-transparent"
          />
        );

      return (
        <div className="flex  items-center">
          <span>{row.getValue("yoy")}%</span>
          <BarChart className="ml-2 h-4 w-4 text-muted-foreground" />
        </div>
      );
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
        category: "real estate",
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
          {expanded === row.getValue("id") && (
            <div className="flex space-x-2">
              <Button
                variant={isEditable ? "ghost" : "outline"}
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted mx-auto"
                onClick={() => setIsEditable(!isEditable)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Pencil</span>
              </Button>
              <DataTableRemove handleRemove={handleRemove}>
                <Button
                  variant="outline"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted mx-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Trash</span>
                </Button>
              </DataTableRemove>
            </div>
          )}
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

  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
