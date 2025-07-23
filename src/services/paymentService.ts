
import { loadStripe } from '@stripe/stripe-js';
import { apiClient } from './apiClient';
import type { ApiResponse } from '@/types/api';

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
  paymentIntentId?: string;
}

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

// Initialize Stripe
const getStripe = () => {
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Stripe publishable key not configured');
  }
  return loadStripe(publishableKey);
};

// Create payment intent
export const createPaymentIntent = async (paymentData: PaymentData): Promise<PaymentIntent> => {
  try {
    const response = await apiClient.post<ApiResponse<PaymentIntent>>('/payments/create-payment-intent', {
      amount: paymentData.amount,
      currency: paymentData.currency.toLowerCase(),
      items: paymentData.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      customerInfo: paymentData.customerInfo,
      metadata: {
        customer_email: paymentData.customerInfo.email,
        customer_name: paymentData.customerInfo.fullName
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Create payment intent error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create payment intent');
  }
};

// Process payment using Stripe Elements
export const processStripePayment = async (
  stripe: any,
  elements: any,
  paymentIntentId: string,
  customerInfo: PaymentData['customerInfo']
): Promise<PaymentResult> => {
  try {
    if (!stripe || !elements) {
      throw new Error('Stripe not properly initialized');
    }

    const cardElement = elements.getElement('card');
    if (!cardElement) {
      throw new Error('Card element not found');
    }

    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentId, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.mobile,
          address: {
            line1: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
          },
        },
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Payment failed',
      };
    }

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        transactionId: paymentIntent.id,
        paymentIntentId: paymentIntent.id,
      };
    } else {
      return {
        success: false,
        error: 'Payment was not successful',
      };
    }
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed',
    };
  }
};

// Confirm payment and create order
export const confirmPaymentAndCreateOrder = async (
  paymentIntentId: string,
  paymentData: PaymentData
): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(`/payments/confirm/${paymentIntentId}`, {
      customerInfo: paymentData.customerInfo,
      items: paymentData.items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        street: paymentData.customerInfo.address,
        city: paymentData.customerInfo.city,
        state: paymentData.customerInfo.state,
        country: 'Nigeria',
        postalCode: '000000' // You might want to add postal code to the form
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('Confirm payment error:', error);
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

// Get payment status
export const getPaymentStatus = async (paymentIntentId: string): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(`/payments/status/${paymentIntentId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get payment status error:', error);
    throw new Error(error.response?.data?.message || 'Failed to get payment status');
  }
};

// Cancel payment
export const cancelPayment = async (paymentIntentId: string): Promise<any> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(`/payments/cancel/${paymentIntentId}`, {});
    return response.data;
  } catch (error: any) {
    console.error('Cancel payment error:', error);
    throw new Error(error.response?.data?.message || 'Failed to cancel payment');
  }
};

// Legacy function for backward compatibility (now uses Stripe)
export const processPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
  try {
    // Create payment intent
    const paymentIntent = await createPaymentIntent(paymentData);
    
    // This would normally be handled by the checkout form with Stripe Elements
    // For now, we'll return the payment intent information
    return {
      success: false,
      error: 'Please use the new Stripe checkout form',
      paymentIntentId: paymentIntent.paymentIntentId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
};

// Export Stripe instance getter
export { getStripe };
