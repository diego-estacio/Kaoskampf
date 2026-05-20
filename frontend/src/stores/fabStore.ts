import { create } from "zustand";

interface FabState {
  showIaButton: boolean;
  setShowIaButton: (show: boolean) => void;
}

export const useFabStore = create<FabState>((set) => ({
  showIaButton: false,
  setShowIaButton: (show) => set({ showIaButton: show }),
}));
