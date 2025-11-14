// Transaction API utilities and endpoints
import { tokenUtils, apiConfig, handleAPIError, isNetworkError } from './api';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost:8080/api';

// Transaction request interfaces
export interface ProcessPaymentRequest {
  orderId: number;
  walletId: number;
}

// Transaction response interfaces
export interface TransactionData {
  transactionId: number;
  walletId: number;
  paymentMethodName: string | null;
  type: string;
  status: string;
  amount: number;
  createdAt: string;
  orderId: number | null;
}

export interface ProcessPaymentResponse {
  code: number;
  message: string;
  data: TransactionData;
}

export interface WalletTransactionsResponse {
  code: number;
  message: string;
  data: TransactionData[];
}

// Transaction API class
export class TransactionAPI {
  /**
   * Process payment for an order
   * @param paymentData - Payment processing data
   * @returns Promise with transaction response
   */
  static async processPayment(paymentData: ProcessPaymentRequest) {
    try {
      const token = tokenUtils.get();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/transactions/process-payment`, {
        method: 'POST',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result: ProcessPaymentResponse = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Process payment API error:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   * @param transactionId - Transaction ID to fetch
   * @returns Promise with transaction data
   */
  static async getTransaction(transactionId: number) {
    try {
      const token = tokenUtils.get();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Get transaction API error:', error);
      throw error;
    }
  }
  /**
   * Get all transactions for a wallet
   * @param walletId - Wallet ID to fetch transactions for
   * @returns Promise with transactions list
   */
  static async getWalletTransactions(walletId: number) {
    try {
      const token = tokenUtils.get();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/transactions/wallet/${walletId}`, {
        method: 'GET',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Get wallet transactions API error:', error);
      return { success: false, error };
    }
  }

  /**
   * Get user transactions by user ID
   * @param userId - User ID to fetch transactions for
   * @returns Promise with transactions list
   */
  static async getUserTransactions(userId: number) {
    try {
      const token = tokenUtils.get();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/transactions/user/${userId}`, {
        method: 'GET',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Get user transactions API error:', error);
      throw error;
    }
  }
}

// Export utility functions for convenience
export { handleAPIError, isNetworkError };

// Export default instance for easier usage
export default TransactionAPI;
