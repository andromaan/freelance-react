import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "../../services/projects/projectsApi";
import ProjectHeader from "./components/ProjectHeader";
import ProjectMeta from "./components/ProjectMeta";
import ProjectMilestones from "./components/ProjectMilestones";
import ProjectResponses from "./components/ProjectResponses";
import PageLoading from "../../components/ui/PageLoading";
import PageError from "../../components/ui/PageError";

const MyProjectPage: React.FC = () => {
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
    return <PageLoading message={t("projects.page.loading")} />;
  }

  if (error || !project) {
    return (
      <PageError 
        message={t("projects.page.notFound")} 
        backToLabel={t("projects.page.backToMyProjects")}
        backToPath="/my-projects"
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main font-sans pb-12 pt-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProjectHeader status={project.status} />

        <ProjectMeta project={project} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <ProjectMilestones projectId={project.id} />
          </div>

          <div className="md:col-span-1 space-y-6">
            <ProjectResponses projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjectPage;
