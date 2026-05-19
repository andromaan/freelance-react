import { useState } from "react";
import { useGetProjectsByEmployerQuery } from "../../services/projects/projectsApi";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import ProjectCard from "./components/ProjectCard";
import { ProjectStatus } from "../../types/project.types";

const MyProjectsPage = () => {
  const { data: myProjects, isLoading } = useGetProjectsByEmployerQuery();
  const [activeTab, setActiveTab] = useState<ProjectStatus | null>(null);

  const filteredProjects =
    myProjects?.filter((p) =>
      activeTab === null ? true : p.status === activeTab,
    ) || [];

  const allProjects = myProjects || [];

  const counts: Record<string, number> = {
    all: allProjects.length,
    [ProjectStatus.Open]: allProjects.filter(
      (p) => p.status === ProjectStatus.Open,
    ).length,
    [ProjectStatus.InProgress]: allProjects.filter(
      (p) => p.status === ProjectStatus.InProgress,
    ).length,
    [ProjectStatus.Completed]: allProjects.filter(
      (p) => p.status === ProjectStatus.Completed,
    ).length,
    [ProjectStatus.Cancelled]: allProjects.filter(
      (p) => p.status === ProjectStatus.Cancelled,
    ).length,
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 font-sans pb-12 pt-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <Header />

        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        {isLoading ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            Оновлення...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="md:col-span-1 lg:col-span-1">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            No projects found for the selected status.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjectsPage;
