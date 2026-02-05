// store/useDateFilter.ts
import { create } from "zustand";

interface DateFilterState {
  startDate: Date | null;
  endDate: Date | null;
  setRange: (start: Date | null, end: Date | null) => void;
}

export const useDateFilter = create<DateFilterState>((set) => ({
  // Default values (e.g., start of year to today)
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-01-24"),
  setRange: (start, end) => set({ startDate: start, endDate: end }),
}));
