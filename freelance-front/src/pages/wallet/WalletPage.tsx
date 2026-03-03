import React, { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import {
  useGetBalanceQuery,
  useCreatePaymentIntentMutation,
  useConfirmDepositMutation,
} from "../../services/wallet/walletApi";
import APP_ENV from "../../env";

// Ініціалізація Stripe (поза компонентом для уникнення повторного завантаження)
const stripePromise = loadStripe(APP_ENV.STRIPE_PUBLISHABLE_KEY ?? "");

// ----- Форма оплати (всередині Elements context) -----
interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      color: "#374151",
      fontFamily: "inherit",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  onSuccess,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();

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
        amount: Math.round(amount * 100), // конвертуємо в центи
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
        setCardError(stripeError.message ?? "Помилка оплати");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setCardError("Платіж не підтверджено");
        return;
      }

      // 3. Повідомити бекенд про успішну оплату
      await confirmDeposit({ paymentIntentId }).unwrap();

      toast.success(`Успішно поповнено на ${amount} грн!`);
      onSuccess();
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || "Помилка під час оплати";
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Сума */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">
          Сума поповнення
        </p>
        <p className="text-2xl font-bold text-primary">{amount} грн</p>
      </div>

      {/* Stripe CardElement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Дані картки
        </label>
        <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg px-3 py-3 bg-white dark:bg-gray-700 focus-within:border-primary transition-colors">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => setCardError(e.error?.message ?? null)}
          />
        </div>
        {cardError && (
          <p className="text-red-500 text-xs mt-1.5">{cardError}</p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
          Тестова картка: 4242 4242 4242 4242 · будь-яка дата · будь-який CVC
        </p>
      </div>

      {/* Дії */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-3 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          Скасувати
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
          {isLoading ? "Обробка…" : "Оплатити"}
        </button>
      </div>
    </form>
  );
};

// ----- Основна сторінка -----
type Step = "amount" | "payment";

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2000];

const WalletPage: React.FC = () => {
  const {
    data: balance,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useGetBalanceQuery();

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<Step>("amount");
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState(0);

  const openModal = () => {
    setStep("amount");
    setAmountInput("");
    setAmountError("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAmountNext = () => {
    const val = parseFloat(amountInput);
    if (!amountInput || isNaN(val) || val <= 0) {
      setAmountError("Введіть коректну суму");
      return;
    }
    if (val < 10) {
      setAmountError("Мінімальна сума — 10 грн");
      return;
    }
    if (val > 50000) {
      setAmountError("Максимальна сума — 50 000 грн");
      return;
    }
    setAmountError("");
    setConfirmedAmount(val);
    setStep("payment");
  };

  const handleSuccess = useCallback(() => {
    setShowModal(false);
    refetchBalance();
  }, [refetchBalance]);

  const formattedBalance =
    balance != null
      ? new Intl.NumberFormat("uk-UA", {
          style: "currency",
          currency: balance.currency ?? "UAH",
          maximumFractionDigits: 2,
        }).format(balance.balance)
      : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Заголовок */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Гаманець
      </h1>

      {/* Картка балансу */}
      <div className="bg-gradient-to-br from-primary to-blue-700 dark:from-blue-900 dark:to-blue-950 rounded-2xl p-6 text-white shadow-lg mb-6">
        <p className="text-sm text-blue-100 mb-1">Поточний баланс</p>
        {balanceLoading ? (
          <div className="h-9 w-32 bg-white/20 animate-pulse rounded-lg" />
        ) : (
          <p className="text-4xl font-bold tracking-tight">
            {formattedBalance ?? "—"}
          </p>
        )}
        <button
          onClick={openModal}
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

      {/* Швидкий вибір суми (підказка) */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Швидке поповнення
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setAmountInput(String(amt));
                setAmountError("");
                setConfirmedAmount(amt);
                setStep("payment");
                setShowModal(true);
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              {amt} грн
            </button>
          ))}
        </div>
      </div>

      {/* Модальне вікно */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Шапка модалки */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {step === "amount" ? "Сума поповнення" : "Оплата"}
              </h2>
              <button
                onClick={closeModal}
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
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Введіть суму (грн)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={50000}
                      step={1}
                      value={amountInput}
                      onChange={(e) => {
                        setAmountInput(e.target.value);
                        setAmountError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleAmountNext()}
                      placeholder="Наприклад: 500"
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

                  {/* Пресети */}
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmountInput(String(amt));
                          setAmountError("");
                        }}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                          amountInput === String(amt)
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary"
                        }`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAmountNext}
                    className="w-full py-3 text-sm font-semibold rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors"
                  >
                    Далі →
                  </button>
                </div>
              )}

              {/* Крок 2: форма оплати Stripe */}
              {step === "payment" && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    amount={confirmedAmount}
                    onSuccess={handleSuccess}
                    onCancel={() => setStep("amount")}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
