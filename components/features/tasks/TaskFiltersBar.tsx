"use client";

import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import type { TaskStatus } from "@/types/tasks";
import useEmployees from "@/hooks/useEmployees";
import useDepartments from "@/hooks/useDepartments";
import useProjects from "@/hooks/useProjects";
import DatePicker from "react-datepicker";

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface TaskFilters {
  date?: string;
  employee?: string;
  department?: string;
  status?: TaskStatus;
  project?: string;
  limit?: number;
}

interface Props {
  filters: TaskFilters;
  setFilters: Dispatch<SetStateAction<TaskFilters>>;
}

// ─── Filter Dropdown ────────────────────────────────────────────────────────────

function FilterDropdown({
  label,
  icon,
  options,
  value,
  onChange,
  disabled = false,
  placeholder = "All",
  hidePlaceholder = false,
}: {
  label: string;
  icon: React.ReactNode;
  options: { id: string; name: string }[];
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  hidePlaceholder?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          disabled
            ? "opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
            : value
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
              : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        {icon}
        <span className="truncate max-w-24">{selected?.name || label}</span>
        {value && !hidePlaceholder && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange(undefined);
            }}
            className="ml-1 hover:text-red-400 cursor-pointer"
          >
            ×
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden min-w-48 max-h-60 overflow-y-auto py-1">
          {!hidePlaceholder && (
            <button
              onClick={() => {
                onChange(undefined);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                !value ? "font-semibold text-red-500" : ""
              }`}
            >
              {placeholder}
            </button>
          )}
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                value === option.id ? "font-semibold text-red-500" : ""
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Status Options ─────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { id: string; name: string }[] = [
  { id: "pending", name: "Pending" },
  { id: "in progress", name: "In Progress" },
  { id: "postponed", name: "Postponed" },
  { id: "completed", name: "Completed" },
];

const LIMIT_OPTIONS: { id: string; name: string }[] = [
  { id: "10", name: "10 Per Page" },
  { id: "20", name: "20 Per Page" },
  { id: "50", name: "50 Per Page" },
  { id: "100", name: "100 Per Page" },
];

// ─── SVG Icons ──────────────────────────────────────────────────────────────────

const CalendarIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
    <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const UserIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DeptIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
    <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
    <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
    <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
  </svg>
);

const FilterIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const FolderIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const ListIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// ─── Date Trigger ───────────────────────────────────────────────────────────────

import { forwardRef } from "react";

interface DateTriggerProps {
  value?: string;
  onClick?: () => void;
  onClear?: () => void;
}

const DateTrigger = forwardRef<HTMLButtonElement, DateTriggerProps>(
  ({ value, onClick, onClear }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        value
          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      {CalendarIcon}
      <span>{value || "Date Range"}</span>
      {value && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClear?.();
          }}
          className="ml-1 hover:text-red-400 cursor-pointer"
        >
          ×
        </span>
      )}
    </button>
  ),
);
DateTrigger.displayName = "DateTrigger";

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function TaskFiltersBar({ filters, setFilters }: Props) {
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const { projects } = useProjects();

  const employeeOptions = employees?.map((employee) => ({
    id: employee.id,
    name: employee.user.name,
  })) ?? [];
  const departmentOptions =
    departments?.map((d: any) => ({ id: d._id || d.id, name: d.name })) ?? [];
  const projectOptions =
    projects?.map((p: any) => ({ id: p._id || p.id, name: p.name })) ?? [];

  const selectedDate = filters.date ? new Date(filters.date) : null;

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl p-4">
      {/* Date Filter */}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          if (date) {
            const formatted = date.toISOString().split("T")[0];
            setFilters((prev) => ({ ...prev, date: formatted }));
          } else {
            setFilters((prev) => {
              const next = { ...prev };
              delete next.date;
              return next;
            });
          }
        }}
        isClearable
        portalId="root-portal"
        customInput={
          <DateTrigger
            onClear={() =>
              setFilters((prev) => {
                const next = { ...prev };
                delete next.date;
                return next;
              })
            }
          />
        }
        popperPlacement="bottom-start"
      />

      {/* Employee */}
      <FilterDropdown
        label="Employee"
        icon={UserIcon}
        options={employeeOptions}
        value={filters.employee}
        onChange={(v) =>
          setFilters((prev) => ({
            ...prev,
            employee: v,
            // Clear department when employee is selected (Filter Priority Rule)
            department: v ? undefined : prev.department,
          }))
        }
      />

      {/* Department — disabled when employee is selected */}
      <FilterDropdown
        label="Department"
        icon={DeptIcon}
        options={departmentOptions}
        value={filters.department}
        onChange={(v) => setFilters((prev) => ({ ...prev, department: v }))}
        disabled={!!filters.employee}
      />

      {/* Status */}
      <FilterDropdown
        label="Status"
        icon={FilterIcon}
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(v) =>
          setFilters((prev) => ({
            ...prev,
            status: v as TaskStatus | undefined,
          }))
        }
      />

      {/* Project */}
      <FilterDropdown
        label="Project"
        icon={FolderIcon}
        options={projectOptions}
        value={filters.project}
        onChange={(v) => setFilters((prev) => ({ ...prev, project: v }))}
      />

      {/* Limit */}
      <FilterDropdown
        label="10 Per Page"
        icon={ListIcon}
        options={LIMIT_OPTIONS}
        value={filters.limit?.toString() || "10"}
        onChange={(v) => setFilters((prev) => ({ ...prev, limit: v ? parseInt(v, 10) : undefined }))}
        hidePlaceholder={true}
      />
    </div>
  );
}
