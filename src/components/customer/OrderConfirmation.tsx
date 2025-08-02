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
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            ส่งออเดอร์แล้ว!
          </h1>
          <p className="text-gray-600 text-lg">
            ขอบคุณสำหรับการสั่งอาหาร
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-800">หมายเลขออเดอร์</span>
            <span className="font-mono text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
              {order.id.split('-')[1]}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-800">โต๊ะ</span>
            <span className="font-bold text-lg bg-orange-100 text-orange-700 px-3 py-1 rounded-lg">{order.tableId}</span>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-800">เวลา</span>
            <span className="text-gray-600 font-medium">
              {order.timestamp.toLocaleTimeString('th-TH', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800 text-lg">ยอดรวม</span>
            <span className="text-2xl font-bold text-orange-500">
              ฿{order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6 text-lg">สถานะออเดอร์และการชำระเงิน</h3>
          
          {/* Payment Status */}
          <div className={`flex items-center space-x-3 p-4 rounded-xl mb-6 ${paymentInfo.bg} border-2 ${paymentInfo.border}`}>
            <PaymentIcon className={`h-6 w-6 ${paymentInfo.color}`} />
            <div className="flex-1">
              <span className={`font-bold text-lg ${paymentInfo.color}`}>
                {paymentInfo.text}
              </span>
              {order.paymentStatus === 'pending_verification' && (
                <p className="text-sm text-gray-600 mt-1">
                  พนักงานกำลังตรวจสอบยอดเงินในบัญชี
                </p>
              )}
            </div>
          </div>
          
          {/* Real-time Status Updates */}
          <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-4">สถานะปัจจุบัน</h4>
            <div className="space-y-3">
              <div className={`flex items-center space-x-3 ${order.status === 'pending' ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full ${order.status === 'pending' ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span>รอการยืนยัน</span>
              </div>
              <div className={`flex items-center space-x-3 ${order.status === 'confirmed' ? 'text-blue-600' : order.status === 'preparing' || order.status === 'ready' || order.status === 'served' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full ${order.status === 'confirmed' ? 'bg-blue-500 animate-pulse' : order.status === 'preparing' || order.status === 'ready' || order.status === 'served' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>ยืนยันออเดอร์</span>
              </div>
              <div className={`flex items-center space-x-3 ${order.status === 'preparing' ? 'text-orange-600' : order.status === 'ready' || order.status === 'served' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full ${order.status === 'preparing' ? 'bg-orange-500 animate-pulse' : order.status === 'ready' || order.status === 'served' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>กำลังทำอาหาร</span>
              </div>
              <div className={`flex items-center space-x-3 ${order.status === 'ready' ? 'text-green-600' : order.status === 'served' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full ${order.status === 'ready' ? 'bg-green-500 animate-pulse' : order.status === 'served' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>พร้อมเสิร์ฟ</span>
              </div>
              <div className={`flex items-center space-x-3 ${order.status === 'served' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full ${order.status === 'served' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>เสิร์ฟแล้ว</span>
              </div>
            </div>
          </div>
          
          {/* Order Status */}
          <div className={`flex items-center space-x-3 p-4 rounded-xl mt-4 ${statusInfo.bg} border-2 ${statusInfo.border}`}>
            <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
            <span className={`font-bold text-lg ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          
          <div className="mt-6 space-y-3 bg-gray-50 rounded-xl p-4">
            <h5 className="font-bold text-gray-800 mb-3">รายการอาหาร</h5>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{item.name} x{item.quantity}</span>
                <span className="font-bold">฿{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {order.paymentStatus === 'pay_at_restaurant' && (
            <button
              onClick={handlePayNow}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <CreditCard className="h-5 w-5" />
              <span>ชำระเงินตอนนี้</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={onNewOrder}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
              order.paymentStatus === 'pay_at_restaurant' 
                ? 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800' 
                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
            }`}
          >
            สั่งเพิ่ม
          </button>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
            <p className="text-blue-700 font-medium">
              ⏰ อาหารจะเสิร์ฟภายใน 15-20 นาที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}