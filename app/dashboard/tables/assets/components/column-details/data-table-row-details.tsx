import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Row } from "@tanstack/react-table";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Eye } from "lucide-react";
import { DataTable } from "../data-table";
import { columns } from "./column-details";
import { Textarea } from "@/components/ui/textarea";
import { ColumnDetailsIncomes } from "./column-details-incomes";
import { Asset } from "../../data/schema";
import { ColumnDetailsCosts } from "./column-details-costs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAssetStore } from "@/store/assetStore";
// import { mergeAssets } from "@/store/store";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowDetails<TData extends Asset>({
  row,
}: DataTableRowActionsProps<TData>) {
  const asset: Asset = row.original;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [value, setValue] = useState<string | null>(asset.note);
  const { updateAssetNote } = useAssetStore();

  useEffect(() => {
    if (open == false) {
      router.replace("/dashboard");
    }
  }, [open]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4 text-gray-500 dark:text-gray-300" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-full overflow-y-auto">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <SheetHeader>
            <SheetTitle>Edit Asset</SheetTitle>
            <SheetDescription>
              Make changes to your asset here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="my-6">
            <DataTable data={[asset]} columns={columns} />
            <div className="grid w-full gap-3 mt-8">
              <Label
                htmlFor="message"
                className="text-gray-800 dark:text-gray-200"
              >
                Notes
              </Label>
              <Textarea
                value={value ? value : ""}
                onChange={(e) => {
                  setValue(e.target.value);
                  updateAssetNote(row.getValue("id"), e.target.value);
                }}
                placeholder="Some notes about the asset and maybe calculations?"
                id="message"
              />
            </div>
            <div className="grid w-full gap-3 mt-8">
              <Label
                htmlFor="income"
                className="text-gray-800 dark:text-gray-200"
              >
                Incomes
              </Label>
              <DataTable data={asset.incomes} columns={ColumnDetailsIncomes} />
            </div>
            <div className="grid w-full gap-3 mt-8">
              <Label
                htmlFor="cost"
                className="text-gray-800 dark:text-gray-200"
              >
                Costs
              </Label>
              <DataTable data={asset.costs} columns={ColumnDetailsCosts} />
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
