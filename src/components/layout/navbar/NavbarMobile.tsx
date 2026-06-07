import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { selectCurrentUser } from "../../../store/userSlice";
import { useSelector } from "react-redux";
import { tokenStorage } from "../../../services/auth/tokenStorage";
import { avatarLetters, userImageUrl } from "../../../utils";
import { useTheme } from "../../../context/ThemeContext";
import { ROLES } from "../../../constants/roles";
import LanguageSwitcher from "../../ui/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import freelanceIconUrl from "../../icons/FreelanceIcon.svg";
import { selectUnreadCount } from "../../../store/notificationSlice";

interface Props {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-xl transition-all duration-200 ${
    isActive
      ? "text-primary bg-primary/10 dark:bg-primary/15"
      : "text-text-main hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800"
  }`;

const NavbarMobile: React.FC<Props> = ({
  menuOpen,
  setMenuOpen,
  handleLogout,
}) => {
  const isAuthenticated = tokenStorage.isAuthenticated();
  const user = useSelector(selectCurrentUser);
  const unreadCount = useSelector(selectUnreadCount);
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide-in drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-[min(320px,85vw)] bg-surface border-l border-border shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-primary"
            onClick={() => setMenuOpen(false)}
          >
            <img src={freelanceIconUrl} alt="" className="w-7 h-7" />
            <span>FreeLance</span>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-lg text-text-muted hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* User card (authenticated) */}
          {isAuthenticated && user && (
            <Link
              to="/profile/edit-profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 mx-4 mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-border hover:border-primary/40 transition-colors"
            >
              {user.avatarImg ? (
                <img
                  src={userImageUrl(user.avatarImg)}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                  {avatarLetters(user)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-main truncate">
                  {user.displayName ?? user.email ?? "..."}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user.email}
                </p>
              </div>
              <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {/* Navigation links */}
          <nav className="px-4 mt-4 flex flex-col gap-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-3 mb-1">
              {t("navbar.home")}
            </p>
            <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)} end>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
              </svg>
              {t("navbar.home")}
            </NavLink>
            <NavLink to="/projects" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {t("navbar.projects")}
            </NavLink>
            <NavLink to="/freelancers" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t("navbar.freelancers")}
            </NavLink>
          </nav>

          {/* Authenticated user links */}
          {isAuthenticated && (
            <nav className="px-4 mt-5 flex flex-col gap-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-3 mb-1">
                {t("navbar.profile")}
              </p>
              <Link
                to="/profile/edit-profile"
                className="flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-xl text-text-main hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t("navbar.profile")}
              </Link>
              {user?.role?.name === ROLES.EMPLOYER && (
                <Link
                  to="/my-projects"
                  className="flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-xl text-text-main hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {t("navbar.projects")}
                </Link>
              )}
              <Link
                to="/my-contracts"
                className="flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-xl text-text-main hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t("navbar.myContracts")}
              </Link>
              <Link
                to="/my-disputes"
                className="flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-xl text-text-main hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {t("navbar.myDisputes", "My Disputes")}
              </Link>
              <Link
                to="/wallet"
                className="flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-xl text-text-main hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="16" rx="2" />
                  <path d="M18,6V4.66a2,2,0,0,0-2.55-1.93L2.88,6.34" />
                  <path fillRule="evenodd" d="M22,11.64H18.18A2.18,2.18,0,0,0,16,13.82h0A2.19,2.19,0,0,0,18.18,16H22" />
                </svg>
                {t("navbar.wallet")}
              </Link>
              <Link
                to="/notifications"
                className="flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-xl text-text-main hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                onClick={() => setMenuOpen(false)}
              >
                <div className="relative w-5 h-5 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                {t("navbar.notifications")}
                {unreadCount > 0 && (
                  <span className="ml-auto text-xs font-semibold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </nav>
          )}
        </div>

        {/* Bottom sticky area */}
        <div className="flex-shrink-0 border-t border-border bg-surface">
          {/* Theme & Language controls */}
          <div className="px-4 py-3 flex items-center gap-2">
            <LanguageSwitcher dropUp />
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 flex-1 py-2 px-3 text-sm font-medium text-text-main bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12H3m15.36 4.95l-.7-.7M6.34 6.34l-.7-.7m12.02 0l-.7.7M6.34 17.66l-.7.7M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
              <span>{t("navbar.theme")}</span>
            </button>
          </div>

          {/* Auth actions */}
          <div className="px-4 pb-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t("navbar.logout")}
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 text-center text-sm font-semibold py-2.5 px-4 rounded-xl text-text-main bg-gray-100 dark:bg-gray-800 border border-border hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center text-sm font-semibold py-2.5 px-4 rounded-xl text-white bg-primary hover:bg-primary-hover transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("navbar.signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMobile;
