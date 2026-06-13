import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetUserByIdQuery } from "../../services/user/userApi";
import { useGetFreelancerByEmailQuery } from "../../services/freelancer/freelancerApi";
import PortfolioCard from "./components/PortfolioCard";
import PageError from "../../components/ui/PageError";
import PageLoading from "../../components/ui/PageLoading";
import ArrowIcon from "../../components/icons/ArrowIcon";

const FreelancerPortfolioPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading } = useGetUserByIdQuery(userId!);
  const email = user?.email || "";

  const { data: freelancer, isLoading: isFreelancerLoading } = useGetFreelancerByEmailQuery(email, {
    skip: !email,
  });

  const isLoading = isUserLoading || isFreelancerLoading;

  if (isLoading) {
    return <PageLoading message={t("freelancerProfile.loadingPortfolio", "Loading portfolio...")} />;
  }

  if (!user || !freelancer) {
    return (
      <PageError
        message={t("freelancerProfile.incomplete")}
        backToLabel={t("freelancerProfile.goBack")}
        backToPath="-1"
      />
    );
  }

  const portfolio = freelancer.portfolio || [];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium mb-4"
        >
          <ArrowIcon direction="left" />
          <span>{t("freelancerProfile.goBack")}</span>
        </button>

        <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-border-light gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-main mb-1">
                {t("freelancerProfile.portfolioFor", "Portfolio for")} {user.displayName || user.email}
              </h1>
              <p className="text-sm text-text-muted">
                {portfolio.length} {t("freelancerProfile.total")}
              </p>
            </div>
          </div>

          {portfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {portfolio.map((item, idx) => (
                <PortfolioCard key={item.id} item={item} index={idx} clampDescription={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-border bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-base font-semibold text-text-main mb-1">
                {t("freelancerProfile.portfolioEmpty")}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerPortfolioPage;
