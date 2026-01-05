
import React, { useState } from 'react';
import { User, TabType } from '../types';

interface NavbarProps {
  user: User;
  onTabChange: (tab: TabType) => void;
  onSearch: (query: string) => void;
  onToggleMenu: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onTabChange, onSearch, onToggleMenu, onLogout }) => {
  const [query, setQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 sm:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleMenu}
          className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
        >
          <i className="fa-solid fa-bars-staggered text-xl"></i>
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('home')}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fa-solid fa-bolt text-white text-lg sm:text-xl"></i>
          </div>
          <span className="text-xl sm:text-2xl font-black text-blue-600 tracking-tighter hidden sm:block">LETAGO</span>
        </div>
      </div>

      <div className="flex-grow max-w-xl mx-2 sm:mx-4">
        <div className="relative group">
          <input 
            type="text" 
            value={query}
            onChange={handleInputChange}
            placeholder="Search Letago..." 
            className="w-full bg-gray-100 rounded-full py-2 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm text-gray-900 font-medium"
          />
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          {query && (
            <button 
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-circle-xmark text-xs"></i>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-4">
        {user.role !== 'USER' && (
          <button 
            onClick={() => onTabChange('admin')}
            className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
          >
            <i className="fa-solid fa-shield-halved"></i>
            Admin
          </button>
        )}
        <button 
          onClick={() => onTabChange('subscription')}
          className="p-2 hover:bg-gray-100 rounded-full text-yellow-500 transition-colors hidden sm:block"
        >
          <i className="fa-solid fa-crown text-lg"></i>
        </button>
        <button 
          onClick={() => onTabChange('notifications')}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors relative"
        >
          <i className="fa-solid fa-bell text-lg"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="relative">
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 border-l border-gray-200 ml-1 sm:ml-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src={user.avatar} className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" alt="Profile" />
            <i className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[60] animate-slide-up">
              <button 
                onClick={() => { onTabChange('profile'); setShowUserMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm font-bold"
              >
                <i className="fa-solid fa-circle-user text-gray-400"></i>
                Profile
              </button>
              {user.role !== 'USER' && (
                <button 
                  onClick={() => { onTabChange('admin'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-blue-600 text-sm font-black uppercase tracking-widest"
                >
                  <i className="fa-solid fa-shield-halved"></i>
                  Admin Panel
                </button>
              )}
              <hr className="my-2 border-gray-50" />
              <button 
                onClick={() => { onLogout(); setShowUserMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-sm font-bold"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
