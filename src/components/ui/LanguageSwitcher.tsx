import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import ukFlag from "../../assets/united-kingdom.png";
import uaFlag from "../../assets/ukraine.png";

const languages = [
  {
    code: "en",
    nativeCode: "en",
    name: "English",
    flag: ukFlag,
  },
  {
    code: "uk",
    nativeCode: "укр",
    name: "Українська",
    flag: uaFlag,
  },
];

const LanguageSwitcher: React.FC<{ dropUp?: boolean }> = ({
  dropUp = false,
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
        aria-label="Switch language"
      >
        <img
          src={currentLanguage.flag}
          alt={`${currentLanguage.code} flag`}
          className="w-5 h-auto rounded-[2px]"
        />
        <span className="hidden sm:inline-block uppercase">
          {currentLanguage.nativeCode}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute ${dropUp ? "bottom-full mb-2" : "mt-2"} lg:right-0 xs:left-0 w-40 bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-[60] animate-in slide-in-from-top-2`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm dark:text-sky-400 transition-colors hover:bg-primary/10  ${
                i18n.language === lang.code
                  ? "text-primary font-medium"
                  : "text-text-main"
              }`}
            >
              <img
                src={lang.flag}
                alt={`${lang.code} flag`}
                className="w-5 h-auto rounded-[2px]"
              />
              {lang.name}
              {i18n.language === lang.code && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
