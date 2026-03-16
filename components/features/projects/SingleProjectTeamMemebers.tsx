type EmploymentType = "full_time" | "part_time" | "freelancer";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  employmentType: EmploymentType;
  compensation: number;
  currency: string;
  assignedAt: string;
}

interface TeamMembersProps {
  employees: Employee[];
}

const EMPLOYMENT_STYLES: Record<
  EmploymentType,
  { badge: string; label: string }
> = {
  full_time: {
    badge: "bg-blue-100 text-blue-700 ring-blue-300",
    label: "Full Time",
  },
  part_time: {
    badge: "bg-purple-100 text-purple-700 ring-purple-300",
    label: "Part Time",
  },
  freelancer: {
    badge: "bg-orange-100 text-orange-700 ring-orange-300",
    label: "Freelancer",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TeamMembers({ employees }: TeamMembersProps) {
  return (
    <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4 gap-4 flex flex-col items-start">
      {/* Header */}
      <h4 className="font-poppins font-medium text-xl">
        Team Members{" "}
        <span className="text-gray-400 text-sm font-normal">
          ({employees?.length})
        </span>
      </h4>

      {/* Members list */}
      <div className="w-full flex flex-col gap-2">
        {employees?.map((emp) => {
          const empStyles = EMPLOYMENT_STYLES[emp.employmentType];
          return (
            <div
              key={emp.id}
              className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-xl px-4 py-3"
            >
              {/* Left: avatar + name + position */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {getInitials(emp?.name)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm capitalize">
                    {emp?.name}
                  </span>
                  <span className="text-gray-400 text-xs capitalize">
                    {emp?.position}
                  </span>
                </div>
              </div>

              {/* Right: compensation + employment type */}
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-sm">
                  {formatCurrency(emp?.compensation, emp?.currency)}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ring-1 ${empStyles.badge}`}
                >
                  {empStyles.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
