import { TableCell, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Row } from "@tanstack/react-table";

interface DataRowProps<TData> {
  row: Row<TData>;
  yearSelected: any;
  activePlans: any;
  table: any;
}

export function DataRow<TData>({
  row,
  yearSelected,
  activePlans,
  table,
}: DataRowProps<TData>) {
  const tf: number = row.getValue("time");
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (yearSelected && activePlans) {
      const selected = yearSelected >= tf;
      setHighlight(selected);
    } else {
      setHighlight(false);
    }
  }, [yearSelected, activePlans]);

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      className={`${highlight && "bg-muted/50"} ${
        activePlans && "cursor-pointer"
      }`}
      onClick={() => {
        if (activePlans && (!yearSelected || row.getIsSelected())) {
          table.resetRowSelection(false);
          row.toggleSelected(!row.getIsSelected());
        }
      }}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
