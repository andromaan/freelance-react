import React from "react";
import { Link, NavLink } from "react-router-dom";
import { selectCurrentUser } from "../../../store/userSlice";
import { useSelector } from "react-redux";
import { tokenStorage } from "../../../services/auth/tokenStorage";
import { avatarLetters, userImageUrl } from "../../../utils";
import { useTheme } from "../../../context/ThemeContext";
import { ROLES } from "../../../constants/roles";
import LanguageSwitcher from "../../ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface Props {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const NavbarMobile: React.FC<Props> = ({
  menuOpen,
  setMenuOpen,
  handleLogout,
}) => {
  const isAuthenticated = tokenStorage.isAuthenticated();
  const user = useSelector(selectCurrentUser);
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full border-b border-border bg-surface px-4 py-4 flex flex-col gap-2 shadow-lg z-40">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 ease-in-out ${
                isActive
                  ? "text-primary bg-primary/10 dark:text-sky-400"
                  : "text-text-main hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 bg-gray-200/70 dark:bg-gray-700/50"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            {t("navbar.home")}
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 ease-in-out ${
                isActive
                  ? "text-primary bg-primary/10 dark:text-sky-400"
                  : "text-text-main hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 bg-gray-200/70 dark:bg-gray-700/50"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            {t("navbar.projects")}
          </NavLink>
          <NavLink
            to="/freelancers"
            className={({ isActive }) =>
              `text-sm font-medium py-2 px-3 rounded-lg transition-all duration-300 ease-in-out ${
                isActive
                  ? "text-primary bg-primary/10 dark:text-sky-400"
                  : "text-text-main hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 bg-gray-200/70 dark:bg-gray-700/50"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            {t("navbar.freelancers")}
          </NavLink>
          <div className="border-t border-border pt-2 mt-1 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  {user?.avatarImg ? (
                    <img
                      src={userImageUrl(user.avatarImg)}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {avatarLetters(user)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {user?.displayName ?? user?.email ?? "..."}
                  </span>
                </div>
                <Link
                  to="/profile/edit-profile"
                  className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary px-3 bg-gray-200/70 dark:bg-gray-700/50 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("navbar.profile")}
                </Link>
                {user?.role?.name === ROLES.EMPLOYER && (
                  <Link
                    to="/my-projects"
                    className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary px-3 bg-gray-200/70 dark:bg-gray-700/50 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    {t("navbar.projects")}
                  </Link>
                )}
                <Link
                  to="/my-contracts"
                  className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary px-3 bg-gray-200/70 dark:bg-gray-700/50 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("navbar.myContracts")}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium text-red-600 dark:text-red-400 py-2 px-3 border border-red-500/50 rounded-lg bg-red-100/70 dark:bg-red-900/30"
                >
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary px-3 bg-gray-200/70 dark:bg-gray-700/50 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary px-3 border border-primary/50 rounded-lg bg-primary/10 dark:bg-sky-900/30"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("navbar.signup")}
                </Link>
              </>
            )}
          </div>
          <div className="border-t border-border py-2 flex items-center justify-between gap-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="py-2 px-3 text-text-muted bg-gray-200/70 dark:bg-gray-700/50 rounded-lg transition-colors flex items-center justify-between w-full"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-3">
                Theme
              </span>

              <div className="px-2">
                {theme === "dark" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12H3m15.36 4.95l-.7-.7M6.34 6.34l-.7-.7m12.02 0l-.7.7M6.34 17.66l-.7.7M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarMobile;
