
import React, { useState, useMemo, useEffect } from 'react';
import { User, Post, Comment, TabType, Notification, Group, Report, AdminLog, UserRole } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PostItem from './components/PostItem';
import CreatePost from './components/CreatePost';

// Views
import ExploreView from './views/ExploreView';
import NotificationsView from './views/NotificationsView';
import ProfileView from './views/ProfileView';
import VideoView from './views/VideoView';
import SubscriptionView from './views/SubscriptionView';
import MessageView from './views/MessageView';
import SearchView from './views/SearchView';
import AuthView from './views/AuthView';
import GroupsView from './views/GroupsView';
import AdminDashboard from './views/AdminDashboard';

const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  handle: '@arivera',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  bio: 'Digital nomad and full-stack explorer. Building the future of social on Letago.',
  followers: 1240,
  following: 840,
  isCreator: true,
  subscribers: 450,
  watchTime: '85 hrs',
  isVerified: true,
  twoFactorEnabled: true,
  role: 'SUPER_ADMIN',
  status: 'active'
};

const INITIAL_FRIENDS: User[] = [
  { id: 'u2', name: 'Sarah Chen', handle: '@schen', avatar: 'https://picsum.photos/seed/sarah/100/100', isCreator: true, subscribers: 12000, isVerified: true, watchTime: '1.4k hrs', followers: 12000, following: 150, isFollowing: true, role: 'USER', status: 'active' },
  { id: 'u3', name: 'Mike Ross', handle: '@miker', avatar: 'https://picsum.photos/seed/mike/100/100', followers: 450, following: 210, isFollowing: false, role: 'MODERATOR', status: 'active' },
  { id: 'u4', name: 'Elena Gilbert', handle: '@egilbert', avatar: 'https://picsum.photos/seed/elena/100/100', isCreator: true, subscribers: 890, watchTime: '120 hrs', followers: 890, following: 300, isFollowing: false, role: 'USER', status: 'active' },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    user: INITIAL_FRIENDS[0],
    content: "Caught this incredible drone shot of the forest. Nature is the best designer! #nature #travel #drone #forest",
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-forest-34537-large.mp4',
    likes: 1240,
    comments: [],
    timestamp: Date.now() - 7200000,
    aiInsight: "Aerial perspectives always offer a fresh look at our world. Majestic!",
    views: 5200,
    watchTime: '45 hrs',
    hashtags: ['nature', 'travel', 'drone', 'forest'],
    moderationStatus: 'approved'
  },
  {
    id: 'p2',
    user: INITIAL_FRIENDS[2],
    content: "New workspace setup. Focus mode enabled! #coding #setup #tech",
    image: 'https://picsum.photos/seed/desk/800/400',
    likes: 84,
    comments: [],
    timestamp: Date.now() - 15200000,
    aiInsight: "Clean spaces lead to clear minds. Productivity levels are looking high!",
    hashtags: ['coding', 'setup', 'tech'],
    moderationStatus: 'approved'
  }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [users, setUsers] = useState<User[]>([...INITIAL_FRIENDS, MOCK_USER]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  
  // Admin & Settings State
  const [reports, setReports] = useState<Report[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminLog[]>([]);
  const [appSettings, setAppSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    aiModerationSensitivity: 75,
    privacyLevel: 'Standard'
  });

  useEffect(() => {
    const savedSession = localStorage.getItem('letago_session');
    if (savedSession) setIsLoggedIn(true);
    
    // Auto-generate a report for demo purposes if none exist
    if (reports.length === 0) {
      setReports([{
        id: 'rep_demo_1',
        reporterId: 'u3',
        targetId: 'p2',
        targetType: 'post',
        reason: 'Potential Spam Content',
        timestamp: Date.now() - 3600000,
        status: 'pending'
      }]);
    }
  }, []);

  const handleLogin = (user?: User) => {
    if (user) setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('letago_session', 'active');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('letago_session');
    setActiveTab('home');
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const logAdminAction = (action: string, targetId?: string) => {
    const newLog: AdminLog = {
      id: `log_${Date.now()}`,
      adminId: currentUser.id,
      adminName: currentUser.name,
      action,
      targetId,
      timestamp: Date.now()
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleReportContent = (postId: string, reason: string) => {
    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      targetId: postId,
      targetType: 'post',
      reason,
      timestamp: Date.now(),
      status: 'pending'
    };
    setReports([newReport, ...reports]);
  };

  const handleModerateUser = (userId: string, status: User['status']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    logAdminAction(`${status === 'active' ? 'Reinstated' : 'Status changed to ' + status} for user`, userId);
  };

  const handleModeratePost = (postId: string, status: Post['moderationStatus']) => {
    if (status === 'removed') {
      setPosts(prev => prev.filter(p => p.id !== postId));
      logAdminAction(`Permanently deleted post`, postId);
    } else {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, moderationStatus: status } : p));
      logAdminAction(`Updated post status to ${status}`, postId);
    }
  };

  const handleResolveReport = (reportId: string, actionTaken: 'dismissed' | 'resolved') => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: actionTaken } : r));
    logAdminAction(`Manually marked report ${reportId} as ${actionTaken}`);
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'admin' && currentUser.role === 'USER') {
      alert("Access Denied: You do not have administrative privileges.");
      return;
    }
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="w-full max-w-2xl mx-auto py-6 space-y-6">
            <CreatePost user={currentUser} onPostCreated={(p) => setPosts([p, ...posts])} />
            <div className="space-y-4">
              {posts.map(post => (
                <PostItem 
                  key={post.id} 
                  post={post} 
                  onLike={() => {}} 
                  onComment={() => {}} 
                  onReport={() => handleReportContent(post.id, 'User Reported Content')}
                />
              ))}
            </div>
          </div>
        );
      case 'admin':
        return (
          <AdminDashboard 
            users={users}
            posts={posts}
            reports={reports}
            logs={auditLogs}
            currentUser={currentUser}
            onModerateUser={handleModerateUser}
            onModeratePost={handleModeratePost}
            onResolveReport={handleResolveReport}
            onUpdateRole={(uid, role) => {
              setUsers(prev => prev.map(u => u.id === uid ? {...u, role} : u));
              logAdminAction(`Changed role of user to ${role}`, uid);
            }}
            appSettings={appSettings}
            onUpdateSettings={(newSettings) => {
              setAppSettings(newSettings);
              logAdminAction('Updated global app settings');
            }}
          />
        );
      case 'profile':
        return <ProfileView user={currentUser} posts={posts.filter(p => p.user.id === currentUser.id)} isOwnProfile={true} onUpdateProfile={handleUpdateUser} />;
      case 'groups':
        return <GroupsView groups={groups} currentUser={currentUser} onCreateGroup={(n, d, c) => setGroups([...groups, { id: `g${Date.now()}`, name: n, description: d, category: c, avatar: 'https://picsum.photos/seed/gp/100/100', membersCount: 1, creatorId: currentUser.id }])} onJoinGroup={() => {}} />;
      case 'explore': return <ExploreView />;
      case 'notifications': return <NotificationsView notifications={notifications} />;
      default: return <div className="p-20 text-center text-gray-400">View implementation pending...</div>;
    }
  };

  if (!isLoggedIn) return <AuthView onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-x-hidden">
      {activeTab !== 'admin' && (
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
          user={currentUser} 
          friends={users.filter(u => u.id !== currentUser.id)}
          onStartChat={() => {}}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`flex-grow flex flex-col ${activeTab !== 'admin' ? 'md:ml-64 lg:ml-72' : ''} pb-16 md:pb-0 transition-all duration-300`}>
        <Navbar 
          user={currentUser} 
          onTabChange={handleTabChange} 
          onSearch={setSearchQuery}
          onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
        />
        <main className={`flex-grow ${activeTab === 'admin' ? '' : 'pt-16 px-4 sm:px-6'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
