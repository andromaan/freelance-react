export interface WalletBalanceVM {
  balance: number;
  currency: string;
}

export interface CreatePaymentIntentVM {
  amount: number;
  currency: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface ConfirmDepositVM {
  paymentIntentId: string;
}
