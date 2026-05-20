import { useState } from "react";
import {
  useGetProjectsByEmployerQuery,
  useDeleteProjectMutation,
} from "../../services/projects/projectsApi";
import Header from "./components/Header";
import Tabs from "./components/Tabs";
import ProjectCard from "./components/ProjectCard";
import CreateProjectModal from "./components/CreateProjectModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { ProjectStatus } from "../../types/project.types";
import { toast } from "react-toastify";

const MyProjectsPage = () => {
  const { data: myProjects, isLoading } = useGetProjectsByEmployerQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [activeTab, setActiveTab] = useState<ProjectStatus | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(
    null,
  );

  const handleDeleteConfirm = async () => {
    if (!projectIdToDelete) return;
    try {
      await deleteProject(projectIdToDelete).unwrap();

      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setProjectIdToDelete(null);
    }
  };

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
        <Header onCreateClick={() => setIsCreateModalOpen(true)} />

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
                <ProjectCard
                  project={project}
                  onDelete={(id) => setProjectIdToDelete(id)}
                />
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

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ConfirmModal
        isOpen={!!projectIdToDelete}
        onClose={() => setProjectIdToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project?"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MyProjectsPage;
