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
        <div className="bg-white p-4 flex items-center space-x-3 shadow-lg">
          <button
            onClick={onBack}
            className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">ตะกร้าสินค้า</h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              ตะกร้าว่างเปล่า
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              เพิ่มเมนูที่ต้องการลงในตะกร้า
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
      <div className="bg-white p-4 flex items-center space-x-3 shadow-lg">
        <button
          onClick={onBack}
          className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">ตะกร้าสินค้า</h1>
          <p className="text-sm text-gray-500">โต๊ะ {tableId} • {state.cart.length} รายการ</p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 p-4 space-y-4">
        {state.cart.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
            <div className="flex space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover shadow-md"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  {item.isOnPromotion && item.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ฿{item.originalPrice}
                    </span>
                  )}
                  <span className={`font-bold ${item.isOnPromotion ? 'text-red-500' : 'text-gray-700'}`}>
                    ฿{item.price}
                  </span>
                </div>
                {item.notes && (
                  <p className="text-xs text-orange-600 mt-1 bg-orange-50 px-2 py-1 rounded-lg inline-block">
                    หมายเหตุ: {item.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4 bg-gray-50 rounded-xl p-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-white hover:bg-gray-100 p-2 rounded-lg transition-colors shadow-sm"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold w-8 text-center text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-white hover:bg-gray-100 p-2 rounded-lg transition-colors shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <span className="font-bold text-xl text-gray-800">
                    ฿{(item.price * item.quantity).toLocaleString()}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, 0)}
                    className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 shadow-2xl border-t-4 border-orange-500">
        {totalSavings > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-700 font-medium">ราคาเต็ม</span>
              <span className="text-gray-500 line-through font-medium">฿{originalTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-700 font-bold text-lg">🎉 คุณประหยัด</span>
              <span className="text-green-600 font-bold text-xl">-฿{totalSavings.toLocaleString()}</span>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold text-gray-800">รวมทั้งหมด</span>
          <span className="text-3xl font-bold text-orange-500">
            ฿{total.toLocaleString()}
          </span>
        </div>
        
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-5 rounded-2xl font-bold text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          ยืนยันออเดอร์
        </button>
      </div>
    </div>
  );
}