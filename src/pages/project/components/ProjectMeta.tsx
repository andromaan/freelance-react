import React from "react";
import type { ProjectVM } from "../../../types/project.types";
import { useTranslation } from "react-i18next";
import { formatDateLocalized } from "../../../utils";

interface Props {
  project: ProjectVM;
}

const ProjectMeta: React.FC<Props> = ({ project }) => {
  const { t } = useTranslation();
  const categories =
    project.categories?.length > 0
      ? project.categories
      : [{ id: "general" as unknown as number, name: "GENERAL" }];

  return (
    <>
      <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="inline-block text-[10px] font-bold tracking-wider px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  {cat.name.toUpperCase()}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-2">
              {project.title}
            </h1>
            <p className="text-text-muted text-sm leading-relaxed max-w-3xl whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          <div className="flex lg:flex-col gap-4 shrink-0 text-right">
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-300 dark:border-gray-700 flex-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                {t("projectDetails.budget")}
              </p>
              <p className="text-xl font-bold text-text-main">
                ${project.budget}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-300 dark:border-gray-700 flex-1">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                {t("projectDetails.deadline")}
              </p>
              <p className="font-medium text-text-main">
                {formatDateLocalized(project.deadline)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectMeta;
