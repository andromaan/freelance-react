import React, { useState, useCallback } from "react";
import { useGetBalanceQuery } from "../../services/wallet/walletApi";
import BalanceCard from "./components/balanceCard/BalanceCard";
import QuickDeposit from "./components/quickDeposit/QuickDeposit";
import DepositModal from "./components/depositModal/DepositModal";

const WalletPage: React.FC = () => {
  const {
    data: wallet,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useGetBalanceQuery();

  const [showModal, setShowModal] = useState(false);
  const [presetAmount, setPresetAmount] = useState<number | undefined>();

  const currency = wallet?.currency ?? "UAH";

  const openModal = () => {
    setPresetAmount(undefined);
    setShowModal(true);
  };

  const openModalWithPreset = (amount: number) => {
    setPresetAmount(amount);
    setShowModal(true);
  };

  const handleSuccess = useCallback(() => {
    setShowModal(false);
    refetchBalance();
  }, [refetchBalance]);

  const formattedBalance =
    wallet != null
      ? new Intl.NumberFormat("uk-UA", {
          style: "currency",
          currency,
          maximumFractionDigits: 2,
        }).format(wallet.balance)
      : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        My Wallet
      </h1>

      <BalanceCard
        formattedBalance={formattedBalance}
        isLoading={balanceLoading}
        onDeposit={openModal}
      />

      <QuickDeposit currency={currency} onSelect={openModalWithPreset} />

      <DepositModal
        show={showModal}
        currency={currency}
        presetAmount={presetAmount}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default WalletPage;
