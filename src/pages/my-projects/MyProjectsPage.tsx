import { useState, useMemo } from "react";
import {
  useGetProjectsByEmployerQuery,
  useDeleteProjectMutation,
} from "../../services/projects/projectsApi";
import ProjectCard from "./components/ProjectCard";
import ProjectTable from "./components/ProjectTable";
import CreateProjectModal from "./components/CreateProjectModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { ProjectStatus } from "../../types/project.types";
import { toast } from "react-toastify";

// TABS DEFINITION
type TabKey = "all" | "open" | "inProgress" | "completed" | "cancelled";

const TABS: { key: TabKey; status: ProjectStatus | null; label: string; icon: React.ReactNode }[] = [
  {
    key: "all",
    status: null,
    label: "All Projects",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    key: "open",
    status: ProjectStatus.Open,
    label: "Open",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "inProgress",
    status: ProjectStatus.InProgress,
    label: "In Progress",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: "completed",
    status: ProjectStatus.Completed,
    label: "Completed",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    key: "cancelled",
    status: ProjectStatus.Cancelled,
    label: "Cancelled",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
];

const MyProjectsPage = () => {
  const { data: myProjects, isLoading, error } = useGetProjectsByEmployerQuery();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const [activeTabKey, setActiveTabKey] = useState<TabKey>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [projectIdToDelete, setProjectIdToDelete] = useState<string | null>(null);

  const activeTabConfig = TABS.find((t) => t.key === activeTabKey) || TABS[0];

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

  const filteredProjects = useMemo(() => {
    if (!myProjects) return [];
    return myProjects.filter((p) =>
      activeTabConfig.status === null ? true : p.status === activeTabConfig.status
    );
  }, [myProjects, activeTabConfig]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-main transition-colors flex">
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-surface border-r border-border min-h-[calc(100vh-64px)]">
        <div className="text-2xl font-bold text-center text-text-main p-6 border-b border-border">
          My Projects
        </div>

        <div className="p-4 border-b border-border">
           <button
             onClick={() => setIsCreateModalOpen(true)}
             className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
             </svg>
             Create Project
           </button>
        </div>

        <nav aria-label="Projects sections" className="flex-1 py-3">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTabKey(key)}
              aria-current={activeTabKey === key ? "page" : undefined}
              className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-left transition-colors border-r-2 ${
                activeTabKey === key
                  ? "bg-primary/5 dark:bg-primary/10 text-primary border-primary"
                  : "text-text-muted border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className={activeTabKey === key ? "text-primary" : "text-gray-400 dark:text-gray-500"}>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header area */}
        <div className="lg:hidden bg-surface border-b border-border p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-text-main">My Projects</h1>
            <button
             onClick={() => setIsCreateModalOpen(true)}
             className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-3 rounded-xl transition-colors text-xs shadow-sm flex items-center gap-1"
           >
             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
             </svg>
             Create
           </button>
        </div>
        {/* Mobile tab bar */}
        <div className="lg:hidden bg-surface border-b border-border px-4 flex gap-1 overflow-x-auto">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTabKey(key)}
              aria-current={activeTabKey === key ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTabKey === key
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <main className="flex-1 p-6 lg:p-8 max-w-4xl w-full mx-auto">
          <div className="mb-6 pb-5 border-b border-border flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-main">
              {activeTabConfig.label}
            </h1>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {isLoading && (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                Failed to load projects.
              </div>
            )}
            {!isLoading && !error && filteredProjects.length === 0 && (
              <div className="text-center p-12 bg-surface rounded-2xl border border-border">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-text-muted text-lg">No projects found in this category.</p>
              </div>
            )}
            {!isLoading && !error && filteredProjects.length > 0 && (
              viewMode === "list" ? (
                <ProjectTable projects={filteredProjects} onDelete={(id) => setProjectIdToDelete(id)} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} onDelete={(id) => setProjectIdToDelete(id)} />
                  ))}
                </div>
              )
            )}
          </div>
        </main>
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
