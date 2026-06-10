import { Calendar, MessageSquare, User, ArrowLeft, Sparkles, Plus, Image as ImageIcon, Film, X, Compass, Users, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReqBadge } from './ReqAnnotation';

export default function PhoneShell({ children }) {
  const { 
    routeStack, 
    popRoute, 
    resetToTab, 
    unreadCount,
    showGlobalPublishSheet,
    globalPublishCircleId,
    closePublishFlow,
    openPublishFlow,
    pushRoute,
    checkLogin
  } = useApp();

  
  // 判断当前是否是子页面层级 (栈深度 > 1)
  const isSubPage = routeStack.length > 1;
  const currentRoute = routeStack[currentRouteIndex()];

  function currentRouteIndex() {
    return routeStack.length - 1;
  }

  // 获取当前活跃的 Tab
  const activeTab = routeStack[0].page;

  // 渲染子页面的顶部导航条
  const renderNavbar = () => {
    if (!isSubPage) return null;
    
    // 这些页面有自己的内置导航栏，PhoneShell不再重复渲染
    const pagesWithOwnNavbar = ['post-detail', 'create-post', 'circle-detail'];
    if (pagesWithOwnNavbar.includes(currentRoute.page)) return null;
    
    let title = '详情';
    if (currentRoute.page === 'circle-detail') title = '圈子同好营';
    if (currentRoute.page === 'post-detail') title = '同好动态';
    if (currentRoute.page === 'group-detail') title = '开团面基';
    if (currentRoute.page === 'group-approve') title = '申请审核';
    if (currentRoute.page === 'create-group') title = '发起开团';
    if (currentRoute.page === 'create-post') title = '发布动态';
    if (currentRoute.page === 'create-circle') title = '新建同好营';
    if (currentRoute.page === 'chat-window') title = '同好交流';
    if (currentRoute.page === 'activity-detail') title = '活动详情';

    return (
      <div 
        style={{
          height: '44px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderBottom: 'var(--border-width) solid var(--m-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          padding: '0 12px',
          flexShrink: 0,
          zIndex: 40,
          userSelect: 'none'
        }}
      >
        <button 
          onClick={popRoute}
          className="interactive-scale"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--m-primary)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          <span>返回</span>
        </button>
        
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)', letterSpacing: '0.5px' }}>
          {title}
        </span>
        
        <div style={{ width: '40px' }}></div> {/* 占位平衡 */}
      </div>
    );
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '375px',
        height: '812px',
        borderRadius: '32px',
        backgroundColor: '#ffffff',
        border: '3px solid #4a3e56',
        boxShadow: '8px 8px 0px #4a3e56',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* 顶部中央黏贴的和纸手撕黄色胶带 */}
      <div className="washi-tape-top" />

      {/* 状态栏 */}
      <div 
        style={{
          width: '100%',
          height: '32px',
          backgroundColor: 'transparent',
          padding: '8px 20px 0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          fontWeight: 800,
          color: 'var(--m-text-main)',
          zIndex: 50,
          flexShrink: 0
        }}
      >
        <span>16:00</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* 信号格 icon */}
          <div style={{ display: 'flex', alignItems: 'end', gap: '1px', height: '8px' }}>
            <div style={{ width: '2px', height: '3px', backgroundColor: 'var(--m-text-main)' }}></div>
            <div style={{ width: '2px', height: '5px', backgroundColor: 'var(--m-text-main)' }}></div>
            <div style={{ width: '2px', height: '7px', backgroundColor: 'var(--m-text-main)' }}></div>
          </div>
          {/* 电池 icon */}
          <div style={{ width: '16px', height: '9px', borderRadius: '2px', border: '1px solid var(--m-text-main)', padding: '1px', display: 'flex', position: 'relative' }}>
            <div style={{ width: '10px', height: '100%', backgroundColor: 'var(--m-text-main)', borderRadius: '1px' }}></div>
            <div style={{ position: 'absolute', right: '-2px', top: '2px', width: '1.5px', height: '3px', backgroundColor: 'var(--m-text-main)', borderRadius: '0 1px 1px 0' }}></div>
          </div>
        </div>
      </div>

      {/* 核心画布区 */}
      <div className="app-container" style={{ flex: 1, minHeight: 0 }}>
        {/* 子页面顶部条 */}
        {renderNavbar()}

        {/* 实际渲染子页面 */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {children}
        </div>

        {/* 底部导航栏 (仅在顶层Tab页展示) */}
        {!isSubPage && (
          <div className="bottom-tabbar">
            {/* 活动 */}
            <button 
              onClick={() => resetToTab('activities')}
              className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
            >
              <Compass className="tab-btn-icon" />
              <span>活动</span>
            </button>

            {/* 同好营 */}
            <button
              onClick={() => resetToTab('circles')}
              className={`tab-btn ${activeTab === 'circles' ? 'active' : ''}`}
            >
              <Users className="tab-btn-icon" />
              <span>同好营</span>
            </button>

            {/* + 号发布按钮 */}
            <button 
              onClick={() => {
                checkLogin(() => openPublishFlow());
              }}
              className="tab-btn"
              style={{ position: 'relative' }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--m-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-12px',
                boxShadow: 'none'
              }}>
                <Plus size={18} strokeWidth={2.5} color="#FFFFFF" />
              </div>
            </button>

            {/* 聊天 */}
            <button 
              onClick={() => resetToTab('messages')}
              className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
              style={{ position: 'relative' }}
            >
              <MessageCircle className="tab-btn-icon" />
              <span>聊天</span>
              {unreadCount > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '6px',
                    backgroundColor: 'var(--m-primary)',
                    color: '#FFFFFF',
                    fontSize: '7px',
                    fontWeight: 800,
                    padding: '1px 4px',
                    borderRadius: '9999px',
                    border: '1px solid #FFFFFF'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* 我的 */}
            <button 
              onClick={() => resetToTab('profile')}
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User className="tab-btn-icon" />
              <span>我的</span>
            </button>
          </div>
        )}
      </div>

      {/* 底部小黑线 */}
      <div 
        style={{
          position: 'absolute',
          bottom: '3px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '3px',
          backgroundColor: '#FFFFFF',
          borderRadius: '9999px',
          zIndex: 50
        }}
      ></div>

      {/* 全局底部发布弹窗 */}
      {showGlobalPublishSheet && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'flex-end',
            animation: 'fadeIn 0.15s ease-out'
          }}
          onClick={closePublishFlow}
        >
          <div 
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '16px 16px 24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 151,
              animation: 'slideUp 0.2s cubic-bezier(0.1, 0.76, 0.55, 0.94)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#E2E5E8', alignSelf: 'center', marginBottom: '4px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>选择发布类型</span>
                <ReqBadge id="PUB-SHEET" style={{ position: 'relative', top: '-1px' }} />
              </h3>
              <button 
                onClick={closePublishFlow}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--m-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {/* 发图文 */}
              <div 
                onClick={() => {
                  closePublishFlow();
                  pushRoute('create-post', { type: 'image', circleId: globalPublishCircleId });
                }}
                className="interactive-scale"
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--m-primary-light)',
                  border: '1px solid var(--m-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <ImageIcon size={18} className="text-[#E5A9A9]" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-primary)' }}>发图文</span>
              </div>

              {/* 发视频 */}
              <div 
                onClick={() => {
                  closePublishFlow();
                  pushRoute('create-post', { type: 'video', circleId: globalPublishCircleId });
                }}
                className="interactive-scale"
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--m-secondary-light)',
                  border: '1px solid var(--m-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Film size={18} className="text-[#A8BDD1]" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-secondary)' }}>发视频</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
