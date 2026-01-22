
import React, { useState, useEffect } from 'react';
import { Play, Square, Coffee, User, Users, Clock, Trash2, Star } from 'lucide-react';
import { Device, DeviceMode, Drink, AppSettings, SessionRecord, ThemeType } from '../types';

interface DevicesProps {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
  drinks: Drink[];
  setDrinks: React.Dispatch<React.SetStateAction<Drink[]>>;
  settings: AppSettings;
  setHistory: React.Dispatch<React.SetStateAction<SessionRecord[]>>;
  theme: ThemeType;
}

const DevicesPage: React.FC<DevicesProps> = ({ devices, setDevices, drinks, setDrinks, settings, setHistory, theme }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [reservationModal, setReservationModal] = useState<string | null>(null);
  const [resName, setResName] = useState('');
  const [resTime, setResTime] = useState('');
  const [isLoyal, setIsLoyal] = useState(false);

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getAccentClass = (active: boolean) => {
    if (!active) return "border-gray-800 bg-gray-900";
    switch (theme) {
      case ThemeType.AHLY: return "border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)] bg-red-600 text-white";
      case ThemeType.RAMADAN: return "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-emerald-500 text-white";
      case ThemeType.CHRISTMAS: return "border-green-600 shadow-[0_0_30px_rgba(22,163,74,0.2)] bg-green-600 text-white";
      default: return "border-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.2)] bg-blue-600 text-white";
    }
  };

  const getButtonAccent = () => {
    switch (theme) {
      case ThemeType.AHLY: return "bg-red-600 hover:bg-red-700 shadow-red-900/20";
      case ThemeType.RAMADAN: return "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-900/20";
      case ThemeType.CHRISTMAS: return "bg-green-600 hover:bg-green-700 shadow-green-900/20";
      default: return "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20";
    }
  };

  const handleToggleDevice = (id: string) => {
    setDevices(prev => prev.map(dev => {
      if (dev.id === id) {
        if (dev.status === 'idle') {
          return { ...dev, status: 'running', startTime: new Date() };
        } else {
          const playTimeMs = new Date().getTime() - (dev.startTime?.getTime() || 0);
          const playTimeMins = Math.max(1, Math.ceil(playTimeMs / 60000));
          const rate = dev.isRoom ? settings.roomPrice : (dev.mode === DeviceMode.SINGLE ? settings.singlePrice : settings.multiPrice);
          const playTotal = (playTimeMins / 60) * rate;
          const drinksTotal = dev.drinks.reduce((acc, d) => acc + (d.price * d.quantity), 0);

          const record: SessionRecord = {
            id: Math.random().toString(36).substr(2, 9),
            deviceName: dev.name,
            startTime: dev.startTime!,
            endTime: new Date(),
            playTotal,
            drinksTotal,
            totalAmount: playTotal + drinksTotal,
            mode: dev.mode
          };

          setHistory(h => [record, ...h]);
          return { ...dev, status: 'idle', startTime: undefined, drinks: [] };
        }
      }
      return dev;
    }));
  };

  const handleToggleMode = (id: string) => {
    setDevices(prev => prev.map(dev => 
      dev.id === id ? { ...dev, mode: dev.mode === DeviceMode.SINGLE ? DeviceMode.MULTI : DeviceMode.SINGLE } : dev
    ));
  };

  const addDrinkToDevice = (deviceId: string, drink: Drink) => {
    if (drink.stock <= 0) return;
    setDevices(prev => prev.map(dev => {
      if (dev.id === deviceId) {
        const existing = dev.drinks.find(d => d.drinkId === drink.id);
        if (existing) {
          return { ...dev, drinks: dev.drinks.map(d => d.drinkId === drink.id ? { ...d, quantity: d.quantity + 1 } : d) };
        }
        return { ...dev, drinks: [...dev.drinks, { drinkId: drink.id, name: drink.name, quantity: 1, price: drink.price }] };
      }
      return dev;
    }));
    setDrinks(prev => prev.map(d => d.id === drink.id ? { ...d, stock: d.stock - 1 } : d));
    setActiveModal(null);
  };

  const handleAddReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationModal || !resName || !resTime) return;
    setDevices(prev => prev.map(dev => dev.id === reservationModal ? { 
      ...dev, 
      reservations: [...dev.reservations, {
        id: Math.random().toString(36).substr(2, 9),
        customerName: resName,
        startTime: resTime,
        duration: 60,
        isLoyal,
        createdAt: Date.now()
      }]
    } : dev));
    setReservationModal(null); setResName(''); setResTime(''); setIsLoyal(false);
  };

  const calculateCurrentTotal = (dev: Device) => {
    if (dev.status === 'idle') return 0;
    const playTimeMs = now.getTime() - (dev.startTime?.getTime() || 0);
    const playTimeMins = Math.max(0, Math.floor(playTimeMs / 60000));
    const rate = dev.isRoom ? settings.roomPrice : (dev.mode === DeviceMode.SINGLE ? settings.singlePrice : settings.multiPrice);
    const playCost = (playTimeMins / 60) * rate;
    const drinkCost = dev.drinks.reduce((acc, d) => acc + (d.price * d.quantity), 0);
    return playCost + drinkCost;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-white">الأجهزة والغرف</h2>
        <div className="flex gap-4">
           <div className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-black border border-emerald-500/20">
             {devices.filter(d => d.status === 'running').length} نشط
           </div>
           <div className="bg-gray-800 text-gray-400 px-4 py-1.5 rounded-full text-xs font-black border border-gray-700">
             {devices.filter(d => d.status === 'idle').length} متاح
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {devices.map(dev => (
          <div key={dev.id} className={`relative rounded-[32px] overflow-hidden bg-black border-2 transition-all duration-300 ${getAccentClass(dev.status === 'running')}`}>
            <div className={`p-5 flex justify-between items-center ${dev.status === 'running' ? '' : 'bg-gray-900 text-gray-400'}`}>
              <div className="flex items-center gap-2">
                <Gamepad size={20} />
                <span className="font-black text-sm">{dev.name}</span>
              </div>
              {!dev.isRoom && (
                <button onClick={() => handleToggleMode(dev.id)} disabled={dev.status === 'running'} className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 bg-black/20">
                  {dev.mode === DeviceMode.SINGLE ? <User size={12} /> : <Users size={12} />}
                  {dev.mode === DeviceMode.SINGLE ? 'Single' : 'Multi'}
                </button>
              )}
            </div>

            <div className={`p-6 space-y-6 ${dev.status === 'running' ? 'bg-black/20' : ''}`}>
              <div className="flex justify-between items-end">
                 <div>
                   <p className="text-[10px] text-gray-500 uppercase font-black mb-1">البدء</p>
                   <p className="text-lg font-black text-white">{dev.startTime ? dev.startTime.toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'}) : '--:--'}</p>
                 </div>
                 <div className="text-left">
                   <p className="text-[10px] text-gray-500 uppercase font-black mb-1">المدة</p>
                   <p className={`text-lg font-black ${dev.status === 'running' ? 'text-white' : 'text-gray-700'}`}>
                     {dev.startTime ? `${Math.floor((now.getTime() - dev.startTime.getTime())/60000)} د` : '0 د'}
                   </p>
                 </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                <p className="text-2xl font-black text-emerald-500">{calculateCurrentTotal(dev).toFixed(0)} <span className="text-xs font-normal">ج.م</span></p>
                <div className="flex gap-3">
                  <button onClick={() => setReservationModal(dev.id)} className="p-3 rounded-2xl bg-gray-900 text-gray-400 hover:text-white transition-colors"><Clock size={18} /></button>
                  <button onClick={() => setActiveModal(dev.id)} className="p-3 rounded-2xl bg-gray-900 text-gray-400 hover:text-white transition-colors"><Coffee size={18} /></button>
                </div>
              </div>

              <button onClick={() => handleToggleDevice(dev.id)} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 ${dev.status === 'running' ? 'bg-red-600 hover:bg-red-700 text-white' : getButtonAccent() + ' text-white'}`}>
                {dev.status === 'running' ? 'إنهاء الجلسة' : 'بدء اللعب'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
          <div className="w-full max-w-sm bg-gray-900 rounded-[40px] border border-gray-800 p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-white mb-6 text-center">إضافة مشروب</h3>
            <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
              {drinks.map(drink => (
                <button key={drink.id} onClick={() => addDrinkToDevice(activeModal, drink)} disabled={drink.stock <= 0} className={`p-5 rounded-3xl border transition-all text-center space-y-2 ${drink.stock > 0 ? 'bg-gray-800 border-gray-800 hover:border-blue-500' : 'bg-gray-900 border-gray-800 opacity-30'}`}>
                  <Coffee size={24} className="mx-auto text-blue-500" />
                  <p className="font-black text-xs text-white truncate">{drink.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {reservationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4" onClick={() => setReservationModal(null)}>
          <div className="w-full max-w-sm bg-gray-900 rounded-[40px] border border-gray-800 p-10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-white mb-8 text-center">حجز مسبق</h3>
            <form onSubmit={handleAddReservation} className="space-y-6">
              <input type="text" value={resName} onChange={(e) => setResName(e.target.value)} className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-blue-500" placeholder="اسم العميل" required />
              <input type="time" value={resTime} onChange={(e) => setResTime(e.target.value)} className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-white outline-none focus:ring-2 ring-blue-500" required />
              <button type="submit" className={`w-full ${getButtonAccent()} text-white font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95`}>تأكيد الحجز</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Gamepad = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12" /><line x1="8" y1="10" x2="8" y2="14" /><circle cx="15" cy="13" r="1" /><circle cx="18" cy="11" r="1" /><rect x="2" y="6" width="20" height="12" rx="3" />
  </svg>
);

export default DevicesPage;
