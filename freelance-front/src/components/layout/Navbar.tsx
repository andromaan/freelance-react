import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tokenStorage } from "../../services/auth/tokenStorage";
import { userApi } from "../../services/user/userApi";
import { authApi } from "../../services/auth/authApi";
import { selectCurrentUser, clearUser } from "../../store/userSlice";
import type { AppDispatch } from "../../store";
import APP_ENV from "../../env";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = tokenStorage.isAuthenticated();
  const user = useSelector(selectCurrentUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    tokenStorage.clearTokens();
    dispatch(clearUser());
    dispatch(userApi.util.resetApiState());
    dispatch(authApi.util.resetApiState());
    navigate("/login");
  };

  const avatarLetters = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-90 transition-opacity"
        >
          <svg
            className="w-8 h-8"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="8" fill="#1976d2" />
            <path
              d="M8 22L14 10L20 18L23 14L26 22H8Z"
              fill="white"
              opacity="0.9"
            />
          </svg>
          <span>FreeLance</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
          >
            Головна
          </Link>
          <Link
            to="/jobs"
            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
          >
            Вакансії
          </Link>
          <Link
            to="/freelancers"
            className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
          >
            Фрілансери
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {user?.avatarImg ? (
                  <img
                    src={`${APP_ENV.API_URL}/${user.avatarImg}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {avatarLetters}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                  {user?.displayName ?? user?.email ?? "..."}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Мій профіль
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Вийти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Увійти
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors"
              >
                Реєстрація
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Меню"
        >
          {menuOpen ? (
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
                d="M6 18L18 6M6 6l12 12"
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 flex flex-col gap-2">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Головна
          </Link>
          <Link
            to="/jobs"
            className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Вакансії
          </Link>
          <Link
            to="/freelancers"
            className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Фрілансери
          </Link>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-2">
                  {user?.avatarImg ? (
                    <img
                      src={`${APP_ENV.API_URL}/${user.avatarImg}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {avatarLetters}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {user?.displayName ?? user?.email ?? "..."}
                  </span>
                </div>
                <Link
                  to="/profile"
                  className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Мій профіль
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium text-red-600 py-2"
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 text-sm font-medium py-2 hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Увійти
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white text-sm font-medium py-2 px-4 rounded-lg text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
