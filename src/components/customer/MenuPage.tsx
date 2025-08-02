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

  return (
    <div className="pb-6">
      {/* Category Tabs */}
      <div className="bg-white p-4 mb-4">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex space-x-4">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                {item.isOnPromotion && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Tag className="h-3 w-3" />
                    <span>โปรโมชั่น</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.isOnPromotion && item.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ฿{item.originalPrice}
                      </span>
                    )}
                    <span className={`text-lg font-bold ${
                      item.isOnPromotion ? 'text-red-500' : 'text-orange-500'
                    }`}>
                      ฿{item.price}
                    </span>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    เพิ่ม
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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