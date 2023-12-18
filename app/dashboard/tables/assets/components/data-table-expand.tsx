"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Label } from "@/components/ui/label";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";
import { ColumnDetailsIncomes } from "./column-details/column-details-incomes";
import { DataTable } from "./data-table";
import { ColumnDetailsCosts } from "./column-details/column-details-costs";
import DataTableTextArea from "./data-table-textarea";
import { Button } from "@/components/ui/button";
import { Asset } from "../data/schema";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { ProfitAllocationCombobox } from "./profit-allocation-combobox";
import { useCalculatedAssetStore } from "@/store/calculationStore";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableExpand<TData extends Asset, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { assets } = useAssetStore();
  const { activePlans } = useCalculatedAssetStore();
  const { expanded, isEditable, setIsEditable } = useAssetExpandedState();
  const [status, setStatus] = React.useState<string | null>(null);
  const pureAssets = assets.filter((asset) => !asset.action_asset);
  const assetsData = activePlans ? assets : pureAssets;

  React.useEffect(() => {
    if (isEditable === true) setStatus(null);
  }, [isEditable]);

  React.useEffect(() => {
    setStatus(null);
  }, [expanded]);

  const handleSave = async (assetId: string) => {
    setStatus("LOADING");
    const updatedAsset = assets.find((asset) => assetId === asset.id);
    console.log(updatedAsset);
    try {
      const response = await fetch("/api/update-asset", {
        method: "POST",
        body: JSON.stringify(updatedAsset),
      });

      const { success } = await response.json();
      if (success) {
        console.log("SUCCESS");
        setStatus("SUCCESS");
        setIsEditable(false);
      } else {
        setStatus("ERROR");
      }
    } catch (err: any) {
      if (err.data?.code === "UNAUTHORIZED") {
        console.log("You don't have the access.");
      } else {
        console.log(err);
      }
      setStatus("ERROR");
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${
                      expanded === row.getValue("id") &&
                      "bg-muted/50 hover:bg-muted/50"
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expanded === row.getValue("id") && (
                    <TableRow className="hover:bg-muted/0">
                      <TableCell colSpan={columns.length} className="w-full">
                        <div>
                          <div className="grid w-full gap-3">
                            <Label
                              htmlFor="message"
                              className="text-gray-800 dark:text-gray-200"
                            >
                              Notes
                            </Label>
                            <DataTableTextArea row={row.original} />
                          </div>
                          <div className="grid w-full gap-3 mt-8">
                            <Label
                              htmlFor="income"
                              className="text-gray-800 dark:text-gray-200"
                            >
                              Incomes
                            </Label>
                            <DataTable
                              // @ts-ignore
                              data={assetsData[row.index].incomes}
                              columns={ColumnDetailsIncomes}
                            />
                          </div>
                          <div className="grid w-full gap-3 mt-8">
                            <Label
                              htmlFor="income"
                              className="text-gray-800 dark:text-gray-200"
                            >
                              Costs
                            </Label>
                            <DataTable
                              // @ts-ignore
                              data={assetsData[row.index].costs}
                              columns={ColumnDetailsCosts}
                            />
                          </div>
                        </div>
                        <div className="w-full flex justify-between my-4">
                          <div className="space-x-4">
                            <ProfitAllocationCombobox
                              disabled={
                                !isEditable ||
                                assetsData[row.index].action_asset
                              }
                              assetId={row.getValue("id")}
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={!isEditable}
                            className="ml-auto"
                            onClick={() => handleSave(row.getValue("id"))}
                          >
                            {status === "LOADING" && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {status === "SUCCESS" && (
                              <Check className="mr-2 h-4 w-4" />
                            )}
                            {status === "ERROR" && (
                              <AlertCircle className="mr-2 h-4 w-4" />
                            )}
                            Save changes
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
