interface CurrencyAmount {
  currency: string;
  amount: number;
}

interface Financials {
  budget: number;
  budgetCurrency: string;
  totalEmployeesCompensation: CurrencyAmount[];
  employeesCount: number;
  moneyCollected: CurrencyAmount[];
  totalExpenses: CurrencyAmount[];
  paidToEmployees: CurrencyAmount[];
  otherExpenses: CurrencyAmount[];
  clientBalanceDue: CurrencyAmount[];
  employeeBalanceDue: CurrencyAmount[];
}

interface FinancialOverviewProps {
  financials?: Financials;
}

/* ───── helpers ───── */

function formatCurrency(amount: number, currency: string): string {
  if (!currency) return amount.toLocaleString();
  try {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

function pick(arr: CurrencyAmount[] | undefined, fallbackCurrency: string) {
  if (!arr || arr.length === 0) return { amount: 0, currency: fallbackCurrency };
  return arr[0];
}

/* ───── P&L line item ───── */

function LineItem({
  label,
  amount,
  currency,
  isBold,
  isTotal,
  colorClass,
  indent,
}: {
  label: string;
  amount: number;
  currency: string;
  isBold?: boolean;
  isTotal?: boolean;
  colorClass?: string;
  indent?: boolean;
}) {
  const textWeight = isBold || isTotal ? "font-bold" : "font-medium";
  const textSize = isTotal ? "text-base" : "text-sm";
  const color = colorClass ?? "";

  return (
    <div
      className={`flex items-center justify-between w-full py-1.5 ${
        isTotal ? "border-t border-gray-300 dark:border-gray-500 pt-3 mt-1" : ""
      }`}
    >
      <span
        className={`${textSize} ${indent ? "pl-4" : ""} text-gray-500 dark:text-gray-300`}
      >
        {label}
      </span>
      <span className={`${textSize} ${textWeight} ${color} tabular-nums`}>
        {formatCurrency(amount, currency)}
      </span>
    </div>
  );
}

/* ───── main component ───── */

export default function FinancialOverview({
  financials,
}: FinancialOverviewProps) {
  if (!financials) return null;

  const cur = financials.budgetCurrency ?? "EGP";
  const budget = financials.budget ?? 0;

  const employeesCost = pick(financials.totalEmployeesCompensation, cur);
  const otherExp = pick(financials.otherExpenses, cur);
  const collected = pick(financials.moneyCollected, cur);
  const totalExpenses = pick(financials.totalExpenses, cur);

  // Accounting calculations
  const grossProfit = budget - employeesCost.amount;
  const netProfit = grossProfit - otherExp.amount;
  const netCashFlow = collected.amount - totalExpenses.amount;

  const isGrossPositive = grossProfit >= 0;
  const isNetPositive = netProfit >= 0;
  const isCashPositive = netCashFlow >= 0;

  // Budget utilisation bar
  const utilPct =
    budget > 0 ? Math.min(Math.round((totalExpenses.amount / budget) * 100), 100) : 0;
  const barColor =
    utilPct >= 100 ? "bg-red-500" : utilPct >= 75 ? "bg-yellow-500" : "bg-green-500";
  const pctColor =
    utilPct >= 100
      ? "text-red-500"
      : utilPct >= 75
        ? "text-yellow-600"
        : "text-green-600";

  return (
    <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-5 flex flex-col gap-1 items-start">
      <h4 className="font-poppins font-medium text-xl mb-2">
        Financial Overview
      </h4>

      {/* ── P&L Statement ── */}
      <LineItem label="Budget (Revenue)" amount={budget} currency={cur} isBold />

      <LineItem
        label="(-) Employees Cost"
        amount={-employeesCost.amount}
        currency={cur}
        indent
      />

      <LineItem
        label="Gross Profit"
        amount={grossProfit}
        currency={cur}
        isTotal
        colorClass={isGrossPositive ? "text-green-600" : "text-red-500"}
      />

      <LineItem
        label="(-) Other Expenses"
        amount={-otherExp.amount}
        currency={cur}
        indent
      />

      <div className="flex items-center justify-between w-full border-t border-gray-300 dark:border-gray-500 pt-3 mt-1">
        <div className="flex items-center gap-2">
          <span className="text-base text-gray-500 dark:text-gray-300">Net Profit</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isNetPositive
                ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                : "bg-red-100 text-red-700 ring-1 ring-red-300"
            }`}
          >
            {isNetPositive ? "Profitable" : "Not Profitable"}
          </span>
        </div>
        <span
          className={`text-base font-bold tabular-nums ${
            isNetPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isNetPositive ? "+" : ""}
          {formatCurrency(netProfit, cur)}
        </span>
      </div>

      {/* ── Budget Utilisation ── */}
      <div className="w-full mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Budget Utilisation
          </span>
          <span className={`font-bold text-sm ${pctColor}`}>{utilPct}%</span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${utilPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{formatCurrency(totalExpenses.amount, cur)} spent</span>
          <span>
            {formatCurrency(Math.max(budget - totalExpenses.amount, 0), cur)}{" "}
            remaining
          </span>
        </div>
      </div>

      {/* ── Net Cash Flow ── */}
      <div className="w-full h-px bg-gray-300 dark:bg-gray-500 mt-3" />
      <div className="flex items-center justify-between w-full pt-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Net Cash Flow
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isCashPositive
                ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                : "bg-red-100 text-red-700 ring-1 ring-red-300"
            }`}
          >
            {isCashPositive ? "Positive" : "Negative"}
          </span>
        </div>
        <span
          className={`font-bold text-lg tabular-nums ${
            isCashPositive ? "text-green-600" : "text-red-500"
          }`}
        >
          {isCashPositive ? "+" : ""}
          {formatCurrency(netCashFlow, cur)}
        </span>
      </div>
    </div>
  );
}
