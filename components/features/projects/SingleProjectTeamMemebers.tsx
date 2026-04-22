import React, { useState } from "react";

type EmploymentType = "full_time" | "part_time" | "freelancer";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  employmentType: EmploymentType;
  compensation?: number;
  currency?: string;
  assignedAt?: string;
}

interface TeamMembersProps {
  employees?: Employee[];
  employeesBreakdown?: any;
  clientPaymentHistory?: any;
  financials?: any;
}

const EMPLOYMENT_STYLES: Record<
  string,
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

function getInitials(name?: string): string {
  if (!name) return "N/A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

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

export default function TeamMembers({ employees, employeesBreakdown, clientPaymentHistory, financials }: TeamMembersProps) {
  const [activeTab, setActiveTab] = useState<"employees" | "client">("employees");

  // Use breakdown if available, else fallback to standard employees list
  const listToRender = employeesBreakdown?.breakdown?.length 
    ? employeesBreakdown.breakdown 
    : employees?.map(emp => ({ 
        employee: emp, 
        compensation: emp.compensation, 
        currency: emp.currency 
      })) || [];

  // Client balance calculations
  const cph = clientPaymentHistory;
  const clientName = cph?.project?.client?.name || "Client";
  const clientCompany = cph?.project?.client?.companyName || "";
  const projectBudget = cph?.project?.budget || financials?.totalBudget || 0;
  const projectCurrency = cph?.project?.currency || financials?.currency || "EGP";
  
  const clientPayments = cph?.payments || [];
  const clientTotalPaid = clientPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const clientRemainingAmount = projectBudget - clientTotalPaid;
  const clientPaidPercentage = projectBudget > 0 ? Math.min((clientTotalPaid / projectBudget) * 100, 100) : (clientTotalPaid > 0 ? 100 : 0);
  const hasClientPayments = clientPayments.length > 0;

  return (
    <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4 gap-4 flex flex-col items-start">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-500 w-full">
        <button
          onClick={() => setActiveTab("employees")}
          className={`pb-2 text-sm font-semibold transition-colors flex items-center gap-2 ${
            activeTab === "employees"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Balance Due for Employees
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'employees' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-500 dark:text-gray-300'}`}>
            {listToRender.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("client")}
          className={`pb-2 text-sm font-semibold transition-colors ${
            activeTab === "client"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          Balance Due for Client
        </button>
      </div>

      {activeTab === "employees" && (
        <div className="w-full flex flex-col gap-3 animate-in fade-in duration-300">
        {listToRender.map((item: any, index: number) => {
          const emp = item.employee;
          if (!emp) return null;
          
          const empStyles = EMPLOYMENT_STYLES[emp.employmentType] || { badge: "bg-gray-100 text-gray-700 ring-gray-300", label: emp.employmentType?.replace(/_/g, " ") || "Unknown" };
          const comp = item.compensation || emp.compensation || 0;
          const cur = item.currency || emp.currency || "EGP";
          const paidAmount = item.paid?.[0]?.amount || 0;
          const remainingAmount = item.remaining ?? (comp - paidAmount);
          const paidPercentage = comp > 0 ? Math.min((paidAmount / comp) * 100, 100) : (paidAmount > 0 ? 100 : 0);
          const hasPayments = item.payments && item.payments.length > 0;

          return (
            <div
              key={emp.id || index}
              className="flex flex-col bg-white dark:bg-gray-700 rounded-xl px-4 py-3 gap-3 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-500 transition-colors"
            >
              {/* Left: avatar + name + position */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-sm font-bold shrink-0">
                    {getInitials(emp.name)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm capitalize">
                      {emp.name}
                    </span>
                    <span className="text-gray-400 text-xs capitalize">
                      {emp.position?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Right: compensation + employment type */}
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-sm tabular-nums">
                    {formatCurrency(comp, cur)}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ring-1 ${empStyles.badge} capitalize tracking-wide`}
                  >
                    {empStyles.label}
                  </span>
                </div>
              </div>

              {/* Balance bar & History */}
              {(item.paid !== undefined || item.remaining !== undefined) && (
                <div className="w-full flex flex-col gap-2 mt-1 pt-3 border-t border-gray-100 dark:border-gray-600">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      Paid: <span className="font-medium text-gray-700 dark:text-gray-200 tabular-nums">{formatCurrency(paidAmount, item.paid?.[0]?.currency || cur)}</span>
                    </span>
                    <span className={`font-semibold tabular-nums ${remainingAmount < 0 ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                      {remainingAmount < 0 ? "Overpaid:" : "Balance Due:"} {formatCurrency(Math.abs(remainingAmount), cur)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${remainingAmount < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                      style={{ width: `${paidPercentage}%` }} 
                    />
                  </div>
                  
                  {/* Payments History Dropdown */}
                  {hasPayments && (
                    <details className="group mt-1">
                      <summary className="text-[11px] text-blue-500 hover:text-blue-600 dark:text-blue-400 cursor-pointer list-none flex items-center gap-1 [&::-webkit-details-marker]:hidden font-medium">
                        <svg className="w-3 h-3 transition-transform group-open:rotate-90 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                        View Payments History ({item.paymentCount})
                      </summary>
                      <div className="pl-4 pt-2 pb-1 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {item.payments.map((p: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-start text-xs border-b border-gray-100 dark:border-gray-600 pb-2 last:border-0 last:pb-0">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-600 dark:text-gray-300 capitalize">
                                {p.description || p.category?.replace(/_/g, " ")}
                              </span>
                              <span className="text-gray-400 text-[10px]">
                                {new Date(p.date).toLocaleDateString("en-GB")} • {p.paymentMethod}
                              </span>
                            </div>
                            <span className="tabular-nums font-semibold text-gray-500 dark:text-gray-300">
                              {formatCurrency(p.amount, p.currency || cur)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {activeTab === "client" && (
        <div className="w-full flex flex-col gap-3 animate-in fade-in duration-300">
          <div className="flex flex-col bg-white dark:bg-gray-700 rounded-xl px-4 py-3 gap-3 shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-500 transition-colors">
            {/* Left: Client name + company */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-sm font-bold shrink-0">
                  {getInitials(clientName)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm capitalize">
                    {clientName}
                  </span>
                  <span className="text-gray-400 text-xs capitalize">
                    {clientCompany || "Client"}
                  </span>
                </div>
              </div>

              {/* Right: Budget */}
              <div className="flex flex-col items-end gap-1">
                <span className="font-bold text-sm tabular-nums text-gray-700 dark:text-gray-200">
                  {formatCurrency(projectBudget, projectCurrency)}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full ring-1 bg-green-50 text-green-700 ring-green-300 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-700 capitalize tracking-wide">
                  Project Budget
                </span>
              </div>
            </div>

            {/* Balance bar & History */}
            <div className="w-full flex flex-col gap-2 mt-1 pt-3 border-t border-gray-100 dark:border-gray-600">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Paid: <span className="font-medium text-gray-700 dark:text-gray-200 tabular-nums">{formatCurrency(clientTotalPaid, projectCurrency)}</span>
                </span>
                <span className={`font-semibold tabular-nums ${clientRemainingAmount < 0 ? "text-red-500" : "text-gray-700 dark:text-gray-300"}`}>
                  {clientRemainingAmount < 0 ? "Overpaid:" : "Balance Due:"} {formatCurrency(Math.abs(clientRemainingAmount), projectCurrency)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 bg-green-500"
                  style={{ width: `${clientPaidPercentage}%` }} 
                />
              </div>
              
              {/* Payments History Dropdown */}
              {hasClientPayments && (
                <details className="group mt-1">
                  <summary className="text-[11px] text-blue-500 hover:text-blue-600 dark:text-blue-400 cursor-pointer list-none flex items-center gap-1 [&::-webkit-details-marker]:hidden font-medium">
                    <svg className="w-3 h-3 transition-transform group-open:rotate-90 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                    View Payments History ({clientPayments.length})
                  </summary>
                  <div className="pl-4 pt-2 pb-1 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {clientPayments.map((p: any, idx: number) => (
                      <div key={p.id || idx} className="flex justify-between items-start text-xs border-b border-gray-100 dark:border-gray-600 pb-2 last:border-0 last:pb-0">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-600 dark:text-gray-300 capitalize">
                            {p.description || "Client Payment"}
                          </span>
                          <span className="text-gray-400 text-[10px]">
                            {new Date(p.date).toLocaleDateString("en-GB")} • {p.paymentMethod || "Transfer"}
                          </span>
                        </div>
                        <span className="tabular-nums font-semibold text-gray-500 dark:text-gray-300">
                          {formatCurrency(p.amount, p.currency || projectCurrency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
