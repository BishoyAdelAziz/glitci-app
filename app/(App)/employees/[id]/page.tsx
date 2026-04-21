"use client";
import { useParams } from "next/navigation";
import useEmployees from "@/hooks/useEmployees";
import { Employee } from "@/types/employee";
import EmployeeMeta from "@/components/features/employees/SingleEmployee/SinlgeEmployeeMeta";
import ProjectsTable from "@/components/features/projects/ProjectsTable";
import EmployeePaymentHistoryTable from "@/components/features/employees/SingleEmployee/EmployeePaymentHistoryTable";
import useProjects from "@/hooks/useProjects";

export default function EmployeePage() {
  const { id } = useParams();

  // ✅ Employee data
  const { employeeData, employeeDataIsError, employeeDataIsLoading } =
    useEmployees({ employeeId: id });

  // ✅ Get all employee projects
  const { projects } = useProjects({ employee: id });

  // ✅ Extract project IDs
  const projectIds = projects?.map((project) => project.id) ?? [];

  if (employeeDataIsLoading) return <div>Loading...</div>;
  if (employeeDataIsError) return <div>Error loading employee</div>;

  const employee: Employee | undefined = employeeData?.data;

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="flex py-3 flex-col gap-[2vh] items-start justify-start w-full">
        <div className="flex items-center justify-start w-full gap-1">
          <div title={"active"} className="w-3 h-3 rounded-full bg-blue-500" />
          <h1 className="text-2xl font-bold">{employee?.user.name}</h1>
          <span className="text-sm font-semibold text-gray-600">
            @{employee?.position.name}
          </span>
        </div>
      </div>

      <EmployeeMeta
        EmployeeType={employee?.employmentType}
        DepartmentName={employee?.department.name}
        startDate={employee?.updatedAt}
        phones={employee?.user?.phone}
        skills={employee?.skills}
      />

      <div className="w-full items-start mt-5">
        <h3 className="font-bold text-gray-500 text-xl">Employee Projects</h3>
        <div className="bg-linear-to-r from-[#DE4646] h-1 w-22 mt-2 to-[#B72D2D]" />
      </div>

      <div className="w-full">
        <ProjectsTable EmployeeId={employee?.id} />
      </div>

      {/* Payment History Section - Component handles hook internally */}
      {id && (
        <div className="w-full mt-8">
          <EmployeePaymentHistoryTable employeeId={id} />
        </div>
      )}
    </section>
  );
}
