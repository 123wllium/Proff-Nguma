
import React, { useState, useRef } from 'react';
import { User, Post } from '../types';
import { analyzePost, suggestCaption } from '../services/geminiService';

interface CreatePostProps {
  user: User;
  onPostCreated: (post: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload and compression progress for large files
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          const reader = new FileReader();
          reader.onloadend = () => {
            setMedia({ url: reader.result as string, type });
            setUploadProgress(null);
          };
          reader.readAsDataURL(file);
        }
        setUploadProgress(Math.floor(progress));
      }, 300);
    }
  };

  const handleMagicCaption = async () => {
    if (!media || media.type !== 'image') return;
    setIsAnalyzing(true);
    const caption = await suggestCaption(media.url);
    setContent(caption);
    setIsAnalyzing(false);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !media) return;

    setIsAnalyzing(true);
    const aiInsight = await analyzePost(content, media?.type === 'image' ? media.url : undefined);

    const newPost: Post = {
      id: Date.now().toString(),
      user: user,
      content: content,
      image: media?.type === 'image' ? media.url : undefined,
      videoUrl: media?.type === 'video' ? media.url : undefined,
      likes: 0,
      comments: [],
      timestamp: Date.now(),
      aiInsight: aiInsight
    };

    onPostCreated(newPost);
    setContent('');
    setMedia(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
      <div className="flex gap-3 mb-4">
        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="User" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
          className="flex-grow bg-gray-50 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none h-24 text-gray-900 font-medium text-sm sm:text-base transition-all"
        />
      </div>

      {uploadProgress !== null && (
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-xs font-bold text-blue-600 px-1">
            <span>Optimizing & Compressing Media...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {media && (
        <div className="relative mb-4 rounded-2xl overflow-hidden group border border-gray-100 shadow-sm">
          {media.type === 'image' ? (
            <img src={media.url} className="w-full h-64 object-cover" alt="Selected" />
          ) : (
            <video src={media.url} className="w-full h-64 object-cover" controls muted />
          )}
          <button 
            onClick={() => setMedia(null)}
            className="absolute top-3 right-3 bg-gray-900/60 backdrop-blur-md text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors z-10"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          {media.type === 'image' && (
            <button 
              onClick={handleMagicCaption}
              className="absolute bottom-4 right-4 bg-blue-600/90 backdrop-blur-md text-white py-2 px-5 rounded-full text-xs font-black shadow-xl flex items-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
              disabled={isAnalyzing}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              {isAnalyzing ? 'Thinking...' : 'Letago AI Caption'}
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-gray-50">
        <div className="flex justify-around sm:justify-start gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col sm:flex-row items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl text-green-500 transition-all active:bg-green-50"
          >
            <i className="fa-solid fa-image text-xl"></i>
            <span className="font-bold text-gray-500 text-xs">Photo</span>
          </button>
          <button 
            onClick={() => videoInputRef.current?.click()}
            className="flex flex-col sm:flex-row items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl text-blue-500 transition-all active:bg-blue-50"
          >
            <i className="fa-solid fa-video text-xl"></i>
            <span className="font-bold text-gray-500 text-xs">Video</span>
          </button>
          <button className="flex flex-col sm:flex-row items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl text-orange-500 transition-all active:bg-orange-50">
            <i className="fa-solid fa-location-dot text-xl"></i>
            <span className="font-bold text-gray-500 text-xs">Place</span>
          </button>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={(!content.trim() && !media) || isAnalyzing}
          className={`py-3 px-8 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg ${
            (!content.trim() && !media) || isAnalyzing 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 hover:scale-105 active:scale-95'
          }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2"><i className="fa-solid fa-circle-notch animate-spin"></i> Processing</span>
          ) : 'Share Now'}
        </button>
      </div>

      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFileChange(e, 'image')} />
      <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={(e) => handleFileChange(e, 'video')} />
    </div>
  );
};

export default CreatePost;
