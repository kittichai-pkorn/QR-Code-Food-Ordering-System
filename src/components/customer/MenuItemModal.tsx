import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h2>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="mb-6">
            {item.isOnPromotion && item.originalPrice && (
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-lg text-gray-400 line-through">
                  ฿{item.originalPrice}
                </span>
                <div className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span>ประหยัด ฿{item.originalPrice - item.price}</span>
                </div>
              </div>
            )}
            <p className={`text-2xl font-bold mb-2 ${
              item.isOnPromotion ? 'text-red-500' : 'text-orange-500'
            }`}>
              ฿{item.price}
            </p>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              จำนวน
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมายเหตุพิเศษ (ถ้ามี)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น ไม่ใส่ผักชี, พิเศษเผ็ด"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            เพิ่มลงตะกร้า - ฿{(item.price * quantity).toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}