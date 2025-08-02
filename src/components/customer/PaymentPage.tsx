import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Building2, QrCode, Upload, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PaymentPageProps {
  onBack: () => void;
  onPaymentCompleted: () => void;
}

export default function PaymentPage({ onBack, onPaymentCompleted }: PaymentPageProps) {
  const { state, dispatch } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'qr_code' | 'bank_transfer' | null>(null);
  const [uploadedSlip, setUploadedSlip] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentOrder = state.currentOrder;
  if (!currentOrder) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedSlip(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQRPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_PAYMENT_STATUS',
        payload: {
          orderId: currentOrder.id,
          paymentStatus: 'paid',
          paymentMethod: 'qr_code'
        }
      });
      setIsProcessing(false);
      onPaymentCompleted();
    }, 2000);
  };

  const handleBankTransferPayment = () => {
    if (!uploadedSlip) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      dispatch({
        type: 'UPDATE_PAYMENT_STATUS',
        payload: {
          orderId: currentOrder.id,
          paymentStatus: 'pending_verification',
          paymentMethod: 'bank_transfer',
          paymentSlip: uploadedSlip
        }
      });
      setIsProcessing(false);
      onPaymentCompleted();
    }, 1000);
  };

  if (paymentMethod === 'qr_code') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center space-x-3 shadow-sm">
          <button
            onClick={() => setPaymentMethod(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">ชำระเงินด้วย QR Code</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                สแกน QR Code เพื่อชำระเงิน
              </h2>
              <p className="text-gray-600 text-sm">
                ใช้แอป Mobile Banking ของคุณสแกน QR Code ด้านล่าง
              </p>
            </div>

            {/* Mock QR Code */}
            <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center">
                <QrCode className="h-20 w-20 text-white" />
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-1">ยอดเงินที่ต้องชำระ</p>
              <p className="text-2xl font-bold text-orange-600">
                ฿{currentOrder.total.toLocaleString()}
              </p>
            </div>

            <button
              onClick={handleQRPayment}
              disabled={isProcessing}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>กำลังตรวจสอบ...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>ชำระเงินแล้ว</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 mt-4">
              กดปุ่มด้านบนหลังจากชำระเงินเรียบร้อยแล้ว
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentMethod === 'bank_transfer') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white p-4 flex items-center space-x-3 shadow-sm">
          <button
            onClick={() => setPaymentMethod(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">โอนเงินเข้าบัญชี</h1>
        </div>

        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">ข้อมูลบัญชีธนาคาร</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">ชื่อบัญชี</p>
                <p className="font-semibold text-gray-800">ร้านอาหารดีลิเชียส</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">เลขที่บัญชี</p>
                <p className="font-mono font-semibold text-gray-800">123-4-56789-0</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">ธนาคาร</p>
                <p className="font-semibold text-gray-800">ธนาคารกสิกรไทย</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">ยอดเงินที่ต้องโอน</p>
                <p className="text-2xl font-bold text-orange-600">
                  ฿{currentOrder.total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">แนบหลักฐานการโอนเงิน</h3>
            <p className="text-sm text-gray-600 mb-4">
              <span className="text-orange-500 font-medium">(ตัวเลือกเสริม)</span> - คุณสามารถแจ้งโอนเงินได้โดยไม่ต้องแนบสลิป
            </p>
            
            {uploadedSlip ? (
              <div className="text-center">
                <img
                  src={uploadedSlip}
                  alt="Payment slip"
                  className="max-w-full h-48 object-contain mx-auto rounded-lg mb-4"
                />
                <button
                  onClick={() => setUploadedSlip(null)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  ลบรูปภาพ
                </button>
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">คลิกเพื่อเลือกรูปภาพ (ไม่บังคับ)</p>
                  <p className="text-sm text-gray-500">รองรับไฟล์ JPG, PNG</p>
                </div>
              </label>
            )}
          </div>

          <button
            onClick={handleBankTransferPayment}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>กำลังส่งข้อมูล...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>แจ้งโอนเงินแล้ว</span>
              </>
            )}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-3">
            หลังจากแจ้งโอนเงิน พนักงานจะตรวจสอบยอดเงินในบัญชีและยืนยันการชำระเงิน
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-4 flex items-center space-x-3 shadow-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">เลือกวิธีการชำระเงิน</h1>
      </div>

      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">สรุปการสั่งซื้อ</h2>
          <div className="space-y-2 mb-4">
            {currentOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>฿{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">ยอดรวมทั้งหมด</span>
              <span className="text-2xl font-bold text-orange-500">
                ฿{currentOrder.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">เลือกวิธีการชำระเงิน</h3>
          
          <button
            onClick={() => setPaymentMethod('qr_code')}
            className="w-full bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-6 transition-all flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <QrCode className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-gray-800">ชำระด้วย QR Code</h4>
              <p className="text-sm text-gray-600">สแกนด้วยแอป Mobile Banking</p>
            </div>
            <div className="text-blue-600">
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('bank_transfer')}
            className="w-full bg-white hover:bg-green-50 border-2 border-gray-200 hover:border-green-300 rounded-xl p-6 transition-all flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-gray-800">โอนเงินเข้าบัญชี</h4>
              <p className="text-sm text-gray-600">โอนผ่านแอปธนาคารและแนบสลิป</p>
            </div>
            <div className="text-green-600">
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}