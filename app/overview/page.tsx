"use client";

import SpendDashboard from "@/components/features/overView/charts/DepartmentsProgress";
import GrowthChart from "@/components/features/overView/charts/GrowthChart";
import IncomeByDepartment from "@/components/features/overView/charts/IncomeByDepartments";
import ButtonLoader from "@/components/Loaders/ButtonLoader";
import useAnalyticsOverview from "@/hooks/useAnalytics";
import useUser from "@/hooks/useUser";

export default function OverViewPage() {
  const { user } = useUser();
  const userName = user?.name || ""; // "ahmed magdy"
  const firstName = userName.split(" ")[0]; // "ahmed"
  const { overview, isLoading, isError, statsData } = useAnalyticsOverview();
  console.log(overview);
  if (isLoading) return <ButtonLoader />;
  if (isError) return;
  return (
    <div className="grid   md:grid-cols-4 grid-cols-1 justify-center items-center gap-8">
      <div className="col-span-4 flex gap-3 items-start justify-center flex-col">
        <h4 className="text-6xl font-poppins font-normal capitalize ">
          Good Morning, {firstName}
        </h4>
        <p className="font-poppins font-light text-2xl">
          Stay on top of your tasks, monitor progress, and track status.
        </p>
      </div>
      <div className="col-span-4 grid md:grid-cols-4 grid-cols-1 items-stretch gap-x-8 gap-y-8 justify-center ">
        <div className="col-span-1 flex flex-col p-8 rounded-4xl items-start gap-8  justify-center bg-[url('/icons/Revenue-Background.svg')] bg-cover bg-no-repeat bg-center">
          <div className="flex flex-col items-start justify-start gap-4">
            <p className="text-white font-poppins font-semibold text-md">
              Revenues
            </p>
            <p className="inline-flex items-start text-white font-poppins font-semibold text-4xl justify-start">
              ${overview?.financials.totalIncome}
              <svg
                width="25"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.6668 9.33301L9.3335 22.6663M22.6668 9.33301H10.6668M22.6668 9.33301V21.333"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>
            <p className="text-white font-poppins font-normal text-xs">
              Increase compared to last week
            </p>
          </div>
          <p className=" inline-flex items-center font-poppins font-normal text-sm justify-center gap-1">
            Revenues report
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.9165 7.00033H11.0832M11.0832 7.00033L8.74984 9.33366M11.0832 7.00033L8.74984 4.66699"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
        </div>
        <div className="col-span-1 bg-white dark:bg-gray-800 p-4 grid rounded-4xl grid-cols-1 md:grid-cols-2 items-stretch gap-x-2 gap-y-4 justify-center">
          <div className="flex flex-col items-start justify-center gap-3 bg-linear-to-bl rounded-2xl p-2 from-[#DE4646] to-[#B72D2D] col-span-1 ">
            <h4 className="text-sm font-poppins font-medium text-white">
              Total salaries
            </h4>
            <p className="font-poppins font-medium text-2xl text-white">
              ${overview?.financials.totalSalaries}
            </p>
            <p className="text-sm font-normal text-white">this month</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-3 bg-linear-to-bl rounded-2xl p-2 bg-[#F6F6F6] dark:bg-gray-600 col-span-1 ">
            <h4 className="text-sm font-poppins font-medium ">
              other expenses
            </h4>
            <p className="font-poppins font-medium text-2xl ">
              ${overview?.financials.otherExpenses}
            </p>
            <p className="text-sm font-normal ">this month</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-3 rounded-2xl p-2  bg-[#F6F6F6] dark:bg-gray-600 col-span-1 ">
            <h4 className="text-sm font-poppins font-medium">Profit Margin</h4>
            <p className="font-poppins font-medium text-2xl ">
              ${overview?.financials.profitMargin}
            </p>
            <p className="text-sm font-normal ">this month</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-3 bg-linear-to-bl rounded-2xl p-2 bg-[#F6F6F6] dark:bg-gray-600 col-span-1 ">
            <h4 className="text-sm font-poppins font-medium ">Net Profit</h4>
            <p className="font-poppins font-medium text-2xl ">
              ${overview?.financials.netProfit}
            </p>
            <p className="text-sm font-normal ">this month</p>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2 flex items-center justify-center dark:bg-gray-800 bg-white rounded-4xl p-4">
          <GrowthChart GrowttChartItems={overview?.charts?.growthTrend} />
        </div>
        <div className="col-span-2  justify-center grid md:grid-cols-3 grid-cols-1  gap-x-4 items-stretch ">
          <div className="w-full bg-white dark:bg-gray-800 rounded-4xl p-4 flex gap-8 flex-col items-start justify-evenly ">
            <div className="flex flex-col items-start justify-center gap-4">
              <h4 className="font-poppins font-semibold text-lg">
                Total Projects
              </h4>
              <p className="text-4xl font-poppins font-medium">
                {statsData?.data.counts.totalProjects}
              </p>
              <p className="font-poppins font-normal text-sm">
                Active Projects
              </p>
            </div>
            <p className="inline-flex items-center justify-center gap-1">
              Projets Report
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.9165 7.00033H11.0832M11.0832 7.00033L8.74984 9.33366M11.0832 7.00033L8.74984 4.66699"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>
          </div>
          <div className="w-full bg-white dark:bg-gray-800 rounded-4xl p-4 flex gap-8 flex-col items-start justify-evenly ">
            <div className="flex flex-col items-start justify-center gap-4">
              <h4 className="font-poppins font-semibold text-lg">
                Active Employees
              </h4>
              <p className="text-4xl font-poppins font-medium">
                {statsData?.data.counts.activeEmployees}
              </p>
              <p className="font-poppins font-normal text-sm">Team Members </p>
            </div>
            <p className="inline-flex items-center justify-center gap-1">
              Employees Report
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.9165 7.00033H11.0832M11.0832 7.00033L8.74984 9.33366M11.0832 7.00033L8.74984 4.66699"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>
          </div>
          <div className="w-full bg-white dark:bg-gray-800 rounded-4xl p-4 flex gap-8 flex-col items-start justify-evenly ">
            <div className="flex flex-col items-start justify-center gap-4">
              <h4 className="font-poppins font-semibold text-lg">
                AVG Completion
              </h4>
              <p className="text-7xl font-poppins font-semibold">
                {statsData?.data.counts.avgCompletion}%
              </p>
              <p className="font-poppins font-normal text-sm"></p>
            </div>
            <p className="inline-flex items-center justify-center gap-1">
              Overall Progress
            </p>
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center dark:bg-gray-800 bg-white rounded-4xl p-4">
          <IncomeByDepartment />
        </div>
        <div className="col-span-2  dark:bg-gray-800 bg-white rounded-4xl p-4">
          <SpendDashboard departments={statsData?.data.departments} />
        </div>
        <div className="col-span-2  dark:bg-gray-800 bg-white rounded-4xl p-4"></div>
      </div>
    </div>
  );
}
