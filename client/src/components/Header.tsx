import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Command } from 'lucide-react';
import socket from '../services/socket';
import api from '../services/api';

const Header: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();

    socket.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('new-notification');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  return (
    <header className="h-20 bg-white/50 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full max-w-lg group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search assets, documents..." 
            className="w-full pl-12 pr-12 py-3 bg-slate-100/50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white focus:border-primary/20 transition-all text-sm font-medium"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400">
            <Command className="w-2.5 h-2.5" />
            K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-3 rounded-2xl transition-all duration-300 ${
              showNotifications ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className={`absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 ${showNotifications ? 'border-primary' : 'border-white'}`}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-96 bg-white border border-slate-200/60 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
              <div className="px-6 py-5 border-b bg-slate-50/50 flex justify-between items-center">
                <span className="font-bold text-slate-900">Notifications</span>
                <button className="text-xs text-primary font-bold hover:underline">Clear all</button>
              </div>
              <div className="max-h-[480px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Inbox Zero</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n._id} 
                      onClick={() => !n.read && markAsRead(n._id)}
                      className={`p-5 border-b border-slate-50 last:border-0 cursor-pointer transition-all hover:bg-slate-50 ${!n.read ? 'bg-primary/[0.02]' : ''}`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                        <div>
                          <p className={`text-sm ${!n.read ? 'font-bold text-slate-900' : 'text-slate-600 font-medium'}`}>{n.message}</p>
                          <span className="text-[11px] font-bold text-slate-400 mt-2 block uppercase tracking-tight">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-bold text-slate-900">SWS Admin</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Administrator</p>
          </div>
          <div className="w-11 h-11 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-slate-900/20 group cursor-pointer hover:scale-105 transition-transform">
            <User className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
