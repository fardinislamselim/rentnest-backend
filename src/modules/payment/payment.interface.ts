export interface ICreatePaymentIntentPayload {
  rentalRequestId: string;
}

export interface ICreatePaymentIntentResult {
  paymentId: string;
  checkoutUrl: string;
  sessionId: string;
  amount: number;
  currency: string;
}

export interface IConfirmPaymentPayload {
  paymentId: string;
}
