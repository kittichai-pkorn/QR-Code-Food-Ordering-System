import React, { useState } from 'react';
import OrderManagement from './merchant/OrderManagement';
import MenuManagement from './merchant/MenuManagement';
import { ArrowLeft, ClipboardList, Menu } from 'lucide-react';

interface MerchantDashboardProps {
  onBack: () => void;
}

export default function MerchantDashboard({ onBack }: MerchantDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">ระบบจัดการร้าน</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'orders'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            <span className="font-medium">จัดการออเดอร์</span>
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'menu'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Menu className="h-4 w-4" />
            <span className="font-medium">จัดการเมนู</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'orders' && <OrderManagement />}
      {activeTab === 'menu' && <MenuManagement />}
    </div>
  );
}