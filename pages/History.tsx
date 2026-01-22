
import React from 'react';
import { Download } from 'lucide-react';
import { SessionRecord } from '../types';

interface HistoryProps {
  history: SessionRecord[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white">سجل العمليات</h2>
          <p className="text-sm text-gray-500">قائمة بجميع الجلسات السابقة</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-xl font-bold">
          <Download size={18} />
          <span>تصدير Excel</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-black border-b border-gray-800">
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-xs">الجهاز</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-xs">من</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-xs">إلى</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-xs">النوع</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-xs text-center">اللعب</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-xs text-center">المشاريب</th>
                <th className="px-6 py-5 font-black text-gray-400 uppercase text-xs text-center">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-600">لا توجد سجلات حالية</td>
                </tr>
              ) : (
                history.map(record => (
                  <tr key={record.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{record.deviceName}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{record.startTime.toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{record.endTime.toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${record.mode === 'single' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {record.mode === 'single' ? 'Single' : 'Multi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-300">{record.playTotal.toFixed(0)} ج.م</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-300">{record.drinksTotal.toFixed(0)} ج.م</td>
                    <td className="px-6 py-4 text-center font-black text-emerald-500">{record.totalAmount.toFixed(0)} ج.م</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
