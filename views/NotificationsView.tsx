
import React from 'react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <i className="fa-solid fa-heart text-red-500"></i>;
      case 'comment': return <i className="fa-solid fa-comment text-blue-500"></i>;
      case 'follow': return <i className="fa-solid fa-user-plus text-green-500"></i>;
      case 'security': return <i className="fa-solid fa-shield-check text-blue-600"></i>;
      default: return <i className="fa-solid fa-bell text-gray-400"></i>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-800">Your Activity</h2>
        <div className="flex gap-4">
          <button className="text-xs font-black uppercase tracking-widest text-blue-600">Mark Read</button>
          <button className="text-xs font-black uppercase tracking-widest text-gray-400">Settings</button>
        </div>
      </div>
      
      <div className="space-y-4">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`flex items-start gap-4 p-5 rounded-[24px] border transition-all ${
              n.type === 'security' 
                ? 'bg-blue-50/50 border-blue-100 shadow-sm shadow-blue-50' 
                : 'bg-white border-gray-100 hover:border-blue-100'
            }`}
          >
            <div className="relative flex-shrink-0">
              {n.avatar ? (
                <img src={n.avatar} className="w-12 h-12 rounded-full object-cover" alt={n.user} />
              ) : (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {getIcon(n.type)}
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-900 text-sm font-medium">
                    {n.user && <span className="font-black mr-1">{n.user}</span>}
                    {n.action}
                  </p>
                  {n.deviceInfo && (
                    <div className="mt-2 p-2 bg-white/50 rounded-xl border border-blue-50">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-tighter mb-1">Device Details</p>
                      <p className="text-xs text-gray-500 font-medium">{n.deviceInfo}</p>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 font-black uppercase whitespace-nowrap">{n.time}</span>
              </div>
            </div>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <i className="fa-solid fa-ghost text-6xl mb-4"></i>
            <p className="text-xs font-black uppercase tracking-widest">Nothing to report</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;
