
import React, { useState } from 'react';
import { User, Post, Report, AdminLog, UserRole } from '../types';

interface AdminDashboardProps {
  users: User[];
  posts: Post[];
  reports: Report[];
  logs: AdminLog[];
  currentUser: User;
  onModerateUser: (userId: string, status: User['status']) => void;
  onModeratePost: (postId: string, status: Post['moderationStatus']) => void;
  onResolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
  appSettings: { maintenanceMode: boolean; registrationEnabled: boolean; aiModerationSensitivity: number; privacyLevel: string };
  onUpdateSettings: (settings: any) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  users, posts, reports, logs, currentUser, onModerateUser, onModeratePost, onResolveReport, onUpdateRole, appSettings, onUpdateSettings 
}) => {
  const [activePanel, setActivePanel] = useState<'overview' | 'users' | 'moderation' | 'logs' | 'settings'>('overview');
  const [userSearch, setUserSearch] = useState('');

  const renderOverview = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: users.length, icon: 'fa-users', color: 'bg-blue-600' },
          { label: 'Pending Reports', value: reports.filter(r => r.status === 'pending').length, icon: 'fa-flag', color: 'bg-red-500' },
          { label: 'Post Reach', value: '84.2k', icon: 'fa-chart-line', color: 'bg-green-500' },
          { label: 'Server Health', value: '99.9%', icon: 'fa-server', color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4 text-xl shadow-lg`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <i className="fa-solid fa-chart-simple text-blue-500"></i>
              Platform Growth
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">Daily</span>
              <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-black uppercase">Weekly</span>
            </div>
          </div>
          <div className="h-64 flex items-end gap-3 justify-between">
            {[45, 60, 30, 80, 50, 90, 75, 60, 100, 80].map((h, i) => (
              <div key={i} className="flex-grow flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full bg-blue-100 rounded-t-lg transition-all group-hover:bg-blue-600" style={{ height: `${h}%` }}></div>
                <span className="text-[10px] text-gray-300 font-black">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-3">
            <i className="fa-solid fa-history text-purple-500"></i>
            Audit Trail
          </h3>
          <div className="space-y-6">
            {logs.slice(0, 4).map(log => (
              <div key={log.id} className="relative pl-6 border-l-2 border-gray-50">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-purple-500"></div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-tighter mb-1">{log.action}</p>
                <p className="text-[10px] text-gray-400 font-medium">By {log.adminName} • {new Date(log.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
            {logs.length === 0 && <p className="text-center py-10 text-gray-300 text-sm font-bold italic">No logs yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Directory</h2>
          <p className="text-sm text-gray-400 font-medium">Manage user statuses and privilege levels across Letago.</p>
        </div>
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search accounts..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-12 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/30">
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Account</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Privilege</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Health Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase())).map(user => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-all">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-11 h-11 rounded-2xl shadow-sm object-cover" alt="" />
                    <div>
                      <p className="font-black text-gray-800 text-sm leading-none mb-1">{user.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{user.handle}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <select 
                    value={user.role} 
                    onChange={(e) => onUpdateRole(user.id, e.target.value as UserRole)}
                    className="bg-gray-100 text-gray-800 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="USER">Base User</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">System Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-600' :
                    user.status === 'suspended' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onModerateUser(user.id, user.status === 'active' ? 'suspended' : 'active')} 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${user.status === 'active' ? 'bg-yellow-50 text-yellow-500 hover:bg-yellow-500 hover:text-white' : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'}`}
                      title={user.status === 'active' ? 'Suspend' : 'Reinstate'}
                    >
                      <i className={`fa-solid ${user.status === 'active' ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                    </button>
                    <button 
                      onClick={() => onModerateUser(user.id, 'banned')} 
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      title="Perm Ban"
                    >
                      <i className="fa-solid fa-ban text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderModeration = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <i className="fa-solid fa-flag text-red-500"></i>
            User Reports
          </h3>
          <div className="space-y-4">
            {reports.filter(r => r.status === 'pending').map(report => (
              <div key={report.id} className="p-6 bg-red-50/50 border border-red-100 rounded-[32px] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><i className="fa-solid fa-triangle-exclamation text-xs"></i></div>
                    <div>
                      <p className="text-xs font-black text-red-600 uppercase tracking-widest">{report.reason}</p>
                      <p className="text-[10px] text-gray-400 font-bold">Report ID: {report.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase">{new Date(report.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onResolveReport(report.id, 'dismissed')}
                    className="flex-grow bg-white text-gray-800 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={() => {
                      onModeratePost(report.targetId, 'removed');
                      onResolveReport(report.id, 'resolved');
                    }}
                    className="flex-grow bg-red-600 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-100 transition-all"
                  >
                    Purge Content
                  </button>
                </div>
              </div>
            ))}
            {reports.filter(r => r.status === 'pending').length === 0 && <p className="text-center py-20 text-gray-300 font-bold uppercase tracking-[0.2em] text-xs">Clear Inbox</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3">
            <i className="fa-solid fa-newspaper text-blue-500"></i>
            Post Oversight
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar pr-2">
            {posts.map(post => (
              <div key={post.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {post.image ? <img src={post.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" /> : <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><i className="fa-solid fa-align-left text-xs"></i></div>}
                  <div className="min-w-0">
                    <p className="text-xs font-black text-gray-800 line-clamp-1">{post.content}</p>
                    <p className="text-[10px] text-gray-400 font-medium">By @{post.user.handle}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onModeratePost(post.id, 'removed')}
                  className="w-8 h-8 rounded-lg bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-gray-100"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 animate-fade-in">
      <h2 className="text-3xl font-black text-gray-800 mb-10 flex items-center gap-4">
        <i className="fa-solid fa-sliders text-blue-600"></i>
        System Configuration
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-800">Maintenance Mode</span>
              <button 
                onClick={() => onUpdateSettings({...appSettings, maintenanceMode: !appSettings.maintenanceMode})}
                className={`w-12 h-6 rounded-full transition-all relative ${appSettings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${appSettings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
              </button>
            </label>
            <p className="text-[10px] text-gray-400 font-medium">When active, only administrators can access the core platform features.</p>
          </div>
          
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-800">Public Registration</span>
              <button 
                onClick={() => onUpdateSettings({...appSettings, registrationEnabled: !appSettings.registrationEnabled})}
                className={`w-12 h-6 rounded-full transition-all relative ${appSettings.registrationEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${appSettings.registrationEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </label>
            <p className="text-[10px] text-gray-400 font-medium">Toggle whether new users can create accounts without invitations.</p>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-800 mb-4">AI Moderation Sensitivity</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={appSettings.aiModerationSensitivity}
              onChange={(e) => onUpdateSettings({...appSettings, aiModerationSensitivity: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[9px] font-black text-gray-300 mt-2 uppercase tracking-widest">
              <span>Lax</span>
              <span>Balanced ({appSettings.aiModerationSensitivity}%)</span>
              <span>Strict</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 p-8 rounded-[30px] border border-gray-100">
          <h4 className="text-sm font-black text-gray-800 mb-6 uppercase tracking-widest">Security Overview</h4>
          <div className="space-y-4">
            {[
              { label: 'SSL Protocol', status: 'TLS 1.3 Active', icon: 'fa-lock' },
              { label: 'DB Encryption', status: 'AES-256 Enabled', icon: 'fa-database' },
              { label: 'AI Vigilance', status: 'Active', icon: 'fa-robot' },
              { label: 'Admin IP Restricted', status: 'Off', icon: 'fa-location-dot', alert: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <i className={`fa-solid ${s.icon} text-gray-300 text-xs`}></i>
                  <span className="text-xs font-bold text-gray-600">{s.label}</span>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${s.alert ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-10 bg-[#f8fafc]">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Sidebar Navigation */}
          <div className="w-full lg:w-72 space-y-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: 'fa-chart-pie' },
              { id: 'users', label: 'User Control', icon: 'fa-user-gear' },
              { id: 'moderation', label: 'Mod Queue', icon: 'fa-shield-halved' },
              { id: 'logs', label: 'Audit Logs', icon: 'fa-list-check' },
              { id: 'settings', label: 'Settings', icon: 'fa-sliders' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all font-black text-sm uppercase tracking-widest ${
                  activePanel === item.id 
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                    : 'text-gray-400 hover:bg-white hover:text-gray-900'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-lg`}></i>
                {item.label}
              </button>
            ))}

            <div className="mt-8 p-6 bg-blue-600 rounded-[30px] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><i className="fa-solid fa-bolt text-4xl"></i></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Authenticated Admin</p>
              <p className="font-black text-lg leading-tight truncate">{currentUser.name}</p>
              <div className="flex items-center gap-2 mt-4 bg-white/20 px-3 py-1.5 rounded-xl w-fit">
                <i className="fa-solid fa-shield-check text-xs"></i>
                <span className="text-[10px] font-black uppercase">{currentUser.role}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setActivePanel('settings')}
              className="w-full mt-4 p-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <i className="fa-solid fa-gear mr-2"></i> System Tools
            </button>
          </div>

          {/* Dynamic Content Switching */}
          <div className="flex-grow">
            {activePanel === 'overview' && renderOverview()}
            {activePanel === 'users' && renderUsers()}
            {activePanel === 'moderation' && renderModeration()}
            {activePanel === 'settings' && renderSettings()}
            {activePanel === 'logs' && (
              <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-gray-800">Immutable Audit Logs</h3>
                  <button className="bg-gray-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest"><i className="fa-solid fa-download mr-2"></i> Export CSV</button>
                </div>
                <div className="space-y-4">
                  {logs.map(log => (
                    <div key={log.id} className="p-5 bg-gray-50 rounded-[24px] flex items-center justify-between border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform"><i className="fa-solid fa-terminal text-sm"></i></div>
                        <div>
                          <p className="text-sm font-black text-gray-800 uppercase tracking-tighter">{log.action}</p>
                          <p className="text-[10px] text-gray-400 font-bold">Admin: {log.adminName} • ID: {log.adminId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-gray-300 block mb-1">{new Date(log.timestamp).toLocaleDateString()}</span>
                        <span className="text-[10px] font-black text-gray-800">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                  {logs.length === 0 && <div className="py-32 text-center text-gray-300 font-black uppercase tracking-[0.3em] text-sm">Vault Empty</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
