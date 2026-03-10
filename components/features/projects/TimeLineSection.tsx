import PriorityBadge from "@/components/ui/flags/PriorityFlag";

interface TimelineSectionProps {
  startDate: string;
  endDate: string;
  priority: Priority;
}

type Priority = "low" | "medium" | "high";
type ProgressStatus = "on-track" | "at-risk" | "overdue" | "completed";

const PRIORITY_STYLES: Record<
  Priority,
  { badge: string; label: string; activeColor: string; activeCount: number }
> = {
  low: {
    badge: "bg-green-100 text-green-700 ring-green-300",
    label: "Low",
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

function getProgressStatus(
  percentage: number,
  isOverdue: boolean,
): ProgressStatus {
  if (isOverdue) return "overdue";
  if (percentage >= 100) return "completed";
  if (percentage >= 75) return "at-risk";
  return "on-track";
}

const STATUS_STYLES: Record<
  ProgressStatus,
  { bar: string; text: string; badge: string }
> = {
  "on-track": {
    bar: "bg-green-500",
    text: "text-green-600",
    badge: "bg-green-100 text-green-700 ring-green-300",
  },
  "at-risk": {
    bar: "bg-yellow-500",
    text: "text-yellow-600",
    badge: "bg-yellow-100 text-yellow-700 ring-yellow-300",
  },
  overdue: {
    bar: "bg-red-500",
    text: "text-red-600",
    badge: "bg-red-100 text-red-700 ring-red-300",
  },
  completed: {
    bar: "bg-blue-500",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700 ring-blue-300",
  },
};

const STATUS_LABELS: Record<ProgressStatus, string> = {
  "on-track": "On Track",
  "at-risk": "At Risk",
  overdue: "Overdue",
  completed: "Completed",
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TimelineSection({
  startDate,
  endDate,
  priority,
}: TimelineSectionProps) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // Guard against invalid or missing dates
  if (
    !startDate ||
    !endDate ||
    isNaN(start.getTime()) ||
    isNaN(end.getTime())
  ) {
    return (
      <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4">
        <h4 className="font-poppins font-medium text-xl">Timeline</h4>
        <p className="text-gray-400 text-sm mt-2">No timeline available.</p>
      </div>
    );
  }

  const totalMs = end.getTime() - start.getTime();
  const elapsedMs = Math.min(
    Math.max(now.getTime() - start.getTime(), 0),
    totalMs,
  );
  const percentage = totalMs > 0 ? Math.round((elapsedMs / totalMs) * 100) : 0;

  const isOverdue = now > end;
  const daysLeft = Math.max(
    0,
    Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const totalDays = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
  const daysGone = Math.min(totalDays - daysLeft, totalDays);
  const status = getProgressStatus(percentage, isOverdue);
  const statusStyles = STATUS_STYLES[status];
  const priorityStyles = PRIORITY_STYLES[priority];

  return (
    <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4 gap-4 flex flex-col items-start justify-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h4 className="font-poppins font-medium text-xl">Timeline</h4>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ring-1 ${statusStyles?.badge}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {/* Date range */}
      <div className="flex items-center justify-between w-full text-sm">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Start
          </span>
          <span className="font-semibold">{formatDate(start)}</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-gray-400 text-xs">
            {daysGone} / {totalDays} days
          </span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            End
          </span>
          <span className="font-semibold">{formatDate(end)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full flex flex-col gap-1.5">
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${statusStyles.bar}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between w-full text-sm">
          <span className="text-gray-400">
            {isOverdue ? (
              <span className="text-red-500 font-medium">
                {Math.abs(daysLeft)} days overdue
              </span>
            ) : (
              <>
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  {daysLeft}
                </span>{" "}
                days remaining
              </>
            )}
          </span>
          <span className={`font-bold text-base ${statusStyles.text}`}>
            {percentage}%
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 dark:bg-gray-500" />

      {/* Priority row */}
      <div className="flex items-start max-w-14 justify-start gap-2 w-full">
        <h4 className="font-poppins  text-base">Priority</h4>
        <PriorityBadge priority={priority} />
      </div>
    </div>
  );
}
