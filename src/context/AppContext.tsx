import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import apiClient from '../services/api';
import {
  transformApiMenuItem,
  transformApiOrder,
  transformApiRestaurantSettings,
  transformToApiOrderRequest,
  transformToApiOrderStatus,
  transformToApiPaymentStatus,
  transformToApiPaymentMethod,
} from '../services/transformers';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isOnPromotion: boolean;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  notes: string;
}

export interface Order {
  id: string;
  tableId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed';
  paymentStatus: 'unpaid' | 'pending_verification' | 'paid' | 'pay_at_restaurant';
  paymentMethod?: 'qr_code' | 'bank_transfer';
  paymentSlip?: string;
  timestamp: Date;
  notes?: string;
}

export interface BrandSettings {
  restaurantName: string;
  description: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  phone: string;
  address: string;
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

interface AppState {
  menu: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  currentOrder: Order | null;
  brandSettings: BrandSettings;
  loading: {
    menu: boolean;
    orders: boolean;
    brandSettings: boolean;
    placingOrder: boolean;
  };
  error: string | null;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: { item: MenuItem; quantity: number; notes: string } }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number; notes?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'PLACE_ORDER'; payload: { tableId: string; paymentChoice: 'online' | 'restaurant' } }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'UPDATE_PAYMENT_STATUS'; payload: { orderId: string; paymentStatus: Order['paymentStatus']; paymentMethod?: Order['paymentMethod']; paymentSlip?: string } }
  | { type: 'COMPLETE_ORDER'; payload: { orderId: string } }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'TOGGLE_MENU_AVAILABILITY'; payload: { id: string } }
  | { type: 'UPDATE_BRAND_SETTINGS'; payload: Partial<BrandSettings> }
  | { type: 'SET_LOADING'; payload: { key: keyof AppState['loading']; loading: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_MENU'; payload: MenuItem[] }
  | { type: 'LOAD_ORDERS'; payload: Order[] }
  | { type: 'LOAD_BRAND_SETTINGS'; payload: BrandSettings }
  | { type: 'ORDER_PLACED_SUCCESS'; payload: Order };

const initialState: AppState = {
  menu: [],
  cart: [],
  orders: [],
  currentOrder: null,
  brandSettings: {
    restaurantName: 'ร้านอาหารดีลิเชียส',
    description: 'อาหารไทยรสชาติดั้งเดิม สดใหม่ทุกวัน',
    logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    primaryColor: '#f97316',
    secondaryColor: '#ef4444',
    accentColor: '#eab308',
    phone: '02-123-4567',
    address: '123 ถนนสุขุมวิท กรุงเทพฯ 10110',
    bankAccount: {
      accountName: 'ร้านอาหารดีลิเชียส',
      accountNumber: '123-4-56789-0',
      bankName: 'ธนาคารกสิกรไทย'
    }
  },
  loading: {
    menu: true,
    orders: false,
    brandSettings: true,
    placingOrder: false,
  },
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.item.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.item.id
              ? { ...item, quantity: item.quantity + action.payload.quantity, notes: action.payload.notes }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload.item, quantity: action.payload.quantity, notes: action.payload.notes }],
      };
    }
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity, notes: action.payload.notes || item.notes }
            : item
        ),
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'PLACE_ORDER': {
      return {
        ...state,
        loading: {
          ...state.loading,
          placingOrder: true,
        },
      };
    }
    case 'ORDER_PLACED_SUCCESS': {
      return {
        ...state,
        orders: [...state.orders, action.payload],
        currentOrder: action.payload,
        cart: [],
        loading: {
          ...state.loading,
          placingOrder: false,
        },
        error: null,
      };
    }
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.orderId
          ? { ...state.currentOrder, status: action.payload.status }
          : state.currentOrder,
      };
    case 'UPDATE_PAYMENT_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { 
                ...order, 
                paymentStatus: action.payload.paymentStatus,
                paymentMethod: action.payload.paymentMethod || order.paymentMethod,
                paymentSlip: action.payload.paymentSlip || order.paymentSlip
              }
            : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.orderId
          ? { 
              ...state.currentOrder, 
              paymentStatus: action.payload.paymentStatus,
              paymentMethod: action.payload.paymentMethod || state.currentOrder.paymentMethod,
              paymentSlip: action.payload.paymentSlip || state.currentOrder.paymentSlip
            }
          : state.currentOrder,
      };
    case 'COMPLETE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: 'completed', paymentStatus: 'paid' }
            : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.orderId
          ? { ...state.currentOrder, status: 'completed', paymentStatus: 'paid' }
          : state.currentOrder,
      };
    case 'ADD_MENU_ITEM':
      return {
        ...state,
        menu: [...state.menu, action.payload],
      };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menu: state.menu.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'TOGGLE_MENU_AVAILABILITY':
      return {
        ...state,
        menu: state.menu.map(item =>
          item.id === action.payload.id
            ? { ...item, available: !item.available }
            : item
        ),
      };
    case 'UPDATE_BRAND_SETTINGS':
      return {
        ...state,
        brandSettings: {
          ...state.brandSettings,
          ...action.payload
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.loading,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'LOAD_MENU':
      return {
        ...state,
        menu: action.payload,
        loading: {
          ...state.loading,
          menu: false,
        },
        error: null,
      };
    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.payload,
        loading: {
          ...state.loading,
          orders: false,
        },
        error: null,
      };
    case 'LOAD_BRAND_SETTINGS':
      return {
        ...state,
        brandSettings: action.payload,
        loading: {
          ...state.loading,
          brandSettings: false,
        },
        error: null,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load menu
        dispatch({ type: 'SET_LOADING', payload: { key: 'menu', loading: true } });
        const menuResponse = await apiClient.getMenu();
        if (menuResponse.success && menuResponse.data) {
          const transformedMenu = menuResponse.data.map(transformApiMenuItem);
          dispatch({ type: 'LOAD_MENU', payload: transformedMenu });
        }

        // Load restaurant settings
        dispatch({ type: 'SET_LOADING', payload: { key: 'brandSettings', loading: true } });
        const settingsResponse = await apiClient.getRestaurantSettings();
        if (settingsResponse.success && settingsResponse.data) {
          const transformedSettings = transformApiRestaurantSettings(settingsResponse.data);
          dispatch({ type: 'LOAD_BRAND_SETTINGS', payload: transformedSettings });
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data from server' });
        dispatch({ type: 'SET_LOADING', payload: { key: 'menu', loading: false } });
        dispatch({ type: 'SET_LOADING', payload: { key: 'brandSettings', loading: false } });
      }
    };

    loadInitialData();
  }, []);

  // Enhanced dispatch with API integration
  const enhancedDispatch = async (action: AppAction) => {
    switch (action.type) {
      case 'PLACE_ORDER': {
        dispatch(action); // Set loading state
        try {
          const orderRequest = transformToApiOrderRequest(
            action.payload.tableId,
            state.cart,
            'Customer order'
          );
          
          const response = await apiClient.createOrder(orderRequest);
          if (response.success && response.data) {
            const transformedOrder = transformApiOrder(response.data);
            dispatch({ type: 'ORDER_PLACED_SUCCESS', payload: transformedOrder });
          } else {
            throw new Error(response.error || 'Failed to place order');
          }
        } catch (error) {
          console.error('Failed to place order:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to place order' });
          dispatch({ type: 'SET_LOADING', payload: { key: 'placingOrder', loading: false } });
        }
        break;
      }
      case 'UPDATE_ORDER_STATUS': {
        try {
          const apiStatus = transformToApiOrderStatus(action.payload.status);
          const response = await apiClient.updateOrderStatus(parseInt(action.payload.orderId), apiStatus);
          if (response.success) {
            dispatch(action);
          }
        } catch (error) {
          console.error('Failed to update order status:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to update order status' });
        }
        break;
      }
      case 'UPDATE_PAYMENT_STATUS': {
        try {
          const apiPaymentStatus = transformToApiPaymentStatus(action.payload.paymentStatus);
          const apiPaymentMethod = transformToApiPaymentMethod(action.payload.paymentMethod);
          
          const response = await apiClient.updatePaymentStatus(parseInt(action.payload.orderId), {
            paymentStatus: apiPaymentStatus,
            paymentMethod: apiPaymentMethod,
            paymentSlip: action.payload.paymentSlip,
          });
          
          if (response.success) {
            dispatch(action);
          }
        } catch (error) {
          console.error('Failed to update payment status:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to update payment status' });
        }
        break;
      }
      default:
        dispatch(action);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}