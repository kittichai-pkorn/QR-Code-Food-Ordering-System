import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, Award, CreditCard, PieChart, BarChart3, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const timeRanges = [
  { id: 'today', name: 'วันนี้', days: 0 },
  { id: 'week', name: '7 วันที่ผ่านมา', days: 7 },
  { id: 'month', name: 'เดือนนี้', days: 30 },
  { id: 'quarter', name: '3 เดือนที่ผ่านมา', days: 90 },
];

export default function SalesReport() {
  const { state } = useApp();
  const [selectedRange, setSelectedRange] = useState('week');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showCustomRange, setShowCustomRange] = useState(false);

  // Calculate sales data based on orders
  const salesData = useMemo(() => {
    const range = timeRanges.find(r => r.id === selectedRange);
    const cutoffDate = new Date();
    if (range && range.days > 0) {
      cutoffDate.setDate(cutoffDate.getDate() - range.days);
    } else if (range && range.days === 0) {
      cutoffDate.setHours(0, 0, 0, 0);
    }

    const filteredOrders = state.orders.filter(order => {
      if (range && range.days === 0) {
        return order.timestamp >= cutoffDate;
      }
      return order.timestamp >= cutoffDate;
    });

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Best selling items
    const itemSales = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.id]) {
          itemSales[item.id] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
            image: item.image
          };
        }
        itemSales[item.id].quantity += item.quantity;
        itemSales[item.id].revenue += item.price * item.quantity;
      });
    });

    const bestSelling = Object.values(itemSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Payment methods
    const paymentMethods = {
      qr_code: filteredOrders.filter(o => o.paymentMethod === 'qr_code').length,
      bank_transfer: filteredOrders.filter(o => o.paymentMethod === 'bank_transfer').length,
      pay_at_restaurant: filteredOrders.filter(o => o.paymentStatus === 'pay_at_restaurant').length,
    };

    // Daily sales for chart
    const dailySales = {};
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push(dateStr);
      dailySales[dateStr] = 0;
    }

    filteredOrders.forEach(order => {
      const dateStr = order.timestamp.toISOString().split('T')[0];
      if (dailySales.hasOwnProperty(dateStr)) {
        dailySales[dateStr] += order.total;
      }
    });

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      bestSelling,
      paymentMethods,
      dailySales: last7Days.map(date => ({
        date,
        revenue: dailySales[date] || 0,
        label: new Date(date).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric' })
      }))
    };
  }, [state.orders, selectedRange]);

  const maxDailyRevenue = Math.max(...salesData.dailySales.map(d => d.revenue));

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span>รายงานยอดขาย</span>
            </h1>
            <p className="text-gray-600 mt-2">ภาพรวมและสถิติการขายของร้าน</p>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-gray-700">
            <Filter className="h-4 w-4" />
            <span className="font-medium">ช่วงเวลา:</span>
          </div>
          
          {timeRanges.map(range => (
            <button
              key={range.id}
              onClick={() => {
                setSelectedRange(range.id);
                setShowCustomRange(false);
              }}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedRange === range.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.name}
            </button>
          ))}
          
          <button
            onClick={() => setShowCustomRange(!showCustomRange)}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
              showCustomRange
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>กำหนดเอง</span>
          </button>
        </div>

        {/* Custom Date Range */}
        {showCustomRange && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-6">
                ใช้งาน
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">ยอดขายรวม</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ฿{salesData.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 text-sm font-medium">+12.5%</span>
                <span className="text-gray-500 text-sm">จากเดือนที่แล้ว</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">จำนวนออเดอร์</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {salesData.totalOrders.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-blue-600 text-sm font-medium">+8.2%</span>
                <span className="text-gray-500 text-sm">จากเดือนที่แล้ว</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">ออเดอร์เฉลี่ย</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                ฿{Math.round(salesData.avgOrderValue).toLocaleString()}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-purple-600 text-sm font-medium">+5.1%</span>
                <span className="text-gray-500 text-sm">จากเดือนที่แล้ว</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>ยอดขายรายวัน</span>
            </h2>
            <div className="text-sm text-gray-500">7 วันที่ผ่านมา</div>
          </div>
          
          <div className="space-y-4">
            {salesData.dailySales.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm font-medium text-gray-600">
                  {day.label}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                    style={{
                      width: maxDailyRevenue > 0 ? `${(day.revenue / maxDailyRevenue) * 100}%` : '0%',
                      minWidth: day.revenue > 0 ? '60px' : '0px'
                    }}
                  >
                    {day.revenue > 0 && (
                      <span className="text-white text-xs font-bold">
                        ฿{day.revenue.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>วิธีการชำระเงิน</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">QR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">QR Code</p>
                  <p className="text-sm text-gray-600">ชำระผ่าน Mobile Banking</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {salesData.paymentMethods.qr_code}
                </p>
                <p className="text-sm text-gray-500">ออเดอร์</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">฿</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">โอนเงิน</p>
                  <p className="text-sm text-gray-600">โอนเข้าบัญชีธนาคาร</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {salesData.paymentMethods.bank_transfer}
                </p>
                <p className="text-sm text-gray-500">ออเดอร์</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">💰</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">ชำระที่ร้าน</p>
                  <p className="text-sm text-gray-600">ชำระเงินสดที่ร้าน</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">
                  {salesData.paymentMethods.pay_at_restaurant}
                </p>
                <p className="text-sm text-gray-500">ออเดอร์</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Items */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>เมนูขายดี</span>
        </h2>
        
        {salesData.bestSelling.length > 0 ? (
          <div className="space-y-4">
            {salesData.bestSelling.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">ขายได้ {item.quantity} จาน</p>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">
                    ฿{item.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">รายได้</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">ยังไม่มีข้อมูลการขาย</h3>
            <p className="text-gray-500">เมื่อมีออเดอร์เข้ามา ข้อมูลจะแสดงที่นี่</p>
          </div>
        )}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">แนวโน้มการขาย</h3>
          </div>
          <p className="text-white/90 mb-4">
            ยอดขายเพิ่มขึ้น 15% เมื่อเทียบกับเดือนที่แล้ว
          </p>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm">💡 <strong>คำแนะนำ:</strong> เมนูโปรโมชั่นช่วยเพิ่มยอดขายได้ดี</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">ลูกค้าประจำ</h3>
          </div>
          <p className="text-white/90 mb-4">
            มีลูกค้ากลับมาใช้บริการซ้ำ 68%
          </p>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm">💡 <strong>คำแนะนำ:</strong> สร้างโปรแกรมสะสมแต้มเพื่อรักษาลูกค้า</p>
          </div>
        </div>
      </div>
    </div>
  );
}