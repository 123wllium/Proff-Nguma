
import React from 'react';
import { User, TabType } from '../types';

interface SidebarProps {
  user: User;
  friends: User[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onStartChat: (user: User) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, friends, activeTab, onTabChange, onStartChat, isOpen, onClose }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'fa-house' },
    { id: 'explore', label: 'Explore', icon: 'fa-compass' },
    { id: 'video', label: 'Video', icon: 'fa-play-circle' },
    { id: 'messages', label: 'Messages', icon: 'fa-comment-dots' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
    { id: 'groups', label: 'Groups', icon: 'fa-users' },
    { id: 'subscription', label: 'Subscription', icon: 'fa-crown', color: 'text-yellow-500' },
    { id: 'profile', label: 'Profile', icon: 'fa-circle-user' },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId as TabType);
    if (onClose) onClose(); // Auto-close on mobile
  };

  return (
    <>
      {/* Backdrop for Mobile Drawer */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed left-0 top-0 bottom-0 w-64 lg:w-72 bg-white border-r border-gray-200 z-[100] overflow-y-auto no-scrollbar
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabClick('home')}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <i className="fa-solid fa-bolt text-white text-xl"></i>
              </div>
              <span className="text-2xl font-black text-blue-600 tracking-tighter">LETAGO</span>
            </div>
            {/* Close button for mobile */}
            <button onClick={onClose} className="md:hidden p-2 text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 flex justify-center text-xl transition-transform group-hover:scale-110 ${item.color || ''}`}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <span className="text-base tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Contacts</h4>
          <div className="space-y-1">
            {friends.slice(0, 5).map(friend => (
              <div 
                key={friend.id}
                onClick={() => {
                  onStartChat(friend);
                  if (onClose) onClose();
                }}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors"
              >
                <div className="relative">
                  <img src={friend.avatar} className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-blue-200 transition-colors" alt={friend.name} />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{friend.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
