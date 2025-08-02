import React, { useState } from 'react';
import { Plus, Edit, ToggleLeft, ToggleRight, ImageIcon, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../context/AppContext';

const categories = [
  { id: 'main', name: 'จานหลัก' },
  { id: 'soup', name: 'ต้ม/แกง' },
  { id: 'salad', name: 'ยำ/สลัด' },
  { id: 'dessert', name: 'ของหวาน' },
  { id: 'drink', name: 'เครื่องดื่ม' },
];

export default function MenuManagement() {
  const { state, dispatch } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const toggleAvailability = (id: string) => {
    dispatch({ type: 'TOGGLE_MENU_AVAILABILITY', payload: { id } });
  };

  const MenuForm = ({ item, onSave, onCancel }: {
    item?: MenuItem;
    onSave: (item: MenuItem) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || 0,
      originalPrice: item?.originalPrice || 0,
      isOnPromotion: item?.isOnPromotion || false,
      category: item?.category || 'main',
      image: item?.image || '',
      available: item?.available ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newItem: MenuItem = {
        id: item?.id || `item-${Date.now()}`,
        ...formData,
      };
      onSave(newItem);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-6">
            {item ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อเมนู
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รายละเอียด
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ราคาเต็ม (บาท)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="0"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  เปิดใช้งานโปรโมชั่น
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, isOnPromotion: !prev.isOnPromotion }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isOnPromotion ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isOnPromotion ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {formData.isOnPromotion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ราคาโปรโมชั่น (บาท)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  max={formData.originalPrice}
                  required
                />
                {formData.originalPrice > 0 && formData.price > 0 && formData.price < formData.originalPrice && (
                  <p className="text-sm text-green-600 mt-1">
                    ประหยัด ฿{formData.originalPrice - formData.price} ({Math.round((1 - formData.price / formData.originalPrice) * 100)}%)
                  </p>
                )}
              </div>
            )}

            {!formData.isOnPromotion && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ราคาขาย (บาท)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    price: Number(e.target.value),
                    originalPrice: Number(e.target.value)
                  }))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL รูปภาพ
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://..."
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                {item ? 'บันทึก' : 'เพิ่มเมนู'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveItem = (item: MenuItem) => {
    if (editingItem) {
      dispatch({ type: 'UPDATE_MENU_ITEM', payload: item });
      setEditingItem(null);
    } else {
      dispatch({ type: 'ADD_MENU_ITEM', payload: item });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          จัดการเมนู ({state.menu.length} รายการ)
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>เพิ่มเมนู</span>
        </button>
      </div>

      {/* Menu Items */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryItems = state.menu.filter(item => item.category === category.id);
          
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category.id} className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">
                {category.name} ({categoryItems.length})
              </h3>
              
              <div className="space-y-3">
                {categoryItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        {item.isOnPromotion && item.originalPrice && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ฿{item.originalPrice}
                            </span>
                            <div className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                              <Tag className="h-3 w-3" />
                              <span>-{Math.round((1 - item.price / item.originalPrice) * 100)}%</span>
                            </div>
                          </>
                        )}
                        <p className={`text-lg font-bold ${
                          item.isOnPromotion ? 'text-red-500' : 'text-orange-500'
                        }`}>
                          ฿{item.price}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.available
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {item.available ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <MenuForm
          onSave={handleSaveItem}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Form Modal */}
      {editingItem && (
        <MenuForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}