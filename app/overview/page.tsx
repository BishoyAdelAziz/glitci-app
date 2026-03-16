"use client";

import SpendDashboard from "@/components/features/overView/charts/DepartmentsProgress";
import GrowthChart from "@/components/features/overView/charts/GrowthChart";
import IncomeByDepartment from "@/components/features/overView/charts/IncomeByDepartments";
import RecentProjectsTable from "@/components/features/overView/RecentProjects";
import ButtonLoader from "@/components/Loaders/ButtonLoader";
import useAnalyticsOverview from "@/hooks/useAnalytics";
import useUser from "@/hooks/useUser";

export default function OverViewPage() {
  const { user } = useUser();
  const userName = user?.name || "";
  const firstName = userName.split(" ")[0];

  const { overview, isLoading, isError, statsData } = useAnalyticsOverview();

  if (isLoading) return <ButtonLoader />;
  if (isError) return null;
  console.log(statsData);
  return (
    <div className="px-4 mt-15 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      {/* HEADER */}
      <div className="col-span-full flex flex-col gap-3">
        <h4 className="text-3xl md:text-5xl lg:text-6xl font-poppins font-normal capitalize">
          Good Morning, {firstName}
        </h4>

        <p className="font-poppins font-light text-lg md:text-xl lg:text-2xl">
          Stay on top of your tasks, monitor progress, and track status.
        </p>
      </div>

      {/* REVENUE CARD */}
      <div className="col-span-1 flex flex-col p-6 md:p-8 rounded-4xl gap-6 bg-[url('/icons/Revenue-Background.svg')] bg-cover bg-no-repeat bg-center">
        <div className="flex flex-col gap-3">
          <p className="text-white font-semibold text-sm">Revenues</p>

          <p className="inline-flex items-center gap-2 text-white font-semibold text-2xl md:text-4xl">
            ${overview?.financials.totalIncome}
            <svg width="25" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M22.6668 9.33301L9.3335 22.6663M22.6668 9.33301H10.6668M22.6668 9.33301V21.333"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>

          <p className="text-white text-xs">Increase compared to last week</p>
        </div>

        <p className="inline-flex items-center text-sm gap-1">
          Revenues report
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path
              d="M2.9165 7.00033H11.0832M11.0832 7.00033L8.74984 9.33366M11.0832 7.00033L8.74984 4.66699"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
      </div>

      {/* FINANCIAL SUMMARY */}
      <div className="col-span-1 grid grid-cols-2 sm:grid-cols-2 gap-4 bg-white dark:bg-gray-800 p-4 rounded-4xl">
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-gradient-to-bl from-[#DE4646] to-[#B72D2D]">
          <h4 className="text-sm text-white">Total salaries</h4>
          <p className="text-xl md:text-2xl text-white">
            ${overview?.financials.totalSalaries}
          </p>
          <p className="text-xs text-white">this month</p>
        </div>

        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#F6F6F6] dark:bg-gray-600">
          <h4 className="text-sm">Other expenses</h4>
          <p className="text-xl md:text-2xl">
            ${overview?.financials.otherExpenses}
          </p>
          <p className="text-xs">this month</p>
        </div>

        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#F6F6F6] dark:bg-gray-600">
          <h4 className="text-sm">Profit Margin</h4>
          <p className="text-xl md:text-2xl">
            ${overview?.financials.profitMargin}
          </p>
          <p className="text-xs">this month</p>
        </div>

        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-[#F6F6F6] dark:bg-gray-600">
          <h4 className="text-sm">Net Profit</h4>
          <p className="text-xl md:text-2xl">
            ${overview?.financials.netProfit}
          </p>
          <p className="text-xs">this month</p>
        </div>
      </div>

      {/* GROWTH CHART */}
      <div className="col-span-1 lg:col-span-2 flex items-center justify-center bg-white dark:bg-gray-800 rounded-4xl p-4">
        <GrowthChart GrowttChartItems={overview?.charts?.growthTrend} />
      </div>

      {/* PROJECTS / EMPLOYEES / COMPLETION */}
      <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-4xl p-4 flex justify-between flex-col gap-6">
          <div>
            <h4 className="font-semibold text-xs md:text-lg">Total Projects</h4>
            <p className="text-3xl md:text-4xl">
              {statsData?.data.counts.totalProjects}
            </p>
            <p className="text-xs md:text-sm">Active Projects</p>
          </div>

          <p className="inline-flex items-center gap-1 text-xs md:text-sm">
            Projects Report
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-4xl p-4 justify-between flex flex-col gap-6">
          <div>
            <h4 className="font-semibold text-xs md:text-lg">
              Active Employees
            </h4>
            <p className="text-3xl md:text-4xl">
              {statsData?.data.counts.activeEmployees}
            </p>
            <p className="text-xs md:text-sm">Team Members</p>
          </div>

          <p className="text-xs md:text-sm">Employees Report</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-4xl p-4 justify-between flex flex-col gap-6">
          <div>
            <h4 className="font-semibold text-xs md:text-lg">AVG Completion</h4>
            <p className="text-4xl md:text-6xl font-semibold">
              {statsData?.data.counts.avgCompletion}%
            </p>
          </div>

          <p className="text-xs md:text-sm">Overall Progress</p>
        </div>
      </div>

      {/* INCOME BY DEPARTMENT */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-4xl p-4">
        <IncomeByDepartment data={overview?.charts?.incomeByDepartment} />
      </div>

      {/* SPEND DASHBOARD */}
      <div className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-4xl p-4">
        <SpendDashboard departments={statsData?.data.departments} />
      </div>
      {/* Recent Projects */}
      <RecentProjectsTable projects={overview?.recentProjects} />
    </div>
  );
}
