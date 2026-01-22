
import React, { useState } from 'react';
import { LogIn, Lock, Mail } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (err.code === 'auth/invalid-email') {
        setError('صيغة البريد الإلكتروني غير صحيحة');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة لاحقاً');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-gray-900 rounded-3xl shadow-2xl overflow-hidden transform transition-all border border-gray-800">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="bg-white/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
            <LogIn size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">إدارة المركز</h1>
          <p className="opacity-70 mt-3 text-sm font-medium">نظام إدارة البلايستيشن المتكامل</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="bg-red-900/30 text-red-400 p-4 rounded-2xl text-sm border border-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block pr-1">البريد الإلكتروني</label>
            <div className="relative group">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-4 pr-12 pl-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                placeholder="example@domain.com"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block pr-1">كلمة المرور</label>
            <div className="relative group">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-4 pr-12 pl-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري التحقق...
              </>
            ) : (
              <>
                <span>دخول للنظام</span>
                <LogIn size={20} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-600 mt-4 leading-relaxed">
            محمي بواسطة Firebase Authentication
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
