import React, { useState } from 'react';
import { X, Plus, Minus, Tag } from 'lucide-react';
import { MenuItem } from '../../context/AppContext';
import { useApp } from '../../context/AppContext';

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const { dispatch } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { item, quantity, notes }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover"
          />
          {item.isOnPromotion && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full flex items-center space-x-2 shadow-lg">
              <Tag className="h-4 w-4" />
              <span className="font-bold">ลด {Math.round((1 - item.price / (item.originalPrice || item.price)) * 100)}%</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{item.name}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{item.description}</p>
          
          <div className="mb-6">
            {item.isOnPromotion && item.originalPrice && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg text-gray-500 line-through font-medium">
                    ราคาเต็ม ฿{item.originalPrice}
                  </span>
                  <div className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full flex items-center space-x-1 font-bold">
                    <Tag className="h-3 w-3" />
                    <span>ประหยัด ฿{item.originalPrice - item.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-red-500">
                    ฿{item.price}
                  </span>
                </div>
              </div>
            )}
            
            {!item.isOnPromotion && (
              <p className="text-3xl font-bold text-gray-800 mb-2">
                ฿{item.price}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              จำนวน
            </label>
            <div className="flex items-center justify-center space-x-6 bg-gray-50 rounded-2xl p-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-white hover:bg-gray-100 p-3 rounded-xl transition-colors shadow-md border border-gray-200"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-white hover:bg-gray-100 p-3 rounded-xl transition-colors shadow-md border border-gray-200"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              หมายเหตุพิเศษ (ถ้ามี)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ไม่ใส่ผักชี, พิเศษเผ็ด, ไม่ใส่น้ำแข็ง"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
              rows={3}
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            เพิ่มลงตะกร้า - ฿{(item.price * quantity).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}