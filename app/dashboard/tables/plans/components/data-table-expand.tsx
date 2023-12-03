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
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Plan } from "../data/schema";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { ColumnDetails } from "./column-details/column-details";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTableExpand<TData extends Plan, TValue>({
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
  const { plans } = usePlanStore();
  const { expanded, isEditable, setIsEditable } = usePlanExpandedState();
  const [status, setStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isEditable === true) setStatus(null);
  }, [isEditable]);

  React.useEffect(() => {
    setStatus(null);
  }, [expanded]);

  const handleSave = async (planId: string) => {
    setStatus("LOADING");
    const updatedPlan = plans.find((plan) => planId === plan.id);
    console.log(updatedPlan);
    try {
      const response = await fetch("/api/update-plan", {
        method: "POST",
        body: JSON.stringify(updatedPlan),
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
                        <div className="grid w-full gap-3 mt-8">
                          <Label
                            htmlFor="income"
                            className="text-gray-800 dark:text-gray-200"
                          >
                            Actions
                          </Label>
                          <DataTable
                            // @ts-ignore
                            data={plans[row.index].actions}
                            columns={ColumnDetails}
                          />
                        </div>
                        <div className="w-full flex">
                          <Button
                            type="submit"
                            disabled={!isEditable}
                            className="ml-auto my-4"
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
