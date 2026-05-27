import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Users, DollarSign, ArrowRight, ShieldAlert, MessageSquare, Check, X } from 'lucide-react';

export default function GroupDetailPage() {
  const { 
    routeStack, 
    groups, 
    activities, 
    user, 
    applyJoinGroup, 
    approveRequest, 
    pushRoute 
  } = useApp();

  // 获取当前开团 ID
  const currentRoute = routeStack[routeStack.length - 1];
  const groupId = currentRoute.params.groupId;

  // 1. 查询拼团数据
  const group = groups.find(g => g.id === groupId);
  const activity = group ? activities.find(a => a.id === group.relatedActivityId) : null;

  // 申请附言输入状态
  const [applyMsg, setApplyMsg] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  if (!group) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>拼团项目不存在或已被取消</h3>
      </div>
    );
  }

  // 2. 身份计算
  const isCreator = user && group.creator.name === user.name;
  const isMember = user && group.members.some(m => m.name === user.name);
  const isPending = user && group.pendingRequests.some(r => r.name === user.name);
  
  // 3. 提交加入申请
  const handleApply = (e) => {
    e.preventDefault();
    applyJoinGroup(group.id, applyMsg);
    setHasApplied(true);
    setApplyMsg('');
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      
      {/* 滚动内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '60px' }}>
        
        {/* 活动迷你绑定卡 (点击可跳回活动详情) */}
        {activity && (
          <div 
            onClick={() => pushRoute('activity-detail', { activityId: activity.id }, 'group_detail')}
            className="glass-panel interactive-scale"
            style={{
              padding: '10px',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <img 
              src={activity.cover} 
              alt="cover" 
              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '7.5px', fontWeight: 800, color: 'var(--m-primary)', display: 'block' }}>关联同好活动：</span>
              <h4 style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {activity.title}
              </h4>
            </div>
            <ArrowRight size={12} className="text-neutral-400" />
          </div>
        )}

        {/* 拼团核心卡 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '14px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="flex justify-between items-start">
            <span className="badge badge-blue">
              {group.type === 'exchange' ? '周边合购' : group.type === 'photo' ? '拍照打卡' : group.type === 'dinner' ? '展后聚餐' : '约人面基'}
            </span>
            <span className={`badge ${group.status === 'recruiting' ? 'badge-sage' : 'badge-slate'}`}>
              {group.status === 'recruiting' ? '招募中' : '已满员'}
            </span>
          </div>

          <h2 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)', lineHeight: '1.4' }}>
            {group.title}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '9px', color: 'var(--m-text-sub)', borderTop: '1px solid rgba(226,229,232,0.4)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Calendar size={11} className="text-neutral-400" />
              <span>集合时间：{new Date(group.startTime).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <DollarSign size={11} className="text-neutral-400" />
              <span>人均花销：{group.price}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Users size={11} className="text-neutral-400" />
              <span>成团席位：{group.currentMembers} / {group.maxMembers} 人 (最高上限)</span>
            </div>
          </div>
        </div>

        {/* 拼团要求说明 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px', border: '1px solid var(--m-border)' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)', marginBottom: '6px' }}>发起人的加入要求：</h3>
          <p style={{ fontSize: '9px', color: 'var(--m-text-sub)', lineHeight: '1.5' }}>
            {group.requirementSummary}
          </p>
        </div>

        {/* ============================================================== */}
        {/* 集合地址板块 (根据是否入围展示公开/私密版) */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>集合地址指南：</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '9px', color: 'var(--m-text-sub)' }}>
              <span style={{ fontWeight: 700, color: 'var(--m-text-main)' }}>公开集合地点（摘要）：</span>
              <p>{group.meetingAddress}</p>
            </div>

            {isMember || isCreator ? (
              <div 
                style={{
                  fontSize: '9px',
                  backgroundColor: 'var(--m-primary-light)',
                  border: '1px solid var(--m-primary)',
                  padding: '8px',
                  borderRadius: '10px',
                  color: '#B56767',
                  marginTop: '4px'
                }}
              >
                <span style={{ fontWeight: 800, display: 'block', marginBottom: '2px' }}>私密精准路线指导（仅团员可见）：</span>
                <p style={{ lineHeight: '1.4' }}>{group.meetingAddressDetail}</p>
              </div>
            ) : (
              <div 
                style={{
                  fontSize: '8.5px',
                  backgroundColor: 'rgba(122, 129, 138, 0.05)',
                  border: '1px dashed var(--m-border)',
                  padding: '8px',
                  borderRadius: '10px',
                  color: 'var(--m-text-sub)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px'
                }}
              >
                <ShieldAlert size={12} className="text-neutral-400 flex-shrink-0" />
                <span>精准集合摊位/主创联系电话等私密路线将在加群成功后解锁。</span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 团员列表展示 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>
            当前成团团员 ({group.members.length})
          </h3>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {group.members.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                <img 
                  src={m.avatar} 
                  alt="avatar" 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '0.5px solid var(--m-border)' }}
                />
                <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', fontWeight: m.role === 'owner' ? 800 : 400 }}>
                  {m.name.substring(0, 4)}
                </span>
                {m.role === 'owner' && (
                  <span style={{ fontSize: '6px', backgroundColor: 'var(--m-primary)', color: '#FFFFFF', padding: '0.5px 3px', borderRadius: '2px', transform: 'scale(0.9)' }}>
                    团主
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 团主管理后台：审批申请人 (P0核心流程，无 Emoji) */}
        {isCreator && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-primary)' }}>
              待审核加入申请 ({group.pendingRequests.length})
            </h3>
            
            {group.pendingRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {group.pendingRequests.map(req => (
                  <div 
                    key={req.id}
                    style={{
                      padding: '8px',
                      borderRadius: '10px',
                      backgroundColor: '#F8F9FA',
                      border: '0.5px solid var(--m-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                      <img 
                        src={req.avatar} 
                        alt="avatar" 
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-main)', display: 'block' }}>{req.name}</span>
                        <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          留言：{req.message}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => approveRequest(group.id, req.id, true)}
                        className="interactive-scale"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--m-sage-light)',
                          color: '#5B7A63',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Check size={12} strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => approveRequest(group.id, req.id, false)}
                        className="interactive-scale"
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 99, 132, 0.1)',
                          color: '#FF6384',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '8px', color: 'var(--m-text-muted)', textAlign: 'center', display: 'block', padding: '12px 0' }}>
                目前没有挂起的入团加入申请。
              </span>
            )}
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* 底部悬浮操作按钮 */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--m-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 12px',
          zIndex: 40
        }}
      >
        {isMember || isCreator ? (
          /* 已入群人员：展示聊天群联动按钮 */
          <button 
            onClick={() => pushRoute('chat-window', { chatId: group.id === 'grp-001' ? 'chat-001' : `chat-${group.id}` }, 'group_detail')}
            className="btn-round btn-primary interactive-scale"
            style={{
              width: '100%',
              height: '34px',
              fontSize: '10px',
              gap: '6px'
            }}
          >
            <MessageSquare size={13} />
            <span>进入开团讨论群</span>
          </button>
        ) : isPending || hasApplied ? (
          /* 等待审批状态 */
          <button 
            disabled 
            style={{
              width: '100%',
              height: '34px',
              borderRadius: '9999px',
              backgroundColor: 'var(--m-slate-light)',
              color: 'var(--m-text-sub)',
              border: 'none',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'not-allowed'
            }}
          >
            申请已提交，等待团主审批
          </button>
        ) : (
          /* 游客/陌生人状态：申请表单 */
          <form onSubmit={handleApply} style={{ width: '100%', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="发送给团主的申请附言（如带什么周边/扩列IP）"
              value={applyMsg}
              onChange={(e) => setApplyMsg(e.target.value)}
              required
              style={{
                flex: 1,
                height: '34px',
                borderRadius: '9999px',
                border: '1px solid var(--m-border)',
                padding: '0 14px',
                fontSize: '9.5px',
                color: 'var(--m-text-main)',
                backgroundColor: '#F8F9FA'
              }}
            />
            <button 
              type="submit"
              className="btn-round btn-primary interactive-scale"
              style={{
                height: '34px',
                padding: '0 16px',
                fontSize: '9.5px',
                whiteSpace: 'nowrap'
              }}
            >
              申请入群
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
