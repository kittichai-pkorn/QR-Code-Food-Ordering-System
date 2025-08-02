import React, { useState } from 'react';
import { QrCode, Utensils, ShoppingBag, Settings } from 'lucide-react';

interface QRScannerProps {
  onScan: (tableId: string) => void;
  onSwitchToMerchant: () => void;
}

export default function QRScanner({ onScan, onSwitchToMerchant }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanDemo = (tableNumber: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onScan(tableNumber);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Utensils className="h-8 w-8 text-orange-500" />
          <h1 className="text-xl font-bold text-gray-800">QR Food</h1>
        </div>
        <button
          onClick={onSwitchToMerchant}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">พนักงาน</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ยินดีต้อนรับ!
          </h2>
          <p className="text-gray-600">
            สแกน QR Code บนโต๊ะเพื่อดูเมนูและสั่งอาหาร
          </p>
        </div>

        {/* QR Scanner Animation */}
        <div className="relative mb-8">
          <div className={`w-64 h-64 border-4 border-orange-200 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            isScanning ? 'border-orange-500 bg-orange-50' : 'bg-white'
          }`}>
            <QrCode className={`h-32 w-32 transition-all duration-500 ${
              isScanning ? 'text-orange-500 animate-pulse' : 'text-gray-400'
            }`} />
          </div>
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 rounded-lg p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">กำลังสแกน...</p>
              </div>
            </div>
          )}
        </div>

        {!isScanning && (
          <div className="space-y-4 w-full max-w-sm">
            <p className="text-center text-gray-600 mb-4">
              หรือเลือกโต๊ะสำหรับทดสอบ:
            </p>
            
            {['A1', 'A2', 'B1', 'B2'].map((table) => (
              <button
                key={table}
                onClick={() => handleScanDemo(table)}
                className="w-full bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-300 rounded-xl p-4 transition-all duration-200 flex items-center justify-center space-x-3"
              >
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-gray-700">โต๊ะ {table}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            สแกน QR Code เพื่อเริ่มสั่งอาหาร
          </p>
        </div>
      </div>
    </div>
  );
}