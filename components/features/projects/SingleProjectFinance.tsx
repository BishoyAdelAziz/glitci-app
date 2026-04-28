import React from "react";

interface CurrencyAmount {
  currency: string;
  amount: number;
}

interface Financials {
  budget: number;
  budgetCurrency: string;
  totalEmployeesCompensation: number | CurrencyAmount[];
  employeesCount: number;
  moneyCollected: number | CurrencyAmount[];
  totalExpenses: number | CurrencyAmount[];
  paidToEmployees: number | CurrencyAmount[];
  otherExpenses: number | CurrencyAmount[];
  otherExpensesInProjectCurrency?: number;
  clientBalanceDue: number | CurrencyAmount[];
  employeeBalanceDue: number | CurrencyAmount[];
}

interface FinancialOverviewProps {
  financials?: Financials;
  employeesBreakdown?: any;
  expensesBreakdown?: any;
  clientPaymentHistory?: any;
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

/* ───── P&L line item ───── */

function LineItem({
  label,
  value,
  currency, // fallback currency
  isNegative,
  isBold,
  isTotal,
  colorClass,
  indent,
  children,
}: {
  label: string;
  value?: number | CurrencyAmount[];
  currency?: string;
  isNegative?: boolean;
  isBold?: boolean;
  isTotal?: boolean;
  colorClass?: string;
  indent?: boolean;
  children?: React.ReactNode;
}) {
  const textWeight = isBold || isTotal ? "font-bold" : "font-medium";
  const textSize = isTotal ? "text-base" : "text-sm";
  const color = colorClass ?? "";

  const containerClass = `flex items-center justify-between w-full py-1.5 ${
    isTotal ? "border-t border-gray-300 dark:border-gray-500 pt-3 mt-1" : ""
  }`;

  const displayValue = (() => {
    if (value === undefined || value === null) return formatCurrency(0, currency || "");
    if (typeof value === "number") {
      const v = isNegative ? -value : value;
      return formatCurrency(v, currency || "");
    }
    if (Array.isArray(value) && value.length > 0) {
      return value
        .map((v) => {
          const raw = isNegative ? -v.amount : v.amount;
          return formatCurrency(raw, v.currency || currency || "");
        })
        .join(" + ");
    }
    return formatCurrency(0, currency || "");
  })();

  const innerContent = (
    <>
      <div className="flex items-center gap-1.5">
        {children && (
          <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        <span
          className={`${textSize} ${!children && indent ? "pl-5.5" : ""} text-gray-500 dark:text-gray-300`}
        >
          {label}
        </span>
      </div>
      <span className={`${textSize} ${textWeight} ${color} tabular-nums text-right`}>
        {displayValue}
      </span>
    </>
  );

  if (children) {
    return (
      <details className="w-full group">
        <summary className={`${containerClass} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          {innerContent}
        </summary>
        <div className="pl-1.5 pb-2 w-full animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      </details>
    );
  }

  return (
    <div className={containerClass}>
      {innerContent}
    </div>
  );
}

/* ───── main component ───── */

export default function FinancialOverview({
  financials,
  employeesBreakdown,
  expensesBreakdown,
  clientPaymentHistory,
}: FinancialOverviewProps) {
  if (!financials) return null;

  const cur = financials?.budgetCurrency ?? "EGP";
  const budget = financials?.budget ?? 0;

  // Use raw values or fallback to picking for Math
  const empCostCalc = typeof financials?.paidToEmployees === "number" 
    ? financials.paidToEmployees 
    : Array.isArray(financials?.paidToEmployees) 
      ? financials?.paidToEmployees?.[0]?.amount 
      : 0;

  const otherExpCalc = typeof financials?.otherExpensesInProjectCurrency === "number"
    ? financials.otherExpensesInProjectCurrency
    : typeof financials?.otherExpenses === "number"
      ? financials.otherExpenses
      : Array.isArray(financials?.otherExpenses)
        ? financials?.otherExpenses?.[0]?.amount 
        : 0;

  const collectedCalc = typeof financials?.moneyCollected === "number"
    ? financials.moneyCollected
    : Array.isArray(financials?.moneyCollected)
      ? financials?.moneyCollected?.[0]?.amount
      : 0;

  const totalExpCalc = typeof financials?.totalExpenses === "number"
    ? financials.totalExpenses
    : Array.isArray(financials?.totalExpenses)
      ? financials?.totalExpenses?.[0]?.amount
      : 0;

  // Accounting calculations
  const grossProfit = budget - (empCostCalc ?? 0);
  const netProfit = grossProfit - (otherExpCalc ?? 0);
  const netCashFlow = (collectedCalc ?? 0) - (totalExpCalc ?? 0);

  const isGrossPositive = grossProfit >= 0;
  const isNetPositive = netProfit >= 0;
  const isCashPositive = netCashFlow >= 0;

  // Budget utilisation bar
  const utilPct =
    budget > 0 ? Math?.min(Math.round(((totalExpCalc ?? 0) / budget) * 100), 100) : 0;
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
      <LineItem label="Budget (Revenue)" value={budget} currency={cur} isBold />

      <LineItem
        label="Client Payments (Collected)"
        value={collectedCalc}
        currency={cur}
        indent
      >
        {clientPaymentHistory?.payments && clientPaymentHistory.payments.length > 0 ? (
          <div className="pl-4 pt-2 pb-1 space-y-3 border-l-2 border-gray-200 dark:border-gray-500 ml-1.5 my-1">
            {clientPaymentHistory.payments.map((p: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{p.description || "Client Payment"}</span>
                  <span className="text-[10px] text-gray-400 capitalize">{new Date(p.date).toLocaleDateString("en-GB")} • {p.paymentMethod}</span>
                </div>
                <span className="tabular-nums font-medium text-gray-600 dark:text-gray-300 text-right">
                  {formatCurrency(p.amount, p.currency || cur)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic px-4 my-2">No client payments tracked yet.</p>
        )}
      </LineItem>

      <LineItem
        label="(-) Employees Cost"
        value={financials?.paidToEmployees}
        currency={cur}
        isNegative
        indent
      >
        {employeesBreakdown?.breakdown && employeesBreakdown.breakdown.length > 0 ? (
          <div className="pl-4 pt-2 pb-1 space-y-3 border-l-2 border-gray-200 dark:border-gray-500 ml-1.5 my-1">
            {employeesBreakdown.breakdown.map((empData: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      {empData.employee?.name}
                      <span className="text-[9px] bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300 px-1.5 py-0.5 rounded font-semibold tracking-wide">
                        Total Budget
                      </span>
                    </span>
                    <span className="text-xs text-gray-400 capitalize mt-0.5">
                      {empData.employee?.position?.replace(/_/g, " ")} • {empData.employee?.employmentType?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex flex-col items-end pt-0.5">
                    <span className="text-sm font-semibold tabular-nums text-gray-700 dark:text-gray-200 text-right">
                      {formatCurrency(empData.compensation, empData.currency || cur)}
                    </span>
                  </div>
                </div>
                
                {/* Payments */}
                {empData.payments && empData.payments.length > 0 && (
                  <details className="group/payment mt-1">
                    <summary className="text-[11px] text-blue-500 hover:text-blue-600 dark:text-blue-400 cursor-pointer list-none flex items-center gap-1 [&::-webkit-details-marker]:hidden font-medium">
                      <svg className="w-3 h-3 transition-transform group-open/payment:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                      {empData.paymentCount} payments ({formatCurrency(empData.paid?.[0]?.amount || 0, empData.paid?.[0]?.currency || cur)} paid)
                    </summary>
                    <div className="pl-4 mt-2 space-y-2">
                       {empData.payments.map((p: any, i: number) => (
                        <div key={i} className="flex justify-between items-start text-xs">
                          <div className="flex flex-col">
                            <span className="text-gray-600 dark:text-gray-300 capitalize font-medium">{p.description || p.category?.replace(/_/g, " ")}</span>
                            <span className="text-gray-400 text-[10px]">
                              {new Date(p.date).toLocaleDateString("en-GB")} • {p.paymentMethod}
                            </span>
                          </div>
                          <span className="tabular-nums text-gray-600 dark:text-gray-300 text-right">
                            {formatCurrency(p.amount, p.currency || cur)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic px-4 my-2">No employee costs tracked yet.</p>
        )}
      </LineItem>

      <LineItem
        label="Gross Profit"
        value={grossProfit}
        currency={cur}
        isTotal
        colorClass={isGrossPositive ? "text-green-600" : "text-red-500"}
      />

      <LineItem
        label="(-) Other Expenses"
        value={financials?.otherExpensesInProjectCurrency ?? financials?.otherExpenses}
        currency={cur}
        isNegative
        indent
      >
        {expensesBreakdown?.expenses && expensesBreakdown.expenses.length > 0 ? (
          <div className="pl-4 pt-2 pb-1 space-y-3 border-l-2 border-gray-200 dark:border-gray-500 ml-1.5 my-1">
            {expensesBreakdown.expenses.map((exp: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{exp.description || exp.category?.replace(/_/g, " ")}</span>
                  <span className="text-[10px] text-gray-400 capitalize">{new Date(exp.date).toLocaleDateString("en-GB")} • {exp.paymentMethod}</span>
                </div>
                <span className="tabular-nums font-medium text-gray-600 dark:text-gray-300 text-right">
                  {formatCurrency(exp.amount, exp.currency || cur)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic px-4 my-2">No other expenses tracked yet.</p>
        )}
      </LineItem>

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
          <span>{formatCurrency(totalExpCalc ?? 0, cur)} spent</span>
          <span>
            {formatCurrency(Math.max(budget - (totalExpCalc ?? 0), 0), cur)}{" "}
            remaining
          </span>
        </div>
      </div>

      {/* ── Net Cash Flow ── */}
      <div className="w-full h-px bg-gray-300 dark:bg-gray-500 mt-3" />
      <div className="w-full mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs uppercase tracking-wide">
            Net Cash Flow
          </span>
          <span className={`font-bold text-sm ${
            netCashFlow > 0 ? "text-green-600" : netCashFlow < 0 ? "text-red-500" : "text-yellow-600"
          }`}>
            {netCashFlow > 0 ? "+" : ""}
            {formatCurrency(netCashFlow, cur)}
          </span>
        </div>

        <div className="w-full flex h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <div 
            className={`transition-all duration-700 ${netCashFlow > 0 ? 'bg-green-500' : netCashFlow < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}
            style={{ width: `${((collectedCalc ?? 0) + (totalExpCalc ?? 0)) > 0 ? ((collectedCalc ?? 0) / ((collectedCalc ?? 0) + (totalExpCalc ?? 0))) * 100 : 50}%` }}
            title={`Client Payments: ${formatCurrency(collectedCalc ?? 0, cur)}`}
          />
          <div 
            className="bg-gray-400 dark:bg-gray-500 transition-all duration-700 opacity-60"
            style={{ width: `${((collectedCalc ?? 0) + (totalExpCalc ?? 0)) > 0 ? ((totalExpCalc ?? 0) / ((collectedCalc ?? 0) + (totalExpCalc ?? 0))) * 100 : 50}%` }}
            title={`Total Expenses: ${formatCurrency(totalExpCalc ?? 0, cur)}`}
          />
        </div>

        <div className="flex items-start justify-between text-xs text-gray-400 mt-1">
          <details className="group w-1/2 pr-2">
            <summary className="cursor-pointer list-none flex flex-col items-start [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-1 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                <svg className="w-3 h-3 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-semibold text-gray-500 dark:text-gray-300">Client Payments</span>
              </div>
              <span className="pl-4">{formatCurrency(collectedCalc ?? 0, cur)}</span>
            </summary>
            <div className="pl-4 pt-2 flex flex-col gap-1.5 w-full text-left">
              {clientPaymentHistory?.payments && clientPaymentHistory.payments.length > 0 ? (
                clientPaymentHistory.payments.map((p: any, idx: number) => (
                  <div key={idx} className="flex flex-col text-[10px]">
                    <span className="font-medium text-gray-600 dark:text-gray-300 capitalize truncate" title={p.description || "Client Payment"}>{p.description || "Payment"}</span>
                    <span className="tabular-nums">{formatCurrency(p.amount, p.currency || cur)}</span>
                  </div>
                ))
              ) : (
                <span className="text-[10px] text-gray-400 italic">No payments</span>
              )}
            </div>
          </details>

          <details className="group w-1/2 pl-2">
            <summary className="cursor-pointer list-none flex flex-col items-end [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-1 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                <span className="font-semibold text-gray-500 dark:text-gray-300">Total Expenses</span>
                <svg className="w-3 h-3 text-gray-400 transition-transform group-open:rotate-90 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span className="pr-4">{formatCurrency(totalExpCalc ?? 0, cur)}</span>
            </summary>
            <div className="pr-4 pt-2 flex flex-col items-end gap-1.5 w-full text-right">
              <div className="flex flex-col text-[10px]">
                <span className="font-medium text-gray-600 dark:text-gray-300">Employee Payments</span>
                <span className="tabular-nums">{formatCurrency(empCostCalc ?? 0, cur)}</span>
              </div>
              <div className="flex flex-col text-[10px]">
                <span className="font-medium text-gray-600 dark:text-gray-300">Other Expenses</span>
                <span className="tabular-nums">{formatCurrency(otherExpCalc ?? 0, cur)}</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
