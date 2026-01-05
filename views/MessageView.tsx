
import React, { useState } from 'react';
import { User, Conversation } from '../types';

interface MessageViewProps {
  conversations: Conversation[];
  currentUser: User;
  onSelectChat: (id: string) => void;
}

const MessageView: React.FC<MessageViewProps> = ({ conversations, currentUser, onSelectChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(c => {
    const otherUser = c.participants.find(p => p.id !== currentUser.id);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-4">
      {/* Sidebar List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-2xl font-black text-gray-800 mb-6">Messages</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 rounded-2xl py-3 px-12 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar pb-10">
          {filteredConversations.map(conv => {
            const otherUser = conv.participants.find(p => p.id !== currentUser.id) || currentUser;
            return (
              <div 
                key={conv.id}
                onClick={() => onSelectChat(conv.id)}
                className="mx-3 mb-1 p-4 rounded-2xl hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-all group"
              >
                <div className="relative flex-shrink-0">
                  <img src={otherUser.avatar} className="w-14 h-14 rounded-full border-2 border-white group-hover:border-blue-100" alt={otherUser.name} />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></span>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-gray-800 truncate">{otherUser.name}</h4>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate font-medium">{conv.lastMessage || 'Click to start chatting...'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Placeholder / Empty State for Chat */}
      <div className="hidden md:flex flex-grow bg-gray-50/50 flex-col items-center justify-center p-12 text-center">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-[35px] flex items-center justify-center mb-6 text-3xl shadow-xl shadow-blue-50">
          <i className="fa-solid fa-comments"></i>
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">Select a Conversation</h3>
        <p className="text-gray-500 font-medium max-w-sm">Choose one of your existing conversations or start a new one with your friends from the sidebar.</p>
        <button className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">New Message</button>
      </div>
    </div>
  );
};

export default MessageView;
