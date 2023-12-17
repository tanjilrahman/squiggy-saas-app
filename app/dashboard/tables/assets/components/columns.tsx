"use client";

import { v4 as uuid } from "uuid";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { categories } from "../data/data";
import { Asset } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  PlusCircle,
  Route,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  useAssetExpandedState,
  useAssetStore,
  useSelectedAssetStore,
} from "@/store/assetStore";
import { Button } from "@/components/ui/button";
import { DataTableCombobox } from "./data-table-combobox";
import { DataTableRemove } from "./data-table-remove";
import ColumnName from "./column/column-name";
import ColumnValue from "./column/column-value";
import ColumnYoy from "./column/column-yoy";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { FormatValueCurrency } from "@/components/FormatValueCurrency";

function NameCell<TData>({ row }: { row: Row<TData> }) {
  const { updateAssetName } = useAssetStore();

  return <ColumnName row={row} updateFunc={updateAssetName} />;
}

function CategoryCell<TData>({ row }: { row: Row<TData> }) {
  const { expanded, isEditable } = useAssetExpandedState();
  const { assets } = useAssetStore();
  const asset = assets.find((asset) => asset.id === row.getValue("id"));

  if (asset?.action_asset)
    return (
      <div className="flex items-center px-4 py-2 space-x-2">
        <Route className="w-4 h-4 text-indigo-500" /> <span>Plan Asset</span>
      </div>
    );

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
}

function SelectHeader<TValue extends Asset>({
  table,
}: {
  table: Table<TValue>;
}) {
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
}

function ValueCell<TData>({ row }: { row: Row<TData> }) {
  const { updateAssetValue } = useAssetStore();
  return <ColumnValue row={row} updateFunc={updateAssetValue} />;
}

function YoyCell<TData>({ row }: { row: Row<TData> }) {
  const { updateAssetYoy } = useAssetStore();
  return <ColumnYoy row={row} updateFunc={updateAssetYoy} />;
}

function ProfitCell<TData extends Asset>({ row }: { row: Row<TData> }) {
  const { calculatedAssets } = useCalculatedAssetStore();

  const calcAssetAll = calculatedAssets.find(
    (year) => year[0].id === row.getValue("id")
  );
  return (
    <div className="flex w-[100px] space-x-2 justify-end">
      <p className="font-medium truncate">
        <FormatValueCurrency number={calcAssetAll && calcAssetAll[0].profit} />
      </p>
    </div>
  );
}

function RoiCell<TData extends Asset>({ row }: { row: Row<TData> }) {
  const { calculatedAssets } = useCalculatedAssetStore();

  const calcAssetAll = calculatedAssets.find(
    (year) => year[0].id === row.getValue("id")
  );
  return (
    <div className="w-[60px] flex items-center justify-end">
      <p>
        {(calcAssetAll &&
          calcAssetAll[0].value > 0 &&
          calcAssetAll[0].roi?.toFixed(2)) ||
          "N/A"}
        {calcAssetAll && calcAssetAll[0].value > 0 && "%"}
      </p>
    </div>
  );
}

function DetailsHeader() {
  const { addAsset } = useAssetStore();
  const { setIsEditable, setExpanded } = useAssetExpandedState();

  const handleAddAsset = () => {
    const newAssetId = uuid();

    const newAsset: Asset = {
      id: newAssetId,
      action_asset: false,
      name: "",
      value: 0,
      category: "",
      note: "",
      additions: 0,
      allocation: "",
      yoy: null,
      yoy_advanced: [],
      yoy_type: "fixed",
      yoy_mode: "simple",
      profit: 0,
      roi: 0,
      incomes: [],
      costs: [],
    };

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
      <PlusCircle className="w-4 h-4" />
      <span>Add Asset</span>
    </Button>
  );
}

function DetailsCell<TData>({ row }: { row: Row<TData> }) {
  const { expanded, isEditable, setIsEditable, setExpanded } =
    useAssetExpandedState();
  const { removeAsset } = useAssetStore();

  const handleRemove = async () => {
    try {
      const response = await fetch("/api/delete-asset", {
        method: "POST",
        body: JSON.stringify({ assetId: row.getValue("id") }),
      });

      const { success, code } = await response.json();
      if (success) {
        console.log("success");
        removeAsset(row.getValue("id"));
        setExpanded(null);
        setIsEditable(false);
      }
      if (code === "NOT FOUND") {
        removeAsset(row.getValue("id"));
        setExpanded(null);
        setIsEditable(false);
      }
    } catch (err: any) {
      if (err.data?.code === "UNAUTHORIZED") {
        console.log("You don't have the access.");
      }
    }
  };

  return (
    <div className="flex items-center justify-end ml-auto space-x-2">
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
          <Pencil className="w-4 h-4" />
          <span className="sr-only">Pencil</span>
        </Button>
        <DataTableRemove handleRemove={handleRemove}>
          <Button
            disabled={expanded !== row.getValue("id")}
            variant="outline"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted mx-auto"
          >
            <Trash2 className="w-4 h-4" />
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
          }
        }}
      >
        {expanded === row.getValue("id") ? (
          <ChevronUp className="w-8 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        <span className="sr-only">Toggle</span>
      </Button>
    </div>
  );
}

export const columns: ColumnDef<Asset>[] = [
  {
    id: "select",
    header: SelectHeader,
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
    cell: NameCell,
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
    cell: CategoryCell,
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
        classNameButton="ml-auto"
      />
    ),
    cell: ValueCell,
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
        className="-translate-x-6"
        classNameButton="ml-auto"
      />
    ),
    cell: YoyCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Profit"
        className="translate-x-4"
        classNameButton="ml-auto"
      />
    ),
    cell: ProfitCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "roi",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ROI"
        classNameButton="ml-auto"
      />
    ),
    cell: RoiCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "details",
    header: DetailsHeader,
    cell: DetailsCell,
  },
];
