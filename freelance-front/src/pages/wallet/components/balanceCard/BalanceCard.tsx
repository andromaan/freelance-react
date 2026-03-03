import React from "react";

interface BalanceCardProps {
  formattedBalance: string | null;
  isLoading: boolean;
  onDeposit: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  formattedBalance,
  isLoading,
  onDeposit,
}) => {
  return (
    <div className="bg-gradient-to-br from-primary to-blue-700 dark:from-blue-900 dark:to-blue-950 rounded-2xl p-6 text-white shadow-lg mb-6">
      <p className="text-sm text-blue-100 mb-1">Поточний баланс</p>
      {isLoading ? (
        <div className="h-9 w-32 bg-white/20 animate-pulse rounded-lg" />
      ) : (
        <p className="text-4xl font-bold tracking-tight">
          {formattedBalance ?? "—"}
        </p>
      )}
      <button
        onClick={onDeposit}
        className="mt-5 inline-flex items-center gap-2 bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Поповнити
      </button>
    </div>
  );
};

export default BalanceCard;
