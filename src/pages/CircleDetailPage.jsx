import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, BookOpen, Plus, Heart, MessageSquare, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';

export default function CircleDetailPage() {
  const { 
    routeStack, 
    circles, 
    circleMemberships, 
    toggleJoinCircle, 
    posts, 
    toggleLikePost, 
    pushRoute, 
    popRoute,
    checkLogin,
    openPublishFlow
  } = useApp();

  const [showActionSheet, setShowActionSheet] = useState(false);


  const currentRoute = routeStack[routeStack.length - 1];
  const circleId = currentRoute.params.circleId;

  // 1. 获取圈子与动态
  const circle = circles.find(c => c.id === circleId);
  const circlePosts = posts.filter(p => p.circleId === circleId && p.status === 'normal');
  const isJoined = !!circleMemberships[circleId];

  if (!circle) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>圈子同好营不存在</h3>
      </div>
    );
  }

  const handleCreatePostClick = () => {
    checkLogin(() => {
      openPublishFlow(circleId);
    });
  };


  // 根据圈子ID返回对应的精美封面插图
  const getCircleCover = (id) => {
    const found = circles.find(c => c.id === id);
    if (found && found.coverImg) return found.coverImg;
    switch (id) {
      case 'cir-001':
        return '/cover_sakura.png'; // 运动番
      case 'cir-002':
        return '/cover_sky.png'; // 原神
      case 'cir-003':
        return '/cover_sky.png'; // 铁道/群星
      case 'cir-004':
        return '/cover_muzi.png'; // 同人创作/漫展
      default:
        return '/cover_muzi.png';
    }
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      
      {/* 顶部沉浸式大封面背景 */}
      <div 
        style={{ 
          height: '110px', 
          width: '100%', 
          position: 'relative', 
          backgroundImage: `url(${getCircleCover(circle.id)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0
        }}
      >
        {/* 暗色渐变罩幕，确保返回按钮清晰可见 */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)'
          }}
        />

        {/* 返回按钮 */}
        <button 
          onClick={popRoute}
          className="interactive-scale"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: 'none',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 15
          }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
        </button>

        {/* 更多选项三点按钮（仅在已加入时可见） */}
        {isJoined && (
          <button 
            onClick={() => setShowActionSheet(true)}
            className="interactive-scale"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 15
            }}
          >
            <MoreHorizontal size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* 圈子信息描述区块（白色卡片半重叠效果） */}
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
        {/* 半悬浮Squircle头像 */}
        <div 
          style={{ 
            width: '54px', 
            height: '54px', 
            borderRadius: '16px', 
            backgroundColor: circle.avatarBg, 
            border: '3px solid #FFFFFF', 
            position: 'absolute', 
            top: '-27px', 
            left: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '18px', 
            fontWeight: 900, 
            color: 'var(--m-text-main)', 
            boxShadow: 'var(--m-shadow-sm)',
            zIndex: 12
          }}
        >
          {circle.avatarImg ? (
            <img 
              src={circle.avatarImg} 
              alt="circle_avatar" 
              style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '13px', 
                objectFit: 'cover' 
              }} 
            />
          ) : (
            circle.avatar.substring(0, 2)
          )}
        </div>

        {/* 标题与基本统计信息 (头像在左侧悬浮，文字整体右移留出空隙) */}
        <div style={{ marginLeft: '62px', minHeight: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)', lineHeight: '1.2', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{circle.name}</span>
            <ReqBadge id="CIR-DETAIL" style={{ position: 'relative', top: '-1px' }} />
          </h2>
          
          <div style={{ display: 'flex', gap: '8px', fontSize: '8px', color: 'var(--m-text-muted)', marginTop: '2px', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Users size={9} />
              {circle.memberCount} 成员
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <BookOpen size={9} />
              {circlePosts.length} 动态
            </span>
          </div>
        </div>

        {/* 圈子简介 (去除呆板的“介绍：”前缀，使用淡雅的引用排版) */}
        <p style={{ fontSize: '9px', color: 'var(--m-text-sub)', lineHeight: '1.4', margin: '4px 0 2px 0' }}>
          {circle.intro}
        </p>

        {/* 标签栏 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {circle.tags.map((t, idx) => (
            <span 
              key={idx} 
              style={{
                fontSize: '8px',
                fontWeight: 700,
                color: 'var(--m-text-sub)',
                backgroundColor: 'var(--m-slate-light)',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* 圈子内的动态流 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: isJoined ? '20px' : '64px' }}>
        
        {circlePosts.length > 0 ? (
          circlePosts.map(p => (
            <div 
              key={p.id}
              onClick={() => pushRoute('post-detail', { postId: p.id }, 'circle_detail')}
              className="glass-panel interactive-scale"
              style={{
                padding: '10px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                cursor: 'pointer',
                border: 'none',
                boxShadow: 'var(--m-shadow-sm)'
              }}
            >
              {/* 作者 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <img 
                  src={p.author.avatar} 
                  alt="avatar" 
                  style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-main)', display: 'block' }}>{p.author.name}</span>
                  <span style={{ fontSize: '7px', color: 'var(--m-text-muted)', display: 'block' }}>{p.createdAt}</span>
                </div>
              </div>

              {/* 内容 */}
              <p style={{ fontSize: '9px', color: 'var(--m-text-sub)', lineHeight: '1.4' }}>
                {p.content}
              </p>

              {/* 缩略图 */}
              {p.images && p.images.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                  {p.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img} 
                      alt="thumb" 
                      style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', border: '0.5px solid var(--m-border)' }}
                    />
                  ))}
                </div>
              )}

              {/* 底部点赞和评论计数 */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(226, 229, 232, 0.45)',
                  paddingTop: '6px',
                  fontSize: '8px',
                  fontWeight: 700,
                  color: 'var(--m-text-muted)'
                }}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLikePost(p.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: p.liked ? 'var(--m-primary)' : 'var(--m-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    padding: 0
                  }}
                >
                  <Heart size={10} className={p.liked ? 'fill-current' : ''} />
                  <span>点赞 {p.likeCount}</span>
                </button>
                
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <MessageSquare size={10} />
                  <span>评论 {p.comments.length}</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--m-text-muted)', fontSize: '9px', position: 'relative' }}>
            <ReqBadge id="CIR-DETAIL" style={{ top: '8px', right: '8px' }} />
            本同好营还没有人发布动态，快来做第一个发言的人吧！
          </div>
        )}

      </div>

      {/* 底部右侧悬浮发布按钮 */}
      {isJoined ? (
        <button 
          onClick={handleCreatePostClick}
          className="btn-round btn-primary interactive-scale"
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            padding: '8px 16px',
            fontSize: '9.5px',
            boxShadow: 'var(--m-shadow-lg)',
            zIndex: 42,
            gap: '2px'
          }}
          >
            <Plus size={12} strokeWidth={2.5} />
            <span>发动态</span>
            <ReqBadge id="CIR-DETAIL" style={{ top: '-10px', right: '-10px' }} />
          </button>
      ) : (
        /* 未加入同好营时：高保真悬浮毛玻璃胶囊提示栏，单点引导更强 */
        <div 
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(226, 229, 232, 0.75)',
            borderRadius: '9999px',
            padding: '6px 6px 6px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            zIndex: 42,
            boxShadow: 'var(--m-shadow-lg)'
          }}
        >
          <span style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', fontWeight: 800 }}>
            加入同好营解锁发帖权限
          </span>
          <button 
            onClick={() => toggleJoinCircle(circle.id)}
            className="btn-round btn-primary interactive-scale"
            style={{ 
              padding: '6px 16px', 
              fontSize: '8.5px', 
              height: '24px', 
              display: 'flex', 
              alignItems: 'center',
              position: 'relative'
            }}
          >
            一键加入
            <ReqBadge id="CIR-DETAIL" style={{ top: '-10px', right: '-10px' }} />
          </button>
        </div>
      )}

      {/* 底部 Action Sheet 弹出操作面板 */}
      {showActionSheet && (
        <div 
          onClick={() => setShowActionSheet(false)}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              width: '100%',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '12px 16px 24px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 -4px 16px rgba(0,0,0,0.1)',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            <div style={{ width: '32px', height: '4px', backgroundColor: '#E2E5E8', borderRadius: '2px', alignSelf: 'center', marginBottom: '8px' }} />

            <button 
              onClick={() => {
                setShowActionSheet(false);
                setTimeout(() => {
                  if (window.confirm(`确定要退出【${circle.name}】吗？退出后您将失去发动态和互动的权限。`)) {
                    toggleJoinCircle(circle.id);
                  }
                }, 100);
              }}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 94, 94, 0.08)',
                color: '#FF5E5E',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              退出同好营
            </button>

            <button 
              onClick={() => setShowActionSheet(false)}
              style={{
                width: '100%',
                backgroundColor: 'var(--m-slate-light)',
                color: 'var(--m-text-sub)',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
