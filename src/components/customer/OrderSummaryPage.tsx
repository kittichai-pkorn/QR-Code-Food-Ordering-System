import React from 'react';
import { ArrowLeft, CreditCard, Store, Clock, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OrderSummaryPageProps {
  tableId: string;
  onBack: () => void;
  onPayOnline: () => void;
  onPayAtRestaurant: () => void;
}

export default function OrderSummaryPage({ 
  tableId, 
  onBack, 
  onPayOnline, 
  onPayAtRestaurant 
}: OrderSummaryPageProps) {
  const { state, dispatch } = useApp();

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayAtRestaurant = async () => {
    if (state.loading.placingOrder) return;
    
    try {
      await dispatch({ 
        type: 'PLACE_ORDER', 
        payload: { tableId, paymentChoice: 'restaurant' } 
      });
      onPayAtRestaurant();
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const handlePayOnline = async () => {
    if (state.loading.placingOrder) return;
    
    try {
      await dispatch({ 
        type: 'PLACE_ORDER', 
        payload: { tableId, paymentChoice: 'online' } 
      });
      onPayOnline();
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center space-x-3 shadow-lg">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">สรุปออเดอร์</h1>
          <p className="text-sm text-gray-500">โต๊ะ {tableId}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">รายการอาหารที่สั่ง</h2>
          
          <div className="space-y-4 mb-6">
            {state.cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <div className="flex items-center space-x-2">
                    {item.isOnPromotion && item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ฿{item.originalPrice}
                      </span>
                    )}
                    <span className={`text-sm font-medium ${item.isOnPromotion ? 'text-red-500' : 'text-gray-600'}`}>
                      ฿{item.price} x {item.quantity}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-xs text-orange-600 mt-1 bg-orange-50 px-2 py-1 rounded-lg inline-block">
                      หมายเหตุ: {item.notes}
                    </p>
                  )}
                </div>
                <span className="font-bold text-lg text-gray-800">
                  ฿{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">ยอดรวมทั้งหมด</span>
              <span className="text-3xl font-bold text-orange-500">
                ฿{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-6">เลือกวิธีการชำระเงิน</h3>
          
          <button
            onClick={handlePayOnline}
            disabled={state.loading.placingOrder}
            className="w-full bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-2 border-gray-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-200 flex items-center space-x-4 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              {state.loading.placingOrder ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <CreditCard className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-gray-800 text-lg">ชำระเงินทันที</h4>
              <p className="text-gray-600">
                {state.loading.placingOrder ? 'กำลังส่งคำสั่งซื้อ...' : 'ชำระผ่าน QR Code หรือโอนเงิน'}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">⚡ เริ่มทำอาหารทันที</span>
              </div>
            </div>
            <div className="text-blue-500">
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
          </button>

          <button
            onClick={handlePayAtRestaurant}
            disabled={state.loading.placingOrder}
            className="w-full bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 border-2 border-gray-200 hover:border-orange-300 rounded-2xl p-6 transition-all duration-200 flex items-center space-x-4 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              {state.loading.placingOrder ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Store className="h-6 w-6 text-orange-600" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-gray-800 text-lg">ชำระเงินที่ร้าน</h4>
              <p className="text-gray-600">
                {state.loading.placingOrder ? 'กำลังส่งคำสั่งซื้อ...' : 'ชำระเงินเมื่อรับอาหาร'}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600 font-medium">⏳ รอการยืนยันจากพนักงาน</span>
              </div>
            </div>
            <div className="text-orange-500">
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
          </button>
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <p className="text-blue-700 font-medium">
            <strong>หมายเหตุ:</strong> หากเลือกชำระเงินที่ร้าน คุณสามารถเปลี่ยนมาชำระออนไลน์ได้ตลอดเวลาในหน้าติดตามสถานะ
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}