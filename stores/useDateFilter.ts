import { create } from "zustand";

interface DateFilterState {
  startDate: Date | null;
  endDate: Date | null;
  setRange: (start: Date | null, end: Date | null) => void;
}

// Logic to get current month bounds
const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
// Note: day "0" of the next month is the last day of the current month

export const useDateFilter = create<DateFilterState>((set) => ({
  startDate: firstDay,
  endDate: lastDay,
  setRange: (start, end) => set({ startDate: start, endDate: end }),
}));
