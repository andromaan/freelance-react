import React from "react";
import { Link } from "react-router-dom";
import { tokenStorage } from "../services/auth/tokenStorage";
import { useSearchFreelancersQuery } from "../services/freelancer/freelancerApi";
import { useGetProjectsFilteredQuery } from "../services/projects/projectsApi";
import { useGetAllCategoriesQuery } from "../services/categories/categoriesApi";
import FreelancerCard from "./freelancers/components/FreelancerCard";
import ProjectCard from "./projects/components/ProjectCard";

const howItWorks = [
  {
    step: "01",
    title: "Register",
    description: "Create a freelancer or employer account in a few minutes.",
  },
  {
    step: "02",
    title: "Find Work or Freelancer",
    description: "Browse job postings or freelancer profiles and choose the best fit.",
  },
  {
    step: "03",
    title: "Negotiate and Start",
    description: "Negotiate terms, sign the agreement, and start the project.",
  },
  {
    step: "04",
    title: "Receive Results",
    description: "The freelancer delivers the work, you confirm and pay through the platform.",
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Development": <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
  "Design": <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  "Content": <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  "Marketing": <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
};

const DefaultCategoryIcon = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />;

const Home: React.FC = () => {
  const isAuthenticated = tokenStorage.isAuthenticated();

  // Fetch Categories
  const { data: categories = [] } = useGetAllCategoriesQuery();

  // Fetch Latest Projects (also provides total projects)
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectsFilteredQuery({ page: 1, pageSize: 3 });
  const latestProjects = projectsData?.items ?? [];
  const totalProjects = projectsData?.totalCount ?? 0;

  // Fetch All Freelancers count
  const { data: allFreelancersData } = useSearchFreelancersQuery({ page: 1, pageSize: 1 });
  const totalFreelancers = allFreelancersData?.totalCount ?? 0;

  // Fetch Top Freelancers
  const { data: topFreelancersData, isLoading: isLoadingFreelancers } = useSearchFreelancersQuery({ page: 1, pageSize: 3, minRating: 4 });
  const topFreelancers = topFreelancersData?.items ?? [];

  return (
    <div className="bg-main transition-colors">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-surface border-b border-border pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-lighten" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-text-main leading-tight mb-6 tracking-tight">
            Find the perfect <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:from-primary dark:to-blue-400">
              freelancer
            </span> for your project
          </h1>
          <p className="text-lg sm:text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Thousands of verified professionals are ready to help your business grow. Fast, secure, quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/projects"
                  className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold rounded-xl text-white bg-primary hover:bg-primary-hover shadow-sm hover:shadow transition-all"
                >
                  Find Work
                </Link>
                <Link
                  to="/freelancers"
                  className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 shadow-sm hover:shadow transition-all"
                >
                  Find Freelancer
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold rounded-xl text-white bg-primary hover:bg-primary-hover shadow-sm hover:shadow transition-all"
                >
                  Start Free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 shadow-sm hover:shadow transition-all"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="bg-surface border-y border-border relative z-10 -mt-8 sm:-mt-12 mx-4 sm:mx-8 max-w-5xl xl:mx-auto rounded-2xl shadow-sm">
        <div className="px-6 py-8 sm:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100 dark:divide-gray-800">
            <div>
              <div className="text-3xl font-bold text-text-main mb-1">
                {totalFreelancers > 0 ? `${totalFreelancers}+` : "10k+"}
              </div>
              <div className="text-sm font-medium text-text-muted">Freelancers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-text-main mb-1">
                {totalProjects > 0 ? `${totalProjects}+` : "5k+"}
              </div>
              <div className="text-sm font-medium text-text-muted">Projects Posted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-text-main mb-1">98%</div>
              <div className="text-sm font-medium text-text-muted">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-text-main mb-1">24/7</div>
              <div className="text-sm font-medium text-text-muted">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST PROJECTS ── */}
      <section className="py-16 sm:py-24 bg-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">
                Latest Projects
              </h2>
              <p className="text-text-muted">
                Find the perfect opportunity to showcase your skills.
              </p>
            </div>
            <Link
              to="/projects"
              className="text-primary hover:text-primary-hover font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              View all projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {isLoadingProjects ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-surface rounded-xl animate-pulse" />
              ))}
            </div>
          ) : latestProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-surface rounded-xl border border-border">
              <p className="text-text-muted">No projects available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 sm:py-24 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-3">
              Popular Categories
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Browse top categories and find professionals in any field
            </p>
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  to="/freelancers"
                  key={cat.id}
                  className="group bg-main border border-border rounded-2xl p-6 flex items-start gap-5 hover:border-primary/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all"
                >
                  <div className="text-primary bg-surface shadow-sm border border-border-light p-3.5 rounded-xl flex-shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {categoryIcons[cat.name] || DefaultCategoryIcon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-main mb-1 group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-text-muted">
                      Explore {cat.name.toLowerCase()} experts
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-3 h-3 bg-gray-300 dark:bg-gray-700 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          )}
          
          <div className="mt-10 text-center">
             <Link
                to="/freelancers"
                className="inline-flex items-center gap-2 text-text-muted hover:text-primary dark:hover:text-primary font-medium transition-colors"
             >
                Browse all categories
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
             </Link>
          </div>
        </div>
      </section>

      {/* ── TOP FREELANCERS ── */}
      <section className="py-16 sm:py-24 bg-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">
                Top Rated Freelancers
              </h2>
              <p className="text-text-muted">
                Work with the best professionals on the platform.
              </p>
            </div>
            <Link
              to="/freelancers"
              className="text-primary hover:text-primary-hover font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              Find more freelancers
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {isLoadingFreelancers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-surface rounded-xl animate-pulse" />
              ))}
            </div>
          ) : topFreelancers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topFreelancers.map((freelancer) => (
                <FreelancerCard key={freelancer.id} freelancer={freelancer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-surface rounded-xl border border-border">
              <p className="text-text-muted">No freelancers available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-24 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-main mb-3">
              How It Works
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Get started by working or finding freelancers in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative">
            {/* Connecting lines for large screens */}
            <div className="hidden lg:block absolute top-6 left-16 right-16 h-0.5 bg-gray-100 dark:bg-gray-800 -z-10" />
            
            {howItWorks.map((item) => (
              <div key={item.step} className="relative bg-surface group">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white flex items-center justify-center text-lg font-bold mb-6 mx-auto sm:mx-0 transition-colors shadow-sm ring-1 ring-primary/50 dark:ring-aqua-950">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-text-main mb-2 text-center sm:text-left">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed text-center sm:text-left">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="py-20 sm:py-28 bg-primary dark:bg-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl mix-blend-overlay" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-blue-100 mb-10 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
              Join thousands of freelancers and clients who have already found each other.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex justify-center items-center bg-white text-primary hover:bg-gray-50 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Register as Freelancer
              </Link>
              <Link
                to="/register"
                className="inline-flex justify-center items-center bg-transparent border-2 border-white/80 text-white hover:bg-white/10 font-bold px-8 py-4 rounded-xl transition-all"
              >
                Find Freelancer
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
