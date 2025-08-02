import React, { useEffect, useState } from 'react';
import { Clock, ChefHat, CheckCircle, UtensilsCrossed, AlertCircle, ClipboardList, CreditCard, Eye, DollarSign, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../context/AppContext';

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

  // Auto-update some orders for demo
  useEffect(() => {
    if (state.orders.length > 0) {
      const timer = setTimeout(() => {
        const pendingOrder = state.orders.find(order => order.status === 'pending');
        if (pendingOrder) {
          dispatch({
            type: 'UPDATE_ORDER_STATUS',
            payload: { orderId: pendingOrder.id, status: 'confirmed' }
          });
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.orders, dispatch]);

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
      <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${config.border}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-gray-800">โต๊ะ {order.tableId}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                #{order.id.split('-')[1]}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {timeAgo < 1 ? 'เพิ่งสั่ง' : `${timeAgo} นาทีที่แล้ว`}
            </p>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.bg}`}>
            <StatusIcon className={`h-4 w-4 ${config.color}`} />
            <span className={`text-sm font-medium ${config.color}`}>
              {config.text}
            </span>
          </div>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${paymentConfig.bg}`}>
            <PaymentIcon className={`h-4 w-4 ${paymentConfig.color}`} />
            <span className={`text-sm font-medium ${paymentConfig.color}`}>
              {paymentConfig.text}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                {item.notes && (
                  <p className="text-xs text-orange-600 mt-1">
                    หมายเหตุ: {item.notes}
                  </p>
                )}
              </div>
              <span className="font-medium">
                ฿{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="font-bold text-lg">
            รวม ฿{order.total.toLocaleString()}
          </div>
          
          <div className="flex space-x-2">
            {/* Payment Actions */}
            {order.paymentStatus === 'pending_verification' && (
              <>
                {order.paymentSlip ? (
                  <button
                    onClick={() => setSelectedSlip(order.paymentSlip!)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>ดูสลิป</span>
                  </button>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-yellow-700">
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
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
              >
                <DollarSign className="h-4 w-4" />
                <span>ยืนยันชำระ</span>
              </button>
            )}
            
            {/* Order Status Actions */}
            {config.nextStatus && order.paymentStatus === 'paid' && (
              <button
                onClick={() => updateOrderStatus(order.id, config.nextStatus!)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
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
    <div className="p-4 space-y-6">
      {/* Active Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            ออเดอร์ที่ต้องจัดการ ({activeOrders.length})
          </h2>
          {activeOrders.length > 0 && (
            <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {activeOrders.filter(o => o.status === 'pending').length} รอยืนยัน
            </div>
          )}
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              ไม่มีออเดอร์ใหม่
            </h3>
            <p className="text-gray-500">
              เมื่อมีลูกค้าสั่งอาหาร ออเดอร์จะแสดงที่นี่
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ออเดอร์ที่เสร็จแล้ว ({completedOrders.length})
          </h2>
          <div className="space-y-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">หลักฐานการโอนเงิน</h3>
              <button
                onClick={() => setSelectedSlip(null)}
                className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <img
              src={selectedSlip}
              alt="Payment slip"
              className="w-full rounded-lg"
            />
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setSelectedSlip(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors"
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