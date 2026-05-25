import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import ProjectHeader from "./components/ProjectHeader";
import ProjectMeta from "./components/ProjectMeta";
import ProjectMilestones from "./components/ProjectMilestones";
import ProjectResponses from "./components/ProjectResponses";

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectByIdQuery(projectId ?? "", {
    skip: !projectId,
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">
          Loading project...
        </span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center gap-4">
        <span className="text-red-500">
          Project not found or error loading project.
        </span>
        <button
          onClick={() => navigate("/projects")}
          className="text-primary hover:text-primary-hover underline"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 font-sans pb-12 pt-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProjectHeader
          projectId={project.id}
          projectBudget={project.budget}
          projectStatus={project.status}
        />

        <ProjectMeta project={project} />

        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
          <div className="md:col-span-8 space-y-6">
            <ProjectMilestones projectId={project.id} />
          </div>

          <div className="md:col-span-2 space-y-6">
            <ProjectResponses projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
