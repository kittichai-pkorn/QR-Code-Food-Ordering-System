import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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
  | { type: 'UPDATE_BRAND_SETTINGS'; payload: Partial<BrandSettings> };

const initialMenu: MenuItem[] = [
  {
    id: '1',
    name: 'ผัดไทยกุ้งสด',
    description: 'ผัดไทยกุ้งสดใหญ่ หวานมัน กลมกล่อม',
    price: 89,
    originalPrice: 120,
    isOnPromotion: true,
    image: 'https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg',
    category: 'main',
    available: true,
  },
  {
    id: '2',
    name: 'ต้มยำกุ้งน้ำข้น',
    description: 'ต้มยำรสจัดจ้าน เปรี้ยว เผ็ด หอม',
    price: 150,
    originalPrice: 150,
    isOnPromotion: false,
    image: 'https://images.pexels.com/photos/16743486/pexels-photo-16743486.jpeg',
    category: 'soup',
    available: true,
  },
  {
    id: '3',
    name: 'ข้าวผัดปู',
    description: 'ข้าวผัดปูเนื้อแน่น หอมหัวหอม',
    price: 129,
    originalPrice: 180,
    isOnPromotion: true,
    image: 'https://images.pexels.com/photos/8697523/pexels-photo-8697523.jpeg',
    category: 'main',
    available: true,
  },
  {
    id: '4',
    name: 'ส้มตำไทย',
    description: 'ส้มตำรสชาติดั้งเดิม เปรี้ยวหวานเผ็ด',
    price: 80,
    originalPrice: 80,
    isOnPromotion: false,
    image: 'https://images.pexels.com/photos/4113670/pexels-photo-4113670.jpeg',
    category: 'salad',
    available: true,
  },
  {
    id: '5',
    name: 'มะม่วงข้าวเหนียว',
    description: 'มะม่วงสุกหวาน เสิร์ฟกับข้าวเหนียวหอม',
    price: 59,
    originalPrice: 90,
    isOnPromotion: true,
    image: 'https://images.pexels.com/photos/5625120/pexels-photo-5625120.jpeg',
    category: 'dessert',
    available: true,
  },
  {
    id: '6',
    name: 'น้ำมะนาวโซดา',
    description: 'น้ำมะนาวโซดาสดชื่น หวานเปรี้ยว',
    price: 45,
    originalPrice: 45,
    isOnPromotion: false,
    image: 'https://images.pexels.com/photos/1337824/pexels-photo-1337824.jpeg',
    category: 'drink',
    available: true,
  }
];

const initialState: AppState = {
  menu: initialMenu,
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
  }
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
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        tableId: action.payload.tableId,
        items: [...state.cart],
        total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending',
        paymentStatus: action.payload.paymentChoice === 'restaurant' ? 'pay_at_restaurant' : 'unpaid',
        timestamp: new Date(),
      };
      return {
        ...state,
        orders: [...state.orders, newOrder],
        currentOrder: newOrder,
        cart: [],
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

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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