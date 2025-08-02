import React from 'react';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CartPageProps {
  tableId: string;
  onBack: () => void;
  onOrderConfirmed: () => void;
}

export default function CartPage({ tableId, onBack, onOrderConfirmed }: CartPageProps) {
  const { state, dispatch } = useApp();

  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = state.cart.reduce((sum, item) => {
    const originalPrice = item.originalPrice || item.price;
    return sum + originalPrice * item.quantity;
  }, 0);
  const totalSavings = originalTotal - total;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity: newQuantity } });
    }
  };

  const handlePlaceOrder = () => {
    dispatch({ type: 'PLACE_ORDER', payload: { tableId } });
    onOrderConfirmed();
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center space-x-3 shadow-sm">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">ตะกร้าสินค้า</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ตะกร้าว่างเปล่า
            </h2>
            <p className="text-gray-600 mb-6">
              เพิ่มเมนูที่ต้องการลงในตะกร้า
            </p>
            <button
              onClick={onBack}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              เลือกเมนู
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold">ตะกร้าสินค้า</h1>
          <p className="text-sm text-gray-500">โต๊ะ {tableId}</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-4">
        {state.cart.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">฿{item.price}</p>
                {item.notes && (
                  <p className="text-xs text-gray-500 mt-1">
                    หมายเหตุ: {item.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-100 hover:bg-gray-200 p-1 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-100 hover:bg-gray-200 p-1 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <>
                    <div className="flex items-center space-x-2">
                      {item.isOnPromotion && item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ฿{item.originalPrice}
                        </span>
                      )}
                      <span className={`text-sm ${
                        item.isOnPromotion ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        ฿{item.price} x {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-orange-500">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 0)}
                      className="text-red-500 hover:text-red-600 p-1 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 shadow-lg">
        {totalSavings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700">ราคาเต็ม</span>
              <span className="text-gray-500 line-through">฿{originalTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-green-700">คุณประหยัด</span>
              <span className="text-green-600">-฿{totalSavings.toLocaleString()}</span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">รวมทั้งหมด</span>
          <span className="text-2xl font-bold text-orange-500">
            ฿{total.toLocaleString()}
          </span>
        </div>
        
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
        >
          ยืนยันออเดอร์
        </button>
      </div>
    </div>
  );
}