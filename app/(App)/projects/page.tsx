import PageHeader from "@/components/features/projects/PageHeader";
import ProjectsTable from "@/components/features/projects/ProjectsTable";

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader />
      <div className="mt-20">
        <ProjectsTable />
      </div>
    </div>
  );
}
