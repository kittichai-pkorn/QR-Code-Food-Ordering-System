import React, { useState } from 'react';
import { Upload, Palette, Store, Phone, MapPin, CreditCard, Eye, Save, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandSettings } from '../../context/AppContext';

export default function BrandingSettings() {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState<BrandSettings>(state.brandSettings);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof BrandSettings, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
  };

  const handleBankAccountChange = (field: keyof BrandSettings['bankAccount'], value: string) => {
    const newData = {
      ...formData,
      bankAccount: {
        ...formData.bankAccount,
        [field]: value
      }
    };
    setFormData(newData);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newData = { ...formData, logo: e.target?.result as string };
        setFormData(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    dispatch({ type: 'UPDATE_BRAND_SETTINGS', payload: formData });
    setIsSaving(false);
  };

  const resetToDefault = () => {
    setFormData(state.brandSettings);
  };

  const presetColors = [
    { name: 'Orange Classic', primary: '#f97316', secondary: '#ef4444', accent: '#eab308' },
    { name: 'Blue Ocean', primary: '#3b82f6', secondary: '#06b6d4', accent: '#10b981' },
    { name: 'Purple Luxury', primary: '#8b5cf6', secondary: '#ec4899', accent: '#f59e0b' },
    { name: 'Green Nature', primary: '#10b981', secondary: '#059669', accent: '#84cc16' },
    { name: 'Red Passion', primary: '#ef4444', secondary: '#dc2626', accent: '#f97316' },
    { name: 'Pink Sweet', primary: '#ec4899', secondary: '#be185d', accent: '#f472b6' },
  ];

  const applyColorPreset = (preset: typeof presetColors[0]) => {
    const newData = {
      ...formData,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent
    };
    setFormData(newData);
  };

  // Live Preview Component
  const LivePreview = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <Eye className="h-5 w-5" />
        <span>ตัวอย่างหน้าเมนูลูกค้า</span>
      </h3>
      
      {/* Mock Customer Menu Preview */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        {/* Header Preview */}
        <div 
          className="p-4 rounded-xl text-white shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` 
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl overflow-hidden flex items-center justify-center">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Store className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-lg">{formData.restaurantName}</h2>
              <p className="text-white/90 text-sm">{formData.description}</p>
            </div>
          </div>
        </div>

        {/* Menu Item Preview */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">ผัดไทยกุ้งสด</h4>
              <p className="text-sm text-gray-600 mb-2">ผัดไทยกุ้งสดใหญ่ หวานมัน กลมกล่อม</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 line-through">฿120</span>
                  <span 
                    className="text-lg font-bold"
                    style={{ color: formData.secondaryColor }}
                  >
                    ฿89
                  </span>
                </div>
                <button 
                  className="px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})` 
                  }}
                >
                  เพิ่ม
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Promotion Banner Preview */}
        <div 
          className="p-4 rounded-xl text-white"
          style={{ 
            background: `linear-gradient(135deg, ${formData.secondaryColor}, ${formData.accentColor})` 
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">โปรโมชั่นพิเศษ!</h3>
              <p className="text-white/90 text-sm">ลดราคาสูงสุด 30%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <span>ปรับแต่งแบรนด์</span>
            </h1>
            <p className="text-gray-600 mt-2">กำหนดรูปลักษณ์และข้อมูลร้านค้าของคุณ</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                showPreview 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>{showPreview ? 'ซ่อนตัวอย่าง' : 'ดูตัวอย่าง'}</span>
            </button>
            
            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium transition-all flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>รีเซ็ต</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Restaurant Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>ข้อมูลร้านค้า</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ชื่อร้านค้า
                </label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="ชื่อร้านอาหารของคุณ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  คำอธิบายร้าน
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  rows={3}
                  placeholder="อธิบายร้านค้าของคุณในสั้น ๆ"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="02-123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  ที่อยู่
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  rows={2}
                  placeholder="ที่อยู่ร้านค้าของคุณ"
                />
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>โลโก้ร้านค้า</span>
            </h2>
            
            <div className="space-y-4">
              {formData.logo && (
                <div className="text-center">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="w-32 h-32 object-cover rounded-2xl mx-auto shadow-lg border-4 border-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-2">ตัวอย่างโลโก้ปัจจุบัน</p>
                </div>
              )}
              
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2 font-medium">คลิกเพื่ออัปโหลดโลโก้</p>
                  <p className="text-sm text-gray-500">รองรับไฟล์ JPG, PNG (แนะนำขนาด 200x200px)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Bank Account Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>ข้อมูลบัญชีธนาคาร</span>
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ชื่อบัญชี
                </label>
                <input
                  type="text"
                  value={formData.bankAccount.accountName}
                  onChange={(e) => handleBankAccountChange('accountName', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="ชื่อบัญชีธนาคาร"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  เลขที่บัญชี
                </label>
                <input
                  type="text"
                  value={formData.bankAccount.accountNumber}
                  onChange={(e) => handleBankAccountChange('accountNumber', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                  placeholder="123-4-56789-0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ธนาคาร
                </label>
                <select
                  value={formData.bankAccount.bankName}
                  onChange={(e) => handleBankAccountChange('bankName', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</option>
                  <option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</option>
                  <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</option>
                  <option value="ธนาคารกรุงไทย">ธนาคารกรุงไทย</option>
                  <option value="ธนาคารทหารไทยธนชาต">ธนาคารทหารไทยธนชาต</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Color Settings & Preview */}
        <div className="space-y-6">
          {/* Color Settings */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>โทนสีแบรนด์</span>
            </h2>
            
            {/* Color Presets */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3">ชุดสีแนะนำ</h3>
              <div className="grid grid-cols-2 gap-3">
                {presetColors.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyColorPreset(preset)}
                    className="p-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all group"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.secondary }}
                      ></div>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: preset.accent }}
                      ></div>
                    </div>
                    <p className="text-xs font-medium text-gray-600 group-hover:text-gray-800">
                      {preset.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Colors */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  สีหลัก (Primary)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-16 h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                    placeholder="#f97316"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  สีรอง (Secondary)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="w-16 h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                    placeholder="#ef4444"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  สีเสริม (Accent)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="w-16 h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => handleInputChange('accentColor', e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                    placeholder="#eab308"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && <LivePreview />}
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">พร้อมบันทึกการตั้งค่าแล้วใช่ไหม?</h3>
            <p className="text-gray-600 text-sm">การเปลี่ยนแปลงจะมีผลทันทีหลังจากบันทึก</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>บันทึกการตั้งค่า</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}