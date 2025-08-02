import React, { useState } from 'react';
import QRScanner from './components/QRScanner';
import CustomerApp from './components/CustomerApp';
import MerchantDashboard from './components/MerchantDashboard';
import { AppProvider } from './context/AppContext';

function App() {
  const [currentView, setCurrentView] = useState<'scanner' | 'customer' | 'merchant'>('scanner');
  const [tableId, setTableId] = useState<string>('');

  const handleQRScan = (tableNumber: string) => {
    setTableId(tableNumber);
    setCurrentView('customer');
  };

  const handleSwitchToMerchant = () => {
    setCurrentView('merchant');
  };

  const handleBackToScanner = () => {
    setCurrentView('scanner');
    setTableId('');
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        {currentView === 'scanner' && (
          <QRScanner 
            onScan={handleQRScan} 
            onSwitchToMerchant={handleSwitchToMerchant}
          />
        )}
        {currentView === 'customer' && (
          <CustomerApp 
            tableId={tableId} 
            onBack={handleBackToScanner}
          />
        )}
        {currentView === 'merchant' && (
          <MerchantDashboard 
            onBack={handleBackToScanner}
          />
        )}
      </div>
    </AppProvider>
  );
}

export default App;