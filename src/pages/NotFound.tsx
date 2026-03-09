import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 number */}
        <div className="relative mb-6 select-none">
          <span className="text-[160px] sm:text-[200px] font-black text-gray-100 dark:text-gray-800 leading-none block">
            404
          </span>
          <div className="absolute inset-0 flex mt-6 items-center justify-center">
            <svg
              className="w-20 h-20 text-primary opacity-80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Сторінку не знайдено
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-8 leading-relaxed">
          Схоже, ця сторінка не існує або була переміщена.
          <br />
          Перевірте адресу або поверніться на головну.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            На головну
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
