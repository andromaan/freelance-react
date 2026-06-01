import React from "react";
import { PRESET_AMOUNTS, formatCurrencyAmount } from "../../utils/currency";

interface AmountStepProps {
  amountInput: string;
  amountError: string;
  currency: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

const AmountStep: React.FC<AmountStepProps> = ({
  amountInput,
  amountError,
  currency,
  onChange,
  onNext,
}) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Enter Amount ({currency})
        </label>
        <input
          type="number"
          min={10}
          max={50000}
          step={1}
          value={amountInput}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onNext()}
          placeholder="For example: 500"
          autoFocus
          className={`w-full px-3 py-3 border-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            amountError
              ? "border-red-500 focus:border-red-500"
              : "border-gray-200 dark:border-gray-600 focus:border-primary"
          }`}
        />
        {amountError && (
          <p className="text-red-500 text-xs mt-1">{amountError}</p>
        )}
      </div>

      {/* Preset Amounts */}
      <div className="flex flex-wrap gap-2">
        {PRESET_AMOUNTS.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => onChange(String(amt))}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
              amountInput === String(amt)
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary"
            }`}
          >
            {formatCurrencyAmount(amt, currency)}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="flex items-center justify-center gap-1 w-full py-3 text-sm font-semibold 
        rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors"
      >
        Next
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          transform="scale(-1)"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default AmountStep;
