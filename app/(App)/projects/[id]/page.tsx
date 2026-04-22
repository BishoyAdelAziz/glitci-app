"use client";

import SingleProjectFinanceComponent from "@/components/features/projects/SingleProjectFinance";
import ProjectMeta from "@/components/features/projects/SingleProjectMeta";
import TeamMembers from "@/components/features/projects/SingleProjectTeamMemebers";
import TimelineSection from "@/components/features/projects/TimeLineSection";
import useProjects from "@/hooks/useProjects";
import { useSearchParam } from "@/hooks/useSearchParam";
import useSingleProjectFinance from "@/hooks/useSingleProjectFinance";
import { SingleProject } from "@/types/SingleProject";
import { useParams } from "next/navigation";

const STATUS_DOT: Record<string, string> = {
  planning: "bg-blue-500",
  active: "bg-green-600",
  on_hold: "bg-yellow-500",
  completed: "bg-gray-400",
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

export default function SingleProjectPage() {
  const { id } = useParams();
  const search = useSearchParam();
  const {
    SingleProjectFinance,
    SingleProjectFinanceIsLoading,
    SingleProjectFinanceIsError,
    SingleProjectEmployeesBreakDown,
    SingleProjectEmployeesBreakDownIsError,
    SingleProjectEmployeesBreakDownIsLoading,
    SingleProjectExpensesBreakDown,
    SingleProjectExpensesBreakDownIsError,
    SingleProjectExpensesBreakDownIsLoading,
    SingleProjectClientPaymentHistory,
    SingleProjectClientPaymentHistoryIsError,
    SingleProjectClientPaymentHistoryIsLoading
  } = useSingleProjectFinance({ projectId: id });

  const {
    singleProjectData: project,
    SingleProjectIsLoading,
    SingleProjectIsError,
  } = useProjects({ id: id, search: search });


  if (SingleProjectIsLoading) {
    return (
      <section className="flex items-center justify-center w-full h-40">
        <p className="text-gray-400 animate-pulse">Loading project...</p>
      </section>
    );
  }

  if (SingleProjectIsError || !project?.data) {
    return (
      <section className="flex items-center justify-center w-full h-40">
        <p className="text-red-400">Failed to load project.</p>
      </section>
    );
  }

  const projectData = project.data;
  const dotColor = STATUS_DOT[projectData.status] ?? "bg-gray-400";

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-[2vh] items-start justify-start w-full">
        {/* Header */}
        <div className="flex items-center justify-start w-full gap-2">
          <div
            title={projectData.status}
            className={`w-3 h-3 rounded-full ${dotColor}`}
          />
          <h1 className="text-2xl font-bold">{projectData.name || "Untitled Project"}</h1>
        </div>
        {projectData.description && (
          <p className="text-gray-400 font-poppins font-medium">
            {projectData.description}
          </p>
        )}

        {/* Meta strip */}
        <ProjectMeta
          clientName={projectData.client?.name}
          createdBy={projectData.createdBy?.name}
          endDate={projectData.endDate}
          startDate={projectData.startDate}
          priority={projectData.priority}
          teamMembersCount={projectData.employees?.length || 0}
        />

        {/* Client + Department & Services */}
        <div className="flex flex-col lg:flex-row items-stretch gap-3 justify-center w-full">
          {/* Client card */}
          <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4 gap-3 flex flex-col items-start justify-between">
            <h4 className="font-poppins font-medium text-xl">Client</h4>

            {/* Avatar + Name */}
            {projectData.client ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-2xl font-bold text-sm tracking-wide">
                    {getInitials(projectData.client.name)}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-base capitalize">
                      {projectData.client.name}
                    </h4>
                    {projectData.client.companyName && (
                      <h4 className="text-gray-400 text-sm capitalize">
                        {projectData.client.companyName}
                      </h4>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-300 dark:bg-gray-500" />

                {/* Contact Info */}
                <div className="flex flex-col items-start gap-2 w-full">
                  {/* Email */}
                  {projectData.client.email && (
                    <div className="flex items-center gap-2">
                      <svg
                        fill="currentColor"
                        style={{ width: "1rem", height: "1rem" }}
                        viewBox="0 0 24 24"
                        className="text-gray-400 shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5L4,8V6l8,5l8-5V8z" />
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {projectData.client.email}
                      </p>
                    </div>
                  )}

                  {/* Phones */}
                  {projectData.client.phones?.map((phone: string) => (
                    <div key={phone} className="flex items-center gap-2">
                      <svg
                        fill="currentColor"
                        width="14px"
                        height="14px"
                        viewBox="0 0 24 24"
                        className="text-gray-400 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6.6,10.8c1.4,2.8,3.8,5.1,6.6,6.6l2.2-2.2c0.3-0.3,0.7-0.4,1-0.2c1.1,0.4,2.3,0.6,3.6,0.6 c0.6,0,1,0.4,1,1V20c0,0.6-0.4,1-1,1C10.6,21,3,13.4,3,4c0-0.6,0.4-1,1-1h3.5c0.6,0,1,0.4,1,1c0,1.3,0.2,2.5,0.6,3.6 c0.1,0.3,0,0.7-0.2,1L6.6,10.8z" />
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {phone}
                      </p>
                    </div>
                  ))}
                  {(!projectData.client.phones || projectData.client.phones.length === 0) && (
                    <p className="text-sm text-gray-400 italic">No phone numbers</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-400 italic text-sm">No client assigned</p>
            )}
          </div>

          {/* Department & Services card */}
          <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4 gap-3 flex flex-col items-start justify-between">
            <h4 className="font-poppins font-medium text-xl">
              Department & Services
            </h4>
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="text-gray-400 text-sm">Department</p>
              <p className={`rounded-4xl px-3 py-1 capitalize ${projectData.department?.name ? 'bg-gray-300 dark:bg-gray-600' : 'text-gray-500 italic'}`}>
                {projectData.department?.name || "Unassigned"}
              </p>
            </div>
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="text-gray-400 text-sm">Services</p>
              {projectData.services && projectData.services.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {projectData.services.map((service: any) => (
                    <p
                      key={service._id}
                      className="bg-gray-300 dark:bg-gray-600 rounded-4xl px-3 py-1 capitalize text-sm"
                    >
                      {service.name}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">No services listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline + Priority */}
        <TimelineSection
          startDate={projectData.startDate}
          endDate={projectData.endDate}
          priority={projectData.priority}
        />

        {/* Financial Overview */}
        {SingleProjectFinanceIsLoading || SingleProjectEmployeesBreakDownIsLoading || SingleProjectExpensesBreakDownIsLoading || SingleProjectClientPaymentHistoryIsLoading ? (
          <div className="w-full h-32 flex items-center justify-center dark:bg-gray-600 bg-[#f2f0f0] rounded-2xl">
            <p className="text-gray-400 animate-pulse">Loading finance data...</p>
          </div>
        ) : (
          <SingleProjectFinanceComponent
            financials={SingleProjectFinance?.data?.financials}
            employeesBreakdown={SingleProjectEmployeesBreakDown?.data}
            expensesBreakdown={SingleProjectExpensesBreakDown?.data}
            clientPaymentHistory={SingleProjectClientPaymentHistory?.data}
          />
        )}

        {/* Team Members */}
        <TeamMembers 
          employees={projectData.employees} 
          employeesBreakdown={SingleProjectEmployeesBreakDown?.data} 
          clientPaymentHistory={SingleProjectClientPaymentHistory?.data}
          financials={SingleProjectFinance?.data?.financials}
        />
      </div>
    </section>
  );
}
