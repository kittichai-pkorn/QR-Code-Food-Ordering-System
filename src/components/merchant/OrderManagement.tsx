import React, { useEffect, useState } from 'react';
import { Clock, ChefHat, CheckCircle, UtensilsCrossed, AlertCircle, ClipboardList, CreditCard, Eye, DollarSign, X, Loader2, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../context/AppContext';
import apiClient from '../../services/api';
import { transformApiOrder } from '../../services/transformers';

const statusConfig = {
  pending: { 
    icon: AlertCircle, 
    text: 'รอยืนยัน', 
    color: 'text-red-500', 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    nextStatus: 'confirmed' as const
  },
  confirmed: { 
    icon: CheckCircle, 
    text: 'ยืนยันแล้ว', 
    color: 'text-blue-500', 
    bg: 'bg-blue-50', 
    border: 'border-blue-200',
    nextStatus: 'preparing' as const
  },
  preparing: { 
    icon: ChefHat, 
    text: 'กำลังทำ', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50', 
    border: 'border-orange-200',
    nextStatus: 'ready' as const
  },
  ready: { 
    icon: UtensilsCrossed, 
    text: 'พร้อมเสิร์ฟ', 
    color: 'text-green-500', 
    bg: 'bg-green-50', 
    border: 'border-green-200',
    nextStatus: 'served' as const
  },
  served: { 
    icon: CheckCircle, 
    text: 'เสิร์ฟแล้ว', 
    color: 'text-gray-500', 
    bg: 'bg-gray-50', 
    border: 'border-gray-200',
    nextStatus: null
  },
};

const paymentStatusConfig = {
  unpaid: { 
    icon: AlertCircle, 
    text: 'รอชำระเงิน', 
    color: 'text-red-500', 
    bg: 'bg-red-50', 
    border: 'border-red-200'
  },
  pending_verification: { 
    icon: Clock, 
    text: 'รอตรวจสอบ', 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-200'
  },
  paid: { 
    icon: CheckCircle, 
    text: 'ชำระแล้ว', 
    color: 'text-green-500', 
    bg: 'bg-green-50', 
    border: 'border-green-200'
  },
  pay_at_restaurant: { 
    icon: Clock, 
    text: 'ชำระที่ร้าน', 
    color: 'text-orange-500', 
    bg: 'bg-orange-50', 
    border: 'border-orange-200'
  },
};

export default function OrderManagement() {
  const { state, dispatch } = useApp();
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load orders from API
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'orders', loading: true } });
      const response = await apiClient.getAllOrders();
      if (response.success && response.data) {
        const transformedOrders = response.data.map(transformApiOrder);
        dispatch({ type: 'LOAD_ORDERS', payload: transformedOrders });
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load orders' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'orders', loading: false } });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId, status }
    });
  };
  
  const confirmPayment = (orderId: string) => {
    dispatch({
      type: 'UPDATE_PAYMENT_STATUS',
      payload: { orderId, paymentStatus: 'paid' }
    });
  };
  
  const completeOrder = (orderId: string) => {
    dispatch({
      type: 'COMPLETE_ORDER',
      payload: { orderId }
    });
  };

  const activeOrders = state.orders.filter(order => order.status !== 'served');
  const completedOrders = state.orders.filter(order => order.status === 'served');

  const OrderCard = ({ order }: { order: Order }) => {
    const config = statusConfig[order.status];
    const paymentConfig = paymentStatusConfig[order.paymentStatus];
    const StatusIcon = config.icon;
    const PaymentIcon = paymentConfig.icon;
    const timeAgo = Math.floor((Date.now() - order.timestamp.getTime()) / 60000);

    return (
      <div className={`bg-white rounded-2xl p-6 shadow-lg border-l-8 ${config.border} hover:shadow-xl transition-all duration-200`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-gray-800 text-xl">โต๊ะ {order.tableId}</span>
              <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-mono">
                #{order.id.split('-')[1]}
              </span>
            </div>
            <p className="text-gray-500 font-medium">
              {timeAgo < 1 ? 'เพิ่งสั่ง' : `${timeAgo} นาทีที่แล้ว`}
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${config.bg} border-2 ${config.border}`}>
            <StatusIcon className={`h-4 w-4 ${config.color}`} />
              <span className={`text-sm font-bold ${config.color}`}>
              {config.text}
            </span>
          </div>
          
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${paymentConfig.bg} border-2 ${paymentConfig.border}`}>
            <PaymentIcon className={`h-4 w-4 ${paymentConfig.color}`} />
              <span className={`text-sm font-bold ${paymentConfig.color}`}>
              {paymentConfig.text}
            </span>
          </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <span className="font-bold text-gray-800">{item.name}</span>
                <span className="text-gray-600 ml-2 font-medium">x{item.quantity}</span>
                {item.notes && (
                  <p className="text-xs text-orange-600 mt-1 bg-orange-50 px-2 py-1 rounded-lg inline-block">
                    หมายเหตุ: {item.notes}
                  </p>
                )}
              </div>
              <span className="font-bold text-lg">
                ฿{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
          <div className="font-bold text-2xl text-orange-500">
            รวม ฿{order.total.toLocaleString()}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Payment Actions */}
            {order.paymentStatus === 'pending_verification' && (
              <>
                {order.paymentSlip ? (
                  <button
                    onClick={() => setSelectedSlip(order.paymentSlip!)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center space-x-1 shadow-lg"
                  >
                    <Eye className="h-4 w-4" />
                    <span>ดูสลิป</span>
                  </button>
                ) : (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl px-3 py-2">
                    <p className="text-xs text-yellow-700 font-medium">
                      ลูกค้าแจ้งโอนแล้ว<br />
                      (ไม่ได้แนบสลิป)
                    </p>
                  </div>
                )}
              </>
            )}
            
            {order.paymentStatus === 'pending_verification' && (
              <button
                onClick={() => confirmPayment(order.id)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center space-x-1 shadow-lg"
              >
                <DollarSign className="h-4 w-4" />
                <span>ยืนยันชำระ</span>
              </button>
            )}
            
            {/* Order Status Actions */}
            {config.nextStatus && order.paymentStatus === 'paid' && (
              <button
                onClick={() => updateOrderStatus(order.id, config.nextStatus!)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg"
              >
                {config.nextStatus === 'confirmed' && 'รับออเดอร์'}
                {config.nextStatus === 'preparing' && 'เริ่มทำ'}
                {config.nextStatus === 'ready' && 'เสร็จแล้ว'}
                {config.nextStatus === 'served' && 'เสิร์ฟแล้ว'}
              </button>
            )}
            
            {/* Pay at Restaurant Actions */}
            {order.paymentStatus === 'pay_at_restaurant' && (
              <>
                {config.nextStatus && (
                  <button
                    onClick={() => updateOrderStatus(order.id, config.nextStatus!)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg"
                  >
                    {config.nextStatus === 'confirmed' && 'รับออเดอร์'}
                    {config.nextStatus === 'preparing' && 'เริ่มทำ'}
                    {config.nextStatus === 'ready' && 'เสร็จแล้ว'}
                    {config.nextStatus === 'served' && 'เสิร์ฟแล้ว'}
                  </button>
                )}
                
                {order.status === 'served' && (
                  <button
                    onClick={() => completeOrder(order.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center space-x-1 shadow-lg"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>ปิดบิล</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Active Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            ออเดอร์ที่ต้องจัดการ ({activeOrders.length})
          </h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing || state.loading.orders}
              className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'รีเฟรช...' : 'รีเฟรช'}</span>
            </button>
            {activeOrders.length > 0 && (
              <div className="bg-gradient-to-r from-red-100 to-pink-100 text-red-600 px-4 py-2 rounded-full text-sm font-bold border-2 border-red-200 animate-pulse">
                {activeOrders.filter(o => o.status === 'pending').length} รอยืนยัน
              </div>
            )}
          </div>
        </div>

        {state.loading.orders ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">กำลังโหลดออเดอร์...</h3>
            <p className="text-gray-500">กรุณารอสักครู่</p>
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              ไม่มีออเดอร์ใหม่
            </h3>
            <p className="text-gray-500 text-lg">
              เมื่อมีลูกค้าสั่งอาหาร ออเดอร์จะแสดงที่นี่
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeOrders
              .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
              .map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ออเดอร์ที่เสร็จแล้ว ({completedOrders.length})
          </h2>
          <div className="space-y-6">
            {completedOrders
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .slice(0, 5)
              .map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        </div>
      )}
      
      {/* Payment Slip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">หลักฐานการโอนเงิน</h3>
              <button
                onClick={() => setSelectedSlip(null)}
                className="text-gray-500 hover:text-gray-700 p-3 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <img
              src={selectedSlip}
              alt="Payment slip"
              className="w-full rounded-xl shadow-lg"
            />
            
            <div className="mt-6">
              <button
                onClick={() => setSelectedSlip(null)}
                className="w-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 py-4 rounded-xl font-bold text-lg transition-all duration-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}