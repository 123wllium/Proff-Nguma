
import React, { useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';

const VideoView: React.FC = () => {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  const videos = [
    { 
      id: 1, 
      user: 'Letago_Adventures', 
      title: 'Amazing Waterfall in the Jungle #nature #travel', 
      likes: '1.2M', 
      comments: '4.5k', 
      avatar: 'https://picsum.photos/seed/water/100/100',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waterfall-in-the-forest-vertical-shot-34534-large.mp4'
    },
    { 
      id: 2, 
      user: 'Chef_Maya', 
      title: 'How to make the perfect Summer Salad 🥗', 
      likes: '800k', 
      comments: '12k', 
      avatar: 'https://picsum.photos/seed/chef/100/100',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-preparing-a-salad-vertical-shot-34531-large.mp4'
    },
    { 
      id: 3, 
      user: 'TechExplorer', 
      title: 'Unboxing the new Letago Phone!', 
      likes: '450k', 
      comments: '8k', 
      avatar: 'https://picsum.photos/seed/tech/100/100',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-using-a-smartphone-vertical-shot-34547-large.mp4'
    }
  ];

  const handleToggleLike = (id: number) => {
    setLikedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleToggleSave = (id: number) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-100px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black -mx-4 sm:mx-0">
      {videos.map((vid) => (
        <div key={vid.id} className="snap-start h-[calc(100vh-64px)] md:h-[calc(100vh-100px)] w-full relative overflow-hidden bg-black flex flex-col items-center justify-center">
          <div className="w-full h-full max-w-[500px] relative">
            <VideoPlayer src={vid.videoUrl} className="w-full h-full" />
            
            {/* Overlay UI */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
              <div className="w-full max-w-[calc(100%-60px)] pointer-events-auto">
                <div className="flex items-center gap-3 mb-3">
                  <img src={vid.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-lg" alt={vid.user} />
                  <div className="flex flex-col">
                    <h4 className="font-bold text-white text-base">@{vid.user}</h4>
                    <button className="bg-blue-600 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white w-fit mt-1">Follow</button>
                  </div>
                </div>
                <p className="text-white text-sm line-clamp-2 mb-2 font-medium leading-relaxed">{vid.title}</p>
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <i className="fa-solid fa-music"></i>
                  <span>Original sound - {vid.user}</span>
                </div>
              </div>
            </div>

            {/* Side Actions */}
            <div className="absolute right-3 bottom-24 flex flex-col gap-5 items-center z-20">
              <button 
                onClick={() => handleToggleLike(vid.id)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`w-12 h-12 ${likedIds.includes(vid.id) ? 'bg-red-500' : 'bg-white/10'} backdrop-blur-md rounded-full flex items-center justify-center transition-all scale-active active:scale-90`}>
                  <i className={`fa-solid fa-heart text-white text-xl ${likedIds.includes(vid.id) ? 'animate-bounce' : ''}`}></i>
                </div>
                <span className="text-white text-[11px] font-bold">{likedIds.includes(vid.id) ? 'Liked' : vid.likes}</span>
              </button>

              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center active:bg-blue-500 transition-all scale-active active:scale-90">
                  <i className="fa-solid fa-comment text-white text-xl"></i>
                </div>
                <span className="text-white text-[11px] font-bold">{vid.comments}</span>
              </button>

              <button 
                onClick={() => handleToggleSave(vid.id)}
                className="flex flex-col items-center gap-1 group"
              >
                <div className={`w-12 h-12 ${savedIds.includes(vid.id) ? 'bg-yellow-500' : 'bg-white/10'} backdrop-blur-md rounded-full flex items-center justify-center transition-all scale-active active:scale-90`}>
                  <i className={`fa-solid fa-bookmark text-white text-xl`}></i>
                </div>
                <span className="text-white text-[11px] font-bold">{savedIds.includes(vid.id) ? 'Saved' : 'Save'}</span>
              </button>

              <button className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center active:bg-green-500 transition-all scale-active active:scale-90">
                  <i className="fa-solid fa-share text-white text-xl"></i>
                </div>
                <span className="text-white text-[11px] font-bold">Share</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoView;
