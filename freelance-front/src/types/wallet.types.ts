export interface WalletBalanceVM {
  balance: number;
  currency: string;
}

export interface CreatePaymentIntentVM {
  amount: number; // in cents
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface ConfirmDepositVM {
  paymentIntentId: string;
}
