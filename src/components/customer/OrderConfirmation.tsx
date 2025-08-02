import React from 'react';
import { CheckCircle, Clock, ChefHat, UtensilsCrossed, CreditCard, AlertTriangle, Store, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OrderConfirmationProps {
  onNewOrder: () => void;
}

const statusConfig = {
  pending: { icon: Clock, text: 'รอยืนยัน', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  confirmed: { icon: CheckCircle, text: 'ยืนยันแล้ว', color: 'text-blue-500', bg: 'bg-blue-50' },
  preparing: { icon: ChefHat, text: 'กำลังทำ', color: 'text-orange-500', bg: 'bg-orange-50' },
  ready: { icon: UtensilsCrossed, text: 'พร้อมเสิร์ฟ', color: 'text-green-500', bg: 'bg-green-50' },
  served: { icon: CheckCircle, text: 'เสิร์ฟแล้ว', color: 'text-gray-500', bg: 'bg-gray-50' },
};

const paymentStatusConfig = {
  unpaid: { icon: AlertTriangle, text: 'รอการชำระเงิน', color: 'text-red-500', bg: 'bg-red-50' },
  pending_verification: { icon: Clock, text: 'รอตรวจสอบการชำระเงิน', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  paid: { icon: CheckCircle, text: 'ชำระเงินแล้ว', color: 'text-green-500', bg: 'bg-green-50' },
  pay_at_restaurant: { icon: Store, text: 'ชำระเงินที่ร้าน', color: 'text-orange-500', bg: 'bg-orange-50' },
};

export default function OrderConfirmation({ onNewOrder }: OrderConfirmationProps) {
  const { state, dispatch } = useApp();
  const order = state.currentOrder;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600">ไม่พบข้อมูลออเดอร์</p>
          <button
            onClick={onNewOrder}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            สั่งใหม่
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;
  
  const paymentInfo = paymentStatusConfig[order.paymentStatus];
  const PaymentIcon = paymentInfo.icon;

  const handlePayNow = () => {
    // Switch to online payment
    dispatch({
      type: 'UPDATE_PAYMENT_STATUS',
      payload: { orderId: order.id, paymentStatus: 'unpaid' }
    });
    // This would typically navigate to payment page
    // For demo purposes, we'll simulate payment completion
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_PAYMENT_STATUS',
        payload: { orderId: order.id, paymentStatus: 'paid', paymentMethod: 'qr_code' }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ส่งออเดอร์แล้ว!
          </h1>
          <p className="text-gray-600">
            ขอบคุณสำหรับการสั่งอาหาร
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-800">หมายเลขออเดอร์</span>
            <span className="font-mono text-sm text-gray-600">
              {order.id.split('-')[1]}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-800">โต๊ะ</span>
            <span className="font-semibold">{order.tableId}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-gray-800">เวลา</span>
            <span className="text-sm text-gray-600">
              {order.timestamp.toLocaleTimeString('th-TH', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800">ยอดรวม</span>
            <span className="text-lg font-bold text-orange-500">
              ฿{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">สถานะออเดอร์และการชำระเงิน</h3>
          
          {/* Payment Status */}
          <div className={`flex items-center space-x-3 p-4 rounded-lg mb-4 ${paymentInfo.bg}`}>
            <PaymentIcon className={`h-6 w-6 ${paymentInfo.color}`} />
            <div className="flex-1">
              <span className={`font-semibold ${paymentInfo.color}`}>
                {paymentInfo.text}
              </span>
              {order.paymentStatus === 'pending_verification' && (
                <p className="text-xs text-gray-600 mt-1">
                  พนักงานกำลังตรวจสอบยอดเงินในบัญชี
                </p>
              )}
            </div>
          </div>
          
          {/* Real-time Status Updates */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">สถานะปัจจุบัน</h4>
            <div className="space-y-2 text-sm">
              <div className={`flex items-center space-x-2 ${order.status === 'pending' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                <span>รอการยืนยัน</span>
              </div>
              <div className={`flex items-center space-x-2 ${order.status === 'confirmed' ? 'text-blue-600' : order.status === 'preparing' || order.status === 'ready' || order.status === 'served' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${order.status === 'confirmed' ? 'bg-blue-500' : order.status === 'preparing' || order.status === 'ready' || order.status === 'served' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>ยืนยันออเดอร์</span>
              </div>
              <div className={`flex items-center space-x-2 ${order.status === 'preparing' ? 'text-orange-600' : order.status === 'ready' || order.status === 'served' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${order.status === 'preparing' ? 'bg-orange-500' : order.status === 'ready' || order.status === 'served' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>กำลังทำอาหาร</span>
              </div>
              <div className={`flex items-center space-x-2 ${order.status === 'ready' ? 'text-green-600' : order.status === 'served' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${order.status === 'ready' ? 'bg-green-500' : order.status === 'served' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>พร้อมเสิร์ฟ</span>
              </div>
              <div className={`flex items-center space-x-2 ${order.status === 'served' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${order.status === 'served' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>เสิร์ฟแล้ว</span>
              </div>
            </div>
          </div>
          
          {/* Order Status */}
          <div className={`flex items-center space-x-3 p-4 rounded-lg ${statusInfo.bg}`}>
            <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
            <span className={`font-semibold ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          
          <div className="mt-4 space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>฿{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {order.paymentStatus === 'pay_at_restaurant' && (
            <button
              onClick={handlePayNow}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>ชำระเงินตอนนี้</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={onNewOrder}
            className={`w-full py-4 rounded-xl font-semibold transition-colors ${
              order.paymentStatus === 'pay_at_restaurant' 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            สั่งเพิ่ม
          </button>
          
          <p className="text-center text-sm text-gray-500">
            อาหารจะเสิร์ฟภายใน 15-20 นาที
          </p>
        </div>
      </div>
    </div>
  );
}