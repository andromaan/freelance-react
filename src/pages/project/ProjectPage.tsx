import React from "react";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import ProjectHeader from "./components/ProjectHeader";
import ProjectMeta from "./components/ProjectMeta";
import ProjectMilestones from "./components/ProjectMilestones";
import ProjectResponses from "./components/ProjectResponses";
import ProjectEmployer from "./components/ProjectEmployer";
import PageLoading from "../../components/ui/PageLoading";
import PageError from "../../components/ui/PageError";
import { useTranslation } from "react-i18next";

const ProjectPage: React.FC = () => {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId: string }>();

  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectByIdQuery(projectId ?? "", {
    skip: !projectId,
  });

  if (isLoading) {
    return <PageLoading message={t("projectDetails.loading")} />;
  }

  if (error || !project) {
    return (
      <PageError 
        message={t("projectDetails.notFound")} 
        backToLabel={t("projectDetails.backToProjects")}
        backToPath="/projects"
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main font-sans pb-12 pt-8 px-4 sm:px-6 lg:px-8 transition-colors">
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
            <ProjectEmployer createdBy={project.createdBy} />
            <ProjectResponses projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
