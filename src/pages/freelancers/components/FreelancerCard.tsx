import React from "react";
import { Link } from "react-router-dom";
import type { SearchFreelancerVM } from "../../../types/freelancer.types";
import APP_ENV from "../../../env";

interface Props {
  freelancer: SearchFreelancerVM;
}

const FreelancerCard: React.FC<Props> = ({ freelancer }) => {
  const firstLetter = (freelancer.displayName || freelancer.email || "?")[0].toUpperCase();
  const avatarUrl = freelancer.avatarImg ? `${APP_ENV.API_URL}/${freelancer.avatarImg}` : null;
  const rating = freelancer.rating > 0 ? freelancer.rating.toFixed(1) : "No rating yet";

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        {/* Header: Avatar, Name, Rating */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 font-bold text-xl">{firstLetter}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate" title={freelancer.displayName || "Anonymous Freelancer"}>
                {freelancer.displayName || "Anonymous Freelancer"}
              </h3>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {freelancer.country && (
                  <span className="font-medium truncate max-w-[140px] sm:max-w-[200px]" title={freelancer.country.name}>
                    {freelancer.country.name}
                  </span>
                )}
                {freelancer.location && (
                  <>
                    <span className="flex-shrink-0 text-gray-300 dark:text-gray-600">&bull;</span>
                    <span className="truncate max-w-[140px] sm:max-w-[200px]" title={freelancer.location}>
                      {freelancer.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end text-sm flex-shrink-0 pt-1">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{rating}</span>
            </div>
            <span className="text-gray-400 dark:text-gray-500 text-xs">
              {freelancer.reviewsCount} review{freelancer.reviewsCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-1">
          {freelancer.bio || "This freelancer hasn't provided a bio yet."}
        </p>

        {/* Skills */}
        {freelancer.skills && freelancer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {freelancer.skills.slice(0, 4).map((skill) => (
              <span
                key={skill.id}
                className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              >
                {skill.name}
              </span>
            ))}
            {freelancer.skills.length > 4 && (
              <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                +{freelancer.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer / Action */}
      <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
        <Link
          to={`/freelancers/${freelancer.userId}`}
          className="block w-full py-2 text-center text-sm font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default FreelancerCard;
