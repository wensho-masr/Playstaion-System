
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DevicesPage from './pages/Devices';
import History from './pages/History';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import { ThemeType, Device, AppSettings, DeviceMode, Drink, SessionRecord, Reservation } from './types';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [theme, setTheme] = useState<ThemeType>(ThemeType.DEFAULT);
  const [settings, setSettings] = useState<AppSettings>({
    singlePrice: 20,
    multiPrice: 30,
    roomPrice: 50,
    theme: ThemeType.DEFAULT
  });

  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'جهاز 1', isRoom: false, status: 'idle', mode: DeviceMode.SINGLE, drinks: [], reservations: [] },
    { id: '2', name: 'جهاز 2', isRoom: false, status: 'idle', mode: DeviceMode.SINGLE, drinks: [], reservations: [] },
    { id: '3', name: 'جهاز 3', isRoom: false, status: 'idle', mode: DeviceMode.SINGLE, drinks: [], reservations: [] },
    { id: '4', name: 'غرفة 1', isRoom: true, status: 'idle', mode: DeviceMode.SINGLE, drinks: [], reservations: [] },
    { id: '5', name: 'غرفة 2', isRoom: true, status: 'idle', mode: DeviceMode.SINGLE, drinks: [], reservations: [] },
    { id: '6', name: 'غرفة 3', isRoom: true, status: 'idle', mode: DeviceMode.SINGLE, drinks: [], reservations: [] },
    { id: '7', name: 'غرفة 4', isRoom: true, status: 'idle', mode: DeviceMode.SINGLE, drinks: [], reservations: [] },
  ]);

  const [drinks, setDrinks] = useState<Drink[]>([
    { id: 'd1', name: 'بيبسي', price: 10, stock: 50 },
    { id: 'd2', name: 'شاي', price: 5, stock: 100 },
    { id: 'd3', name: 'قهوة', price: 15, stock: 80 },
    { id: 'd4', name: 'إندومي', price: 20, stock: 30 },
  ]);

  const [history, setHistory] = useState<SessionRecord[]>([]);

  // Listen for Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
  };

  const mainClasses = "bg-gray-950 text-gray-100 min-h-screen relative";

  // Reservation Auto-Start Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 5);

      setDevices(prev => prev.map(dev => {
        if (dev.status === 'idle') {
          const matchingReservations = dev.reservations.filter(r => r.startTime === timeStr);
          
          if (matchingReservations.length > 0) {
            const sortedMatch = [...matchingReservations].sort((a, b) => {
              if (a.isLoyal !== b.isLoyal) return a.isLoyal ? -1 : 1;
              return a.createdAt - b.createdAt;
            });
            
            const winningRes = sortedMatch[0];
            
            return {
              ...dev,
              status: 'running',
              startTime: new Date(),
              reservations: dev.reservations.filter(r => r.id !== winningRes.id)
            };
          }
        }
        return dev;
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className={`flex flex-col md:flex-row min-h-screen bg-gray-950`}>
        <Sidebar onLogout={handleLogout} theme={theme} />
        <main className={`flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto ${mainClasses}`}>
          {/* Theme Special Effects */}
          {theme === ThemeType.RAMADAN && (
            <div className="fixed top-0 left-0 w-full h-20 pointer-events-none opacity-30 overflow-hidden z-[100]">
               <div className="flex justify-between px-10">
                 {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="text-4xl lantern-anim">🏮</div>)}
               </div>
            </div>
          )}
          {theme === ThemeType.CHRISTMAS && (
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-40">
              <div className="absolute top-0 left-0 w-full h-full animate-pulse flex justify-around flex-wrap p-10">
                {[...Array(20)].map((_, i) => <div key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>❄️</div>)}
              </div>
            </div>
          )}
          
          <Routes>
            <Route path="/" element={<Dashboard history={history} theme={theme} />} />
            <Route 
              path="/devices" 
              element={
                <DevicesPage 
                  devices={devices} 
                  setDevices={setDevices} 
                  drinks={drinks} 
                  setDrinks={setDrinks}
                  settings={settings}
                  setHistory={setHistory}
                  theme={theme}
                />
              } 
            />
            <Route path="/history" element={<History history={history} theme={theme} />} />
            <Route path="/inventory" element={<Inventory drinks={drinks} setDrinks={setDrinks} theme={theme} />} />
            <Route 
              path="/settings" 
              element={
                <Settings 
                  settings={settings} 
                  setSettings={setSettings} 
                  devices={devices}
                  setDevices={setDevices}
                  drinks={drinks}
                  setDrinks={setDrinks}
                  setTheme={setTheme}
                  theme={theme}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
