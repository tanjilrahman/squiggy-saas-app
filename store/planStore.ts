import {
  Plan,
  Action,
  ActionAsset,
} from "@/app/dashboard/tables/plans/data/schema";
import { create } from "zustand";

type PlanExpandedState = {
  expanded: string | null;
  isEditable: boolean;
  setExpanded: (id: string | null) => void;
  setIsEditable: (boolean: boolean) => void;
};

export const usePlanExpandedState = create<PlanExpandedState>((set) => ({
  expanded: null,
  isEditable: false,
  setExpanded: (id) => set({ expanded: id }),
  setIsEditable: (boolean) => set({ isEditable: boolean }),
}));

type SelectedPlanStore = {
  selectedPlan: Plan | null;
  setSelectedPlan: (plan: Plan | null) => void;
};

export const useSelectedPlanStore = create<SelectedPlanStore>((set) => ({
  selectedPlan: null,
  setSelectedPlan: (selectedPlan) => set({ selectedPlan }),
}));

type SelectedMiniPlanStore = {
  startTime: number | null;
  setStartTime: (number: number | null) => void;
};

export const useSelectedMiniPlanStore = create<SelectedMiniPlanStore>(
  (set) => ({
    startTime: null,
    setStartTime: (startTime) => set({ startTime }),
  })
);

type PlanStore = {
  plans: Plan[];
  setPlans: (plans: Plan[]) => void;

  addPlan: (newPlan: Plan) => void;
  addAction: (planId: string, newAction: Action) => void;

  removePlan: (planId: string) => void;
  removeAction: (planId: string, actionId: string) => void;

  updatePlanName: (planId: string, newName: string) => void;
  updatePlanInflation: (planId: string, newInflation: number) => void;
  updatePlanInflationAdvanced: (
    planId: string,
    newInflationAdvanced: number[]
  ) => void;
  updatePlanInflationMode: (
    planId: string,
    newInflationMode: "simple" | "advanced"
  ) => void;
  updatePlanNote: (planId: string, newNote: string) => void;
  updatePlanStatus: (planId: string, newStatus: string) => void;

  updateActionName: (planId: string, actionId: string, newName: string) => void;
  updateActionTime: (planId: string, actionId: string, newTime: number) => void;
  updateActionAssetIn: (
    planId: string,
    actionId: string,
    newAssetIn: ActionAsset
  ) => void;
  updateActionAssetOut: (
    planId: string,
    actionId: string,
    newAssetOut: ActionAsset
  ) => void;
  removeActionAssetInId: (planId: string, actionId: string, id: string) => void;
  removeActionAssetOutId: (planId: string, actionId: string) => void;
  updateActionValue: (
    planId: string,
    actionId: string,
    newValue: number
  ) => void;
  updateActionStatus: (
    planId: string,
    actionId: string,
    newStatus: string
  ) => void;
};

// Define the Zustand store
export const usePlanStore = create<PlanStore>((set) => ({
  plans: [],

  setPlans: (plans) => set({ plans }),

  addPlan: (newPlan) => {
    set((state) => ({
      plans: [...state.plans, newPlan],
    }));
  },

  addAction: (planId, newAction) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: [...plan.actions, newAction],
            }
          : plan
      ),
    }));
  },

  removePlan: (planId) => {
    set((state) => ({
      plans: state.plans.filter((plan) => plan.id !== planId),
    }));
  },

  removeAction: (planId, actionId) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.filter((action) => action.id !== actionId),
            }
          : plan
      ),
    }));
  },

  updatePlanName: (planId, newName) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId ? { ...plan, name: newName } : plan
      ),
    }));
  },

  updatePlanInflation: (planId, newInflation) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId ? { ...plan, inflation: newInflation } : plan
      ),
    }));
  },

  updatePlanInflationAdvanced: (planId, newInflationAdvanced) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? { ...plan, inflation_advanced: newInflationAdvanced }
          : plan
      ),
    }));
  },

  updatePlanInflationMode: (planId, newInflationMode) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? { ...plan, inflation_mode: newInflationMode }
          : plan
      ),
    }));
  },

  updatePlanNote: (planId, newNote) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId ? { ...plan, note: newNote } : plan
      ),
    }));
  },

  updatePlanStatus: (planId, newStatus) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId ? { ...plan, status: newStatus } : plan
      ),
    }));
  },

  updateActionName: (planId, actionId, newName) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.map((action) =>
                action.id === actionId ? { ...action, name: newName } : action
              ),
            }
          : plan
      ),
    }));
  },

  updateActionTime: (planId, actionId, newTime) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.map((action) =>
                action.id === actionId ? { ...action, time: newTime } : action
              ),
            }
          : plan
      ),
    }));
  },

  updateActionAssetIn: (planId, actionId, newAssetIn) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.map((action) =>
                action.id === actionId
                  ? { ...action, assetsIn: [...action.assetsIn, newAssetIn] }
                  : action
              ),
            }
          : plan
      ),
    }));
  },
  updateActionAssetOut: (planId, actionId, newAssetOut) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.map((action) =>
                action.id === actionId
                  ? { ...action, assetOut: newAssetOut }
                  : action
              ),
            }
          : plan
      ),
    }));
  },

  removeActionAssetInId: (planId, actionId, id) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.map((action) =>
                action.id === actionId
                  ? {
                      ...action,
                      assetsIn: action.assetsIn.filter(
                        (asset) => asset.id !== id
                      ),
                    }
                  : action
              ),
            }
          : plan
      ),
    }));
  },

  removeActionAssetOutId: (planId, actionId) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.map((action) =>
                action.id === actionId
                  ? {
                      ...action,
                      assetOut: null,
                    }
                  : action
              ),
            }
          : plan
      ),
    }));
  },
  updateActionValue: (planId, actionId, newValue) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.map((action) =>
                action.id === actionId ? { ...action, value: newValue } : action
              ),
            }
          : plan
      ),
    }));
  },

  updateActionStatus: (planId, actionId, newStatus) => {
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              actions: plan.actions.map((action) =>
                action.id === actionId
                  ? { ...action, status: newStatus }
                  : action
              ),
            }
          : plan
      ),
    }));
  },
}));
