
import React, { useState, useEffect, useRef } from 'react';
import { User, Conversation, Message, MessageType } from '../types';
import { getSmartReplies } from '../services/geminiService';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onClose: () => void;
  onSendMessage: (text?: string, media?: { url: string; type: MessageType }) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUser, onClose, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: MessageType } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const otherUser = conversation.participants.find(p => p.id !== currentUser.id) || currentUser;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    // Mark messages as seen when window is active
    // In a real app, this would trigger an API call

    const lastMsg = conversation.messages[conversation.messages.length - 1];
    if (lastMsg && lastMsg.senderId !== currentUser.id) {
      getSmartReplies(lastMsg.text || "").then(setSmartReplies);
    } else {
      setSmartReplies([]);
    }
  }, [conversation.messages, currentUser.id]);

  // Voice Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage(undefined, { url: audioUrl, type: 'voice' });
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type: MessageType = file.type.startsWith('image') ? 'image' : 'video';
      const url = URL.createObjectURL(file);
      setMediaPreview({ url, type });
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim() || mediaPreview) {
      onSendMessage(inputText || undefined, mediaPreview || undefined);
      setInputText('');
      setMediaPreview(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 right-4 sm:right-20 w-80 sm:w-96 bg-white shadow-2xl rounded-t-2xl z-[80] flex flex-col border border-gray-100 animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-white border-b border-gray-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img src={otherUser.avatar} className="w-10 h-10 rounded-full object-cover" alt={otherUser.name} />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 leading-tight">{otherUser.name}</h4>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online Now</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-50 rounded-full text-blue-600 transition-colors">
            <i className="fa-solid fa-phone text-xs"></i>
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-full text-blue-600 transition-colors">
            <i className="fa-solid fa-video text-xs"></i>
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="h-96 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/30"
      >
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
            <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center">
              <i className="fa-solid fa-comments text-blue-300 text-2xl"></i>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-10">Safe and Encrypted Chat</p>
          </div>
        ) : (
          conversation.messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUser.id;
            const isLast = idx === conversation.messages.length - 1;
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] overflow-hidden ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-br-none shadow-lg' 
                    : 'bg-white text-gray-900 rounded-2xl rounded-bl-none shadow-sm border border-gray-100'
                }`}>
                  {/* Media Content */}
                  {msg.mediaUrl && msg.mediaType === 'image' && (
                    <img src={msg.mediaUrl} className="w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                  )}
                  {msg.mediaUrl && msg.mediaType === 'video' && (
                    <video src={msg.mediaUrl} className="w-full max-h-60 object-cover" controls />
                  )}
                  {msg.mediaUrl && msg.mediaType === 'voice' && (
                    <div className="px-4 py-3 flex items-center gap-3 min-w-[200px]">
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                        <i className="fa-solid fa-play text-xs"></i>
                      </button>
                      <div className="flex-grow h-1 bg-current opacity-20 rounded-full relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-current rounded-full"></div>
                      </div>
                      <span className="text-[10px] font-bold">0:12</span>
                    </div>
                  )}

                  {/* Text Content */}
                  {msg.text && (
                    <div className="px-4 py-2.5 text-sm font-medium leading-relaxed">
                      {msg.text}
                    </div>
                  )}
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center gap-1.5 mt-1 px-1">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <span className="text-[9px] text-blue-500 font-black uppercase tracking-tighter">
                      {msg.status === 'seen' ? 'Seen' : 'Delivered'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {conversation.isTyping && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="flex gap-1 bg-gray-100 px-3 py-2.5 rounded-2xl rounded-bl-none">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Media Preview Drawer */}
      {mediaPreview && (
        <div className="p-3 bg-gray-50 border-t border-gray-100 animate-slide-up flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden relative">
              {mediaPreview.type === 'image' ? (
                <img src={mediaPreview.url} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black"><i className="fa-solid fa-video text-white text-xs"></i></div>
              )}
              <button 
                onClick={() => setMediaPreview(null)}
                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
              >
                <i className="fa-solid fa-xmark text-[8px]"></i>
              </button>
            </div>
            <span className="text-xs font-bold text-gray-500">Ready to send...</span>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="p-3 border-t border-gray-50 bg-white space-y-3">
        {/* AI Smart Replies */}
        {smartReplies.length > 0 && !inputText && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {smartReplies.map((reply, i) => (
              <button 
                key={i}
                onClick={() => onSendMessage(reply)}
                className="whitespace-nowrap px-4 py-1.5 bg-white hover:bg-blue-600 hover:text-white rounded-full text-[11px] font-black text-blue-600 border-2 border-blue-50 transition-all active:scale-95"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {isRecording ? (
            <div className="flex-grow flex items-center justify-between bg-red-50 px-4 py-2 rounded-full border border-red-100 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs font-black text-red-600 uppercase tracking-widest">{formatDuration(recordingDuration)}</span>
              </div>
              <button 
                onClick={stopRecording}
                className="bg-red-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-tighter"
              >
                Send Note
              </button>
              <button onClick={() => { setIsRecording(false); clearInterval(timerRef.current); }} className="text-gray-400"><i className="fa-solid fa-trash-can"></i></button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <i className="fa-solid fa-circle-plus text-lg"></i>
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
              </div>
              
              <div className="flex-grow relative">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Aa"
                  className="w-full bg-gray-100 rounded-full py-2.5 px-5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {inputText.trim() || mediaPreview ? (
                <button 
                  onClick={handleSend}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-110 active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-paper-plane text-sm"></i>
                </button>
              ) : (
                <button 
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Hold to record"
                >
                  <i className="fa-solid fa-microphone text-lg"></i>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
