
import React, { useState, useRef } from 'react';
import { Post, Comment } from '../types';
import CommentSection from './CommentSection';
import VideoPlayer from './VideoPlayer';

interface PostItemProps {
  post: Post;
  onLike: () => void;
  // Fix: changed onComment signature to accept the content string and optional parentId from CommentSection
  onComment: (content: string, parentId?: string) => void;
  onReport?: () => void;
  onBlock?: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onLike, onComment, onReport, onBlock }) => {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const handleReport = () => {
    if (confirm("Are you sure you want to report this post for review?")) {
      onReport?.();
      setShowMenu(false);
    }
  };

  const handleBlock = () => {
    if (confirm(`Block ${post.user.name}? You will no longer see their posts or messages.`)) {
      onBlock?.();
      setShowMenu(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-fade-in relative">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={post.user.avatar} className="w-10 h-10 rounded-full border border-gray-100 object-cover" alt="Avatar" />
          <div>
            <h4 className="font-bold text-gray-800 text-sm hover:underline cursor-pointer">{post.user.name}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Public • Secured</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[60] animate-slide-up">
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm font-bold">
                <i className="fa-solid fa-bookmark text-gray-400"></i> Save Post
              </button>
              <hr className="my-2 border-gray-50" />
              <button 
                onClick={handleReport}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-500 text-sm font-bold"
              >
                <i className="fa-solid fa-flag"></i> Report Post
              </button>
              <button 
                onClick={handleBlock}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 text-sm font-bold"
              >
                <i className="fa-solid fa-user-slash"></i> Block User
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <p className="text-gray-900 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">{post.content}</p>
      </div>

      {post.image && (
        <div className="w-full bg-gray-50">
          <img src={post.image} className="w-full max-h-[500px] object-cover mx-auto" alt="Post" />
        </div>
      )}

      {post.videoUrl && (
        <div className="w-full bg-black aspect-video">
          <VideoPlayer src={post.videoUrl} className="w-full h-full" />
        </div>
      )}

      <div className="p-4 border-t border-gray-50 flex items-center gap-6">
        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600">
          <i className="fa-solid fa-heart"></i> Like
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600"
        >
          <i className="fa-solid fa-comment"></i> Comment
        </button>
        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 ml-auto">
          <i className="fa-solid fa-share-nodes"></i> Share
        </button>
      </div>

      {showComments && (
        <div className="bg-gray-50/50 p-4 border-t border-gray-50">
          {/* Fix: onAddComment from CommentSection provides (content: string, parentId?: string) */}
          <CommentSection comments={post.comments} onAddComment={(content, parentId) => onComment(content, parentId)} />
        </div>
      )}
    </div>
  );
};

export default PostItem;
