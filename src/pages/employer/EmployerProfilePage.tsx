import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEmployerByEmailQuery } from "../../services/employer/employerApi";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import { useGetLanguagesQuery } from "../../services/languages/languagesApi";
import { userImageUrl } from "../../utils";
import PageError from "../../components/ui/PageError";

const EmployerProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Fetch User
  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(userId!);

  // Fetch Languages dictionary
  const { data: languagesList } = useGetLanguagesQuery();

  const email = user?.email || "";

  // Fetch Employer details by email
  const { data: employer, isLoading: isEmployerLoading } =
    useGetEmployerByEmailQuery(email, {
      skip: !email,
    });

  const isLoading = isUserLoading || isEmployerLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user || !employer) {
    return (
      <PageError 
        message="This profile might be incomplete or does not exist." 
        backToLabel="Go Back"
        backToPath="-1"
      />
    );
  }

  const avatarLetters = user.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : (user.email?.slice(0, 2).toUpperCase() ?? "??");

  const countryText = user.country?.name ?? "Location not specified";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm mt-12 sm:mt-16">
          <div className="relative flex flex-col sm:flex-row gap-6 sm:items-end">
            <div className="relative shrink-0 -mt-16 sm:-mt-20">
              {user.avatarImg ? (
                <img
                  src={userImageUrl(user.avatarImg)}
                  alt={user.displayName || "Avatar"}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md bg-white dark:bg-gray-800"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 bg-primary text-white text-3xl font-bold flex items-center justify-center shadow-md">
                  {avatarLetters}
                </div>
              )}
            </div>

            <div className="flex-1 pb-2 mt-2 sm:mt-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {user.displayName || user.email}
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Employer
                </span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{countryText}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                Company Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Company Name
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">
                    {employer.companyName || "Not specified"}
                  </p>
                </div>

                {employer.companyWebsite && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Website
                    </h3>
                    <a
                      href={
                        employer.companyWebsite.startsWith("http")
                          ? employer.companyWebsite
                          : `https://${employer.companyWebsite}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-primary hover:text-primary-hover font-medium transition-colors"
                    >
                      {employer.companyWebsite}
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                Languages
              </h2>
              {user.languages && user.languages.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {user.languages.map((lang) => {
                    const langName =
                      languagesList?.find((l) => l.id === lang.languageId)
                        ?.name || `Language ${lang.languageId}`;
                    return (
                      <div
                        key={lang.languageId}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {langName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                          {lang.proficiencyLevel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No languages specified.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfilePage;
