
import React from 'react';
import { User, Conversation } from '../types';

interface MessengerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentUser: User;
  onSelectConversation: (id: string) => void;
}

const MessengerPanel: React.FC<MessengerPanelProps> = ({ isOpen, onClose, conversations, currentUser, onSelectConversation }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-[60] transition-opacity"
        onClick={onClose}
      ></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-2xl z-[70] flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <i className="fa-solid fa-xmark text-lg text-gray-500"></i>
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-gray-100 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="text-center py-10 px-6">
              <i className="fa-solid fa-comment-dots text-4xl text-gray-200 mb-3"></i>
              <p className="text-gray-500 text-sm">No messages yet. Start a conversation with your friends!</p>
            </div>
          ) : (
            conversations.map(conv => {
              const otherUser = conv.participants.find(p => p.id !== currentUser.id) || currentUser;
              return (
                <div 
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className="p-3 mx-2 rounded-xl hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="relative flex-shrink-0">
                    <img src={otherUser.avatar} className="w-12 h-12 rounded-full" alt={otherUser.name} />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-bold text-gray-800 truncate">{otherUser.name}</h4>
                      <span className="text-[10px] text-gray-400">
                        {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage || 'Sent a new message'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default MessengerPanel;
