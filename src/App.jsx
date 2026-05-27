import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import PhoneShell from './components/PhoneShell';
import TesterPanel from './components/TesterPanel';

// Pages
import ActivityListPage from './pages/ActivityListPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import GroupDetailPage from './pages/GroupDetailPage';
import CreateGroupPage from './pages/CreateGroupPage';
import CircleHomepage from './pages/CircleHomepage';
import CircleDetailPage from './pages/CircleDetailPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import MessagePage from './pages/MessagePage';
import ChatWindowPage from './pages/ChatWindowPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { routeStack } = useApp();
  
  // 获取路由栈顶的页面
  const currentRoute = routeStack[routeStack.length - 1];

  const renderActivePage = () => {
    switch (currentRoute.page) {
      case 'activities':
        return <ActivityListPage />;
      case 'activity-detail':
        return <ActivityDetailPage />;
      case 'group-detail':
        return <GroupDetailPage />;
      case 'create-group':
        return <CreateGroupPage />;
      case 'circles':
        return <CircleHomepage />;
      case 'circle-detail':
        return <CircleDetailPage />;
      case 'post-detail':
        return <PostDetailPage />;
      case 'create-post':
        return <CreatePostPage />;
      case 'messages':
        return <MessagePage />;
      case 'chat-window':
        return <ChatWindowPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <CircleHomepage />;
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#09090C',
        backgroundImage: 'radial-gradient(circle at 20% 30%, #2A1F2D 0%, #09090C 70%)',
        overflow: 'hidden'
      }}
    >
      {/* 左侧：手机框模拟器 */}
      <div 
        style={{
          flex: 1.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <PhoneShell>
          {renderActivePage()}
        </PhoneShell>
      </div>

      {/* 右侧：状态管理器沙盒面板 */}
      <div 
        style={{
          flex: 1,
          height: '100%',
          maxWidth: '420px',
          minWidth: '320px'
        }}
      >
        <TesterPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
