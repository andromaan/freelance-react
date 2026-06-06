import React from "react";
import { Link } from "react-router-dom";
import { useGetUserByIdQuery } from "../../../services/user/userApi";
import { userImageUrl } from "../../../utils";
import { useTranslation } from "react-i18next";

interface Props {
  createdBy?: string;
}

const ProjectEmployer: React.FC<Props> = ({ createdBy }) => {
  const { t } = useTranslation();
  const { data: user, isLoading } = useGetUserByIdQuery(createdBy ?? "", {
    skip: !createdBy,
  });

  if (!createdBy) return null;

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border shadow-sm p-5 animate-pulse">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const firstLetter = (user.displayName || user.email || "?")[0].toUpperCase();

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-5">
      <h3 className="font-semibold text-text-main mb-4">{t("projectDetails.aboutClient")}</h3>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          {user.avatarImg ? (
            <img
              src={userImageUrl(user.avatarImg)}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-lg">{firstLetter}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-text-main truncate">
            {user.displayName || t("projectDetails.anonymousClient")}
          </p>
          <div className="flex items-center gap-1 text-sm text-text-muted mt-0.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">
              {user.country?.name || t("projectDetails.unknownLocation")}
            </span>
          </div>
        </div>
      </div>

      <Link
        to={`/employers/${user.id}`}
        className="block w-full py-2 text-center text-sm font-semibold rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-primary dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        {t("projectDetails.viewProfile")}
      </Link>
    </div>
  );
};

export default ProjectEmployer;
