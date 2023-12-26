import React, { useEffect } from "react";
import { Switch } from "./ui/switch";
import { useCalculatedAssetStore } from "@/store/calculationStore";

function PlannedAssetToggle() {
  const { setActivePlans, activePlans } = useCalculatedAssetStore();

  useEffect(() => {
    const storedShow = localStorage.getItem("showActionAssets");
    if (storedShow) {
      setActivePlans(JSON.parse(storedShow));
    }
  }, [setActivePlans]);

  const handleSetShow = (show: boolean) => {
    localStorage.setItem("showActionAssets", String(show));
    setActivePlans(show);
  };
  return (
    <div className="mb-5 flex justify-end">
      <div className="flex space-x-3 items-center">
        <p className="text-muted-foreground">Scenarios</p>
        <Switch
          checked={activePlans}
          onCheckedChange={() => handleSetShow(!activePlans)}
        />
      </div>
    </div>
  );
}

export default PlannedAssetToggle;
