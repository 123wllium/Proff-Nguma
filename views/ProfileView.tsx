
import React, { useState, useRef } from 'react';
import { User, Post, Comment } from '../types';
import PostItem from '../components/PostItem';
import CreatePost from '../components/CreatePost';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  isOwnProfile?: boolean;
  onToggleFollow?: (userId: string) => void;
  onUpdateProfile?: (updates: Partial<User>) => void;
  onPostCreated?: (post: Post) => void;
  onLike?: (postId: string) => void;
  // Fix: Update onComment signature to accept string content instead of Comment object
  onComment?: (postId: string, content: string, parentId?: string) => void;
  onBlock?: (userId: string) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  posts, 
  isOwnProfile, 
  onToggleFollow, 
  onUpdateProfile,
  onPostCreated,
  onLike,
  onComment,
  onBlock
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'videos' | 'saved'>('feed');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'coverPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile?.({ [type]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 sm:px-0">
      {/* Hidden Inputs */}
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'avatar')} />
      <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'coverPhoto')} />

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div 
          className="h-48 relative overflow-hidden bg-gradient-to-r from-blue-400 to-indigo-600 transition-all group/cover"
          style={user.coverPhoto ? { backgroundImage: `url(${user.coverPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {isOwnProfile && (
            <button 
              onClick={() => coverInputRef.current?.click()}
              className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-xl backdrop-blur-md font-bold text-sm transition-all transform hover:scale-105 active:scale-95"
            >
              <i className="fa-solid fa-camera mr-2"></i> Edit Cover
            </button>
          )}
        </div>
        
        <div className="px-6 sm:px-8 pb-8 flex flex-col items-center sm:items-start sm:flex-row gap-6 -mt-16">
          <div className="relative group/avatar">
            <img src={user.avatar} className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl relative z-10 object-cover" alt={user.name} />
            {isOwnProfile && (
              <button 
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 z-20 bg-black/40 rounded-3xl opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1"
              >
                <i className="fa-solid fa-camera text-xl"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
              </button>
            )}
            {user.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-xl border-4 border-white shadow-lg z-30">
                <i className="fa-solid fa-circle-check text-white text-sm"></i>
              </div>
            )}
          </div>
          <div className="flex-grow mt-16 sm:mt-20 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-black text-gray-800">{user.name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 font-medium">
                  <span>{user.handle}</span>
                  {user.isCreator && (
                    <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Creator</span>
                  )}
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                {isOwnProfile ? (
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Edit Profile</button>
                ) : (
                  <>
                    <button 
                      onClick={() => onToggleFollow?.(user.id)}
                      className={`px-8 py-2 rounded-xl font-bold shadow-lg transition-all ${
                        user.isFollowing 
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-none' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                      }`}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="bg-gray-100 text-gray-700 p-2.5 rounded-xl hover:bg-gray-200 transition-colors"><i className="fa-solid fa-message"></i></button>
                  </>
                )}
                <button className="bg-gray-100 text-gray-700 p-2.5 rounded-xl hover:bg-gray-200 transition-colors"><i className="fa-solid fa-share-nodes"></i></button>
              </div>
            </div>
            
            <p className="mt-4 text-gray-700 leading-relaxed max-w-2xl text-center sm:text-left">{user.bio}</p>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="text-center md:text-left md:border-r border-gray-200">
                <span className="block text-xl font-black text-gray-800">{posts.length}</span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Posts</span>
              </div>
              <div className="text-center md:text-left md:border-r border-gray-200">
                <span className="block text-xl font-black text-gray-800">
                  {user.followers.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  Followers
                </span>
              </div>
              <div className="text-center md:text-left md:border-r border-gray-200">
                <span className="block text-xl font-black text-gray-800">
                  {user.following.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  Following
                </span>
              </div>
              {user.isCreator && (
                <div className="text-center md:text-left">
                  <span className="block text-xl font-black text-blue-600">{user.watchTime || '0 hrs'}</span>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Watch Time</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Tabs */}
      <div className="flex justify-center border-b border-gray-200 mb-8">
        {[
          { id: 'feed', label: 'Feed' },
          { id: 'videos', label: 'Videos' },
          { id: 'saved', label: 'Saved' }
        ].map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 font-bold border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Creation Tools (Only for own profile) */}
      {isOwnProfile && activeTab === 'feed' && (
        <div className="mb-8">
          <CreatePost user={user} onPostCreated={(p) => onPostCreated?.(p)} />
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {sortedPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                <i className="fa-solid fa-newspaper text-gray-100 text-6xl mb-4"></i>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No posts to show yet</p>
              </div>
            ) : (
              sortedPosts.map(post => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  onLike={() => onLike?.(post.id)} 
                  onComment={(content, parentId) => onComment?.(post.id, content, parentId)} 
                  onBlock={() => onBlock?.(post.user.id)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {posts.filter(p => p.videoUrl).map((post) => (
              <div key={post.id} className="aspect-[9/16] relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 bg-black">
                <video src={post.videoUrl} className="w-full h-full object-cover opacity-80" muted />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <i className="fa-solid fa-play text-white text-3xl opacity-50"></i>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                  <p className="text-xs font-bold line-clamp-1">{post.content}</p>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-black">
                  <span className="flex items-center gap-1.5"><i className="fa-solid fa-heart"></i> {post.likes}</span>
                </div>
              </div>
            ))}
            {posts.filter(p => p.videoUrl).length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100">
                <i className="fa-solid fa-video-slash text-gray-100 text-6xl mb-4"></i>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No videos available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100">
              <i className="fa-solid fa-bookmark text-gray-100 text-6xl mb-4"></i>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Saved posts appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
