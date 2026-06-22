import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Bell, Heart, UserPlus, ArrowLeft, ShieldAlert, Trash2, Ban, Flag } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';

export default function MessagePage() {
  const {
    messages,
    pushRoute,
    visibleStrangerMessages,
    deleteConversation,
    deleteStrangerThread,
    blockStranger,
    reportStranger,
    groups,
    user,
    notificationUnreads,
    resetNotificationUnread,
    routeStack
  } = useApp();

  // 支持测试面板一键直达：
  //  params.initialView = 'strangers' 进入即展示陌生人消息
  //  params.initialNotif = 'system'|'likes'|'followers'|'comments' 进入即展示对应通知详情
  const initialParams = routeStack?.[routeStack.length - 1]?.params || {};
  const { initialView, initialNotif, forceEmpty } = initialParams;

  // 测试面板强制演示陌生人消息空状态
  const strangerList = forceEmpty === 'strangers' ? [] : visibleStrangerMessages;

  // 用于控制当前展现哪一类通知详情的二级状态：null (主列表) | 'system' | 'likes' | 'followers' | 'comments'
  const [activeNotificationType, setActiveNotificationType] = useState(initialNotif || null);
  const [showStrangers, setShowStrangers] = useState(initialView === 'strangers');

  // 1. 过滤底部的聊天会话：排除系统通知账号，保留纯粹的群聊与私聊
  const chatConversations = messages.filter(chat => chat.id !== 'chat-sys');

  // 2. 模拟的高保真、零 Emoji 二次元交互通知数据
  // 动态合并：如果登录用户有自己发起的团且有待审核申请，则自动新增为系统审核通知项
  const creatorGroupsWithRequests = groups ? groups.filter(g => g.creator?.name === user?.name && g.pendingRequests?.length > 0) : [];
  const dynamicSystemNotifications = [
    ...creatorGroupsWithRequests.flatMap(g => 
      g.pendingRequests.map(req => ({
        id: `sys-req-${g.id}-${req.id}`,
        title: '入团加入申请审核',
        content: `用户【${req.name}】申请加入您发起的拼团【${g.title}】，留言：“${req.message || '无'}”。点击前往审核。`,
        time: '刚刚',
        groupId: g.id
      }))
    ),
    { id: 'sys-1', title: '拼团审核通知', content: '您发起的【CP30同人谷子交换拼摊】已被系统审核通过，地标已点亮上线。', time: '14:20' },
    { id: 'sys-2', title: '入团申请通过', content: '您申请加入的【原神提瓦特Coser相册互拍团】已被团主通过。开团讨论组已为您自动激活。', time: '昨天' }
  ];

  const mockNotifications = {
    system: dynamicSystemNotifications,
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

  // 登录拦截：未登录用户不展示任何私信/通知内容，仅显示登录引导
  if (!user) {
    return (
      <LoginGuard
        icon={MessageSquare}
        title="登录后查看消息"
        desc="登录环境账户后即可查看私信、群聊与系统通知"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col select-none relative" style={{ backgroundColor: 'var(--m-bg-canvas)' }}>

      {/* 统一头部 */}
      <div
        style={{
          backgroundColor: 'var(--m-bg-card)',
          padding: '12px 16px',
          borderBottom: '1px solid #EEEEEE',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}
      >
	        {(activeNotificationType || showStrangers) && (
	          <button
	            onClick={() => {
	              setActiveNotificationType(null);
	              setShowStrangers(false);
	            }}
            className="interactive-scale"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={16} className="text-neutral-600" />
          </button>
        )}

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{showStrangers ? '陌生人消息' : activeNotificationType ? getNotificationTitle() : '消息中心'}</span>
            <ReqBadge id={showStrangers ? 'MSG-RISK' : activeNotificationType ? 'MSG-NOTIF' : 'MSG-HOME'} style={{ position: 'relative', top: '-1px' }} />
          </h1>
        </div>

        {!activeNotificationType && !showStrangers && (
          <span style={{ fontSize: '8.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>
            即时交流与互动
          </span>
        )}
      </div>

      {/* 滚动内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '60px' }}>

	        {showStrangers ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '10px 12px', borderRadius: '14px', backgroundColor: '#FFF8E7', border: '1px solid #F1D69A', color: '#8C6F3D', fontSize: '8.5px', lineHeight: '1.45', display: 'flex', gap: '8px' }}>
              <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>陌生人回复前最多 3 条纯文本。含联系方式、链接、图片视频或严重涉诈话术会被限制或拦截。</span>
            </div>

            {strangerList.length > 0 ? (
              strangerList.map(thread => (
                <div key={thread.id} style={{ backgroundColor: 'var(--m-bg-card)', borderRadius: '12px', padding: '12px', border: '1px solid #EEEEEE', boxShadow: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div
                    onClick={() => pushRoute('stranger-chat', { threadId: thread.id }, 'messages')}
                    className="interactive-scale"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  >
                    <img src={thread.avatar} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>{thread.sender}</span>
                        <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)' }}>{thread.time}</span>
                      </div>
                      <p style={{ margin: '3px 0 0 0', fontSize: '8px', color: 'var(--m-text-sub)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thread.preview}</p>
                    </div>
                    {thread.riskLevel === 'warning' && (
                      <span style={{ fontSize: '7px', fontWeight: 800, color: '#8C6F3D', backgroundColor: '#FFF8E7', borderRadius: '9999px', padding: '2px 6px' }}>风险</span>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    <button
                      onClick={() => {
                        if (confirm('确定删除这条陌生人会话记录吗？')) deleteStrangerThread(thread.id);
                      }}
                      style={{ border: 'none', borderRadius: '9999px', padding: '6px 0', backgroundColor: '#F8F9FA', color: 'var(--m-text-sub)', fontSize: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', cursor: 'pointer' }}
                    >
                      <Trash2 size={10} /> 删除
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('拉黑后将拒收并隐藏对方消息，确定继续吗？')) blockStranger(thread.id);
                      }}
                      style={{ border: 'none', borderRadius: '9999px', padding: '6px 0', backgroundColor: 'var(--m-slate-light)', color: 'var(--m-text-sub)', fontSize: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', cursor: 'pointer' }}
                    >
                      <Ban size={10} /> 拉黑
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('请选择或输入举报类型：诈骗 / 骚扰 / 虚假信息', '诈骗');
                        if (reason) reportStranger(thread.id, reason);
                      }}
                      style={{ border: 'none', borderRadius: '9999px', padding: '6px 0', backgroundColor: 'rgba(255,99,132,0.08)', color: '#FF6384', fontSize: '8px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', cursor: 'pointer' }}
                    >
                      <Flag size={10} /> 举报
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', backgroundColor: 'var(--m-bg-card)', borderRadius: '12px', border: '1px solid #EEEEEE', color: 'var(--m-text-muted)', fontSize: '9px' }}>
                暂无未处理陌生人消息
              </div>
            )}

            <button
              onClick={() => setShowStrangers(false)}
              className="btn-round btn-secondary interactive-scale"
              style={{ marginTop: '6px', fontSize: '9px', padding: '8px 0', justifyContent: 'center', display: 'flex' }}
            >
              返回聊天列表
            </button>
          </div>
        ) : activeNotificationType ? (
          /* ============================================================== */
          /* 二级界面：展示具体的分类消息通知流 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {mockNotifications[activeNotificationType].map(item => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.groupId) {
                    pushRoute('group-approve', { groupId: item.groupId }, 'messages');
                  }
                }}
                className={item.groupId ? 'interactive-scale' : ''}
                style={{
                  backgroundColor: 'var(--m-bg-card)',
                  borderRadius: '12px',
                  padding: '12px',
                  border: item.groupId ? '1.5px solid var(--m-primary)' : '1px solid #EEEEEE',
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  cursor: item.groupId ? 'pointer' : 'default',
                  position: 'relative'
                }}
              >
                {item.groupId && (
                  <ReqBadge id="GRP-APPLY" style={{ position: 'absolute', top: '-6px', right: '-6px' }} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: item.groupId ? 'var(--m-primary)' : 'var(--m-text-main)' }}>
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
                display: 'flex',
                position: 'relative'
              }}
            >
              返回聊天列表
              <ReqBadge id="MSG-NOTIF" style={{ top: '-10px', right: '-10px' }} />
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
                backgroundColor: 'transparent',
                position: 'relative'
              }}
            >
              <ReqBadge id="MSG-NOTIF" style={{ top: '-10px', right: '-10px' }} />
              {/* 系统消息 */}
              <div
                onClick={() => {
                  setActiveNotificationType('system');
                  resetNotificationUnread('system');
                }}
                className="interactive-scale"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E6D7E8', color: '#7D5591', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--m-shadow-sm)', position: 'relative' }}>
                  <Bell size={16} strokeWidth={2.2} />
                  {notificationUnreads?.system > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#FF6384',
                      color: '#FFFFFF',
                      fontSize: '8px',
                      fontWeight: 800,
                      minWidth: '14px',
                      height: '14px',
                      padding: '0 3px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(255,99,132,0.35)',
                      zIndex: 10
                    }}>
                      {notificationUnreads.system}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--m-text-sub)' }}>系统消息</span>
              </div>

              {/* 赞与收藏 */}
              <div
                onClick={() => {
                  setActiveNotificationType('likes');
                  resetNotificationUnread('likes');
                }}
                className="interactive-scale"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#F5E1E1', color: '#B56767', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--m-shadow-sm)', position: 'relative' }}>
                  <Heart size={16} strokeWidth={2.2} />
                  {notificationUnreads?.likes > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#FF6384',
                      color: '#FFFFFF',
                      fontSize: '8px',
                      fontWeight: 800,
                      minWidth: '14px',
                      height: '14px',
                      padding: '0 3px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(255,99,132,0.35)',
                      zIndex: 10
                    }}>
                      {notificationUnreads.likes}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--m-text-sub)' }}>赞与收藏</span>
              </div>

              {/* 新增关注 */}
              <div
                onClick={() => {
                  setActiveNotificationType('followers');
                  resetNotificationUnread('followers');
                }}
                className="interactive-scale"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E2ECE4', color: '#5B7A63', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--m-shadow-sm)', position: 'relative' }}>
                  <UserPlus size={16} strokeWidth={2.2} />
                  {notificationUnreads?.followers > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#FF6384',
                      color: '#FFFFFF',
                      fontSize: '8px',
                      fontWeight: 800,
                      minWidth: '14px',
                      height: '14px',
                      padding: '0 3px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(255,99,132,0.35)',
                      zIndex: 10
                    }}>
                      {notificationUnreads.followers}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--m-text-sub)' }}>新增关注</span>
              </div>

              {/* 评论与@ */}
              <div
                onClick={() => {
                  setActiveNotificationType('comments');
                  resetNotificationUnread('comments');
                }}
                className="interactive-scale"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E1ECF5', color: '#557591', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--m-shadow-sm)', position: 'relative' }}>
                  <MessageSquare size={16} strokeWidth={2.2} />
                  {notificationUnreads?.comments > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#FF6384',
                      color: '#FFFFFF',
                      fontSize: '8px',
                      fontWeight: 800,
                      minWidth: '14px',
                      height: '14px',
                      padding: '0 3px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(255,99,132,0.35)',
                      zIndex: 10
                    }}>
                      {notificationUnreads.comments}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '8.5px', fontWeight: 700, color: 'var(--m-text-sub)' }}>评论与@</span>
              </div>
            </div>

            {/* 2. 底部会话列表栏 - 重构为大厂通栏列表，去掉硬卡片框，设计重叠群头像 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '4px' }}>
                <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  聊天会话
                  <ReqBadge id="MSG-HOME" style={{ position: 'relative', top: '-1px' }} />
                  <ReqBadge id="MSG-RISK" style={{ position: 'relative', top: '-1px' }} />
                </h3>
                <button
                  onClick={() => setShowStrangers(true)}
                  style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--m-primary)', fontSize: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <ShieldAlert size={10} />
                  陌生人 {visibleStrangerMessages.length}
                </button>
              </div>

              {chatConversations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--m-bg-card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid #EEEEEE' }}>
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
                          backgroundColor: 'transparent',
                          borderBottom: index === chatConversations.length - 1 ? 'none' : '1px solid rgba(226, 229, 232, 0.45)',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>

                          {/* 高保真重叠群头像 (2个真实博主头像重叠 + 1个微缩计数气泡) */}
                          {chat.isGroup ? (
                            <div style={{ position: 'relative', width: '38px', height: '38px', flexShrink: 0 }}>
                              <img
                                src="/avatar_neko.png"
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
                                src="/avatar_cos.png"
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

	                        {/* 右侧未读数与删除 */}
	                        <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
	                          {hasUnread && (
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
	                          )}
	                          {!chat.isGroup && (
	                            <button
	                              onClick={(e) => {
	                                e.stopPropagation();
	                                if (confirm('确定删除这条私聊会话吗？本地记录会清空。')) deleteConversation(chat.id);
	                              }}
	                              style={{ border: 'none', backgroundColor: 'transparent', color: 'var(--m-text-muted)', cursor: 'pointer', padding: '4px' }}
	                            >
	                              <Trash2 size={11} />
	                            </button>
	                          )}
	                        </div>
	                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    padding: '30px',
                    textAlign: 'center',
                    backgroundColor: 'var(--m-bg-card)',
                    borderRadius: '12px',
                    border: '1px solid #EEEEEE',
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
