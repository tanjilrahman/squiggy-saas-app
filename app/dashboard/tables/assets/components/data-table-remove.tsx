import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAssetStore } from "@/store/assetStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type DataTableRemoveProps = {
  handleRemove: () => void;
  children: JSX.Element;
};

export function DataTableRemove({
  handleRemove,
  children,
}: DataTableRemoveProps) {
  const { assets } = useAssetStore();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const deleteButton = () => {
    setLoading(true);
    handleRemove();
  };

  useEffect(() => {
    setLoading(false);
    setOpen(false);
  }, [assets]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Do you really want to delete this record? This process cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={loading} variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={deleteButton}
            disabled={loading}
            variant="destructive"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{" "}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
