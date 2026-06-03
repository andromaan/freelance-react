import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import APP_ENV from "../../../../env";
import AmountStep from "../amountStep/AmountStep";
import CheckoutForm from "../checkoutForm/CheckoutForm";
import { formatCurrencyAmount } from "../../utils/currency";

// Ініціалізація Stripe (поза компонентом для уникнення повторного завантаження)
const stripePromise = loadStripe(APP_ENV.STRIPE_PUBLISHABLE_KEY ?? "");

type Step = "amount" | "payment";

export interface DepositModalProps {
  show: boolean;
  currency: string;
  presetAmount?: number; // якщо задано — одразу відкривається крок оплати
  onClose: () => void;
  onSuccess: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({
  show,
  currency,
  presetAmount,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<Step>("amount");
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState(0);

  // Скидаємо стан при відкритті модалки
  useEffect(() => {
    if (show) {
      if (presetAmount) {
        setConfirmedAmount(presetAmount);
        setStep("payment");
      } else {
        setStep("amount");
        setAmountInput("");
        setAmountError("");
        setConfirmedAmount(0);
      }
    }
  }, [show, presetAmount]);

  const handleAmountChange = (value: string) => {
    setAmountInput(value);
    setAmountError("");
  };

  const handleAmountNext = () => {
    const val = parseFloat(amountInput);
    if (!amountInput || isNaN(val) || val <= 0) {
      setAmountError("Enter a valid amount");
      return;
    }
    if (val < 10) {
      setAmountError(`Minimum amount — ${formatCurrencyAmount(10, currency)}`);
      return;
    }
    if (val > 50000) {
      setAmountError(
        `Maximum amount — ${formatCurrencyAmount(50000, currency)}`,
      );
      return;
    }
    setAmountError("");
    setConfirmedAmount(val);
    setStep("payment");
  };

  if (!show) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="modal-content bg-surface rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Шапка модалки */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h2 className="text-lg font-semibold text-text-main">
            {step === "amount" ? "Enter Amount" : "Payment"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
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
          </button>
        </div>

        <div className="px-6 py-5">
          {/* Крок 1: ввід суми */}
          {step === "amount" && (
            <AmountStep
              amountInput={amountInput}
              amountError={amountError}
              currency={currency}
              onChange={handleAmountChange}
              onNext={handleAmountNext}
            />
          )}

          {/* Крок 2: форма оплати Stripe */}
          {step === "payment" && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={confirmedAmount}
                currency={currency}
                onSuccess={onSuccess}
                onCancel={() => setStep("amount")}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
