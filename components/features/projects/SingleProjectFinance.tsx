interface ProjectEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  employmentType: "full_time" | "part_time" | "freelancer";
  compensation: number;
  currency: string;
  assignedAt: string;
}

type FinancialEmployee = Pick<ProjectEmployee, "compensation">;

interface FinancialOverviewProps {
  budget: number;
  currency: string;
  employees: FinancialEmployee[];
}

function formatCurrency(amount: number, currency: string): string {
  if (!currency) return amount.toLocaleString();
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function FinancialOverview({
  budget,
  currency,
  employees,
}: FinancialOverviewProps) {
  if (!budget || !currency || !employees) return null;
  const teamCost = employees?.reduce(
    (sum: number, emp: FinancialEmployee) => sum + emp.compensation,
    0,
  );
  const grossProfit = budget - teamCost;
  const allocationPct = Math.min(Math.round((teamCost / budget) * 100), 100);
  const isProfit = grossProfit >= 0;

  return (
    <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4 gap-4 flex flex-col items-start">
      <h4 className="font-poppins font-medium text-xl">Financial Overview</h4>

      <div className="flex items-stretch gap-3 w-full">
        <div className="flex-1 bg-white dark:bg-gray-700 rounded-xl p-3 flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Budget
          </span>
          <span className="font-bold text-lg">
            {formatCurrency(budget, currency)}
          </span>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-700 rounded-xl p-3 flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Team Cost
          </span>
          <span className="font-bold text-lg">
            {formatCurrency(teamCost, currency)}
          </span>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-700 rounded-xl p-3 flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Gross Profit
          </span>
          <span
            className={`font-bold text-lg ${isProfit ? "text-green-600" : "text-red-500"}`}
          >
            {isProfit ? "+" : ""}
            {formatCurrency(grossProfit, currency)}
          </span>
          <span
            className={`text-xs font-medium ${isProfit ? "text-green-500" : "text-red-400"}`}
          >
            {isProfit ? "▲ Profitable" : "▼ Over budget"}
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Budget Allocation
          </span>
          <span
            className={`font-bold text-sm ${
              allocationPct >= 100
                ? "text-red-500"
                : allocationPct >= 75
                  ? "text-yellow-600"
                  : "text-green-600"
            }`}
          >
            {allocationPct}%
          </span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              allocationPct >= 100
                ? "bg-red-500"
                : allocationPct >= 75
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${allocationPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatCurrency(teamCost, currency)} allocated</span>
          <span>{formatCurrency(budget - teamCost, currency)} remaining</span>
        </div>
      </div>
    </div>
  );
}
