import { MenuItem as ApiMenuItem, Order as ApiOrder, RestaurantSettings as ApiRestaurantSettings } from './api';
import { MenuItem, CartItem, Order, BrandSettings } from '../context/AppContext';

export function transformApiMenuItem(apiItem: ApiMenuItem): MenuItem {
  return {
    id: apiItem.id.toString(),
    name: apiItem.name,
    description: apiItem.description || '',
    price: apiItem.isPromotion && apiItem.promotionPrice ? apiItem.promotionPrice : apiItem.fullPrice,
    originalPrice: apiItem.fullPrice,
    isOnPromotion: apiItem.isPromotion,
    image: apiItem.image || '',
    category: apiItem.category,
    available: apiItem.isAvailable,
  };
}

export function transformApiOrder(apiOrder: ApiOrder): Order {
  return {
    id: apiOrder.id.toString(),
    tableId: apiOrder.table.number,
    items: apiOrder.orderItems.map(item => ({
      ...transformApiMenuItem(item.menu),
      quantity: item.quantity,
      notes: item.notes || '',
    })),
    total: apiOrder.totalAmount,
    status: apiOrder.status.toLowerCase() as Order['status'],
    paymentStatus: transformPaymentStatus(apiOrder.paymentStatus),
    paymentMethod: apiOrder.paymentMethod ? transformPaymentMethod(apiOrder.paymentMethod) : undefined,
    paymentSlip: apiOrder.paymentSlip,
    timestamp: new Date(apiOrder.createdAt),
    notes: apiOrder.notes,
  };
}

function transformPaymentStatus(apiStatus: ApiOrder['paymentStatus']): Order['paymentStatus'] {
  const statusMap: Record<ApiOrder['paymentStatus'], Order['paymentStatus']> = {
    'UNPAID': 'unpaid',
    'PENDING_VERIFICATION': 'pending_verification',
    'PAID': 'paid',
    'PAY_AT_RESTAURANT': 'pay_at_restaurant',
    'CANCELLED': 'unpaid', // fallback
  };
  return statusMap[apiStatus] || 'unpaid';
}

function transformPaymentMethod(apiMethod: NonNullable<ApiOrder['paymentMethod']>): Order['paymentMethod'] {
  const methodMap: Record<NonNullable<ApiOrder['paymentMethod']>, Order['paymentMethod']> = {
    'QR_CODE': 'qr_code',
    'BANK_TRANSFER': 'bank_transfer',
  };
  return methodMap[apiMethod];
}

export function transformApiRestaurantSettings(apiSettings: ApiRestaurantSettings): BrandSettings {
  return {
    restaurantName: apiSettings.name,
    description: apiSettings.description || '',
    logo: apiSettings.logo || '',
    primaryColor: apiSettings.primaryColor,
    secondaryColor: apiSettings.secondaryColor,
    accentColor: apiSettings.accentColor,
    phone: apiSettings.phone || '',
    address: apiSettings.address || '',
    bankAccount: {
      accountName: apiSettings.bankAccountName || '',
      accountNumber: apiSettings.bankAccountNumber || '',
      bankName: apiSettings.bankName || '',
    },
  };
}

export function transformToApiOrderRequest(tableId: string, items: CartItem[], notes?: string) {
  return {
    tableId: parseInt(tableId.replace('T', '').replace(/^0+/, '')) || 1, // Convert T001 to 1
    items: items.map(item => ({
      menuId: parseInt(item.id),
      quantity: item.quantity,
      notes: item.notes,
    })),
    notes,
  };
}

export function transformToApiOrderStatus(status: Order['status']): ApiOrder['status'] {
  const statusMap: Record<Order['status'], ApiOrder['status']> = {
    'pending': 'PENDING',
    'confirmed': 'CONFIRMED',
    'preparing': 'PREPARING',
    'ready': 'READY',
    'served': 'SERVED',
    'completed': 'COMPLETED',
  };
  return statusMap[status] || 'PENDING';
}

export function transformToApiPaymentStatus(status: Order['paymentStatus']): ApiOrder['paymentStatus'] {
  const statusMap: Record<Order['paymentStatus'], ApiOrder['paymentStatus']> = {
    'unpaid': 'UNPAID',
    'pending_verification': 'PENDING_VERIFICATION',
    'paid': 'PAID',
    'pay_at_restaurant': 'PAY_AT_RESTAURANT',
  };
  return statusMap[status] || 'UNPAID';
}

export function transformToApiPaymentMethod(method: Order['paymentMethod']): ApiOrder['paymentMethod'] {
  if (!method) return undefined;
  const methodMap: Record<Order['paymentMethod'], NonNullable<ApiOrder['paymentMethod']>> = {
    'qr_code': 'QR_CODE',
    'bank_transfer': 'BANK_TRANSFER',
  };
  return methodMap[method];
}