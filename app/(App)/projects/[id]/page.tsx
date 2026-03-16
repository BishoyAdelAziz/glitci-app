"use client";

import SingleProjectFinance from "@/components/features/projects/SingleProjectFinance";
import ProjectMeta from "@/components/features/projects/SingleProjectMeta";
import TeamMembers from "@/components/features/projects/SingleProjectTeamMemebers";
import TimelineSection from "@/components/features/projects/TimeLineSection";
import useProjects from "@/hooks/useProjects";
import { useSearchParam } from "@/hooks/useSearchParam";
import { SingleProject } from "@/types/SingleProject";
import { useParams } from "next/navigation";

const STATUS_DOT: Record<SingleProject["status"], string> = {
  planning: "bg-blue-500",
  active: "bg-green-600",
  on_hold: "bg-yellow-500",
  completed: "bg-gray-400",
};

function getInitials(name: string): string {
  return name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("")
    ?.toUpperCase()
    ?.slice(0, 2);
}

export default function SingleProjectPage() {
  const { id } = useParams();
  const search = useSearchParam();

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

  if (SingleProjectIsError || !project) {
    return (
      <section className="flex items-center justify-center w-full h-40">
        <p className="text-red-400">Failed to load project.</p>
      </section>
    );
  }

  const dotColor = STATUS_DOT[project.data.status] ?? "bg-gray-400";
  console.log(project);
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-[2vh] items-start justify-start w-full">
        {/* Header */}
        <div className="flex items-center justify-start w-full gap-1">
          <div
            title={project.data.status}
            className={`w-3 h-3 rounded-full ${dotColor}`}
          />
          <h1 className="text-2xl font-bold">{project?.data?.name}</h1>
        </div>
        <p className="text-gray-400 font-poppins font-medium">
          {project?.data?.description}
        </p>

        {/* Meta strip */}
        <ProjectMeta
          clientName={project?.data?.client?.name}
          createdBy={project?.data?.createdBy?.name}
          endDate={project?.data?.endDate}
          startDate={project?.data?.startDate}
          priority={project?.data.priority}
          teamMembersCount={project?.data?.employees?.length}
        />

        {/* Client + Department & Services */}
        <div className="flex items-stretch gap-3 justify-center w-full">
          {/* Client card */}
          <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4 gap-3 flex flex-col items-start justify-between">
            <h4 className="font-poppins font-medium text-xl">Client</h4>

            {/* Avatar + Name */}
            <div className="flex items-center  gap-3">
              <div className="bg-white dark:bg-gray-900 px-4 py-3 rounded-2xl font-bold text-sm tracking-wide">
                {getInitials(project?.data?.client?.name)}
              </div>
              <div className="flex flex-col">
                <h4 className="font-semibold text-base capitalize">
                  {project?.data?.client?.name}
                </h4>
                <h4 className="text-gray-400 text-sm capitalize">
                  {project?.data?.client?.companyName}
                </h4>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-300 dark:bg-gray-500" />

            {/* Contact Info */}
            <div className="flex flex-col items-start gap-2 w-full">
              {/* Email */}
              <div className="flex items-center gap-2">
                <svg
                  fill="currentColor"
                  width="14px"
                  height="14px"
                  viewBox="0 0 24 24"
                  className="text-gray-400 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5L4,8V6l8,5l8-5V8z" />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {project?.data?.client?.email}
                </p>
              </div>

              {/* Phones */}
              {project?.data?.client?.phones.map((phone) => (
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
            </div>
          </div>

          {/* Department & Services card */}
          <div className="dark:bg-gray-600 bg-[#f2f0f0] w-full rounded-2xl p-4 gap-3 flex flex-col items-start justify-between">
            <h4 className="font-poppins font-medium text-xl">
              Department & Services
            </h4>
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="text-gray-400 text-sm">Department</p>
              <p className="bg-gray-300 dark:bg-gray-600 rounded-4xl px-3 py-1 capitalize">
                {project?.data?.department?.name}
              </p>
            </div>
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="text-gray-400 text-sm">Services</p>
              <div className="flex flex-wrap gap-2">
                {project?.data?.services?.map((service) => (
                  <p
                    key={service._id}
                    className="bg-gray-300 dark:bg-gray-600 rounded-4xl px-3 py-1 capitalize"
                  >
                    {service.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline + Priority */}
        <TimelineSection
          startDate={project?.data.startDate}
          endDate={project?.data.endDate}
          priority={project?.data.priority}
        />

        {/* Financial Overview */}
        <SingleProjectFinance
          budget={project?.data.budget}
          currency={project?.data.currency}
          employees={project?.data.employees}
        />

        {/* Team Members */}
        <TeamMembers employees={project?.data.employees} />
      </div>
    </section>
  );
}
