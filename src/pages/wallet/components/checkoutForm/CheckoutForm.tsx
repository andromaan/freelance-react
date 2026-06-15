import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import {
  useCreatePaymentIntentMutation,
  useConfirmDepositMutation,
} from "../../../../services/wallet/walletApi";
import { toStripeAmount, formatCurrencyAmount } from "../../utils/currency";
import { useTheme } from "../../../../context/ThemeContext";

export interface CheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  currency,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const isDark = useTheme().theme === "dark";

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "15px",
        color: isDark ? "#f3f4f6" : "#111827",
        fontFamily: "inherit",
        backgroundColor: "transparent",
        "::placeholder": { color: isDark ? "#6b7280" : "#9ca3af" },
        iconColor: isDark ? "#9ca3af" : "#6b7280",
      },
      invalid: { color: "#ef4444", iconColor: "#ef4444" },
    },
  };

  const [createPaymentIntent, { isLoading: creatingIntent }] =
    useCreatePaymentIntentMutation();
  const [confirmDeposit, { isLoading: confirming }] =
    useConfirmDepositMutation();

  const [cardError, setCardError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const isLoading = creatingIntent || confirming || processing;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError(null);

    try {
      // 1. Створити PaymentIntent на бекенді
      const intentData = await createPaymentIntent({
        amount: toStripeAmount(amount, currency),
        currency,
      }).unwrap();

      const { clientSecret, paymentIntentId } = intentData;

      // 2. Підтвердити платіж через Stripe.js
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) {
        setCardError(stripeError.message ?? "Payment error");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setCardError("Payment not confirmed");
        return;
      }

      // 3. Повідомити бекенд про успішну оплату
      await confirmDeposit({ paymentIntentId }).unwrap();

      toast.success(
        `Successfully topped up by ${formatCurrencyAmount(amount, currency)}!`,
      );
      onSuccess();
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "An error occurred during payment";
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Сума */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 text-center">
        <p className="text-sm text-text-muted mb-0.5">
          Enter Amount ({currency})
        </p>
        <p className="text-2xl font-bold text-primary">
          {formatCurrencyAmount(amount, currency)}
        </p>
      </div>

      {/* Stripe CardElement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 bg-surface focus-within:border-primary transition-colors">
          <CardElement
            options={cardElementOptions}
            onChange={(e) => setCardError(e.error?.message ?? null)}
          />
        </div>
        {cardError && (
          <p className="text-red-500 text-xs mt-1.5">{cardError}</p>
        )}
        
      </div>

      {/* Дії */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-3 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 px-4 py-3 text-sm font-semibold rounded-lg bg-primary hover:bg-primary-hover text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {isLoading ? "Processing…" : "Pay"}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
