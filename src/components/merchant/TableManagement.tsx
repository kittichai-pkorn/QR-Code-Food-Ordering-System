import React, { useState } from 'react';
import { Plus, Edit, Trash2, QrCode, Download, X, Eye, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  qrCode: string;
}

export default function TableManagement() {
  const { state } = useApp();
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 'A1', capacity: 4, status: 'available', qrCode: 'table-a1-qr' },
    { id: '2', number: 'A2', capacity: 4, status: 'occupied', qrCode: 'table-a2-qr' },
    { id: '3', number: 'B1', capacity: 6, status: 'available', qrCode: 'table-b1-qr' },
    { id: '4', number: 'B2', capacity: 2, status: 'reserved', qrCode: 'table-b2-qr' },
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [showQRModal, setShowQRModal] = useState<Table | null>(null);
  const [copiedQR, setCopiedQR] = useState<string | null>(null);

  const statusConfig = {
    available: { text: 'ว่าง', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
    occupied: { text: 'มีลูกค้า', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    reserved: { text: 'จอง', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  };

  const TableForm = ({ table, onSave, onCancel }: {
    table?: Table;
    onSave: (table: Omit<Table, 'id' | 'qrCode'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      number: table?.number || '',
      capacity: table?.capacity || 4,
      status: table?.status || 'available' as const,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {table ? 'แก้ไขโต๊ะ' : 'เพิ่มโต๊ะใหม่'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                หมายเลขโต๊ะ
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="เช่น A1, B2, VIP1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                จำนวนที่นั่ง
              </label>
              <select
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value={2}>2 ที่นั่ง</option>
                <option value={4}>4 ที่นั่ง</option>
                <option value={6}>6 ที่นั่ง</option>
                <option value={8}>8 ที่นั่ง</option>
                <option value={10}>10 ที่นั่ง</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                สถานะ
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Table['status'] }))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="available">ว่าง</option>
                <option value="occupied">มีลูกค้า</option>
                <option value="reserved">จอง</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg"
              >
                {table ? 'บันทึก' : 'เพิ่มโต๊ะ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const QRModal = ({ table, onClose }: { table: Table; onClose: () => void }) => {
    const qrUrl = `${window.location.origin}?table=${table.number}`;
    
    const handleDownload = () => {
      // Create QR Code canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      
      if (ctx) {
        // Simple QR code placeholder (in real app, use QR library)
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 300, 300);
        ctx.fillStyle = '#fff';
        ctx.fillRect(20, 20, 260, 260);
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Table ${table.number}`, 150, 150);
        ctx.fillText('QR Code', 150, 170);
        
        // Download
        const link = document.createElement('a');
        link.download = `table-${table.number}-qr.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    };

    const handleCopyUrl = async () => {
      try {
        await navigator.clipboard.writeText(qrUrl);
        setCopiedQR(table.id);
        setTimeout(() => setCopiedQR(null), 2000);
      } catch (err) {
        console.error('Failed to copy URL');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              QR Code โต๊ะ {table.number}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            {/* QR Code Display */}
            <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-4 border-gray-200">
              <div className="w-40 h-40 bg-black rounded-lg flex flex-col items-center justify-center text-white">
                <QrCode className="h-16 w-16 mb-2" />
                <span className="text-sm font-bold">โต๊ะ {table.number}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">URL สำหรับสแกน:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-white px-3 py-2 rounded-lg text-xs font-mono text-gray-700 border">
                  {qrUrl}
                </code>
                <button
                  onClick={handleCopyUrl}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  {copiedQR === table.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              {copiedQR === table.id && (
                <p className="text-xs text-green-600 mt-1">คัดลอกแล้ว!</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>ดาวน์โหลด QR Code</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveTable = (tableData: Omit<Table, 'id' | 'qrCode'>) => {
    if (editingTable) {
      setTables(prev => prev.map(table => 
        table.id === editingTable.id 
          ? { ...table, ...tableData }
          : table
      ));
      setEditingTable(null);
    } else {
      const newTable: Table = {
        id: Date.now().toString(),
        ...tableData,
        qrCode: `table-${tableData.number.toLowerCase()}-qr`
      };
      setTables(prev => [...prev, newTable]);
      setShowAddForm(false);
    }
  };

  const handleDeleteTable = (tableId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบโต๊ะนี้?')) {
      setTables(prev => prev.filter(table => table.id !== tableId));
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <span>จัดการโต๊ะและ QR Code</span>
            </h1>
            <p className="text-gray-600 mt-2">จัดการข้อมูลโต๊ะและสร้าง QR Code สำหรับลูกค้า</p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>เพิ่มโต๊ะใหม่</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">โต๊ะว่าง</p>
                <p className="text-2xl font-bold text-green-700">
                  {tables.filter(t => t.status === 'available').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">มีลูกค้า</p>
                <p className="text-2xl font-bold text-red-700">
                  {tables.filter(t => t.status === 'occupied').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">●</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">จอง</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {tables.filter(t => t.status === 'reserved').length}
                </p>
              </div>
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">⏰</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">รวมทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-700">{tables.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <QrCode className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">รายการโต๊ะทั้งหมด</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">หมายเลขโต๊ะ</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">จำนวนที่นั่ง</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">สถานะ</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">QR Code</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tables.map((table) => {
                const status = statusConfig[table.status];
                return (
                  <tr key={table.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-blue-600">{table.number}</span>
                        </div>
                        <span className="font-bold text-gray-800">โต๊ะ {table.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{table.capacity} ที่นั่ง</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color} ${status.border} border`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setShowQRModal(table)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span>ดู QR Code</span>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setShowQRModal(table)}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                          title="ดาวน์โหลด QR Code"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingTable(table)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTable(table.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tables.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">ยังไม่มีโต๊ะ</h3>
            <p className="text-gray-500 mb-4">เริ่มต้นด้วยการเพิ่มโต๊ะแรกของคุณ</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              เพิ่มโต๊ะใหม่
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <TableForm
          onSave={handleSaveTable}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingTable && (
        <TableForm
          table={editingTable}
          onSave={handleSaveTable}
          onCancel={() => setEditingTable(null)}
        />
      )}

      {/* QR Code Modal */}
      {showQRModal && (
        <QRModal
          table={showQRModal}
          onClose={() => setShowQRModal(null)}
        />
      )}
    </div>
  );
}