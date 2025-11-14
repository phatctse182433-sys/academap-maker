// Order API utilities and endpoints
import { tokenUtils, apiConfig, handleAPIError, isNetworkError } from './api';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'http://localhost:8080/api';

// Order request interfaces
export interface CreateOrderRequest {
  userId: number;
  packageId: number;
  status: string;
}

// Order response interfaces
export interface OrderPackage {
  packageId: number;
  name: string;
  price: number;
  apiCallLimit: string;
  durationDays: string;
  createdAt: string;
  updatedAt: string;
  category: string | null;
  templates: any[];
  apiKeys: any[];
}

export interface OrderUser {
  id: number;
  mail: string;
  fullName: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  userStatus: string;
  collections: any[];
  templates: any[];
  apiKeys: any[];
  wallet: {
    walletId: number;
    balance: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface OrderData {
  orderId: number;
  status: string;
  orderDate: string;
  activatedAt: string | null;
  expiredAt: string | null;
  completedAt: string | null;
  packages: OrderPackage;
  user: OrderUser;
  transaction: any;
}

export interface CreateOrderResponse {
  code: number;
  message: string;
  data: OrderData;
}

// Order API class
export class OrderAPI {
  /**
   * Create a new order
   * @param orderData - Order creation data
   * @returns Promise with order response
   */
  static async createOrder(orderData: CreateOrderRequest) {
    try {
      const token = tokenUtils.get();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result: CreateOrderResponse = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Create order API error:', error);
      throw error;
    }
  }

  /**
   * Get order by ID
   * @param orderId - Order ID to fetch
   * @returns Promise with order data
   */
  static async getOrder(orderId: number) {
    try {
      const token = tokenUtils.get();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
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
      console.error('Get order API error:', error);
      throw error;
    }
  }

  /**
   * Get all orders for a user
   * @param userId - User ID to fetch orders for
   * @returns Promise with orders list
   */
  static async getUserOrders(userId: number) {
    try {
      const token = tokenUtils.get();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
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
      console.error('Get user orders API error:', error);
      throw error;
    }
  }

  /**
   * Update order status
   * @param orderId - Order ID to update
   * @param status - New status for the order
   * @returns Promise with updated order data
   */
  static async updateOrderStatus(orderId: number, status: string) {
    try {
      const token = tokenUtils.get();
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Update order status API error:', error);
      throw error;
    }
  }

  /**
   * Get user ID from current token
   * @returns User ID or null if not found
   */
  static getUserIdFromToken(): number | null {
    const token = tokenUtils.get();
    if (!token) return null;
    
    try {
      const decoded = tokenUtils.decode(token);
      if (decoded.userId) {
        return decoded.userId;
      }
      
      // For testing purposes, use hardcoded userId
      // In production, you might need to call a separate API to get userId by email
      return 2; // Using the same userId as in wallet fetch
    } catch (error) {
      console.error('Failed to get userId from token:', error);
      return null;
    }
  }
}

// Export utility functions for convenience
export { handleAPIError, isNetworkError };

// Export default instance for easier usage
export default OrderAPI;
