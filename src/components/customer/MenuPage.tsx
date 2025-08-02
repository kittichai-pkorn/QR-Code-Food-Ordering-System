import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import MenuItemModal from './MenuItemModal';
import { MenuItem } from '../../context/AppContext';
import { Tag } from 'lucide-react';

const categories = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'main', name: 'จานหลัก' },
  { id: 'soup', name: 'ต้ม/แกง' },
  { id: 'salad', name: 'ยำ/สลัด' },
  { id: 'dessert', name: 'ของหวาน' },
  { id: 'drink', name: 'เครื่องดื่ม' },
];

export default function MenuPage() {
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredMenu = selectedCategory === 'all' 
    ? state.menu.filter(item => item.available)
    : state.menu.filter(item => item.category === selectedCategory && item.available);

  const promotionItems = state.menu.filter(item => item.isOnPromotion && item.available);

  return (
    <div className="pb-6">
      {/* Promotion Banner */}
      {promotionItems.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">โปรโมชั่นพิเศษ!</h3>
              <p className="text-white/90 text-sm">ลดราคาสูงสุด 30% สำหรับเมนูยอดนิยม</p>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-white p-4 mb-4 shadow-sm">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shadow-sm ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-4">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-[1.02] border border-gray-100"
          >
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover shadow-md"
                />
                {item.isOnPromotion && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 shadow-lg animate-pulse">
                    <Tag className="h-3 w-3" />
                    <span>ลด {Math.round((1 - item.price / (item.originalPrice || item.price)) * 100)}%</span>
                  </div>
                )}
                {item.isOnPromotion && (
                  <div className="absolute -bottom-1 -left-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold shadow-md">
                    HOT
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1 text-lg">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-end justify-between">
                  <div className="flex flex-col space-y-1">
                    {item.isOnPromotion && item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through font-medium">
                        ฿{item.originalPrice}
                      </span>
                    )}
                    <span className={`text-xl font-bold ${
                      item.isOnPromotion ? 'text-red-500' : 'text-gray-800'
                    }`}>
                      ฿{item.price}
                    </span>
                    {item.isOnPromotion && item.originalPrice && (
                      <span className="text-xs text-green-600 font-medium">
                        ประหยัด ฿{item.originalPrice - item.price}
                      </span>
                    )}
                  </div>
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                    เพิ่ม
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredMenu.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">ไม่มีเมนูในหมวดนี้</h3>
            <p className="text-gray-500">กรุณาเลือกหมวดหมู่อื่น</p>
          </div>
        )}
      </div>

      {/* Menu Item Modal */}
      {selectedItem && (
        <MenuItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}