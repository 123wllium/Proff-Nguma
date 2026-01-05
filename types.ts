
export type TabType = 'home' | 'explore' | 'groups' | 'notifications' | 'profile' | 'messages' | 'video' | 'subscription' | 'search' | 'admin';

export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  handle: string;
  bio?: string;
  followers: number;
  following: number;
  isCreator?: boolean;
  subscribers?: number;
  watchTime?: string;
  isSubscribed?: boolean;
  isVerified?: boolean;
  isFollowing?: boolean;
  twoFactorEnabled?: boolean;
  role: UserRole;
  status: UserStatus;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  membersCount: number;
  creatorId: string;
  isJoined?: boolean;
  category: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  videoUrl?: string;
  likes: number;
  comments: Comment[];
  timestamp: number;
  aiInsight?: string;
  views?: number;
  isSaved?: boolean;
  watchTime?: string;
  hashtags?: string[];
  isReported?: boolean;
  moderationStatus?: 'approved' | 'flagged' | 'removed';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: number;
  replies?: Comment[];
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'post' | 'user' | 'comment';
  reason: string;
  timestamp: number;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  timestamp: number;
  targetId?: string;
}

export interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'security';
  user?: string;
  action: string;
  time: string;
  avatar?: string;
  isRead?: boolean;
  deviceInfo?: string;
}

// Added missing types used in messaging and reactions
export type MessageType = 'text' | 'image' | 'video' | 'voice';

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: MessageType;
  timestamp: number;
  status: 'sent' | 'delivered' | 'seen';
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  updatedAt: number;
  lastMessage?: string;
  isTyping?: boolean;
}

export interface Reaction {
  label: string;
  emoji: string;
}
