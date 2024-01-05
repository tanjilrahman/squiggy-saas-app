import { useSelectedAssetStore } from "@/store/assetStore";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import {
  useAreaChartDataStore,
  useBarChartDataStore,
} from "@/store/chartStore";
import {
  useSelectedMiniPlanStore,
  useSelectedPlanStore,
} from "@/store/planStore";
import { X } from "lucide-react";
import React from "react";

function DashboardAlert() {
  const { selectedAssets, setSelectedAssets } = useSelectedAssetStore();
  const { selectedPlan, setSelectedPlan } = useSelectedPlanStore();
  const { areaChartKey, yearSelected, setAreaChartKey, setYearSelected } =
    useAreaChartDataStore();
  const { setBarChartKey } = useBarChartDataStore();
  const { barChartActive, setBarChartActive } = useCalculatedAssetStore();
  const { startTime } = useSelectedMiniPlanStore();
  const handleResetAreaChart = () => {
    setAreaChartKey(areaChartKey + 1);
    setYearSelected(null);
  };
  const handleResetAssetSelected = () => {
    setSelectedAssets([]);
  };
  const handleResetPlanSelected = () => {
    setSelectedPlan(null);
  };
  const handleResetCategorySelected = () => {
    setBarChartKey(areaChartKey + 1);
    setAreaChartKey(areaChartKey + 1);
    setBarChartActive(false);
  };
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex justify-center space-x-2">
      {yearSelected && (
        <div className="flex items-center px-3 py-1 rounded-md text-sm bg-muted text-muted-foreground">
          <span>Assets from year - {yearSelected + currentYear}</span>
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
              onClick={handleResetAssetSelected}
              className="h-4 w-4 ml-1 cursor-pointer hover:text-primary"
            />
          )}
        </div>
      )}
      {selectedPlan && (
        <div className="flex items-center px-3 py-1 rounded-md text-sm bg-muted text-muted-foreground">
          <span>Scenario selected</span>
          {!startTime && (
            <X
              onClick={handleResetPlanSelected}
              className="h-4 w-4 ml-1 cursor-pointer hover:text-primary"
            />
          )}
        </div>
      )}
      {barChartActive && (
        <div className="flex items-center px-3 py-1 rounded-md text-sm bg-muted text-muted-foreground">
          <span>Category selected</span>
          {!startTime && (
            <X
              onClick={handleResetCategorySelected}
              className="h-4 w-4 ml-1 cursor-pointer hover:text-primary"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardAlert;
