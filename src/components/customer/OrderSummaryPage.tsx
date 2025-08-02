import React from 'react';
import { ArrowLeft, CreditCard, Store, Clock } from 'lucide-react';
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

  const handlePayAtRestaurant = () => {
    dispatch({ 
      type: 'PLACE_ORDER', 
      payload: { tableId, paymentChoice: 'restaurant' } 
    });
    onPayAtRestaurant();
  };

  const handlePayOnline = () => {
    dispatch({ 
      type: 'PLACE_ORDER', 
      payload: { tableId, paymentChoice: 'online' } 
    });
    onPayOnline();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center space-x-3 shadow-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">สรุปออเดอร์</h1>
          <p className="text-sm text-gray-500">โต๊ะ {tableId}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">รายการอาหารที่สั่ง</h2>
          
          <div className="space-y-3 mb-4">
            {state.cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">฿{item.price} x {item.quantity}</p>
                  {item.notes && (
                    <p className="text-xs text-orange-600 mt-1">
                      หมายเหตุ: {item.notes}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-gray-800">
                  ฿{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">ยอดรวมทั้งหมด</span>
              <span className="text-2xl font-bold text-orange-500">
                ฿{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">เลือกวิธีการชำระเงิน</h3>
          
          <button
            onClick={handlePayOnline}
            className="w-full bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 transition-all flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-gray-800">ชำระเงินทันที</h4>
              <p className="text-sm text-gray-600">ชำระผ่าน QR Code หรือโอนเงิน</p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">เริ่มทำอาหารทันที</span>
              </div>
            </div>
            <div className="text-blue-600">
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
          </button>

          <button
            onClick={handlePayAtRestaurant}
            className="w-full bg-white hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 rounded-xl p-6 transition-all flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Store className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-gray-800">ชำระเงินที่ร้าน</h4>
              <p className="text-sm text-gray-600">ชำระเงินเมื่อรับอาหาร</p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600">รอการยืนยันจากพนักงาน</span>
              </div>
            </div>
            <div className="text-orange-600">
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>หมายเหตุ:</strong> หากเลือกชำระเงินที่ร้าน คุณสามารถเปลี่ยนมาชำระออนไลน์ได้ตลอดเวลาในหน้าติดตามสถานะ
          </p>
        </div>
      </div>
    </div>
  );
}