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
  const { expanded, isEditable } = useAssetExpandedState();

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
                              data={assets[row.index].incomes}
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
                              data={assets[row.index].costs}
                              columns={ColumnDetailsCosts}
                            />
                          </div>
                        </div>
                        <div className="w-full flex">
                          <Button
                            type="submit"
                            disabled={!isEditable}
                            className="ml-auto my-4"
                          >
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
