
import React, { useState } from 'react';
import { Group, User } from '../types';

interface GroupsViewProps {
  groups: Group[];
  currentUser: User;
  onCreateGroup: (name: string, description: string, category: string) => void;
  onJoinGroup: (groupId: string) => void;
}

const GroupsView: React.FC<GroupsViewProps> = ({ groups, currentUser, onCreateGroup, onJoinGroup }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('General');
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'General', 'Tech', 'Nature', 'Travel', 'Art', 'Gaming'];

  const filteredGroups = groups.filter(g => 
    filter === 'All' || g.category === filter
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim() && newGroupDesc.trim()) {
      onCreateGroup(newGroupName, newGroupDesc, newGroupCategory);
      setNewGroupName('');
      setNewGroupDesc('');
      setShowCreateModal(false);
    }
  };

  return (
    <div className="py-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Communities</h2>
          <p className="text-gray-500 font-medium">Join or create spaces to share interests with others.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-plus"></i>
          Create New Group
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap border-2 transition-all ${
              filter === cat 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-50' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-blue-600">
            <div className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
               <div className="absolute -bottom-6 left-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                    <img src={group.avatar} className="w-full h-full object-cover rounded-xl" alt={group.name} />
                  </div>
               </div>
            </div>
            <div className="p-6 pt-10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-black text-gray-800 text-xl leading-tight group-hover:text-blue-600 transition-colors">{group.name}</h4>
                <span className="bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border border-gray-100">
                  {group.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-6 h-10">
                {group.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-800">{group.membersCount.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Members</span>
                </div>
                <button 
                  onClick={() => onJoinGroup(group.id)}
                  className={`px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    group.isJoined 
                      ? 'bg-gray-100 text-gray-400 cursor-default' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {group.isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredGroups.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-users-slash text-gray-200 text-3xl"></i>
            </div>
            <p className="text-gray-400 font-bold">No groups found in this category.</p>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-blue-50/30">
              <h3 className="text-2xl font-black text-gray-800">Start a Community</h3>
              <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center transition-colors">
                <i className="fa-solid fa-xmark text-gray-400"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Group Name</label>
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Creative Photographers"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category</label>
                <select 
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                <textarea 
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="What is this community about?"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium h-32 resize-none"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-grow py-4 rounded-2xl font-black text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-4 rounded-2xl font-black text-white bg-blue-600 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Launch Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsView;
