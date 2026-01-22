
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign, Gamepad } from 'lucide-react';
import { SessionRecord, ThemeType } from '../types';

interface DashboardProps {
  history: SessionRecord[];
  theme: ThemeType;
}

const Dashboard: React.FC<DashboardProps> = ({ history, theme }) => {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  
  const getThemeAccentHex = () => {
    switch (theme) {
      case ThemeType.AHLY: return '#ef4444';
      case ThemeType.RAMADAN: return '#34d399';
      case ThemeType.CHRISTMAS: return '#10b981';
      default: return '#3b82f6';
    }
  };

  const accentHex = getThemeAccentHex();

  const stats = useMemo(() => {
    const dailySessions = history.filter(s => s.startTime.toISOString().split('T')[0] === filterDate);
    const totalRevenue = dailySessions.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalDrinks = dailySessions.reduce((acc, s) => acc + s.drinksTotal, 0);
    const totalPlay = dailySessions.reduce((acc, s) => acc + s.playTotal, 0);
    
    return {
      count: dailySessions.length,
      revenue: totalRevenue,
      drinks: totalDrinks,
      play: totalPlay
    };
  }, [history, filterDate]);

  const chartData = useMemo(() => {
    const hours = Array.from({length: 24}, (_, i) => ({
      hour: `${i}:00`,
      revenue: 0
    }));

    history.forEach(s => {
      if (s.startTime.toISOString().split('T')[0] === filterDate) {
        const h = s.startTime.getHours();
        hours[h].revenue += s.totalAmount;
      }
    });

    return hours.filter(h => h.revenue > 0 || parseInt(h.hour) > 8);
  }, [history, filterDate]);

  const getAccentClass = (base: string) => {
    switch (theme) {
      case ThemeType.AHLY: return `text-red-500 bg-red-500/10`;
      case ThemeType.RAMADAN: return `text-emerald-400 bg-emerald-500/10`;
      case ThemeType.CHRISTMAS: return `text-green-500 bg-green-500/10`;
      default: return `text-blue-500 bg-blue-500/10`;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">الإحصائيات</h2>
          <p className="text-gray-500 text-sm mt-1">تتبع أداء المركز والنمو المالي</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 p-2 rounded-xl shadow-2xl">
          <Calendar size={18} className="text-gray-500" />
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="outline-none text-xs font-bold bg-transparent text-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="الإيرادات" 
          value={`${stats.revenue.toFixed(0)}`} 
          unit="ج.م"
          icon={<DollarSign size={20} />} 
          accentClass={getAccentClass('blue')}
        />
        <StatCard 
          title="الجلسات" 
          value={stats.count.toString()} 
          icon={<Users size={20} />} 
          accentClass="text-purple-500 bg-purple-500/10"
        />
        <StatCard 
          title="اللعب" 
          value={`${stats.play.toFixed(0)}`} 
          unit="ج.م"
          icon={<Gamepad size={20} />} 
          accentClass="text-amber-500 bg-amber-500/10"
        />
        <StatCard 
          title="المشاريب" 
          value={`${stats.drinks.toFixed(0)}`} 
          unit="ج.م"
          icon={<TrendingUp size={20} />} 
          accentClass="text-pink-500 bg-pink-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl shadow-xl">
          <h3 className="text-lg font-black mb-6 text-gray-300">تحليل الإيرادات الساعي</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#4b5563'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#4b5563'}} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #374151', 
                    backgroundColor: '#000',
                    fontSize: '12px' 
                  }}
                  itemStyle={{ color: accentHex }}
                />
                <Bar dataKey="revenue" fill={accentHex} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <h3 className="text-lg font-black mb-6 text-gray-300">هيكل المبيعات</h3>
          <div className="space-y-8">
            <ProgressBar 
              label="اللعب" 
              value={stats.play} 
              total={stats.revenue} 
              color={accentHex} 
            />
            <ProgressBar 
              label="المشروبات" 
              value={stats.drinks} 
              total={stats.revenue} 
              color="#f59e0b" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit, icon, accentClass }: any) => (
  <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-3xl shadow-lg transition-transform hover:scale-[1.02]">
    <div className="flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accentClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-white mt-1">
          {value} <span className="text-xs font-normal text-gray-600">{unit}</span>
        </p>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ label, value, total, color }: any) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-gray-400">{label}</span>
        <span className="text-sm font-black text-white">{value.toFixed(1)} ج.م</span>
      </div>
      <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
