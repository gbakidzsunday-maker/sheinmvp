/**
 * Paystack integration for card-only payments.
 * All amounts are in kobo internally (₦1 = 100 kobo).
 */

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

interface InitializePaymentParams {
  email: string;
  amount: number; // in kobo
  reference: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

interface InitializePaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializePayment(params: InitializePaymentParams): Promise<InitializePaymentResponse> {
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: params.amount,
      reference: params.reference,
      callback_url: params.callback_url,
      metadata: params.metadata,
      channels: ['card'], // CARD ONLY — disable bank transfer, USSD, etc.
    }),
  });

  return response.json();
}

interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    paid_at: string;
    channel: string;
    metadata: any;
    customer: {
      email: string;
    };
    authorization: {
      authorization_code: string;
      card_type: string;
      last4: string;
    };
  };
}

export async function verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
    },
  });

  return response.json();
}

export function generateReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `SHEIN_${timestamp}${random}`.toUpperCase();
}
