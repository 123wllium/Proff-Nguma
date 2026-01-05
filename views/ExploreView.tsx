
import React from 'react';

const ExploreView: React.FC = () => {
  const images = [
    'https://picsum.photos/seed/exp1/400/600',
    'https://picsum.photos/seed/exp2/400/400',
    'https://picsum.photos/seed/exp3/800/600',
    'https://picsum.photos/seed/exp4/400/400',
    'https://picsum.photos/seed/exp5/400/400',
    'https://picsum.photos/seed/exp6/400/800',
    'https://picsum.photos/seed/exp7/400/400',
    'https://picsum.photos/seed/exp8/400/400',
    'https://picsum.photos/seed/exp9/600/400',
  ];

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Discover</h2>
        <div className="flex gap-2">
          {['For You', 'Trending', 'Nature', 'Tech'].map((tag, i) => (
            <span key={i} className={`px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer transition-colors ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-gray-500 hover:bg-gray-200 border border-gray-100'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((src, i) => (
          <div key={i} className="relative group cursor-pointer overflow-hidden rounded-2xl bg-gray-200 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <img 
              src={src} 
              alt={`Explore ${i}`} 
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
              <span className="flex items-center gap-1"><i className="fa-solid fa-heart"></i> {Math.floor(Math.random() * 500)}</span>
              <span className="flex items-center gap-1"><i className="fa-solid fa-comment"></i> {Math.floor(Math.random() * 50)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreView;
