import { Textarea } from "@/components/ui/textarea";
import React, { useEffect } from "react";
import { Asset } from "../data/schema";
import { useAssetExpandedState, useAssetStore } from "@/store/assetStore";

function DataTableTextArea({ row }: { row: Asset }) {
  const [value, setValue] = React.useState<string | null>(row.note);
  const { assets, updateAssetNote } = useAssetStore();
  const { isEditable } = useAssetExpandedState();

  useEffect(() => {
    setValue(row.note);
  }, [assets]);

  return (
    <Textarea
      value={value ? value : ""}
      disabled={!isEditable}
      onChange={(e) => {
        setValue(e.target.value);
        updateAssetNote(row.id!, e.target.value);
      }}
      placeholder="Some notes about the asset and maybe calculations?"
      id="message"
    />
  );
}

export default DataTableTextArea;
