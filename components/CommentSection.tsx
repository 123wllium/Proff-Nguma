
import React, { useState, useRef } from 'react';
import { Comment, Reaction } from '../types';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
}

const COMMENT_REACTIONS = [
  { label: 'Like', emoji: '👍' },
  { label: 'Love', emoji: '❤️' },
  { label: 'Haha', emoji: '😂' },
  { label: 'Wow', emoji: '😮' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Angry', emoji: '😡' },
];

const CommentItem: React.FC<{ 
  comment: Comment; 
  onAddReply: (content: string, parentId: string) => void;
  isReply?: boolean;
}> = ({ comment, onAddReply, isReply }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const pickerTimeoutRef = useRef<any>(null);

  const formatDate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onAddReply(replyText, comment.id);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleReact = (reaction: string) => {
    setUserReaction(userReaction === reaction ? null : reaction);
    setShowReactionPicker(false);
  };

  return (
    <div className={`flex gap-3 ${isReply ? 'ml-8 mt-2' : ''}`}>
      <img src={comment.userAvatar} className={`${isReply ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex-shrink-0 object-cover`} alt={comment.userName} />
      <div className="flex flex-col flex-grow group">
        <div className="bg-gray-100 rounded-2xl px-3 py-2 max-w-fit relative">
          <p className="font-bold text-[11px] text-gray-800">{comment.userName}</p>
          <p className="text-sm text-gray-900 font-medium">{comment.content}</p>
          
          {/* Active Reaction Display */}
          {userReaction && (
            <div className="absolute -bottom-2 -right-2 bg-white shadow-sm border border-gray-100 rounded-full px-1 py-0.5 flex items-center text-[10px]">
              {COMMENT_REACTIONS.find(r => r.label === userReaction)?.emoji}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-1 ml-2 relative">
          {/* Reaction Button with Hover Picker */}
          <div 
            className="relative"
            onMouseEnter={() => {
              pickerTimeoutRef.current = setTimeout(() => setShowReactionPicker(true), 400);
            }}
            onMouseLeave={() => {
              if (pickerTimeoutRef.current) clearTimeout(pickerTimeoutRef.current);
            }}
          >
            <button 
              className={`text-[11px] font-bold ${userReaction ? 'text-blue-600' : 'text-gray-500'} hover:underline`}
              onClick={() => handleReact('Like')}
            >
              {userReaction || 'Like'}
            </button>

            {showReactionPicker && (
              <div 
                className="absolute bottom-full left-0 mb-2 bg-white shadow-xl rounded-full px-2 py-1 flex gap-1 border border-gray-100 z-50 animate-slide-up"
                onMouseEnter={() => { if(pickerTimeoutRef.current) clearTimeout(pickerTimeoutRef.current); }}
                onMouseLeave={() => setShowReactionPicker(false)}
              >
                {COMMENT_REACTIONS.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => handleReact(r.label)}
                    className="w-7 h-7 flex items-center justify-center text-lg hover:scale-125 transition-transform"
                    title={r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className="text-[11px] font-bold text-gray-500 hover:underline"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            Reply
          </button>
          
          <span className="text-[11px] text-gray-400">{formatDate(comment.timestamp)}</span>
        </div>

        {/* Reply Input Field */}
        {showReplyInput && (
          <form onSubmit={handleReplySubmit} className="mt-3 flex gap-2 animate-fade-in">
            <input 
              type="text"
              autoFocus
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.userName}...`}
              className="flex-grow bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button 
              type="submit"
              disabled={!replyText.trim()}
              className="text-blue-600 font-bold text-xs px-2 disabled:opacity-30"
            >
              Post
            </button>
          </form>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3 mt-3 border-l-2 border-gray-100 pl-2">
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                onAddReply={onAddReply} 
                isReply={true} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleAddReply = (content: string, parentId: string) => {
    onAddComment(content, parentId);
  };

  return (
    <div className="space-y-6">
      {/* Primary Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <img src="https://picsum.photos/seed/alex/100/100" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" alt="Me" />
        <div className="flex-grow flex gap-2">
          <input 
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={!newComment.trim()}
            className="text-blue-600 hover:bg-blue-50 px-3 rounded-full transition-colors disabled:opacity-0"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            onAddReply={handleAddReply} 
          />
        ))}
        {comments.length === 0 && (
          <p className="text-center text-xs text-gray-400 py-4 italic">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
