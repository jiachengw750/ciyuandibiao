import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Heart, MessageSquare, Send, ChevronLeft, ChevronRight, Share2, Star, MessageCircle, AlertCircle } from 'lucide-react';

export default function PostDetailPage() {
  const { routeStack, popRoute, posts, toggleLikePost, addCommentToPost, circles } = useApp();
  const [commentText, setCommentText] = useState('');

  // 1. 获取当前动态
  const currentRoute = routeStack[routeStack.length - 1];
  const postId = currentRoute.params.postId;
  const post = posts.find(p => p.id === postId && p.status === 'normal');

  if (!post) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#F6F5F2', height: '100%' }}>
        <AlertCircle size={32} className="text-rose-400 mx-auto" />
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)', marginTop: '8px' }}>该动态不存在或已被删除</h3>
        <button 
          onClick={popRoute}
          className="btn-round btn-secondary interactive-scale"
          style={{ marginTop: '12px', fontSize: '9px', padding: '6px 16px' }}
        >
          返回上一页
        </button>
      </div>
    );
  }

  const c = circles.find(item => item.id === post.circleId);

  // 2. 发送评论
  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToPost(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="w-full h-full bg-[#FFFFFF] flex flex-col relative select-none">
      
      {/* 1. 顶部粘性动作栏 (返回、作者头像、关注按钮、分享) */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid rgba(226, 229, 232, 0.5)',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          zIndex: 50,
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <button 
            onClick={popRoute}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
          >
            <ChevronLeft size={18} className="text-neutral-700" />
          </button>
          
          {/* 作者名片 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <img 
              src={post.author.avatar} 
              alt="avatar" 
              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '0.5px solid var(--m-border)' }}
            />
            <span 
              style={{ 
                fontSize: '9px', 
                fontWeight: 800, 
                color: 'var(--m-text-main)', 
                textOverflow: 'ellipsis', 
                overflow: 'hidden', 
                whiteSpace: 'nowrap',
                maxWidth: '90px'
              }}
            >
              {post.author.name}
            </span>
          </div>
          
          {/* 关注按钮 */}
          <button 
            className="interactive-scale"
            style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'var(--m-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '7.5px',
              fontWeight: 800,
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            关注
          </button>
        </div>

        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          <Share2 size={13} className="text-neutral-500" />
        </button>
      </div>

      {/* 主滚动内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '60px' }}>
        
        {/* 2. 顶部大画幅配图区域 */}
        {post.images && post.images.length > 0 && (
          <div style={{ width: '100%', position: 'relative', backgroundColor: '#F0F1F4' }}>
            <img 
              src={post.images[0]} 
              alt="mainpic" 
              style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
            />
            
            {/* 265人圈评热聊胶囊 */}
            <div 
              style={{
                position: 'absolute',
                left: '12px',
                top: '12px',
                backgroundColor: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                borderRadius: '9999px',
                padding: '3px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                color: '#FFFFFF',
                fontSize: '7px',
                fontWeight: 700
              }}
            >
              <span>265人正在讨论</span>
              <ChevronRight size={8} />
            </div>

            {post.images.length > 1 && (
              <div 
                style={{
                  position: 'absolute',
                  right: '12px',
                  bottom: '12px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#FFFFFF',
                  fontSize: '7.5px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '9999px'
                }}
              >
                1 / {post.images.length}
              </div>
            )}
          </div>
        )}

        {/* 3. 详情与正文排版 */}
        <div style={{ padding: '16px 14px' }}>
          
          {/* 大标题 & 月度榜单徽章 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 900, color: 'var(--m-text-main)', lineHeight: '1.4' }}>
              {post.title || (c ? `地标面基：${c.name}心得分享` : '同好聚会心得分享')}
            </h2>
            
            {c && (
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start' }}>
                <span 
                  style={{
                    backgroundColor: 'rgba(218, 184, 107, 0.12)',
                    color: '#C49830',
                    fontSize: '7px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <Star size={8} className="fill-current" />
                  {c.name}热度分享榜 Top 1
                </span>
              </div>
            )}
          </div>

          {/* 正文 (杂志般的舒展行高) */}
          <p 
            style={{ 
              fontSize: '9.5px', 
              color: 'var(--m-text-sub)', 
              lineHeight: '1.6', 
              margin: '14px 0',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {post.content}
          </p>

          {/* 二次元胶囊标签组 (#猗窝座 #童磨) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
            {c?.tags.map((tag, idx) => (
              <span 
                key={idx} 
                style={{
                  backgroundColor: '#F0F1F4',
                  color: 'var(--m-text-sub)',
                  fontSize: '7.5px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}
              >
                #{tag}
              </span>
            ))}
            <span 
              style={{
                backgroundColor: '#F0F1F4',
                color: 'var(--m-text-sub)',
                fontSize: '7.5px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px'
              }}
            >
              #面基扩列
            </span>
          </div>

          {/* 编辑日期与热度 */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              fontSize: '7.5px', 
              color: 'var(--m-text-muted)',
              borderBottom: '1px solid rgba(226, 229, 232, 0.45)',
              paddingBottom: '14px',
              marginBottom: '14px'
            }}
          >
            <span>编辑于 {post.createdAt} • 离线沙盒</span>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>热度 {post.likeCount * 8 + 120}</span>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: post.collected ? '#C49830' : 'var(--m-text-muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '2px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                <Star size={10} className={post.collected ? 'fill-current' : ''} />
                <span>{post.collected ? '已收藏' : '收藏'}</span>
              </button>
            </div>
          </div>

          {/* 4. 盖楼评论区 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', marginBottom: '4px' }}>
              热门评论 ({post.comments.length})
            </h3>
            
            {post.comments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {post.comments.map((comm, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    
                    {/* 评论主楼层 */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
                      <div 
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--m-primary-light)',
                          color: 'var(--m-primary)',
                          fontSize: '8px',
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {comm.author.substring(0, 1)}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>{comm.author}</span>
                          <span style={{ fontSize: '7px', color: 'var(--m-text-muted)' }}>{comm.time}</span>
                        </div>
                        <p style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', lineHeight: '1.4', marginTop: '1px' }}>
                          {comm.content}
                        </p>
                      </div>

                      {/* 楼层心形点赞 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--m-text-muted)', cursor: 'pointer' }}>
                        <Heart size={8} />
                        <span style={{ fontSize: '6px', fontWeight: 800 }}>82</span>
                      </div>
                    </div>

                    {/* 模拟的子回复折叠层级 */}
                    {idx === 0 && (
                      <div 
                        style={{
                          marginLeft: '30px',
                          paddingLeft: '6px',
                          borderLeft: '1.5px solid rgba(226, 229, 232, 0.6)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          marginTop: '2px'
                        }}
                      >
                        <span style={{ fontSize: '7.5px', color: 'var(--m-primary)', fontWeight: 800, cursor: 'pointer' }}>
                          — 展开更多 3 条回复
                        </span>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', textAlign: 'center', display: 'block', padding: '16px 0' }}>
                暂无同好评论。写下第一条评论，开启话题吧！
              </span>
            )}
          </div>

        </div>

      </div>

      {/* 5. 底部悬浮评论工具栏 (分离式输入框 + 赞、评、转) */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '52px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid rgba(226, 229, 232, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          zIndex: 50
        }}
      >
        {/* 输入表单 */}
        <form onSubmit={handleSendComment} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px' }}>
          <input 
            type="text" 
            placeholder="留条评论，说说感想..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            style={{
              flex: 1,
              height: '32px',
              borderRadius: '9999px',
              border: 'none',
              padding: '0 14px',
              fontSize: '9.5px',
              color: 'var(--m-text-main)',
              backgroundColor: '#F0F1F4',
              outline: 'none'
            }}
          />
          <button 
            type="submit"
            className="btn-round btn-primary interactive-scale"
            style={{
              height: '32px',
              width: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Send size={11} />
          </button>
        </form>

        {/* 右侧反馈按钮组 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          <button 
            onClick={() => toggleLikePost(post.id)}
            style={{
              background: 'none',
              border: 'none',
              color: post.liked ? 'var(--m-primary)' : 'var(--m-text-sub)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 0
            }}
          >
            <Heart size={14} className={post.liked ? 'fill-current text-rose-400' : ''} />
            <span style={{ fontSize: '6px', fontWeight: 800, marginTop: '1px' }}>{post.likeCount}</span>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--m-text-sub)' }}>
            <MessageCircle size={14} />
            <span style={{ fontSize: '6px', fontWeight: 800, marginTop: '1px' }}>{post.comments.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--m-text-sub)', cursor: 'pointer' }}>
            <Share2 size={14} />
            <span style={{ fontSize: '6px', fontWeight: 800, marginTop: '1px' }}>分享</span>
          </div>
        </div>
      </div>

    </div>
  );
}
