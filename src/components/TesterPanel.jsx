import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, RefreshCw, MapPin, UserCheck, Eye } from 'lucide-react';

export default function TesterPanel() {
  const {
    user,
    setUser,
    handleLogout,
    handleLoginSuccess,
    activities,
    setActivities,
    groups,
    setGroups,
    pushRoute
  } = useApp();

  // 导航按钮样式
  const navButtonStyle = {
    fontSize: '8px',
    textAlign: 'left',
    padding: '6px 10px',
    borderRadius: '6px',
    backgroundColor: '#16161A',
    border: '1px solid #333',
    color: '#C5C6C7',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  // 1. 重置所有模拟数据
  const handleResetData = () => {
    window.location.reload();
  };

  // 2. 切换活动状态
  const changeActivityStatus = (id, newStatus) => {
    setActivities(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  // 3. 模拟其他人提交加入申请
  const simulateIncomingRequest = (groupId) => {
    const randomUsers = [
      { name: '冷酷松露酱', avatar: '/avatar_poet.png', msg: '求过！排少谷子带了黑尾和列夫！' },
      { name: '秋叶原常驻喵', avatar: '/avatar_neko.png', msg: '互拍搭子，带单反设备！' },
      { name: '吃土少女咸鱼', avatar: '/avatar_muzi.png', msg: 'CP搭火锅，我饭量大但能说会道！' }
    ];
    const pick = randomUsers[Math.floor(Math.random() * randomUsers.length)];
    
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          pendingRequests: [
            ...g.pendingRequests,
            {
              id: `req-sim-${Date.now()}`,
              name: pick.name,
              avatar: pick.avatar,
              message: pick.msg
            }
          ]
        };
      }
      return g;
    }));
    alert(`已为拼团【${groups.find(g => g.id === groupId)?.title.substring(0, 10)}...】模拟收到新团员申请！`);
  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#16161A',
        borderLeft: '1px solid #232329',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflowY: 'auto',
        color: '#C5C6C7'
      }}
    >
      
      {/* 标题头部 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #232329', paddingBottom: '12px' }}>
        <Shield size={18} color="var(--m-primary)" />
        <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>
          次元地标沙盒状态管理器
        </h2>
      </div>

      {/* 第一部分：登录用户模拟 */}
      <div style={{ backgroundColor: '#1E1E24', borderRadius: '14px', padding: '12px', border: '1px solid #2C2C35' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--m-primary)', marginBottom: '8px', textTransform: 'uppercase' }}>
          当前登录环境
        </h3>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={user.avatar} 
              alt="avatar" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectCover: 'cover', border: '1px solid #333' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#FFF', display: 'block' }}>{user.name}</span>
              <span style={{ fontSize: '8px', color: '#888', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.bio}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                fontSize: '8px',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                color: '#FF6384',
                border: '1px solid rgba(255, 99, 132, 0.2)',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              登出
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
            <span style={{ fontSize: '9px', color: '#888' }}>当前未登录游客身份</span>
            <button 
              onClick={handleLoginSuccess}
              style={{
                fontSize: '8px',
                fontWeight: 700,
                backgroundColor: 'rgba(229, 169, 169, 0.15)',
                color: 'var(--m-primary)',
                border: '1px solid rgba(229, 169, 169, 0.3)',
                padding: '4px 8px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              登录默认用户
            </button>
          </div>
        )}
      </div>

      {/* 第二部分：状态机事件触发器 */}
      <div style={{ backgroundColor: '#1E1E24', borderRadius: '14px', padding: '12px', border: '1px solid #2C2C35', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--m-primary)', textTransform: 'uppercase' }}>
          地标状态变更模拟
        </h3>

        {/* 漫展状态 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#AAA' }}>漫展点位状态切换：</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button 
              onClick={() => changeActivityStatus('act-003', 'ongoing')}
              style={{ fontSize: '8px', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#16161A', color: '#FFF', cursor: 'pointer' }}
            >
              {"大悦城快闪 -> 进行中"}
            </button>
            <button 
              onClick={() => changeActivityStatus('act-003', 'ended')}
              style={{ fontSize: '8px', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#16161A', color: '#FFF', cursor: 'pointer' }}
            >
              {"大悦城快闪 -> 已结束"}
            </button>
            <button 
              onClick={() => changeActivityStatus('act-001', 'ongoing')}
              style={{ fontSize: '8px', padding: '3px 6px', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#16161A', color: '#FFF', cursor: 'pointer' }}
            >
              {"CP30 -> 进行中"}
            </button>
          </div>
        </div>

        {/* 拼团申请模拟 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #2C2C35', paddingTop: '8px' }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#AAA' }}>他人入团申请触发：</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {groups.map(g => (
              <button 
                key={g.id}
                onClick={() => simulateIncomingRequest(g.id)}
                style={{
                  fontSize: '8px',
                  textAlign: 'left',
                  padding: '5px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#16161A',
                  border: '1px solid #333',
                  color: '#C5C6C7',
                  cursor: 'pointer',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                + 申请本团: {g.title.substring(0, 16)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 第二点五部分：页面导航列表 */}
      <div style={{ backgroundColor: '#1E1E24', borderRadius: '14px', padding: '12px', border: '1px solid #2C2C35', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--m-primary)', textTransform: 'uppercase' }}>
          📱 所有页面快速导航
        </h3>

        {/* PRD-02 圈子模块 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>PRD-02 圈子模块</span>
          <button onClick={() => pushRoute('circles', {}, 'tester')} style={navButtonStyle}>
            同好营首页（发现/关注/圈子）
          </button>
          <button onClick={() => pushRoute('circle-detail', { circleId: 'cir-001' }, 'tester')} style={navButtonStyle}>
            圈子详情页
          </button>
          <button onClick={() => pushRoute('post-detail', { postId: 'post-001' }, 'tester')} style={navButtonStyle}>
            动态详情页
          </button>
          <button onClick={() => pushRoute('create-post', { circleId: 'cir-001' }, 'tester')} style={navButtonStyle}>
            发布动态页
          </button>
        </div>

        {/* PRD-03 活动模块 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>PRD-03 活动模块</span>
          <button onClick={() => pushRoute('activities', {}, 'tester')} style={navButtonStyle}>
            活动列表页
          </button>
          <button onClick={() => pushRoute('activity-detail', { activityId: 'act-001' }, 'tester')} style={navButtonStyle}>
            活动详情页
          </button>
        </div>

        {/* PRD-04 消息模块 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>PRD-04 消息模块（需登录）</span>
          <button onClick={() => { handleLoginSuccess(); pushRoute('messages', {}, 'tester'); }} style={navButtonStyle}>
            消息中心
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('chat-window', { chatId: 'chat-001' }, 'tester'); }} style={navButtonStyle}>
            开团群聊天窗口
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('stranger-chat', { threadId: 'str-001' }, 'tester'); }} style={navButtonStyle}>
            陌生人私聊窗口
          </button>
        </div>

        {/* PRD-05 个人主页 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>PRD-05 个人主页</span>
          <button onClick={() => { handleLoginSuccess(); pushRoute('profile', {}, 'tester'); }} style={navButtonStyle}>
            我的主页（5个Tab）- 已登录
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('profile', { userId: 'user-002' }, 'tester'); }} style={navButtonStyle}>
            他人主页 - 已登录
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('social-list', { type: 'followers' }, 'tester'); }} style={navButtonStyle}>
            粉丝/关注列表（需登录）
          </button>
        </div>

        {/* PRD-06 开团模块 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>PRD-06 开团模块</span>
          <button onClick={() => pushRoute('group-detail', { groupId: 'grp-001' }, 'tester')} style={navButtonStyle}>
            拼团详情页（游客可看）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('create-group', { activityId: 'act-001' }, 'tester'); }} style={navButtonStyle}>
            创建拼团页（需登录）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('group-approve', { groupId: 'grp-001' }, 'tester'); }} style={navButtonStyle}>
            团主审批页（需登录+团主身份）
          </button>
        </div>

        {/* PRD-08 票务&KYC模块 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>PRD-08 票务&KYC模块（需登录）</span>
          <button onClick={() => { handleLoginSuccess(); pushRoute('ticket-select', { activityId: 'act-001' }, 'tester'); }} style={navButtonStyle}>
            票种选择页
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('kyc', { activityId: 'act-001', ticketType: 'normal' }, 'tester'); }} style={navButtonStyle}>
            实名认证页
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('coser-info', { activityId: 'act-001', ticketType: 'coser', realName: '张三', idNumber: '310101199001011234' }, 'tester'); }} style={navButtonStyle}>
            Coser服装信息采集
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('payment', { activityId: 'act-001', ticketType: 'normal', realName: '张三', idNumber: '310101199001011234' }, 'tester'); }} style={navButtonStyle}>
            支付页（15分钟倒计时）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('payment-result', { orderId: 'ORD123456', success: true }, 'tester'); }} style={navButtonStyle}>
            支付结果页（成功）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('payment-result', { orderId: 'ORD123456', success: false }, 'tester'); }} style={navButtonStyle}>
            支付结果页（失败）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('my-tickets', {}, 'tester'); }} style={navButtonStyle}>
            我的票夹
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('qr-code', { ticket: { id: 'TKT001', activity: { name: '测试活动', date: '2026-06-28', time: '09:00-18:00', location: '测试地点' }, ticketType: 'normal', realName: '张三' } }, 'tester'); }} style={navButtonStyle}>
            核销二维码页
          </button>
        </div>

        {/* 未登录游客可浏览的页面 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>未登录·游客可浏览</span>
          <button onClick={() => { handleLogout(); pushRoute('circles', {}, 'tester'); }} style={navButtonStyle}>
            同好营游客状态（可浏览发现Tab）
          </button>
          <button onClick={() => { handleLogout(); pushRoute('activities', {}, 'tester'); }} style={navButtonStyle}>
            活动列表游客状态
          </button>
          <button onClick={() => { handleLogout(); pushRoute('activity-detail', { activityId: 'act-001' }, 'tester'); }} style={navButtonStyle}>
            活动详情游客状态
          </button>
          <button onClick={() => { handleLogout(); pushRoute('post-detail', { postId: 'post-001' }, 'tester'); }} style={navButtonStyle}>
            动态详情游客状态
          </button>
          <button onClick={() => { handleLogout(); pushRoute('group-detail', { groupId: 'grp-001' }, 'tester'); }} style={navButtonStyle}>
            拼团详情游客状态
          </button>
        </div>

        {/* 未登录拦截态：点击需登录功能时展示的登录引导 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>未登录·登录拦截引导页</span>
          <button onClick={() => { handleLogout(); pushRoute('profile', {}, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            个人主页 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('messages', {}, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            消息页 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('stranger-chat', { threadId: 'str-001' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            陌生人私信 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('create-post', { circleId: 'cir-001' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            发布动态 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('create-group', { activityId: 'act-001' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            发起拼团 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('group-approve', { groupId: 'grp-001' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            团主审批 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('social-list', { type: 'followers' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            粉丝/关注列表 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('kyc', { activityId: 'act-001', ticketType: 'normal' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            实名认证 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('coser-info', { activityId: 'act-001', ticketType: 'coser' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            Coser信息登记 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('payment', { activityId: 'act-001', ticketType: 'normal' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            支付页 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('payment-result', { orderId: 'ORD123456', success: true }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            订单结果 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('my-tickets', {}, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            我的票夹 → 登录引导
          </button>
          <button onClick={() => { handleLogout(); pushRoute('qr-code', { ticket: { id: 'TKT001' } }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            电子票二维码 → 登录引导
          </button>
        </div>

        {/* 空状态展示（一键直达，无需手动操作） */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>空状态（已登录·一键直达）</span>
          <button onClick={() => { handleLoginSuccess(); pushRoute('circles', { initialTab: 'following', forceEmpty: 'following' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            关注Tab空状态（未关注任何人）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('circles', { initialTab: 'circles', forceEmpty: 'circles' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            圈子Tab空状态（未加入任何圈子）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('profile', { initialTab: 'drafts', forceEmpty: 'drafts' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            草稿箱空状态
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('messages', { initialView: 'strangers', forceEmpty: 'strangers' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            陌生人消息空状态（无未处理消息）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('my-tickets', { empty: true }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            票夹空状态
          </button>
        </div>

        {/* 错误状态 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>错误状态</span>
          <button onClick={() => pushRoute('activity-detail', { activityId: 'act-999' }, 'tester')} style={navButtonStyle}>
            活动不存在错误页
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('chat-window', { chatId: 'chat-999' }, 'tester'); }} style={navButtonStyle}>
            聊天窗口不存在错误页
          </button>
        </div>

        {/* KYC认证流程（需登录） */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>KYC认证流程步骤（需登录·一键直达）</span>
          <button onClick={() => { handleLoginSuccess(); pushRoute('kyc', { activityId: 'act-001', ticketType: 'normal', initialStep: 'info' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            ① 实名说明页
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('kyc', { activityId: 'act-001', ticketType: 'normal', initialStep: 'id-card' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            ② 身份证识别页
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('kyc', { activityId: 'act-001', ticketType: 'normal', initialStep: 'face' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            ③ 人脸识别页
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('kyc', { activityId: 'act-001', ticketType: 'normal', initialStep: 'verifying' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            ④ 核验中页
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('kyc', { activityId: 'act-001', ticketType: 'normal', initialStep: 'success' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            ⑤ 认证成功页
          </button>
        </div>

        {/* 页面内弹窗（需登录·一键直达） */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '8px', fontWeight: 700, color: '#888', marginTop: '4px' }}>页面内弹窗与抽屉（需登录·一键直达）</span>
          <button onClick={() => { handleLoginSuccess(); pushRoute('profile', { openModal: 'edit' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            编辑资料弹窗
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('profile', { openModal: 'settings' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            账号设置弹窗
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('circles', { initialTab: 'circles', openDrawer: 'explore' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            发现圈子抽屉
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('create-post', { circleId: 'cir-001', openDrawer: 'tags' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            话题标签抽屉
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('chat-window', { chatId: 'chat-002', openMenu: true }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            私聊更多菜单（删除/拉黑/举报）
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('messages', { initialNotif: 'system' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            通知详情·系统消息
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('messages', { initialNotif: 'likes' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            通知详情·赞与收藏
          </button>
          <button onClick={() => { handleLoginSuccess(); pushRoute('messages', { initialNotif: 'comments' }, 'tester'); }} style={{...navButtonStyle, fontSize: '7.5px'}}>
            通知详情·评论与@
          </button>
        </div>
      </div>

      {/* 第三部分：调试与清空 */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          onClick={() => pushRoute('pitch')}
          style={{
            width: '100%',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--m-primary)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(229, 169, 169, 0.15)',
            marginBottom: '4px'
          }}
        >
          <span>💼 商业路演 PPT</span>
        </button>

        <button 
          onClick={handleResetData}
          style={{
            width: '100%',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#FF5E5E',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255, 94, 94, 0.15)'
          }}
        >
          <RefreshCw size={12} />
          <span>重置沙盒状态</span>
        </button>
        <span style={{ fontSize: '7.5px', color: '#555', textAlign: 'center' }}>
          次元地标 P0 高保真单页应用模拟器 v1.1.0
        </span>
      </div>

    </div>
  );
}
