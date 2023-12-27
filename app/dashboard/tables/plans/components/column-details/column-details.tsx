"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import ColumnDetailsName from "./column-details-name";
import ColumnDetailsAdd from "./column-details-add";
import ColumnDetailsDelete from "./column-details-delete";
import { usePlanExpandedState, usePlanStore } from "@/store/planStore";
import { Plan } from "../../data/schema";
import { useEffect, useState } from "react";
import { formatValue } from "@/lib/helperFunctions";
import ColumnDetailsAssetsIn from "./column-details-assetsin";
import ColumnDetailsAssetOut from "./column-details-assetout";
import { useAssetStore } from "@/store/assetStore";
import ColumnDetailsTime from "./column-details-time";

function ActionNameCell<TData>({ row }: { row: Row<TData> }) {
  const { updateActionName } = usePlanStore();

  return <ColumnDetailsName row={row} updateFunc={updateActionName} />;
}

function ActionTimeCell<TData>({ row }: { row: Row<TData> }) {
  const { updateActionTime } = usePlanStore();

  return <ColumnDetailsTime row={row} updateFunc={updateActionTime} />;
}

function ActionAssetsInCell<TData>({ row }: { row: Row<TData> }) {
  return <ColumnDetailsAssetsIn row={row} />;
}

function ActionAssetOutCell<TData>({ row }: { row: Row<TData> }) {
  return <ColumnDetailsAssetOut row={row} />;
}

function ActionValueCell<TData>({ row }: { row: Row<TData> }) {
  const [value, setValue] = useState<number>(row.getValue("value"));
  const { assets } = useAssetStore();
  const { plans, updateActionValue } = usePlanStore();
  const { expanded } = usePlanExpandedState();

  const plan = plans.find((plan) => plan.id === expanded);
  const action = plan?.actions.find(
    (action) => action.id === row.getValue("id")
  );

  const asset = assets.find((asset) => asset.id === action?.assetOut);
  const targetAsset = assets.find((a) => a.id === asset?.action_asset);

  useEffect(() => {
    const sameAsset = asset?.id === targetAsset?.id;
    const newValue =
      (asset?.value || 0) - (sameAsset ? 0 : targetAsset?.value || 0);
    setValue(newValue);
  }, [plans]);

  useEffect(() => {
    updateActionValue(expanded!, row.getValue("id"), value);
  }, [value]);

  return (
    <div className="flex w-[80px] px-3 py-2 border border-transparent">
      <span className="truncate font-medium">{formatValue(value)}</span>
    </div>
  );
}

function StatusCell<TData>({ row }: { row: Row<TData> }) {
  const [status, setStatus] = useState<string>(row.getValue("status"));
  const [assetOutId, setAssetOutId] = useState<string>(
    row.getValue("assetOut")
  );
  const [assetsInIds, setAssetsInIds] = useState<string[]>(
    row.getValue("assetsIn")
  );
  const { assets } = useAssetStore();
  const { plans, updateActionStatus } = usePlanStore();
  const { expanded } = usePlanExpandedState();

  useEffect(() => {
    setAssetOutId(row.getValue("assetOut"));
    setAssetsInIds(row.getValue("assetsIn"));
  }, [plans]);

  useEffect(() => {
    const assetsInTotalValue = assetsInIds.reduce((sum, assetId) => {
      const asset = assets.find((a) => a.id === assetId);
      const actionAssetId = asset?.action_asset;
      const targetAsset = assets.find((a) => a.id === actionAssetId);
      const assetInValue = (targetAsset?.value || 0) - (asset?.value || 0);

      return sum + assetInValue;
    }, 0);

    const assetOut = assets.find((asset) => asset.id === assetOutId);

    const targetOutAsset = assets.find(
      (asset) => asset.id === assetOut?.action_asset
    );

    const assetOutValue = (assetOut?.value || 0) - (targetOutAsset?.value || 0);
    const newStatus = assetsInTotalValue > assetOutValue ? "OK" : "At risk";
    setStatus(newStatus);
  }, [assetOutId, assetsInIds]);

  useEffect(() => {
    updateActionStatus(expanded!, row.getValue("id"), status);
  }, [status]);

  return (
    <div className="flex w-[70px] px-3 py-2 border border-transparent">
      <span className="truncate font-medium">{status}</span>
    </div>
  );
}

function ActionAddCell<TData>({ row }: { row: Row<TData> }) {
  const { removeAction } = usePlanStore();

  return <ColumnDetailsDelete row={row} updateFunc={removeAction} />;
}

function ActionAddHeader() {
  const { addAction } = usePlanStore();
  return <ColumnDetailsAdd updateFunc={addAction} />;
}

export const ColumnDetails: ColumnDef<Plan>[] = [
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
    cell: ActionNameCell,
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Time"
        className="translate-x-3"
      />
    ),
    cell: ActionTimeCell,
  },
  {
    accessorKey: "assetsIn",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Assets in"
        className="translate-x-3"
      />
    ),
    cell: ActionAssetsInCell,
  },
  {
    accessorKey: "assetOut",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Asset out"
        className="translate-x-3"
      />
    ),
    cell: ActionAssetOutCell,
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
    cell: ActionValueCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        sort={false}
        column={column}
        title="Status"
        className="translate-x-3"
      />
    ),
    cell: StatusCell,
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
    header: ActionAddHeader,
    cell: ActionAddCell,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
