import { TableCell, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface DataRowProps {
  row: any;
  yearSelected: any;
  activePlans: any;
  table: any;
}

export function DataRow({
  row,
  yearSelected,
  activePlans,
  table,
}: DataRowProps) {
  const tf: number[] = row.getValue("timeframe");
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (yearSelected && activePlans) {
      const selected = yearSelected >= tf[0] && yearSelected <= tf[1];
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
        if (activePlans) {
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
