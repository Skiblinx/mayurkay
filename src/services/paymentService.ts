
export interface PaymentData {
  amount: number;
  currency: string;
  customerInfo: {
    email: string;
    mobile: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// This is a mock payment service that can be replaced with real payment integration
export const processPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock payment success/failure (90% success rate for demo)
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    return {
      success: true,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } else {
    return {
      success: false,
      error: "Payment failed. Please try again or contact support.",
    };
  }
};

// Placeholder for Stripe integration
export const createStripeSession = async (paymentData: PaymentData): Promise<{ url: string }> => {
  // This would integrate with Stripe when configured
  console.log('Stripe integration placeholder', paymentData);
  throw new Error('Stripe integration not configured. Please set up Stripe keys.');
};
