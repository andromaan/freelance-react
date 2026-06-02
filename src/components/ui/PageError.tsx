import React from "react";
import { useNavigate } from "react-router-dom";

interface PageErrorProps {
  message: string;
  backToLabel?: string;
  backToPath?: string;
}

const PageError: React.FC<PageErrorProps> = ({ 
  message, 
  backToLabel = "Back to Home", 
  backToPath = "/" 
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (backToPath === "-1") {
      navigate(-1);
    } else {
      navigate(backToPath as any);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="relative mb-6 select-none">
          <span className="text-[120px] sm:text-[150px] font-black text-gray-400/80 dark:text-gray-800 leading-none block">
            Oops!
          </span>
          <div className="absolute inset-0 flex mt-4 items-center justify-center">
            <svg className="w-16 h-16 text-red-500 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Error
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={handleNavigation}
            className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            {backToLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageError;
