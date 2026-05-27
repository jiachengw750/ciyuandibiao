import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronRight, MessageSquare, Bell, Heart, UserPlus, ArrowLeft } from 'lucide-react';

export default function MessagePage() {
  const { messages, pushRoute } = useApp();
  
  // 用于控制当前展现哪一类通知详情的二级状态：null (主列表) | 'system' | 'likes' | 'followers' | 'comments'
  const [activeNotificationType, setActiveNotificationType] = useState(null);

  // 1. 过滤底部的聊天会话：排除系统通知账号，保留纯粹的群聊与私聊
  const chatConversations = messages.filter(chat => chat.id !== 'chat-sys');

  // 2. 模拟的高保真、零 Emoji 二次元交互通知数据
  const mockNotifications = {
    system: [
      { id: 'sys-1', title: '拼团审核通知', content: '您发起的【CP30同人谷子交换拼摊】已被系统审核通过，地标已点亮上线。', time: '14:20' },
      { id: 'sys-2', title: '入团申请通过', content: '您申请加入的【原神提瓦特Coser相册互拍团】已被团主通过。开团讨论组已为您自动激活。', time: '昨天' }
    ],
    likes: [
      { id: 'like-1', name: '冷酷松露酱', content: '赞了你的动态：今天在大悦城排队三小时终于拿到了限定立牌！', time: '15:40' },
      { id: 'like-2', name: '提瓦特头号吟游诗人', content: '收藏了你的动态：原神FES入场券抢占与交通避坑指南。', time: '昨天' }
    ],
    followers: [
      { id: 'follow-1', name: '秋叶原常驻喵', content: '关注了你。对方发布的新地标面基动态将优先向您推送。', time: '11:15' },
      { id: 'follow-2', name: '猫又教研组长', content: '与您达成互相关注。你们现在可以互相发送私信进行谷子交换面基。', time: '3天前' }
    ],
    comments: [
      { id: 'comm-1', name: '吃土少女咸鱼', content: '在评论区回复了你：我也去CP30，求扩列！到时可以去摊位找你交换无偿明信片吗？', time: '10:05' },
      { id: 'comm-2', name: '小黑猫_研磨', content: '在提瓦特同盟中提到了你：上次也是这位同好在摊位指路，人超好。', time: '前天' }
    ]
  };

  const getNotificationTitle = () => {
    switch (activeNotificationType) {
      case 'system': return '系统消息';
      case 'likes': return '赞与收藏';
      case 'followers': return '新增关注';
      case 'comments': return '评论与@';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col select-none relative">
      
      {/* 统一头部 */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          padding: '12px 16px',
          borderBottom: '1px solid var(--m-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}
      >
        {activeNotificationType && (
          <button 
            onClick={() => setActiveNotificationType(null)}
            className="interactive-scale"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={16} className="text-neutral-600" />
          </button>
        )}
        
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--m-text-main)' }}>
            {activeNotificationType ? getNotificationTitle() : '消息中心'}
          </h1>
        </div>
        
        {!activeNotificationType && (
          <span style={{ fontSize: '8.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>
            即时交流与互动
          </span>
        )}
      </div>

      {/* 滚动内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '60px' }}>
        
        {activeNotificationType ? (
          /* ============================================================== */
          /* 二级界面：展示具体的分类消息通知流 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockNotifications[activeNotificationType].map(item => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '12px',
                  border: 'none',
                  boxShadow: 'var(--m-shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>
                    {item.name || item.title}
                  </span>
                  <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)' }}>
                    {item.time}
                  </span>
                </div>
                <p style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', lineHeight: '1.4' }}>
                  {item.content}
                </p>
              </div>
            ))}

            <button 
              onClick={() => setActiveNotificationType(null)}
              className="btn-round btn-secondary interactive-scale"
              style={{
                marginTop: '12px',
                fontSize: '9px',
                padding: '8px 0',
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex'
              }}
            >
              返回聊天列表
            </button>
          </div>
        ) : (
          /* ============================================================== */
          /* 主界面：顶部 4 类社交磁贴（去除白色背景大卡片，采用莫兰迪系柔和配色） */
          <>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                padding: '8px 4px',
                backgroundColor: 'transparent'
              }}
            >
              {/* 系统消息 */}
              <div 
                onClick={() => setActiveNotificationType('system')}
                className="interactive-scale"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E6D7E8', color: '#7D5591', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--m-shadow-sm)' }}>
                  <Bell size={16} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--m-text-sub)' }}>系统消息</span>
              </div>

              {/* 赞与收藏 */}
              <div 
                onClick={() => setActiveNotificationType('likes')}
                className="interactive-scale"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#F5E1E1', color: '#B56767', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--m-shadow-sm)' }}>
                  <Heart size={16} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--m-text-sub)' }}>赞与收藏</span>
              </div>

              {/* 新增关注 */}
              <div 
                onClick={() => setActiveNotificationType('followers')}
                className="interactive-scale"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E2ECE4', color: '#5B7A63', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--m-shadow-sm)' }}>
                  <UserPlus size={16} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--m-text-sub)' }}>新增关注</span>
              </div>

              {/* 评论与@ */}
              <div 
                onClick={() => setActiveNotificationType('comments')}
                className="interactive-scale"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E1ECF5', color: '#557591', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--m-shadow-sm)' }}>
                  <MessageSquare size={16} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--m-text-sub)' }}>评论与@</span>
              </div>
            </div>

            {/* 2. 底部会话列表栏 - 重构为大厂通栏列表，去掉硬卡片框，设计重叠群头像 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '4px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>
                  聊天会话
                </h3>
              </div>

              {chatConversations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--m-shadow-sm)' }}>
                  {chatConversations.map((chat, index) => {
                    const hasUnread = chat.unread > 0;
                    return (
                      <div 
                        key={chat.id}
                        onClick={() => pushRoute('chat-window', { chatId: chat.id }, 'messages')}
                        className="interactive-scale"
                        style={{
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          backgroundColor: '#FFFFFF',
                          borderBottom: index === chatConversations.length - 1 ? 'none' : '1px solid rgba(226, 229, 232, 0.45)',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                          
                          {/* 高保真重叠群头像 (2个真实博主头像重叠 + 1个微缩计数气泡) */}
                          {chat.isGroup ? (
                            <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
                              <img 
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=60&h=60&q=80" 
                                style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  border: '1.5px solid #FFFFFF',
                                  objectFit: 'cover',
                                  zIndex: 3
                                }}
                                alt="avatar1"
                              />
                              <img 
                                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=60&h=60&q=80" 
                                style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  right: 0,
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  border: '1.5px solid #FFFFFF',
                                  objectFit: 'cover',
                                  zIndex: 2
                                }}
                                alt="avatar2"
                              />
                              <div 
                                style={{
                                  position: 'absolute',
                                  top: '2px',
                                  right: '2px',
                                  width: '15px',
                                  height: '15px',
                                  borderRadius: '50%',
                                  border: '1px solid #FFFFFF',
                                  backgroundColor: '#E5A9A9',
                                  color: '#FFFFFF',
                                  fontSize: '7px',
                                  fontWeight: 900,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  zIndex: 1
                                }}
                              >
                                +3
                              </div>
                            </div>
                          ) : (
                            <div 
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--m-primary-light)',
                                color: 'var(--m-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 800,
                                flexShrink: 0
                              }}
                            >
                              <MessageSquare size={18} strokeWidth={2.2} />
                            </div>
                          )}

                          <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>
                                {chat.title}
                              </span>
                              <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 500 }}>
                                {chat.time}
                              </span>
                            </div>
                            <p 
                              style={{
                                fontSize: '8px',
                                color: 'var(--m-text-sub)',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                margin: 0
                              }}
                            >
                              {chat.lastMessage}
                            </p>
                          </div>
                        </div>

                        {/* 右侧未读数展示 (去除多余的右箭头，使视觉更干净) */}
                        {hasUnread && (
                          <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                            <span 
                              style={{
                                backgroundColor: '#E5A9A9',
                                color: '#FFFFFF',
                                fontSize: '8px',
                                fontWeight: 800,
                                minWidth: '13px',
                                height: '13px',
                                padding: '0 3px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(229,169,169,0.3)'
                              }}
                            >
                              {chat.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div 
                  style={{
                    padding: '30px',
                    textAlign: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(226, 229, 232, 0.45)',
                    color: 'var(--m-text-muted)',
                    fontSize: '9px'
                  }}
                >
                  暂无活跃聊天会话。参与面基拼团或私聊其他同好后将自动开启。
                </div>
              )}

              {/* 会话列表底部的轻量感装饰，消除空旷感 */}
              <div style={{ textAlign: 'center', margin: '24px 0 10px 0', opacity: 0.35 }}>
                <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', letterSpacing: '1px', fontWeight: 800 }}>
                  — 暂无更多会话 —
                </span>
              </div>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
