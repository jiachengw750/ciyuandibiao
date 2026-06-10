import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Sparkles, ChevronRight, Heart, MessageSquare, Star, Compass, Volleyball, Orbit, Edit3, HeartHandshake, ArrowLeft, Trash2, X } from 'lucide-react';

export default function CircleHomepage() {
  const { 
    circles, 
    circleMemberships, 
    toggleJoinCircle,
    posts, 
    toggleLikePost, 
    pushRoute, 
    checkLogin,
    user,
    openPublishFlow
  } = useApp();

  
  // 1. 顶部 Tab 三段式导航：'following' (关注) | 'discover' (发现) | 'circles' (圈子)
  const [activeSubTab, setActiveSubTab] = useState('discover');
  
  // 探索新同好营弹窗控制状态
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [exploreCategory, setExploreCategory] = useState('all');
  
  // 2. 搜索查询、搜索激活与分类胶囊状态
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['排球少年', '吃谷交换', '大悦城快闪']);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [discoverTagFilter, setDiscoverTagFilter] = useState('推荐');

  // 3. 圈子到矢量图标的配合映射
  const getCircleIcon = (id) => {
    switch (id) {
      case 'cir-001':
        return <Volleyball size={16} className="text-[#B56767]" />;
      case 'cir-002':
        return <Compass size={16} className="text-[#5B7A63]" />;
      case 'cir-003':
        return <Orbit size={16} className="text-[#557591]" />;
      case 'cir-004':
        return <Edit3 size={16} className="text-[#845E8B]" />;
      default:
        return <Sparkles size={16} className="text-[#B0B7BD]" />;
    }
  };

  // 4. 过滤圈子列表
  const visibleCircles = useMemo(() => {
    return circles.filter(c => c.status !== 'removed' && c.status !== 'dissolved');
  }, [circles]);

  const filteredCircles = useMemo(() => {
    return visibleCircles.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesTags = c.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTags) return false;
      }
      
      if (categoryFilter === 'anime') {
        return c.tags.includes('运动番') || c.id === 'cir-001';
      }
      if (categoryFilter === 'game') {
        return c.tags.includes('原神') || c.tags.includes('米哈游') || c.id === 'cir-002' || c.id === 'cir-003';
      }
      if (categoryFilter === 'goods') {
        return c.tags.includes('吃谷交换') || c.tags.includes('周边同人') || c.id === 'cir-004';
      }
      
      return true;
    });
  }, [visibleCircles, searchQuery, categoryFilter]);

  const joinedCircles = useMemo(() => {
    return filteredCircles.filter(c => circleMemberships[c.id]);
  }, [filteredCircles, circleMemberships]);

  const recommendedCircles = useMemo(() => {
    return filteredCircles.filter(c => !circleMemberships[c.id]);
  }, [filteredCircles, circleMemberships]);

  const allRecommendedCircles = useMemo(() => {
    return visibleCircles.filter(c => !circleMemberships[c.id]);
  }, [visibleCircles, circleMemberships]);

  const filteredExploreCircles = useMemo(() => {
    return allRecommendedCircles.filter(c => {
      if (exploreCategory === 'all') return true;
      if (exploreCategory === 'anime') {
        return c.tags.includes('运动番') || c.id === 'cir-001';
      }
      if (exploreCategory === 'game') {
        return c.tags.includes('原神') || c.tags.includes('米哈游') || c.id === 'cir-002' || c.id === 'cir-003';
      }
      if (exploreCategory === 'goods') {
        return c.tags.includes('吃谷交换') || c.tags.includes('周边同人') || c.id === 'cir-004';
      }
      return true;
    });
  }, [allRecommendedCircles, exploreCategory]);

  // 5. 动态流逻辑
  const publicPosts = useMemo(() => {
    return posts.filter(p => p.status === 'normal');
  }, [posts]);

  const filteredDiscoverPosts = useMemo(() => {
    let list = publicPosts;
    if (discoverTagFilter === '推荐') {
      return list;
    }
    return list.filter(p => {
      const cleanFilter = discoverTagFilter;
      const hasTopic = p.topics && p.topics.some(t => t.toLowerCase().includes(cleanFilter.toLowerCase()));
      if (hasTopic) return true;

      const hasText = p.content.toLowerCase().includes(cleanFilter.toLowerCase()) || 
                      (p.title && p.title.toLowerCase().includes(cleanFilter.toLowerCase()));
      if (hasText) return true;

      if (cleanFilter === '日常') {
        return !p.topics || p.topics.length === 0 || p.content.includes('今天') || p.content.includes('吐槽') || p.content.includes('日常');
      }
      if (cleanFilter === 'COS返图') {
        return p.content.toLowerCase().includes('cos') || p.content.toLowerCase().includes('coser');
      }
      if (cleanFilter === '原创OC') {
        return p.content.toLowerCase().includes('oc') || p.content.includes('设子') || p.content.includes('设定');
      }
      if (cleanFilter === '同人小说') {
        return p.content.includes('同人') || p.content.includes('小说') || p.content.includes('推文') || p.content.includes('文包');
      }
      if (cleanFilter === '吃谷打卡') {
        return p.content.includes('谷子') || p.content.includes('吃谷') || p.content.includes('排卡') || p.content.includes('立牌') || p.content.includes('徽章') || p.content.includes('痛包');
      }
      return false;
    });
  }, [publicPosts, discoverTagFilter]);

  const followingPosts = useMemo(() => {
    if (!user) return [];
    return posts.filter(p => p.status === 'normal' && circleMemberships[p.circleId]);
  }, [posts, circleMemberships, user]);

  const handleCreateCircleClick = () => {
    checkLogin(() => {
      pushRoute('create-circle');
    });
  };

  // 瀑布流单卡片渲染组件 (高保真二次元风格，无 Emoji)
  const renderWaterfallCard = (p) => {
    const c = circles.find(item => item.id === p.circleId);
    const hasImage = p.images && p.images.length > 0;

    return (
      <div 
        key={p.id}
        onClick={() => pushRoute('post-detail', { postId: p.id }, 'circle_home')}
        className="interactive-scale"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid rgba(226, 229, 232, 0.45)',
          boxShadow: '0 4px 12px rgba(168, 189, 209, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          marginBottom: '8px'
        }}
      >
        {/* 卡片封面图 */}
        {hasImage ? (
          <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
            <img 
              src={p.images[0]} 
              alt="cover" 
              style={{ 
                width: '100%', 
                maxHeight: p.id === 'post-001' ? '180px' : '140px', // 高度参差，展现瀑布流动态感
                minHeight: '100px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {p.images.length > 1 && (
              <span 
                style={{
                  position: 'absolute',
                  right: '6px',
                  bottom: '6px',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: '#FFFFFF',
                  fontSize: '7.5px',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  fontWeight: 800
                }}
              >
                {p.images.length}
              </span>
            )}
          </div>
        ) : (
          /* 纯文字卡片展示精美的渐变色占位 */
          <div 
            style={{ 
              height: '75px', 
              backgroundImage: 'linear-gradient(135deg, rgba(229, 169, 169, 0.1) 0%, rgba(168, 189, 209, 0.1) 100%)', 
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid rgba(226, 229, 232, 0.2)'
            }}
          >
            <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 800, textAlign: 'center', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {p.content}
            </span>
          </div>
        )}

        {/* 卡片信息区 */}
        <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column' }}>
          
          {/* 标题（限制两行） */}
          <h4 
            style={{ 
              fontSize: '8.5px', 
              fontWeight: 800, 
              color: 'var(--m-text-main)', 
              lineHeight: '1.4',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-all'
            }}
          >
            {p.content}
          </h4>

          {/* 所属圈子标签 */}
          {c && (
            <span style={{ fontSize: '7.5px', color: 'var(--m-primary)', fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>
              #{c.name}
            </span>
          )}

          {/* 底部：作者与点赞数 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '0.5px solid rgba(226, 229, 232, 0.3)', paddingTop: '6px' }}>
            
            {/* 作者头像名字 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flex: 1 }}>
              <img 
                src={p.author.avatar} 
                alt="av" 
                style={{ width: '14px', height: '14px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span 
                style={{ 
                  fontSize: '7px', 
                  color: 'var(--m-text-sub)', 
                  textOverflow: 'ellipsis', 
                  overflow: 'hidden', 
                  whiteSpace: 'nowrap' 
                }}
              >
                {p.author.name}
              </span>
            </div>

            {/* 点赞计数 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#A0A5AB', fontSize: '7px', fontWeight: 800 }}>
              <Heart size={8} className={p.liked ? 'fill-current text-rose-400' : ''} />
              <span>{p.likeCount > 1000 ? `${(p.likeCount / 1000).toFixed(1)}k` : p.likeCount}</span>
            </div>

          </div>

        </div>

      </div>
    );
  };

  // 将动态数组均拆分为左右两栏，用于渲染瀑布流
  const renderWaterfallGrid = (postsList) => {
    const leftCol = [];
    const rightCol = [];
    postsList.forEach((postItem, index) => {
      if (index % 2 === 0) {
        leftCol.push(postItem);
      } else {
        rightCol.push(postItem);
      }
    });

    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {leftCol.map(p => renderWaterfallCard(p))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {rightCol.map(p => renderWaterfallCard(p))}
        </div>
      </div>
    );
  };

  // 专用于“同好集市”瀑布流的单卡片渲染
  const renderMarketWaterfallCard = (p) => {
    const c = circles.find(item => item.id === p.circleId);
    const hasImage = p.images && p.images.length > 0;
    const isJoined = c ? circleMemberships[c.id] : false;

    // 为集市动态选用我们本地生成的图库进行插图补齐
    let cardImg = p.images?.[0];
    if (!cardImg) {
      if (p.circleId === 'cir-001') cardImg = '/cover_sakura.png';
      else if (p.circleId === 'cir-002') cardImg = '/cover_sky.png';
      else cardImg = '/cover_muzi.png';
    }

    return (
      <div 
        key={p.id}
        onClick={() => pushRoute('post-detail', { postId: p.id }, 'circle_home')}
        className="interactive-scale"
        style={{
          backgroundColor: 'var(--m-bg-card)',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid #EEEEEE',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          marginBottom: '8px',
          position: 'relative'
        }}
      >
        {/* 卡片封面图 */}
        <div style={{ width: '100%', position: 'relative', overflow: 'hidden' }}>
          <img 
            src={cardImg} 
            alt="cover" 
            style={{ 
              width: '100%', 
              maxHeight: p.id === 'post-001' ? '170px' : '130px', 
              minHeight: '90px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>

        {/* 卡片信息区 */}
        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          
          {/* 标题（限制两行） */}
          <h4 
            style={{ 
              fontSize: '8.5px', 
              fontWeight: 800, 
              color: 'var(--m-text-main)', 
              lineHeight: '1.35',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-all'
            }}
          >
            {p.content}
          </h4>

          {/* 核心：圈子来源标牌与快捷加入按钮 */}
          {c && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                backgroundColor: 'rgba(168, 129, 194, 0.06)', 
                borderRadius: '8px', 
                padding: '4px 6px',
                marginTop: '2px',
                border: '0.5px dashed rgba(168, 129, 194, 0.2)'
              }}
            >
              <span 
                onClick={() => pushRoute('circle-detail', { circleId: c.id }, 'circle_home')}
                style={{ fontSize: '7px', color: 'var(--m-primary)', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60px' }}
              >
                {c.name.replace('同好营', '').replace('同盟', '').replace('分部', '')}
              </span>
              
              <button
                onClick={() => toggleJoinCircle(c.id)}
                className="interactive-scale"
                style={{
                  background: isJoined ? 'none' : 'var(--m-primary)',
                  color: isJoined ? 'var(--m-primary)' : '#FFFFFF',
                  border: isJoined ? 'none' : 'none',
                  fontSize: '6.5px',
                  fontWeight: 800,
                  padding: isJoined ? '0' : '1px 5px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {isJoined ? '已加入' : '+ 加入'}
              </button>
            </div>
          )}

          {/* 底部：作者与点赞数 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', borderTop: '0.5px solid rgba(226, 229, 232, 0.3)', paddingTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', minWidth: 0, flex: 1 }}>
              <img 
                src={p.author.avatar} 
                alt="av" 
                style={{ width: '12px', height: '12px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '6.5px', color: 'var(--m-text-sub)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {p.author.name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#A0A5AB', fontSize: '6.5px', fontWeight: 800 }}>
              <Heart size={7} className={p.liked ? 'fill-current text-rose-400' : ''} />
              <span>{p.likeCount}</span>
            </div>
          </div>

        </div>

      </div>
    );
  };

  const renderMarketWaterfallGrid = (postsList) => {
    const leftCol = [];
    const rightCol = [];
    postsList.forEach((postItem, index) => {
      if (index % 2 === 0) {
        leftCol.push(postItem);
      } else {
        rightCol.push(postItem);
      }
    });

    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {leftCol.map(p => renderMarketWaterfallCard(p))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {rightCol.map(p => renderMarketWaterfallCard(p))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col select-none relative">
      
      {/* 顶部搜索与三段式 Tab 导航区 */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          padding: '12px 16px 0 16px',
          borderBottom: '1px solid var(--m-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '24px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--m-text-main)' }}>
            兴趣同好营
          </h1>
          <button 
            onClick={() => setIsSearchOverlayOpen(true)}
            className="interactive-scale"
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--m-text-sub)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'background-color 0.2s'
            }}
          >
            <Search size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* 三段式 Tab 导航条 */}
        <div 
          style={{
            display: 'flex',
            width: '100%',
            height: '36px',
            marginTop: '4px',
            borderBottom: '2px solid transparent',
            position: 'relative'
          }}
        >
          <button 
            onClick={() => setActiveSubTab('following')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              fontSize: '11px',
              fontWeight: 800,
              color: activeSubTab === 'following' ? 'var(--m-primary)' : 'var(--m-text-sub)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s ease'
            }}
          >
            关注
            {activeSubTab === 'following' && (
              <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '3px', backgroundColor: 'var(--m-primary)', borderRadius: '9999px' }}></div>
            )}
          </button>

          <button 
            onClick={() => setActiveSubTab('discover')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              fontSize: '11px',
              fontWeight: 800,
              color: activeSubTab === 'discover' ? 'var(--m-primary)' : 'var(--m-text-sub)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s ease'
            }}
          >
            发现
            {activeSubTab === 'discover' && (
              <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '3px', backgroundColor: 'var(--m-primary)', borderRadius: '9999px' }}></div>
            )}
          </button>
          
          <button 
            onClick={() => setActiveSubTab('circles')}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              fontSize: '11px',
              fontWeight: 800,
              color: activeSubTab === 'circles' ? 'var(--m-primary)' : 'var(--m-text-sub)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'color 0.2s ease'
            }}
          >
            圈子
            {activeSubTab === 'circles' && (
              <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '3px', backgroundColor: 'var(--m-primary)', borderRadius: '9999px' }}></div>
            )}
          </button>
        </div>

      </div>

      {/* 滚动内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', paddingBottom: '60px' }}>
        
        {/* ============================================================== */}
        {/* 选项卡一：关注流 (双栏瀑布流排版) */}
        {activeSubTab === 'following' && (
          <div>
            {!user ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--m-text-sub)', fontSize: '9.5px' }}>
                请先在右侧状态面板或“我的”页面登录，以同步您关注同好营的专属动态。
              </div>
            ) : followingPosts.length > 0 ? (
              renderWaterfallGrid(followingPosts)
            ) : (
              <div 
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'var(--m-text-sub)',
                  gap: '8px'
                }}
              >
                <HeartHandshake size={32} className="text-neutral-300 animate-pulse" />
                <h4 style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>尚未收到关注更新</h4>
                <p style={{ fontSize: '8.5px', color: 'var(--m-text-muted)', maxWidth: '190px', lineHeight: '1.4' }}>
                  您入驻的同好营最近还没有新动态。可以前往“发现”广场浏览或发布新内容。
                </p>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 选项卡二：发现广场 (双栏瀑布流排版) */}
        {activeSubTab === 'discover' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* 发现广场特有的横向滚动二级分类标签 */}
            <div 
              style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                padding: '4px 4px 10px 4px', 
                borderBottom: '1px solid rgba(226, 229, 232, 0.45)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {['推荐', '日常', 'COS返图', '原创OC', '同人小说', '吃谷打卡'].map(tag => {
                const isActive = discoverTagFilter === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setDiscoverTagFilter(tag)}
                    className="interactive-scale"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '2px 0',
                      fontSize: '9.5px',
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? 'var(--m-primary)' : 'var(--m-text-sub)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{tag}</span>
                    {isActive && (
                      <div 
                        style={{ 
                          width: '100%', 
                          height: '2px', 
                          backgroundColor: 'var(--m-primary)', 
                          borderRadius: '1px',
                          position: 'absolute',
                          bottom: '-10px',
                          left: 0
                        }} 
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {filteredDiscoverPosts.length > 0 ? (
              renderWaterfallGrid(filteredDiscoverPosts)
            ) : (
              <div 
                style={{ 
                  padding: '40px 20px', 
                  textAlign: 'center', 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '12px',
                  border: '1px solid rgba(226, 229, 232, 0.45)',
                  color: 'var(--m-text-muted)', 
                  fontSize: '9px' 
                }}
              >
                该分类下暂时没有公开动态。
              </div>
            )}
          </div>
        )}

        {/* 选项卡三：圈子目录 (重构为第3种推荐：置物架滑轨 + 同好集市瀑布流) */}
        {activeSubTab === 'circles' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* 顶部：同好营置物架 (Stories 圆角卡片横滑轨道，极具沉浸感) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-sub)', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                📌 同好营安利墙 ({circles.length})
              </span>
              
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  overflowX: 'auto', 
                  padding: '4px 4px 8px 4px', 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {/* 探索新同好营虚线卡片 */}
                <div
                  onClick={() => setShowExploreModal(true)}
                  className="interactive-scale"
                  style={{
                    flexShrink: 0,
                    width: '105px',
                    height: '75px',
                    borderRadius: '12px',
                    border: '1.5px dashed var(--m-primary)',
                    backgroundColor: 'rgba(168, 129, 194, 0.05)',
                    padding: '8px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(168, 129, 194, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div 
                      style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '50%', 
                        backgroundColor: '#FFFFFF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: '1px solid var(--m-primary)'
                      }}
                    >
                      <Search size={11} className="text-[#A881C2]" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <h5 style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-primary)', margin: 0 }}>
                      探索新同好营
                    </h5>
                    <span style={{ fontSize: '6.5px', color: 'var(--m-primary)', opacity: 0.8 }}>
                      寻找未加入圈子
                    </span>
                  </div>
                </div>

                {circles.map(c => {
                  const isJoined = circleMemberships[c.id];
                  
                  // 根据同好营配对本地水彩插画
                  let coverImg = '/cover_sakura.png';
                  if (c.id === 'cir-001') coverImg = '/cover_sakura.png';
                  else if (c.id === 'cir-002' || c.id === 'cir-003') coverImg = '/cover_sky.png';
                  else if (c.id === 'cir-004') coverImg = '/cover_muzi.png';

                  return (
                    <div
                      key={c.id}
                      onClick={() => pushRoute('circle-detail', { circleId: c.id }, 'circle_home')}
                      className="interactive-scale"
                      style={{
                        flexShrink: 0,
                        width: '105px',
                        height: '75px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(226,229,232,0.85)',
                        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.88) 100%), url(${coverImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        padding: '8px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(168, 129, 194, 0.03)'
                      }}
                    >
                      {/* 头像 + 快捷按钮 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {c.avatarImg ? (
                          <img 
                            src={c.avatarImg} 
                            alt="c_av" 
                            style={{ 
                              width: '22px', 
                              height: '22px', 
                              borderRadius: '50%', 
                              objectFit: 'cover',
                              border: '1.5px solid #FFFFFF',
                              boxShadow: 'var(--m-shadow-sm)'
                            }}
                          />
                        ) : (
                          <div 
                            style={{ 
                              width: '22px', 
                              height: '22px', 
                              borderRadius: '50%', 
                              backgroundColor: c.avatarBg || '#EBDCD8', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: '8.5px', 
                              fontWeight: 800, 
                              color: 'var(--m-text-main)', 
                              border: '1.5px solid #FFFFFF',
                              boxShadow: 'var(--m-shadow-sm)'
                            }}
                          >
                            {c.avatar.substring(0, 2)}
                          </div>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleJoinCircle(c.id);
                          }}
                          className="interactive-scale"
                          style={{
                            background: isJoined ? 'rgba(168, 129, 194, 0.15)' : 'var(--m-primary)',
                            color: isJoined ? 'var(--m-primary)' : '#FFFFFF',
                            border: 'none',
                            borderRadius: '50%',
                            width: '14px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '8.5px',
                            fontWeight: 900
                          }}
                        >
                          {isJoined ? '✓' : '+'}
                        </button>
                      </div>

                      {/* 标题 */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <h5 
                          style={{ 
                            fontSize: '8.5px', 
                            fontWeight: 800, 
                            color: 'var(--m-text-main)', 
                            margin: 0, 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            maxWidth: '90px' 
                          }}
                        >
                          {c.name}
                        </h5>
                        <span style={{ fontSize: '6.5px', color: 'var(--m-text-muted)' }}>
                          {c.memberCount} 同好
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 底部：同好集市瀑布流 (双列卡片动态展示) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed var(--m-border)', paddingTop: '12px', marginTop: '4px' }}>
              <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-sub)', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🛍️ 逛逛同好集市动态 ({publicPosts.length})
              </span>

              {publicPosts.length > 0 ? (
                renderMarketWaterfallGrid(publicPosts)
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', fontSize: '9px', color: 'var(--m-text-muted)' }}>
                  集市里空空如也，发布第一条动态吧！
                </div>
              )}
            </div>

          </div>
        )}

      </div>


      {/* 悬浮发布按钮已统一由底部导航栏 "+" 承担，此处不再重复 */}
      {/* 抖音级沉浸式全屏搜索层 */}
      {isSearchOverlayOpen && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 120,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* 顶部搜索输入头部 */}
          <div 
            style={{
              height: '44px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid var(--m-border)',
              flexShrink: 0
            }}
          >
            {/* 返回箭头 */}
            <button 
              onClick={() => {
                setIsSearchOverlayOpen(false);
                setSearchQuery('');
              }}
              className="interactive-scale"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--m-text-main)', display: 'flex', alignItems: 'center' }}
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>

            {/* 搜索框输入容器 */}
            <div 
              style={{
                flex: 1,
                height: '30px',
                backgroundColor: '#F0F1F4',
                borderRadius: '9999px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Search size={12} className="text-neutral-400" />
              <input 
                type="text"
                placeholder="搜索同好营、漫展话题、扩列动态..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    if (!searchHistory.includes(searchQuery.trim())) {
                      setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 8));
                    }
                  }
                }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '9.5px',
                  color: 'var(--m-text-main)'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--m-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                >
                  <X size={10} />
                </button>
              )}
            </div>

            {/* 搜索确认按钮 */}
            <button 
              onClick={() => {
                if (searchQuery.trim()) {
                  if (!searchHistory.includes(searchQuery.trim())) {
                    setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 8));
                  }
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '10.5px',
                fontWeight: 800,
                color: searchQuery.trim() ? 'var(--m-primary)' : 'var(--m-text-muted)',
                cursor: 'pointer'
              }}
            >
              搜索
            </button>
          </div>

          {/* 搜索体内容区 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', backgroundColor: '#F8F9FA' }}>
            
            {/* 1. 默认展示推荐话题与历史记录 */}
            {!searchQuery.trim() ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* 历史记录 */}
                {searchHistory.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>历史搜索</span>
                      <button 
                        onClick={() => setSearchHistory([])}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '8px', color: 'var(--m-text-muted)', cursor: 'pointer' }}
                      >
                        <Trash2 size={10} />
                        <span>清空</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {searchHistory.map((item, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '9999px',
                            padding: '4px 10px',
                            border: '1px solid rgba(226,229,232,0.45)'
                          }}
                        >
                          <span 
                            onClick={() => setSearchQuery(item)}
                            style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', cursor: 'pointer', fontWeight: 800 }}
                          >
                            {item}
                          </span>
                          <button 
                            onClick={() => setSearchHistory(prev => prev.filter(h => h !== item))}
                            style={{ background: 'none', border: 'none', color: 'var(--m-text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 猜你想搜 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>猜你想搜</span>
                  
                  <div 
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '14px', 
                      padding: '12px 10px', 
                      border: '1px solid rgba(226,229,232,0.45)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      rowGap: '12px',
                      columnGap: '10px'
                    }}
                  >
                    {[
                      { word: '排球少年快闪展', hot: true },
                      { word: 'CP30漫展面基', hot: true },
                      { word: '原神FES谷子', hot: true },
                      { word: '痛包材料拼单', hot: false },
                      { word: '徐汇痛车打卡', hot: false },
                      { word: '名侦探柯南剧场版', hot: false },
                      { word: '大悦城吃谷地图', hot: false },
                      { word: 'Coser面基扩列', hot: false }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setSearchQuery(item.word);
                          if (!searchHistory.includes(item.word)) {
                            setSearchHistory(prev => [item.word, ...prev].slice(0, 8));
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <span 
                          style={{ 
                            fontSize: '9px', 
                            fontWeight: 900, 
                            color: index < 3 ? 'var(--m-primary)' : 'var(--m-text-muted)',
                            width: '12px'
                          }}
                        >
                          {index + 1}
                        </span>
                        <span style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', fontWeight: 800, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
                          {item.word}
                        </span>
                        {item.hot && (
                          <span style={{ fontSize: '7px', color: '#FF5E5E', fontWeight: 900, backgroundColor: 'rgba(255,94,94,0.1)', padding: '1px 3px', borderRadius: '3px' }}>
                            热
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* 2. 搜索展示结果区 */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* 匹配的同好营 */}
                {filteredCircles.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-muted)' }}>相关同好营</span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {filteredCircles.slice(0, 2).map(c => (
                        <div 
                          key={c.id}
                          onClick={() => {
                            setIsSearchOverlayOpen(false);
                            pushRoute('circle-detail', { circleId: c.id }, 'circle_home');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            padding: '8px 10px',
                            border: '1px solid rgba(226,229,232,0.45)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                            <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: c.avatarBg + '60', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>
                              {c.avatar}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', display: 'block' }}>{c.name}</span>
                              <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)' }}>{c.memberCount} 成员 • {c.intro.substring(0, 15)}...</span>
                            </div>
                          </div>
                          <ChevronRight size={10} className="text-neutral-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 相关的同好动态 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-muted)' }}>相关同好动态</span>
                  {publicPosts.length > 0 ? (
                    renderWaterfallGrid(publicPosts)
                  ) : (
                    <div style={{ padding: '30px', textAlign: 'center', fontSize: '9px', color: 'var(--m-text-muted)', backgroundColor: '#FFFFFF', borderRadius: '12px' }}>
                      未找到相关的同好动态
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}
      {/* 探索新同好营弹窗 */}
      {showExploreModal && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowExploreModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid var(--m-primary)',
              width: '90%',
              maxWidth: '320px',
              maxHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(168, 129, 194, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* 顶部胶带贴纸装饰 */}
            <div 
              style={{
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%) rotate(-2deg)',
                width: '70px',
                height: '16px',
                backgroundColor: 'rgba(168, 129, 194, 0.3)',
                border: '1px dashed var(--m-primary)',
                zIndex: 10
              }}
            />

            {/* 弹窗头部 */}
            <div 
              style={{
                padding: '16px 16px 10px 16px',
                borderBottom: '1px dashed var(--m-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
                marginTop: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} className="text-[#A881C2]" />
                <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0 }}>探索新同好营</h3>
              </div>
              <button 
                onClick={() => setShowExploreModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--m-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* 弹窗分类切换标签 */}
            <div 
              style={{
                display: 'flex',
                gap: '8px',
                padding: '8px 12px 6px 12px',
                borderBottom: '1px dashed var(--m-border)',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                flexShrink: 0
              }}
            >
              {[
                { key: 'all', label: '全部' },
                { key: 'anime', label: '动漫' },
                { key: 'game', label: '游戏' },
                { key: 'goods', label: '吃谷' }
              ].map(cat => {
                const isActive = exploreCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setExploreCategory(cat.key)}
                    className="interactive-scale"
                    style={{
                      background: isActive ? 'var(--m-primary)' : 'rgba(168, 129, 194, 0.08)',
                      color: isActive ? '#FFFFFF' : 'var(--m-text-sub)',
                      border: isActive ? 'none' : '1px dashed rgba(168, 129, 194, 0.3)',
                      borderRadius: '8px',
                      padding: '3px 8px',
                      fontSize: '8px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* 弹窗列表内容 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {allRecommendedCircles.length > 0 ? (
                filteredExploreCircles.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredExploreCircles.map(c => {
                      // 为同好营选用我们本地生成的图库进行插图补齐
                      let coverImg = '/cover_sakura.png';
                      if (c.id === 'cir-001') coverImg = '/cover_sakura.png';
                      else if (c.id === 'cir-002' || c.id === 'cir-003') coverImg = '/cover_sky.png';
                      else if (c.id === 'cir-004') coverImg = '/cover_muzi.png';

                      return (
                        <div 
                          key={c.id}
                          onClick={() => {
                            setShowExploreModal(false);
                            pushRoute('circle-detail', { circleId: c.id }, 'circle_home');
                          }}
                          className="interactive-scale"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#FDFCF7',
                            borderRadius: '12px',
                            padding: '8px 10px',
                            border: '1px solid rgba(168, 129, 194, 0.15)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                            {c.avatarImg ? (
                              <img 
                                src={c.avatarImg} 
                                alt="c_av" 
                                style={{ 
                                  width: '26px', 
                                  height: '26px', 
                                  borderRadius: '50%', 
                                  objectFit: 'cover',
                                  border: '1px solid #FFFFFF',
                                  flexShrink: 0
                                }}
                              />
                            ) : (
                              <div 
                                style={{ 
                                  width: '26px', 
                                  height: '26px', 
                                  borderRadius: '50%', 
                                  backgroundColor: c.avatarBg || '#EBDCD8', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  fontSize: '10px', 
                                  fontWeight: 800,
                                  color: 'var(--m-text-main)',
                                  border: '1px solid #FFFFFF',
                                  flexShrink: 0
                                }}
                              >
                                {c.avatar.substring(0, 2)}
                              </div>
                            )}
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', display: 'block' }}>{c.name}</span>
                              <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)' }}>{c.memberCount} 成员 • {c.intro.substring(0, 15)}...</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleJoinCircle(c.id);
                            }}
                            className="interactive-scale"
                            style={{
                              background: 'var(--m-primary)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              cursor: 'pointer',
                              fontSize: '7.5px',
                              fontWeight: 800
                            }}
                          >
                            + 加入
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--m-text-muted)', fontSize: '8.5px' }}>
                    该分类下的同好营您已全部加入啦！
                  </div>
                )
              ) : (
                <div style={{ padding: '40px 10px', textAlign: 'center', color: 'var(--m-text-muted)', fontSize: '8.5px' }}>
                  🎉 您已加入了所有的同好营！
                </div>
              )}
            </div>
            
            {/* 弹窗底部提示 */}
            <div style={{ padding: '8px 12px', borderTop: '1px dashed var(--m-border)', backgroundColor: '#FAF9F6', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '7px', color: 'var(--m-text-muted)' }}>点击即可查看圈子详情</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
