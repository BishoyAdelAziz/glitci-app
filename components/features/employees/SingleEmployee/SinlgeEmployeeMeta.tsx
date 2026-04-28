import { Department } from "@/types/employee";
import { Employee } from "@/types/employee";
import {
  CalendarRangeIcon,
  HousePlusIcon,
  Phone,
  ToolboxIcon,
  ToolCaseIcon,
  User2,
  WrenchIcon,
} from "lucide-react";
interface ProjectMetaProps {
  EmployeeType?: string;
  startDate?: string;
  endDate?: string;
  DepartmentName?: Department["name"];
  industry?: string;
  phones?: string;
  skills?: Employee["skills"];
}

type Priority = "normal" | "medium" | "high";

const PRIORITY_STYLES: Record<
  Priority,
  { badge: string; label: string; activeColor: string; activeCount: number }
> = {
  normal: {
    badge: "bg-green-100 text-green-700 ring-green-300",
    label: "Normal",
    activeColor: "bg-green-500",
    activeCount: 1,
  },
  medium: {
    badge: "bg-yellow-100 text-yellow-700 ring-yellow-300",
    label: "Medium",
    activeColor: "bg-yellow-500",
    activeCount: 2,
  },
  high: {
    badge: "bg-red-100 text-red-700 ring-red-300",
    label: "High",
    activeColor: "bg-red-500",
    activeCount: 3,
  },
};

function formatDate(dateStr: string | undefined): string {
  return new Date(dateStr ?? "").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EmployeeMeta({
  EmployeeType,
  startDate,
  endDate,
  phones,
  DepartmentName,
  skills,
}: ProjectMetaProps) {
  return (
    <div className="flex items-center w-full justify-start flex-wrap gap-3">
      {/* Created By */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <div className="inline-flex items-center justify-center gap-1">
          <User2 className="size-4" />
          <p className="text-gray-500">Employee Type:</p>
        </div>

        <p className="text-sm font-normal text-gray-500">
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {EmployeeType}
          </span>
        </p>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <div className="inline-flex items-center justify-center gap-1">
          <CalendarRangeIcon className="size-4" />
          <span className="text-gray-400">Created At: </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {formatDate(startDate)}
            </span>
          </span>
        </div>
      </div>

      {/* Priority */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <div className="inline-flex items-center justify-center gap-1">
          <Phone className="size-4" />
          <span className="text-gray-400">Phones: </span>
        </div>

        <span className="text-gray-500 inline-flex gap-1">
          <span className="font-semibold flex gap-2 text-gray-800 dark:text-gray-100">
            {/* {phones?.map((phone) => {
              return <p key={phone}>{phone}</p>;
            })} */}
            {phones}
          </span>
        </span>
      </div>

      {/* Team Members */}

      {/* Client */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <div className="inline-flex items-center justify-center gap-1">
          <HousePlusIcon className="size-4" />
          <p className="text-gray-500">Department:</p>
        </div>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {DepartmentName}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <div className="inline-flex items-center justify-center gap-1">
          <ToolboxIcon className="size-4" />
          <p className="text-gray-500">Skills: </p>
        </div>

        <p className="text-sm text-gray-500">
          {skills?.map((skill, idx) => (
            <span
              key={skill.id}
              className="font-semibold text-gray-800 dark:text-gray-100"
            >
              {skill.name}
              {idx < skills.length - 1 && <span> - </span>}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
