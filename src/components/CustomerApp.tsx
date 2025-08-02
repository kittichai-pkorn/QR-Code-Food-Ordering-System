import React, { useState } from 'react';
import MenuPage from './customer/MenuPage';
import CartPage from './customer/CartPage';
import OrderSummaryPage from './customer/OrderSummaryPage';
import PaymentPage from './customer/PaymentPage';
import OrderConfirmation from './customer/OrderConfirmation';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CustomerAppProps {
  tableId: string;
  onBack: () => void;
}

export default function CustomerApp({ tableId, onBack }: CustomerAppProps) {
  const [currentPage, setCurrentPage] = useState<'menu' | 'cart' | 'order_summary' | 'payment' | 'confirmation'>('menu');
  const { state } = useApp();

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-bold text-gray-800">โต๊ะ {tableId}</h1>
            <p className="text-xs text-gray-500">เลือกเมนูที่ต้องการ</p>
          </div>
        </div>

        {currentPage === 'menu' && (
          <button
            onClick={() => setCurrentPage('cart')}
            className="relative bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      {currentPage === 'menu' && (
        <MenuPage />
      )}
      {currentPage === 'cart' && (
        <CartPage 
          tableId={tableId}
          onBack={() => setCurrentPage('menu')}
          onOrderConfirmed={() => setCurrentPage('order_summary')}
        />
      )}
      {currentPage === 'order_summary' && (
        <OrderSummaryPage 
          tableId={tableId}
          onBack={() => setCurrentPage('cart')}
          onPayOnline={() => setCurrentPage('payment')}
          onPayAtRestaurant={() => setCurrentPage('confirmation')}
        />
      )}
      {currentPage === 'payment' && (
        <PaymentPage 
          onBack={() => setCurrentPage('order_summary')}
          onPaymentCompleted={() => setCurrentPage('confirmation')}
        />
      )}
      {currentPage === 'confirmation' && (
        <OrderConfirmation 
          onNewOrder={() => {
            setCurrentPage('menu');
          }}
        />
      )}
    </div>
  );
}