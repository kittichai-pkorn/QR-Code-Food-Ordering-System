const API_BASE_URL = '/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  fullPrice: number;
  promotionPrice: number | null;
  isPromotion: boolean;
  image: string | null;
  category: string;
  isAvailable: boolean;
  preparationTime: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  tableId: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PENDING_VERIFICATION' | 'PAID' | 'PAY_AT_RESTAURANT' | 'CANCELLED';
  paymentMethod?: 'QR_CODE' | 'BANK_TRANSFER';
  paymentSlip?: string;
  totalAmount: number;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
  updatedAt: string;
  table: {
    id: number;
    number: string;
    capacity: number;
  };
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  menuId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string;
  menu: MenuItem;
}

export interface RestaurantSettings {
  id: number;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  tableId: number;
  items: {
    menuId: number;
    quantity: number;
    notes?: string;
  }[];
  notes?: string;
  customerName?: string;
  customerPhone?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        // Try to read as text first to avoid JSON parsing errors on HTML error pages
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Try to parse as JSON if it looks like JSON
        if (errorText.trim().startsWith('{') || errorText.trim().startsWith('[')) {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If JSON parsing fails, use the text as is or default message
            errorMessage = errorText || errorMessage;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Menu API
  async getMenu(): Promise<ApiResponse<MenuItem[]>> {
    return this.request<MenuItem[]>('/menu');
  }

  async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<MenuItem>> {
    return this.request<MenuItem>('/admin/menu', {
      method: 'POST',
      body: JSON.stringify(menuItem),
    });
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<ApiResponse<MenuItem>> {
    return this.request<MenuItem>(`/admin/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMenuItem(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/menu/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders API
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrdersByTable(tableId: number): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>(`/orders/table/${tableId}`);
  }

  async getAllOrders(params?: {
    status?: string;
    paymentStatus?: string;
    limit?: number;
  }): Promise<ApiResponse<Order[]>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<Order[]>(`/admin/orders${query ? `?${query}` : ''}`);
  }

  async updateOrderStatus(
    orderId: number,
    status: Order['status']
  ): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updatePaymentStatus(
    orderId: number,
    paymentData: {
      paymentStatus: Order['paymentStatus'];
      paymentMethod?: Order['paymentMethod'];
      paymentSlip?: string;
    }
  ): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/admin/orders/${orderId}/payment`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  // Restaurant Settings API
  async getRestaurantSettings(): Promise<ApiResponse<RestaurantSettings>> {
    return this.request<RestaurantSettings>('/restaurant/settings');
  }

  async updateRestaurantSettings(
    settings: Partial<RestaurantSettings>
  ): Promise<ApiResponse<RestaurantSettings>> {
    return this.request<RestaurantSettings>('/admin/restaurant/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Reports API
  async getSalesReport(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request<any>(`/admin/reports/sales${query ? `?${query}` : ''}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;