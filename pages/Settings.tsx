
import React, { useState } from 'react';
import { Save, Gamepad2, Shield, Trash2, Plus, DollarSign as DollarIcon, Palette, Star, Heart, TreePine, Moon } from 'lucide-react';
import { AppSettings, Device, DeviceMode, ThemeType, Drink } from '../types';

interface SettingsProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  drinks: Drink[];
  setDrinks: React.Dispatch<React.SetStateAction<Drink[]>>;
  setTheme: (t: ThemeType) => void;
  theme: ThemeType;
}

const Settings: React.FC<SettingsProps> = ({ settings, setSettings, devices, setDevices, setTheme, theme }) => {
  const [newDeviceName, setNewDeviceName] = useState('');
  const [isNewRoom, setIsNewRoom] = useState(false);
  const [password, setPassword] = useState('admin');

  const handleAddDevice = () => {
    if (!newDeviceName) return;
    const newDev: Device = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDeviceName, isRoom: isNewRoom, status: 'idle', mode: DeviceMode.SINGLE, drinks: [], reservations: []
    };
    setDevices(prev => [...prev, newDev]);
    setNewDeviceName('');
  };

  const updateTheme = (t: ThemeType) => {
    setTheme(t);
    setSettings(s => ({ ...s, theme: t }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-white">الإعدادات</h2>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-black">ضبط إعدادات النظام</p>
        </div>
        <button className="hidden md:flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl">
          <Save size={20} /> حفظ الإعدادات
        </button>
      </div>

      {/* Theme Section */}
      <section className="bg-gray-900/50 border border-gray-800 p-8 rounded-[40px] shadow-xl space-y-8">
        <h3 className="text-lg font-black flex items-center gap-3 text-gray-300 border-b border-gray-800 pb-6 uppercase">
          <Palette className="text-blue-500" size={22} /> مظهر النظام والسمات
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ThemeButton 
            active={theme === ThemeType.DEFAULT} onClick={() => updateTheme(ThemeType.DEFAULT)}
            icon={<Moon className="text-blue-500" size={24} />} label="الافتراضي" color="border-blue-500/20 bg-blue-500/5"
          />
          <ThemeButton 
            active={theme === ThemeType.AHLY} onClick={() => updateTheme(ThemeType.AHLY)}
            icon={<Heart className="text-red-500" size={24} fill="currentColor" />} label="الأهلي" color="border-red-600/20 bg-red-600/5"
          />
          <ThemeButton 
            active={theme === ThemeType.RAMADAN} onClick={() => updateTheme(ThemeType.RAMADAN)}
            icon={<Star className="text-emerald-500" size={24} fill="currentColor" />} label="رمضان" color="border-emerald-500/20 bg-emerald-500/5"
          />
          <ThemeButton 
            active={theme === ThemeType.CHRISTMAS} onClick={() => updateTheme(ThemeType.CHRISTMAS)}
            icon={<TreePine className="text-green-500" size={24} />} label="الكريسماس" color="border-green-500/20 bg-green-500/5"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-900/50 border border-gray-800 p-8 rounded-[40px] shadow-xl space-y-8">
        <h3 className="text-lg font-black flex items-center gap-3 text-gray-300 border-b border-gray-800 pb-6 uppercase">
          <DollarIcon className="text-emerald-500" size={22} /> تسعير الجلسات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PriceInput label="ساعة الفردي" value={settings.singlePrice} onChange={(v) => setSettings(s => ({...s, singlePrice: v}))} />
          <PriceInput label="ساعة المالتي" value={settings.multiPrice} onChange={(v) => setSettings(s => ({...s, multiPrice: v}))} />
          <PriceInput label="ساعة الغرفة" value={settings.roomPrice} onChange={(v) => setSettings(s => ({...s, roomPrice: v}))} isRoom />
        </div>
      </section>

      {/* Devices Section */}
      <section className="bg-gray-900/50 border border-gray-800 p-8 rounded-[40px] shadow-xl space-y-8">
        <h3 className="text-lg font-black flex items-center gap-3 text-gray-300 border-b border-gray-800 pb-6 uppercase">
          <Gamepad2 className="text-purple-500" size={22} /> إدارة الأجهزة
        </h3>
        <div className="flex flex-col gap-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black border border-gray-800 p-6 rounded-3xl">
             <input type="text" placeholder="اسم الجهاز الجديد" value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)}
                    className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 ring-blue-500" />
             <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl px-4 cursor-pointer">
                  <input type="checkbox" checked={isNewRoom} onChange={(e) => setIsNewRoom(e.target.checked)} className="w-5 h-5 accent-purple-500" />
                  <span className="text-xs font-black text-gray-400">غرفة خاصة</span>
                </label>
                <button onClick={handleAddDevice} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all"><Plus /></button>
             </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map(d => (
                <div key={d.id} className="flex items-center justify-between p-5 bg-black border border-gray-800 rounded-2xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.isRoom ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                      <Gamepad2 size={18} />
                    </div>
                    <div><p className="font-black text-sm text-white">{d.name}</p></div>
                  </div>
                  <button onClick={() => setDevices(prev => prev.filter(x => x.id !== d.id))} className="text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-gray-900/50 border border-gray-800 p-8 rounded-[40px] shadow-xl space-y-8">
        <h3 className="text-lg font-black flex items-center gap-3 text-gray-300 border-b border-gray-800 pb-6 uppercase">
          <Shield className="text-blue-500" size={22} /> الحماية
        </h3>
        <div className="space-y-4">
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">تغيير كلمة المرور</label>
          <div className="flex flex-col md:flex-row gap-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                   className="flex-1 bg-black border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-blue-500" placeholder="كلمة المرور الجديدة" />
            <button className="bg-gray-800 hover:bg-black text-white px-8 py-4 rounded-2xl font-black transition-all active:scale-95">تحديث</button>
          </div>
        </div>
      </section>

      <button className="md:hidden w-full flex items-center justify-center gap-3 bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-2xl">
        <Save size={24} /> حفظ كافة الإعدادات
      </button>
    </div>
  );
};

const ThemeButton = ({ active, onClick, icon, label, color }: any) => (
  <button onClick={onClick} className={`p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 group relative ${active ? 'border-white bg-black scale-105' : 'border-gray-800 bg-black/40 hover:border-gray-700'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
    <span className={`text-xs font-black ${active ? 'text-white' : 'text-gray-600'}`}>{label}</span>
  </button>
);

const PriceInput = ({ label, value, onChange, isRoom }: any) => (
  <div>
    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">{label}</label>
    <div className="relative group">
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
             className={`w-full bg-black border rounded-2xl p-4 text-white outline-none focus:ring-2 transition-all font-black text-xl ${isRoom ? 'border-purple-900/50 focus:ring-purple-500' : 'border-gray-800 focus:ring-blue-500'}`} />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-600">ج.م</span>
    </div>
  </div>
);

export default Settings;
