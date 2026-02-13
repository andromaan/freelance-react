import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-5">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg max-w-2xl">
        <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-semibold mb-4">
          Ласкаво просимо на Freelance Platform!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-8">
          Ви успішно увійшли в систему.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white border-none rounded-lg px-8 py-3 text-base font-medium cursor-pointer transition-all"
        >
          Вийти
        </button>
      </div>
    </div>
  );
};

export default Home;
