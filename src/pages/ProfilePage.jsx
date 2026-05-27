import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LogOut, Heart, Calendar, MessageSquare, MapPin, 
  Settings, X, ChevronRight, Camera, Copy, 
  RefreshCw, Plus, Compass, Sparkles, Smile, ArrowLeft, Edit3, Trash2, Play
} from 'lucide-react';

export default function ProfilePage() {
  const { 
    user, 
    setUser,
    handleLogout, 
    handleLoginSuccess, 
    activities, 
    groups, 
    posts,
    activityRelations, 
    circles,
    pushRoute,
    resetToTab,
    openPublishFlow,
    drafts,
    deleteDraft
  } = useApp();




  // 默认个人资料信息
  const userGender = user?.gender || '保密';
  const userBirthday = user?.birthday || '2004-10-12';
  const userMbti = user?.mbti || 'INFP';
  const userId = user?.id || '1057860';
  const userCover = user?.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
  const userIp = '上海市';

  // 状态弹窗控制
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);



  // 选项编辑分级弹窗
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showMbtiPicker, setShowMbtiPicker] = useState(false);

  // 一级主 Tab: 'publish' (发布) | 'drafts' (草稿箱) | 'activities' (活动)
  const [activeMainTab, setActiveMainTab] = useState('publish');
  
  // 二级子 Tab (仅在 'publish' 时显示): 'works' (作品) | 'liked' (喜欢) | 'collected' (收藏)
  const [activeSubTab, setActiveSubTab] = useState('works');

  // 编辑字段临时状态
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editGender, setEditGender] = useState('保密');
  const [editBirthday, setEditBirthday] = useState('');
  const [editMbti, setEditMbti] = useState('INFP');
  const [editCover, setEditCover] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  
  // 自定义新标签输入状态
  const [customTagInput, setCustomTagInput] = useState('');

  // 换头像/封面背景池
  const mockAvatarPool = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  ];

  const mockCoverPool = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80'
  ];

  // 预设的人设性格标签
  const presetTagsPool = [
    '温柔的猫', 'ENTP', '委托老师', '互联网民工', '福瑞控', '正太', 
    '小猫咪', 'INFP', 'ISFJ', '萌妹', '纯爱战士', '吃谷大佬', 
    '咕咕咕', 'Coser大佬', '排少狂热', '原神双修', '技术宅', '社恐人士'
  ];
  const [recommendedTags, setRecommendedTags] = useState(presetTagsPool.slice(0, 10));

  const handleShuffleTags = () => {
    const shuffled = [...presetTagsPool].sort(() => 0.5 - Math.random());
    setRecommendedTags(shuffled.slice(0, 10));
  };

  // 过滤数据逻辑
  // 1. 作品 (我正式发布的动态)
  const myPosts = posts.filter(p => user && p.author.name === user.name && p.status === 'normal');
  
  // 2. 喜欢 (我点过赞的动态)
  const likedPosts = posts.filter(p => p.liked);

  // 3. 收藏 (我收藏的动态)
  const collectedPosts = posts.filter(p => p.collected);

  // 4. 草稿箱数据
  const mockDrafts = drafts;

  // 5. 想去的活动
  const wantedActivities = activities.filter(a => activityRelations[a.id]?.wanted);
  
  // 6. 我参加的拼团
  const joinedGroups = groups.filter(g => user && g.members.some(m => m.name === user.name));

  // 7. 我加入的同好营 (我的圈子)
  // 模拟一些用户加入的同好营
  const myCircles = circles.slice(0, 2);

  const openEditModal = () => {
    if (!user) return;
    setEditName(user.name);
    setEditBio(user.bio);
    setEditGender(userGender);
    setEditBirthday(userBirthday);
    setEditMbti(userMbti);
    setEditCover(userCover);
    setEditAvatar(user.avatar);
    setSelectedTags([...user.badges]);
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    setUser({
      ...user,
      name: editName,
      bio: editBio,
      avatar: editAvatar,
      badges: selectedTags,
      gender: editGender,
      birthday: editBirthday,
      mbti: editMbti,
      cover: editCover,
      id: userId
    });
    setShowEditModal(false);
  };

  const [copied, setCopied] = useState(false);
  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCycleAvatar = () => {
    const currentIndex = mockAvatarPool.indexOf(editAvatar);
    const nextIndex = (currentIndex + 1) % mockAvatarPool.length;
    setEditAvatar(mockAvatarPool[nextIndex]);
  };

  const handleCycleCover = () => {
    const currentIndex = mockCoverPool.indexOf(editCover);
    const nextIndex = (currentIndex + 1) % mockCoverPool.length;
    setEditCover(mockCoverPool[nextIndex]);
  };

  const toggleSelectTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 8) {
        alert('最多只能选择8个标签哦~');
        return;
      }
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const cleanTag = customTagInput.trim();
    if (!cleanTag) return;
    if (selectedTags.includes(cleanTag)) {
      alert('该标签已存在');
      return;
    }
    if (selectedTags.length >= 8) {
      alert('最多只能选择8个标签哦~');
      return;
    }
    setSelectedTags(prev => [...prev, cleanTag]);
    setCustomTagInput('');
  };

  const [cacheSize, setCacheSize] = useState('32.4 MB');

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col select-none relative overflow-hidden">
      
      {/* 顶部个人背景封面 */}
      <div 
        style={{ 
          height: '110px', 
          width: '100%', 
          position: 'relative', 
          backgroundImage: `url(${user ? userCover : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)' }} />

        {/* 顶部操作：设置 + 退出 */}
        {user && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px', zIndex: 15 }}>
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="interactive-scale"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Settings size={13} />
            </button>
            <button 
              onClick={handleLogout}
              className="interactive-scale"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>

      {/* 个人主卡片 (白色悬浮堆叠面板) */}
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          borderTopLeftRadius: '20px', 
          borderTopRightRadius: '20px', 
          marginTop: '-16px', 
          padding: '16px 16px 12px 16px',
          borderBottom: '1px solid var(--m-border)', 
          position: 'relative', 
          zIndex: 10,
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          flexShrink: 0 
        }}
      >
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
              {/* 大头像 */}
              <img 
                src={user.avatar} 
                alt="avatar" 
                style={{ 
                  width: '58px', 
                  height: '58px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: '3px solid #FFFFFF', 
                  position: 'absolute', 
                  top: '-29px', 
                  left: '0px', 
                  boxShadow: 'var(--m-shadow-sm)',
                  zIndex: 12
                }}
              />
              
              {/* 头像右侧社交统计 (与大厂截图一致：粉丝、关注、获赞) */}
              <div 
                style={{ 
                  marginLeft: '70px', 
                  display: 'flex', 
                  gap: '14px', 
                  paddingTop: '4px',
                  lineHeight: '1.2' 
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)' }}>256</span>
                  <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>粉丝</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)' }}>18</span>
                  <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>关注</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)' }}>1.2k</span>
                  <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>获赞</span>
                </div>
              </div>

              {/* 编辑资料 */}
              <button
                onClick={openEditModal}
                className="interactive-scale"
                style={{
                  border: '1px solid rgba(226, 229, 232, 0.9)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  fontSize: '8px',
                  color: 'var(--m-text-sub)',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={9} />
                <span>编辑资料</span>
              </button>
            </div>

            {/* 姓名与标签 */}
            <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>
                  {user.name}
                </h2>
                
                {/* 年龄、MBTI、性别保密等小标签 */}
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <span style={{ fontSize: '7px', fontWeight: 800, color: '#FF7D90', backgroundColor: '#FFF0F2', padding: '1px 5px', borderRadius: '4px' }}>
                    {userGender === '保密' ? '保密' : userGender}
                  </span>
                  <span style={{ fontSize: '7px', fontWeight: 800, color: '#5B7A63', backgroundColor: '#E2ECE4', padding: '1px 5px', borderRadius: '4px' }}>
                    {userMbti}
                  </span>
                </div>
              </div>

              {/* UID & IP属地 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }} onClick={handleCopyId}>
                  UID: {userId} <Copy size={8} />
                </span>
                <span>IP: {userIp}</span>
              </div>

              <p style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', lineHeight: '1.3', marginTop: '2px' }}>
                {user.bio}
              </p>
            </div>

            {/* 自定义人设标签 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
              {user.badges.map((b, i) => (
                <span 
                  key={i} 
                  style={{
                    fontSize: '8px',
                    fontWeight: 700,
                    color: 'var(--m-primary)',
                    backgroundColor: 'var(--m-primary-light)',
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div style={{ padding: '20px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', color: 'var(--m-text-sub)' }}>未登录，登录后即可查看同好状态与活动</span>
            <button 
              onClick={handleLoginSuccess}
              className="btn-round btn-primary interactive-scale"
              style={{ padding: '6px 18px', fontSize: '9.5px' }}
            >
              登录环境账户
            </button>
          </div>
        )}
      </div>

      {/* 我的同好营横滑卡片 (Point 1 Approved) */}
      {user && (
        <div style={{ padding: '10px 16px', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>我的同好营</span>
            <button 
              onClick={() => pushRoute('circles')} 
              style={{ background: 'none', border: 'none', fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <span>全部</span>
              <ChevronRight size={10} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
            {myCircles.map(c => (
              <div 
                key={c.id}
                onClick={() => pushRoute('circle-detail', { circleId: c.id }, 'profile')}
                className="interactive-scale"
                style={{
                  flexShrink: 0,
                  width: '90px',
                  padding: '8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(226,229,232,0.6)',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <img src={c.avatar} alt="c_avatar" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--m-text-main)', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name}
                </span>
                <span style={{ fontSize: '6.5px', color: 'var(--m-text-muted)', transform: 'scale(0.95)' }}>
                  {c.memberCount} 成员
                </span>
              </div>
            ))}

            {/* 虚线加入同好营卡片 */}
            <div 
              onClick={() => resetToTab('circles')}
              className="interactive-scale"
              style={{
                flexShrink: 0,
                width: '90px',
                height: '59px',
                borderRadius: '10px',
                border: '1px dashed var(--m-primary)',
                backgroundColor: 'var(--m-primary-light)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                cursor: 'pointer'
              }}
            >
              <Plus size={12} className="text-[#E5A9A9]" />
              <span style={{ fontSize: '7.5px', fontWeight: 800, color: 'var(--m-primary)' }}>加入同好营</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 双级嵌套 Tab 结构 */}
      {user && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          
          {/* 一级大分类 Tab: 发布 | 草稿箱 | 活动 */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              padding: '10px 16px 8px 16px', 
              backgroundColor: '#FFFFFF',
              borderBottom: '1px solid rgba(226, 229, 232, 0.4)',
              flexShrink: 0
            }}
          >
            {[
              { key: 'publish', label: '发布' },
              { key: 'drafts', label: '草稿箱' },
              { key: 'activities', label: '活动' }
            ].map(tab => {
              const isActive = activeMainTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveMainTab(tab.key)}
                  className="interactive-scale"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px 8px',
                    fontSize: '10px',
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? 'var(--m-primary)' : 'var(--m-text-sub)',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <div 
                      style={{ 
                        width: '100%', 
                        height: '2px', 
                        backgroundColor: 'var(--m-primary)', 
                        borderRadius: '1px',
                        position: 'absolute',
                        bottom: '-8px',
                        left: 0
                      }} 
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* 二级子 Tab: 只在一级 Tab 激活 'publish' 时显示 */}
          {activeMainTab === 'publish' && (
            <div 
              style={{
                display: 'flex',
                gap: '16px',
                padding: '6px 16px',
                backgroundColor: '#FFFFFF',
                borderBottom: '1px solid rgba(226, 229, 232, 0.25)',
                flexShrink: 0
              }}
            >
              {[
                { key: 'works', label: '作品' },
                { key: 'liked', label: '喜欢' },
                { key: 'collected', label: '收藏' }
              ].map(sub => {
                const isActive = activeSubTab === sub.key;
                return (
                  <button
                    key={sub.key}
                    onClick={() => setActiveSubTab(sub.key)}
                    className="interactive-scale"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '2px 0',
                      fontSize: '8.5px',
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? 'var(--m-primary)' : 'var(--m-text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 滚动内容卡片区域 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '60px' }}>
            
            {/* ==================== 1. 发布 Tab (作品/喜欢/收藏) ==================== */}
            {activeMainTab === 'publish' && (
              <>
                {/* 1.1 作品 (我正式发布的动态) */}
                {activeSubTab === 'works' && (
                  myPosts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '2px 0' }}>
                      {myPosts.map(p => {
                        const hasImages = p.images && p.images.length > 0;
                        const isVideo = !!p.videoUrl;
                        return (
                          <div 
                            key={p.id}
                            onClick={() => pushRoute('post-detail', { postId: p.id }, 'profile')}
                            className="interactive-scale"
                            style={{
                              position: 'relative',
                              width: '100%',
                              aspectRatio: '1 / 1',
                              backgroundColor: '#F3F4F6',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer'
                            }}
                          >
                            {hasImages ? (
                              <img src={p.images[0]} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                                <span style={{ fontSize: '7.5px', color: '#FFFFFF', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.2' }}>
                                  {p.content}
                                </span>
                              </div>
                            )}

                            {isVideo && (
                              <div style={{ position: 'absolute', top: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.5)', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                                <Play size={8} fill="#FFFFFF" />
                              </div>
                            )}

                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '2px', color: '#FFFFFF' }}>
                              <Heart size={8} fill={p.liked ? 'var(--m-primary)' : 'none'} stroke={p.liked ? 'var(--m-primary)' : '#FFFFFF'} />
                              <span style={{ fontSize: '7.5px', fontWeight: 800 }}>{p.likeCount}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      {/* 二次元空插图设计 */}
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--m-primary-light)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                        <Smile size={18} className="text-[#E5A9A9]" />
                      </div>
                      <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700 }}>还没有发布过作品哦~</span>
                      <button 
                        onClick={() => openPublishFlow()}
                        className="btn-round btn-primary interactive-scale"
                        style={{ padding: '4px 14px', fontSize: '8px' }}
                      >
                        去发一条
                      </button>

                    </div>
                  )
                )}

                {/* 1.2 喜欢 (我点过赞的动态) */}
                {activeSubTab === 'liked' && (
                  likedPosts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '2px 0' }}>
                      {likedPosts.map(p => {
                        const hasImages = p.images && p.images.length > 0;
                        const isVideo = !!p.videoUrl;
                        return (
                          <div 
                            key={p.id}
                            onClick={() => pushRoute('post-detail', { postId: p.id }, 'profile')}
                            className="interactive-scale"
                            style={{
                              position: 'relative',
                              width: '100%',
                              aspectRatio: '1 / 1',
                              backgroundColor: '#F3F4F6',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer'
                            }}
                          >
                            {hasImages ? (
                              <img src={p.images[0]} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                                <span style={{ fontSize: '7.5px', color: '#FFFFFF', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.2' }}>
                                  {p.content}
                                </span>
                              </div>
                            )}

                            {isVideo && (
                              <div style={{ position: 'absolute', top: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.5)', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                                <Play size={8} fill="#FFFFFF" />
                              </div>
                            )}

                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '2px', color: '#FFFFFF' }}>
                              <Heart size={8} fill="var(--m-primary)" stroke="var(--m-primary)" />
                              <span style={{ fontSize: '7.5px', fontWeight: 800 }}>{p.likeCount}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#E2ECE4', display: 'flex', alignItems: 'center', justify: 'center' }}>
                        <Smile size={18} className="text-[#5B7A63]" />
                      </div>
                      <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700 }}>还没有点赞过其他动态</span>
                    </div>
                  )
                )}

                {/* 1.3 收藏 (我收藏的动态) */}
                {activeSubTab === 'collected' && (
                  collectedPosts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', padding: '2px 0' }}>
                      {collectedPosts.map(p => {
                        const hasImages = p.images && p.images.length > 0;
                        const isVideo = !!p.videoUrl;
                        return (
                          <div 
                            key={p.id}
                            onClick={() => pushRoute('post-detail', { postId: p.id }, 'profile')}
                            className="interactive-scale"
                            style={{
                              position: 'relative',
                              width: '100%',
                              aspectRatio: '1 / 1',
                              backgroundColor: '#F3F4F6',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer'
                            }}
                          >
                            {hasImages ? (
                              <img src={p.images[0]} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                                <span style={{ fontSize: '7.5px', color: '#FFFFFF', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: '1.2' }}>
                                  {p.content}
                                </span>
                              </div>
                            )}

                            {isVideo && (
                              <div style={{ position: 'absolute', top: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.5)', width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                                <Play size={8} fill="#FFFFFF" />
                              </div>
                            )}

                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)', padding: '4px 6px', display: 'flex', alignItems: 'center', gap: '2px', color: '#FFFFFF' }}>
                              <Heart size={8} fill={p.liked ? 'var(--m-primary)' : 'none'} stroke={p.liked ? 'var(--m-primary)' : '#FFFFFF'} />
                              <span style={{ fontSize: '7.5px', fontWeight: 800 }}>{p.likeCount}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--m-secondary-light)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                        <Smile size={18} className="text-[#A8BDD1]" />
                      </div>
                      <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700 }}>还没有收藏过帖子</span>
                    </div>
                  )
                )}
              </>
            )}

            {/* ==================== 2. 草稿箱 Tab ==================== */}
            {activeMainTab === 'drafts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mockDrafts.length > 0 ? (
                  mockDrafts.map(d => (
                    <div 
                      key={d.id}
                      onClick={() => pushRoute('create-post', { draft: d })}
                      className="glass-panel interactive-scale"
                      style={{
                        padding: '10px 12px',
                        borderRadius: '14px',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        border: 'none',
                        boxShadow: 'var(--m-shadow-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      {d.images && d.images[0] ? (
                        <img src={d.images[0]} alt="draft_img" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '6px', color: '#FFFFFF', fontWeight: 800 }}>Text</span>
                        </div>
                      )}
                      <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <h4 style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {d.title || '无标题草稿'}
                        </h4>
                        <p style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {d.content || '暂无内容'}
                        </p>
                        <span style={{ fontSize: '6.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>编辑于 {d.createdAt}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <span style={{ fontSize: '7px', fontWeight: 800, color: 'var(--m-primary)', backgroundColor: 'var(--m-primary-light)', padding: '2px 5px', borderRadius: '4px' }}>
                          {d.type === 'video' ? '视频' : '图文'}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('确定要删除这篇草稿吗？')) {
                              deleteDraft(d.id);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF6384',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--m-text-muted)', fontSize: '8px', fontWeight: 700 }}>
                    草稿箱空空如也
                  </div>
                )}
              </div>
            )}

            {/* ==================== 3. 活动 Tab (合并想去展会与拼团) ==================== */}
            {activeMainTab === 'activities' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* 3.1 拼团活动面基段 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', paddingLeft: '4px' }}>加入的拼团面基</span>
                  {joinedGroups.length > 0 ? (
                    joinedGroups.map(g => (
                      <div 
                        key={g.id}
                        onClick={() => pushRoute('group-detail', { groupId: g.id }, 'profile')}
                        className="glass-panel interactive-scale"
                        style={{
                          padding: '10px 12px',
                          borderRadius: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#FFFFFF',
                          border: 'none',
                          boxShadow: 'var(--m-shadow-sm)'
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <h4 style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', margin: 0 }}>
                            {g.title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Calendar size={9} />
                              {new Date(g.startTime).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })} 14:00
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <MapPin size={9} />
                              {g.city}
                            </span>
                          </div>
                        </div>
                        <span 
                          style={{ 
                            fontSize: '7.5px', 
                            fontWeight: 800, 
                            color: g.creator.name === user.name ? 'var(--m-primary)' : 'var(--m-secondary)', 
                            backgroundColor: g.creator.name === user.name ? 'var(--m-primary-light)' : 'var(--m-secondary-light)',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            marginLeft: '12px'
                          }}
                        >
                          {g.creator.name === user.name ? '主理人' : '已入团'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', color: 'var(--m-text-muted)', fontSize: '8px', fontWeight: 700 }}>
                      尚未加入任何面基拼团，去地图上找找吧~
                    </div>
                  )}
                </div>

                {/* 3.2 想去展会段 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', paddingLeft: '4px' }}>想去的展会活动</span>
                  {wantedActivities.length > 0 ? (
                    wantedActivities.map(a => (
                      <div 
                        key={a.id}
                        onClick={() => pushRoute('activity-detail', { activityId: a.id }, 'profile')}
                        className="glass-panel interactive-scale"
                        style={{
                          padding: '10px',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          backgroundColor: '#FFFFFF',
                          border: 'none',
                          boxShadow: 'var(--m-shadow-sm)'
                        }}
                      >
                        <img 
                          src={a.cover} 
                          alt="cv" 
                          style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <h4 style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', margin: 0 }}>
                            {a.title}
                          </h4>
                          <p style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                            {a.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '12px', color: 'var(--m-text-muted)', fontSize: '8px', fontWeight: 700 }}>
                      尚未标记想去的同好活动
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗：编辑个人资料 */}
      {showEditModal && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', position: 'relative', overflowY: 'auto' }}>
            
            {/* 顶层导航栏 */}
            <div 
              style={{
                height: '48px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--m-border)',
                backgroundColor: 'rgba(255,255,255,0.95)',
                position: 'sticky',
                top: 0,
                zIndex: 110
              }}
            >
              <button 
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--m-text-sub)', fontWeight: 800, cursor: 'pointer' }}
              >
                取消
              </button>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)' }}>编辑资料</span>
              <button 
                onClick={handleSaveProfile}
                className="interactive-scale"
                style={{ 
                  backgroundColor: 'var(--m-primary)', 
                  color: '#FFFFFF', 
                  fontSize: '10px', 
                  fontWeight: 800, 
                  padding: '4px 14px', 
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer' 
                }}
              >
                保存
              </button>
            </div>

            {/* 宽幅封面编辑图区域 (点击更换封面) */}
            <div 
              onClick={handleCycleCover}
              className="interactive-scale"
              style={{
                height: '110px',
                width: '100%',
                backgroundImage: `url(${editCover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 5, color: '#FFFFFF', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                <Camera size={18} />
                <span style={{ fontSize: '8px', fontWeight: 800 }}>点击更换背景图</span>
              </div>
            </div>

            {/* 个人资料设置列表 */}
            <div style={{ padding: '0 16px 40px 16px', marginTop: '-24px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* 可点击更换的相机悬浮头像 */}
              <div style={{ position: 'relative', width: '54px', height: '54px', alignSelf: 'flex-start', cursor: 'pointer' }} onClick={handleCycleAvatar}>
                <img 
                  src={editAvatar} 
                  alt="avatar_edit" 
                  style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFFFFF', boxShadow: 'var(--m-shadow-sm)' }}
                />
                <div style={{ position: 'absolute', inset: '3px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                  <Camera size={14} />
                </div>
              </div>

              {/* 表单项列表 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--m-border)', borderRadius: '14px', overflow: 'hidden' }}>
                
                {/* ID行 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>ID</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={handleCopyId}>
                    <span style={{ fontSize: '9px', color: 'var(--m-text-muted)', fontWeight: 700 }}>{userId}</span>
                    <Copy size={11} className={copied ? 'text-green-500' : 'text-neutral-400'} />
                  </div>
                </div>

                {/* 昵称行 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#FFFFFF' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>昵称</span>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value.substring(0, 12))}
                    style={{
                      border: 'none',
                      textAlign: 'right',
                      fontSize: '9.5px',
                      fontWeight: 800,
                      color: 'var(--m-text-sub)',
                      outline: 'none',
                      padding: 0,
                      width: '120px'
                    }}
                    maxLength={12}
                    placeholder="请输入昵称"
                  />
                </div>

                {/* 性别选择行 */}
                <div 
                  onClick={() => setShowGenderPicker(true)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>性别</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '9.5px', color: 'var(--m-text-sub)', fontWeight: 800 }}>{editGender}</span>
                    <ChevronRight size={12} className="text-neutral-300" />
                  </div>
                </div>

                {/* 生日选择行 */}
                <div 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#FFFFFF', position: 'relative' }}
                >
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>生日</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <input 
                      type="date"
                      value={editBirthday}
                      onChange={(e) => setEditBirthday(e.target.value)}
                      style={{
                        border: 'none',
                        fontSize: '9.5px',
                        fontWeight: 800,
                        color: 'var(--m-text-sub)',
                        outline: 'none',
                        textAlign: 'right',
                        backgroundColor: 'transparent',
                        fontFamily: 'inherit',
                        cursor: 'pointer'
                      }}
                    />
                    <ChevronRight size={12} className="text-neutral-300" />
                  </div>
                </div>

                {/* MBTI选择行 */}
                <div 
                  onClick={() => setShowMbtiPicker(true)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>MBTI</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '9.5px', color: 'var(--m-text-sub)', fontWeight: 800 }}>{editMbti}</span>
                    <ChevronRight size={12} className="text-neutral-300" />
                  </div>
                </div>

                {/* 标签选择行 */}
                <div 
                  onClick={() => setShowTagSelector(true)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>个人设定标签</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '8.5px', color: 'var(--m-primary)', fontWeight: 800 }}>
                      {selectedTags.length > 0 ? `已选 ${selectedTags.length}/8` : '请选择标签'}
                    </span>
                    <ChevronRight size={12} className="text-neutral-300" />
                  </div>
                </div>

              </div>

              {/* 简介 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', paddingLeft: '4px' }}>个人签名</span>
                <div style={{ position: 'relative', width: '100%' }}>
                  <textarea 
                    rows={3}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value.substring(0, 100))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '14px',
                      backgroundColor: '#F6F5F2',
                      border: 'none',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      color: 'var(--m-text-main)',
                      outline: 'none',
                      resize: 'none',
                      lineHeight: '1.4'
                    }}
                    placeholder="介绍一下你吃什么IP，主推什么角色吧~"
                    maxLength={100}
                  />
                  <span style={{ position: 'absolute', bottom: '8px', right: '12px', fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700 }}>
                    {editBio.length}/100
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 性别 Picker */}
          {showGenderPicker && (
            <div 
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 120, display: 'flex', alignItems: 'flex-end' }}
              onClick={() => setShowGenderPicker(false)}
            >
              <div 
                style={{ width: '100%', backgroundColor: '#FFFFFF', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 121 }}
                onClick={e => e.stopPropagation()}
              >
                <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', textAlign: 'center', marginBottom: '8px' }}>选择性别</h4>
                {['男', '女', '双修', '保密'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => {
                      setEditGender(gender);
                      setShowGenderPicker(false);
                    }}
                    className="interactive-scale"
                    style={{
                      width: '100%',
                      padding: '10px 0',
                      fontSize: '9.5px',
                      fontWeight: editGender === gender ? 900 : 500,
                      color: editGender === gender ? 'var(--m-primary)' : 'var(--m-text-main)',
                      backgroundColor: editGender === gender ? 'var(--m-primary-light)' : '#F6F5F2',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MBTI Picker */}
          {showMbtiPicker && (
            <div 
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 120, display: 'flex', alignItems: 'flex-end' }}
              onClick={() => setShowMbtiPicker(false)}
            >
              <div 
                style={{ width: '100%', backgroundColor: '#FFFFFF', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 121 }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0 }}>选择 MBTI 人格设定</h4>
                  <button onClick={() => setShowMbtiPicker(false)} style={{ background: 'none', border: 'none', color: 'var(--m-text-muted)', cursor: 'pointer' }}><X size={14} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {['INFP', 'ENTP', 'INFJ', 'ENFP', 'INTJ', 'ENTJ', 'ISFP', 'ESFP', 'ISTP', 'ESTP', 'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ', '双重人格', '保密'].map(m => (
                    <button
                      key={m}
                      onClick={() => {
                        setEditMbti(m);
                        setShowMbtiPicker(false);
                      }}
                      className="interactive-scale"
                      style={{
                        padding: '8px 0',
                        fontSize: '8.5px',
                        fontWeight: editMbti === m ? 900 : 600,
                        color: editMbti === m ? '#FFFFFF' : 'var(--m-text-sub)',
                        backgroundColor: editMbti === m ? 'var(--m-primary)' : '#F6F5F2',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 标签选择二级全屏 */}
          {showTagSelector && (
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#FFFFFF',
                zIndex: 130,
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              {/* 顶部标签条 */}
              <div 
                style={{
                  height: '48px',
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--m-border)',
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0
                }}
              >
                <button 
                  onClick={() => setShowTagSelector(false)}
                  style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '2px' }}
                >
                  <ArrowLeft size={16} className="text-neutral-700" />
                </button>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)' }}>选择标签</span>
                <button 
                  onClick={() => setShowTagSelector(false)}
                  style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--m-primary)', fontWeight: 800, cursor: 'pointer' }}
                >
                  保存
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0 }}>个人标签</h3>
                  <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700 }}>挑选几个最像你的标签，展示在主页里</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value.substring(0, 8))}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      backgroundColor: '#F6F5F2',
                      border: 'none',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      color: 'var(--m-text-main)',
                      outline: 'none'
                    }}
                    placeholder="写一个自己的标签 (最长8个字)"
                  />
                  <button
                    onClick={handleAddCustomTag}
                    className="interactive-scale"
                    style={{
                      backgroundColor: 'rgba(255, 99, 132, 0.08)',
                      color: 'var(--m-primary)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontSize: '9px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    添加
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>已选择</span>
                    <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700 }}>{selectedTags.length}/8</span>
                  </div>
                  
                  {selectedTags.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '10px', backgroundColor: '#F6F5F2', borderRadius: '12px' }}>
                      {selectedTags.map(tag => (
                        <span 
                          key={tag}
                          onClick={() => toggleSelectTag(tag)}
                          style={{
                            fontSize: '8px',
                            fontWeight: 800,
                            color: 'var(--m-primary)',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--m-primary-light)',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {tag}
                          <X size={8} />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--m-text-muted)', fontSize: '8px', border: '1px dashed var(--m-border)', borderRadius: '12px' }}>
                      还没有选择标签，最多选择 8 个展示在主页
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>人设标签</span>
                    <button 
                      onClick={handleShuffleTags}
                      className="interactive-scale"
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        fontSize: '8px', 
                        color: 'var(--m-primary)', 
                        fontWeight: 800, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '2px',
                        cursor: 'pointer'
                      }}
                    >
                      <RefreshCw size={8} />
                      <span>换一换</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {recommendedTags.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleSelectTag(tag)}
                          className="interactive-scale"
                          style={{
                            fontSize: '8.5px',
                            fontWeight: 700,
                            color: isSelected ? 'var(--m-primary)' : 'var(--m-text-sub)',
                            backgroundColor: isSelected ? 'var(--m-primary-light)' : '#F6F5F2',
                            border: isSelected ? '1px solid var(--m-primary)' : 'none',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* 弹窗：账号设置 */}
      {showSettingsModal && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '80%',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: '#E2E5E8', alignSelf: 'center', marginBottom: '4px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)' }}>账号与系统设置</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--m-text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--m-border)', borderRadius: '14px', overflow: 'hidden', marginTop: '6px', gap: '1px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>允许附近同好通过地图扩列我</span>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--m-primary)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>新拼团审核通过时发送推送通知</span>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--m-primary)' }} />
              </div>

              <div 
                onClick={() => {
                  setCacheSize('0.00 KB');
                  alert('系统缓存清理成功！');
                }}
                className="interactive-scale"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>清除本地运行缓存</span>
                <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700 }}>{cacheSize}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#FFFFFF' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>软件版本</span>
                <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700 }}>v1.2.0 Stable Build</span>
              </div>

            </div>

            <button 
              onClick={() => {
                setShowSettingsModal(false);
                handleLogout();
              }}
              className="interactive-scale"
              style={{
                width: '100%',
                padding: '10px 0',
                fontSize: '9px',
                fontWeight: 800,
                color: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.08)',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '6px'
              }}
            >
              退出当前账号
            </button>
          </div>
        </div>
      )}


    </div>
  );
}

