import React from "react";
import { PRESET_AMOUNTS, formatCurrencyAmount } from "../../utils/currency";

interface QuickDepositProps {
  currency: string;
  onSelect: (amount: number) => void;
}

const QuickDeposit: React.FC<QuickDepositProps> = ({ currency, onSelect }) => {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Quick Deposit
      </p>
      <div className="flex flex-wrap gap-2">
        {PRESET_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => onSelect(amt)}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
          >
            {formatCurrencyAmount(amt, currency)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickDeposit;
