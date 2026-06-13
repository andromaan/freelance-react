import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ArrowIcon from "../../../components/icons/ArrowIcon";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  portfolioUrl?: string;
}

interface PortfolioCardProps {
  item: PortfolioItem;
  index: number;
  clampDescription?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item, index, clampDescription = true }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-emerald-400 to-cyan-500",
    "from-violet-500 to-fuchsia-500",
    "from-amber-400 to-orange-500",
    "from-pink-500 to-rose-500",
  ];
  const gradient = gradients[index % gradients.length];
  const urlStr = item.portfolioUrl?.toLowerCase() || "";
  const isGithub = urlStr.includes("github.com");
  const isDribbble = urlStr.includes("dribbble.com");

  return (
    <div className="group flex flex-col bg-surface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative">
      {item.portfolioUrl && (
        <a
          href={item.portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-0"
          aria-label={item.title}
        />
      )}
      <div
        className={`pl-4 h-16 w-full bg-gradient-to-br ${gradient} opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-start relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        {isGithub ? (
          <svg
            className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform relative z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        ) : isDribbble ? (
          <svg
            className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform relative z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.156-.13-.316-.2-.476-1.328-3.143-2.825-5.992-2.868-6.071l-.019-.033A8.47 8.47 0 0118.605 6.61zM12 3.5c2.316 0 4.417.93 5.948 2.443-.092.164-1.378 2.435-2.73 5.485-3.003-1.285-6.196-1.579-6.398-1.596-.062-.004-.131-.01-.197-.01-.062 0-.127 0-.192.002C8.361 9.426 8.272 9.06 8.169 8.675 6.945 4.103 4.606 1.821 4.545 1.761 6.551 1.018 8.877 1.018 10.883 1.761c.061.06 2.4 2.342 3.624 6.914zM3.5 12c0-1.077.2-2.106.565-3.064.218.156 3.193 2.193 4.428 6.223a31.396 31.396 0 00-4.887 2.115A8.468 8.468 0 013.5 12zm8.5 8.5c-2.072 0-3.97-.74-5.454-1.97.106-.051 2.223-1.01 4.962-1.996 1.353 3.681 1.956 7.155 1.99 7.375C12.983 20.354 12.497 20.5 12 20.5zm6.536-2.505a8.483 8.483 0 01-4.086 2.32c-.08-.544-.658-3.94-1.928-7.513 2.825-.333 5.568.18 5.867.24a8.476 8.476 0 01.147 4.953z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-12 h-12 text-white/80 group-hover:text-white group-hover:scale-110 transition-transform relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col relative pointer-events-none">
        <h4 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors line-clamp-1 mb-2">
          {item.title}
        </h4>
        {item.description ? (
          <div className="mb-4 flex-1">
            <p className={`text-sm text-text-muted whitespace-pre-line ${clampDescription && !isExpanded ? "line-clamp-2" : ""}`}>
              {item.description}
            </p>
            {clampDescription && item.description.length > 80 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-xs text-primary font-medium mt-1 hover:underline focus:outline-none pointer-events-auto relative z-10"
              >
                {isExpanded
                  ? t("freelancerProfile.showLess", "Show less")
                  : t("freelancerProfile.readMore", "Read more")}
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1"></div>
        )}
        {item.portfolioUrl && (
          <div className="mt-auto pt-4 border-t border-border-light flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">
            <span>{t("freelancerProfile.viewLink", "View link")}</span>
            <ArrowIcon direction="right" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;
