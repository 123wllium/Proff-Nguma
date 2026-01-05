
import React, { useState } from 'react';
import { User, Post } from '../types';

interface SearchViewProps {
  query: string;
  users: User[];
  posts: Post[];
  onNavigateUser: (user: User) => void;
  onNavigatePost: (postId: string) => void;
  onToggleFollow?: (userId: string) => void;
}

const SearchView: React.FC<SearchViewProps> = ({ query, users, posts, onToggleFollow }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'people' | 'posts' | 'videos' | 'hashtags'>('all');

  const normalizedQuery = query.toLowerCase().trim();
  const isHashtagQuery = normalizedQuery.startsWith('#');
  const tagToSearch = isHashtagQuery ? normalizedQuery.slice(1) : normalizedQuery;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(normalizedQuery) || 
    u.handle.toLowerCase().includes(normalizedQuery)
  );

  const filteredPosts = posts.filter(p => 
    p.content.toLowerCase().includes(normalizedQuery) ||
    p.hashtags?.some(tag => tag.includes(tagToSearch))
  );

  const filteredVideos = posts.filter(p => 
    p.videoUrl && (
      p.content.toLowerCase().includes(normalizedQuery) ||
      p.hashtags?.some(tag => tag.includes(tagToSearch))
    )
  );

  const allHashtags = Array.from(new Set(posts.flatMap(p => p.hashtags || [])))
    .filter((tag: string) => tag.includes(tagToSearch))
    .map((tag: string) => ({
      name: tag,
      count: posts.filter(p => p.hashtags?.includes(tag)).length
    }))
    .sort((a, b) => b.count - a.count);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'people', label: 'Accounts' },
    { id: 'posts', label: 'Posts' },
    { id: 'videos', label: 'Videos' },
    { id: 'hashtags', label: 'Hashtags' },
  ];

  return (
    <div className="py-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Results for "{query}"</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8 animate-fade-in">
        {/* People Section */}
        {(activeCategory === 'all' || activeCategory === 'people') && filteredUsers.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs">People</h3>
              {activeCategory === 'all' && <button onClick={() => setActiveCategory('people')} className="text-xs font-bold text-blue-600">See all</button>}
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {filteredUsers.slice(0, activeCategory === 'all' ? 3 : 20).map(u => (
                <div key={u.id} className="p-4 flex items-center justify-between border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={u.avatar} className="w-12 h-12 rounded-full border-2 border-white group-hover:border-blue-100" alt={u.name} />
                      {u.isVerified && <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full"><i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i></div>}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{u.name}</h4>
                      <p className="text-xs text-gray-400">{u.handle} • {u.followers.toLocaleString()} Followers</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFollow?.(u.id);
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        u.isFollowing 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {u.isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hashtags Section */}
        {(activeCategory === 'all' || activeCategory === 'hashtags') && allHashtags.length > 0 && (
          <section>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-4">Hashtags</h3>
            <div className="flex flex-wrap gap-2">
              {allHashtags.map(tag => (
                <div key={tag.name} className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 cursor-pointer hover:border-blue-200 transition-all">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold">#</div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">#{tag.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">{tag.count} Posts</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Posts/Videos Section */}
        {(activeCategory === 'all' || activeCategory === 'posts' || activeCategory === 'videos') && (
          <section>
            <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs mb-4">
              {activeCategory === 'videos' ? 'Videos' : 'Content'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(activeCategory === 'videos' ? filteredVideos : filteredPosts).map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer">
                  {post.videoUrl ? (
                    <div className="relative aspect-video bg-black flex items-center justify-center">
                      <i className="fa-solid fa-play text-white/50 text-3xl"></i>
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-bold">
                        {post.views} views
                      </div>
                    </div>
                  ) : post.image ? (
                    <img src={post.image} className="w-full aspect-video object-cover" alt="Post" />
                  ) : (
                    <div className="aspect-video bg-gray-50 p-4 flex items-center justify-center italic text-gray-400 text-xs text-center">
                      {post.content.substring(0, 100)}...
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={post.user.avatar} className="w-6 h-6 rounded-full" alt={post.user.name} />
                      <span className="text-xs font-bold text-gray-700">{post.user.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-search text-gray-300 text-3xl"></i>
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">No Results Found</h3>
            <p className="text-gray-500">Try adjusting your keywords or checking for typos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
