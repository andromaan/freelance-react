import React from "react";

interface PageLoadingProps {
  message?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">{message}</p>
    </div>
  );
};

export default PageLoading;
