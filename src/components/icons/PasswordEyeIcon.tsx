import React from "react";

interface Props {
  className?: string;
  isClosed: boolean;
}

const PasswordEyeIcon: React.FC<Props> = ({ className, isClosed }) => {
  return (
    <div className={className}>
      {isClosed ? (
        <svg
          viewBox="1 1 24 24"
          width="22" height="22"
          stroke="currentColor"
          fill="none"
        >
          <path
            d="M2 2L22 22"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
        >
          <path
            d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3.16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default PasswordEyeIcon;
