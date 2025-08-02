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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Utensils className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">QR Food</h1>
            <p className="text-xs text-gray-500">ระบบสั่งอาหารออนไลน์</p>
          </div>
        </div>
        <button
          onClick={onSwitchToMerchant}
          className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">พนักงาน</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <QrCode className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            ยินดีต้อนรับ!
          </h2>
          <p className="text-gray-600 text-lg">
            สแกน QR Code บนโต๊ะเพื่อดูเมนูและสั่งอาหาร
          </p>
        </div>

        {/* QR Scanner Animation */}
        <div className="relative mb-12">
          <div className={`w-72 h-72 border-4 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-xl ${
            isScanning 
              ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-orange-200' 
              : 'border-orange-200 bg-white shadow-gray-200'
          }`}>
            <QrCode className={`h-36 w-36 transition-all duration-500 ${
              isScanning ? 'text-orange-500 animate-pulse' : 'text-gray-400'
            }`} />
          </div>
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-orange-500 mx-auto mb-3"></div>
                <p className="text-gray-700 font-medium">กำลังสแกน...</p>
              </div>
            </div>
          )}
        </div>

        {!isScanning && (
          <div className="space-y-4 w-full max-w-sm">
            <p className="text-center text-gray-600 mb-6 font-medium">
              หรือเลือกโต๊ะสำหรับทดสอบ:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {['A1', 'A2', 'B1', 'B2'].map((table) => (
                <button
                  key={table}
                  onClick={() => handleScanDemo(table)}
                  className="bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 border-2 border-orange-200 hover:border-orange-300 rounded-2xl p-6 transition-all duration-200 flex flex-col items-center justify-center space-y-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700">โต๊ะ {table}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">ปลอดภัย</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">รวดเร็ว</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">ง่ายดาย</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              สแกน QR Code เพื่อเริ่มสั่งอาหาร<br />
              ไม่ต้องรอพนักงาน สั่งได้ทันที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}