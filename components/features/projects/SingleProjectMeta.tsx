interface ProjectMetaProps {
  createdBy: string;
  startDate: string;
  endDate: string;
  priority: Priority;
  teamMembersCount: number;
  clientName: string;
}

type Priority = "low" | "medium" | "high";

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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProjectMeta({
  createdBy,
  startDate,
  endDate,
  priority,
  teamMembersCount,
  clientName,
}: ProjectMetaProps) {
  const p = PRIORITY_STYLES[priority];

  return (
    <div className="flex items-center w-full justify-start flex-wrap gap-3">
      {/* Created By */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <svg
          height="14px"
          width="14px"
          viewBox="0 0 512 512"
          fill="#99a1af"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M256,265.308c73.252,0,132.644-59.391,132.644-132.654C388.644,59.412,329.252,0,256,0c-73.262,0-132.643,59.412-132.643,132.654C123.357,205.917,182.738,265.308,256,265.308z" />
          <path d="M425.874,393.104c-5.922-35.474-36-84.509-57.552-107.465c-5.829-6.212-15.948-3.628-19.504-1.427c-27.04,16.672-58.782,26.399-92.819,26.399c-34.036,0-65.778-9.727-92.818-26.399c-3.555-2.201-13.675-4.785-19.505,1.427c-21.55,22.956-51.628,71.991-57.551,107.465C71.573,480.444,164.877,512,256,512C347.123,512,440.427,480.444,425.874,393.104z" />
        </svg>
        <p className="text-sm font-normal text-gray-500">
          Created by{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {createdBy}
          </span>
        </p>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <svg
          fill="currentColor"
          width="14px"
          height="14px"
          viewBox="0 0 24 24"
          className="text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3,22H21a1,1,0,0,0,1-1V6a1,1,0,0,0-1-1H17V3a1,1,0,0,0-2,0V5H9V3A1,1,0,0,0,7,3V5H3A1,1,0,0,0,2,6V21A1,1,0,0,0,3,22ZM4,7H20v3H4Zm0,5H20v8H4Z" />
        </svg>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">
            <span className="text-gray-400">From </span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {formatDate(startDate)}
            </span>
          </span>
          <span className="text-gray-300">→</span>
          <span className="text-gray-500">
            <span className="text-gray-400">To </span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {formatDate(endDate)}
            </span>
          </span>
        </div>
      </div>

      {/* Priority */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-2 h-2 rounded-full ${level <= p?.activeCount ? p?.activeColor : "bg-gray-300 dark:bg-gray-500"}`}
            />
          ))}
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ring-1  ${p?.badge}`}
        >
          {p?.label}
        </span>
      </div>

      {/* Team Members */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <svg
          fill="currentColor"
          width="14px"
          height="14px"
          viewBox="0 0 24 24"
          className="text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16,11c1.66,0,2.99-1.34,2.99-3S17.66,5,16,5c-1.66,0-3,1.34-3,3S14.34,11,16,11z M8,11c1.66,0,2.99-1.34,2.99-3S9.66,5,8,5C6.34,5,5,6.34,5,8S6.34,11,8,11z M8,13c-2.33,0-7,1.17-7,3.5V19h14v-2.5C15,14.17,10.33,13,8,13z M16,13c-0.29,0-0.62,0.02-0.97,0.05c1.16,0.84,1.97,1.97,1.97,3.45V19h6v-2.5C23,14.17,18.33,13,16,13z" />
        </svg>
        <p className="text-sm text-gray-500">
          Team{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {teamMembersCount}
          </span>
        </p>
      </div>

      {/* Client */}
      <div className="flex items-center gap-2 bg-[#f2f0f0] dark:bg-gray-700 rounded-xl px-3 py-2">
        <svg
          fill="currentColor"
          width="14px"
          height="14px"
          viewBox="0 0 24 24"
          className="text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,5c1.66,0,3,1.34,3,3s-1.34,3-3,3S9,9.66,9,8S10.34,5,12,5z M12,19.2c-2.5,0-4.71-1.28-6-3.22c0.03-1.99,4-3.08,6-3.08c1.99,0,5.97,1.09,6,3.08C16.71,17.92,14.5,19.2,12,19.2z" />
        </svg>
        <p className="text-sm text-gray-500">
          Client{" "}
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {clientName}
          </span>
        </p>
      </div>
    </div>
  );
}
