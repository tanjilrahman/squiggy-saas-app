import { useSelectedAssetStore } from "@/store/assetStore";
import { useAreaChartDataStore } from "@/store/chartStore";
import { useSelectedMiniPlanStore } from "@/store/planStore";
import { X } from "lucide-react";
import React from "react";

function DashboardAlert() {
  const { selectedAssets, setSelectedAssets } = useSelectedAssetStore();
  const { areaChartKey, yearSelected, setAreaChartKey, setYearSelected } =
    useAreaChartDataStore();
  const { startTime } = useSelectedMiniPlanStore();
  const handleResetAreaChart = () => {
    setAreaChartKey(areaChartKey + 1);
    setYearSelected(null);
    setSelectedAssets([]);
  };
  return (
    <div className="flex justify-center">
      {yearSelected && (
        <div className="flex items-center px-3 py-1 rounded-md text-sm bg-muted text-muted-foreground">
          <span>Assets from year - {yearSelected + 2023}</span>
          {!startTime && (
            <X
              onClick={handleResetAreaChart}
              className="h-4 w-4 ml-1 cursor-pointer hover:text-primary"
            />
          )}
        </div>
      )}
      {selectedAssets.length > 0 && (
        <div className="flex items-center px-3 py-1 rounded-md text-sm bg-muted text-muted-foreground">
          <span>Partial asset(s) selected</span>
          {!startTime && (
            <X
              onClick={handleResetAreaChart}
              className="h-4 w-4 ml-1 cursor-pointer hover:text-primary"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardAlert;
