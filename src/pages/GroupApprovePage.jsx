import { useApp } from '../context/AppContext';
import { Check, X, Users, MessageSquare } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';
import ErrorState from '../components/ErrorState';

export default function GroupApprovePage() {
  const {
    routeStack,
    groups,
    approveRequest,
    popRoute,
    user
  } = useApp();

  // 获取路由参数中的 groupId
  const currentRoute = routeStack[routeStack.length - 1];
  const groupId = currentRoute?.params?.groupId;

  // 查询拼团数据
  const group = groups.find(g => g.id === groupId);

  // 登录拦截：未登录不可进入审核管理
  if (!user) {
    return (
      <LoginGuard
        icon={Users}
        title="登录后管理拼团申请"
        desc="登录环境账户后即可审核入团申请"
        showBack
      />
    );
  }

  if (!group) {
    return (
      <ErrorState
        icon={Users}
        title="拼团不存在"
        desc="该拼团可能已被取消、已成团或链接已失效"
      />
    );
  }

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      {/* 滚动内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
        
        {/* 拼团基本信息卡（简易版） */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="badge badge-blue" style={{ alignSelf: 'flex-start' }}>
            {group.type === 'exchange' ? '周边合购' : group.type === 'photo' ? '拍照打卡' : group.type === 'dinner' ? '展后聚餐' : '约人面基'}
          </span>
          <h2 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)' }}>
            {group.title}
          </h2>
          <div style={{ fontSize: '9px', color: 'var(--m-text-sub)', display: 'flex', gap: '8px' }}>
            <span>成团席位：{group.currentMembers} / {group.maxMembers} 人</span>
            <span>待审核数：{group.pendingRequests.length} 人</span>
          </div>
        </div>

        {/* 审批列表 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '12px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>待审核加入申请 ({group.pendingRequests.length})</span>
            <ReqBadge id="GRP-APPLY" style={{ position: 'relative', top: '-1px' }} />
          </h3>

          {group.pendingRequests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {group.pendingRequests.map(req => (
                <div
                  key={req.id}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: '#F8F9FA',
                    border: '0.5px solid var(--m-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  {/* 用户基本信息 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={req.avatar}
                      alt="avatar"
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '0.5px solid var(--m-border)' }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', display: 'block' }}>{req.name}</span>
                      <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        共同圈子：排球少年同好营 · 标签：吃谷交换 / 漫展常客
                      </span>
                    </div>
                  </div>

                  {/* 申请附言 */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '0.5px solid rgba(226,229,232,0.6)' }}>
                    <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', fontWeight: 800, display: 'block', marginBottom: '2px' }}>申请附言：</span>
                    <p style={{ fontSize: '8.5px', color: 'var(--m-text-main)', margin: 0, lineHeight: '1.4' }}>
                      {req.message || '（该申请人未填写附言）'}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '0.5px dashed rgba(226,229,232,0.6)', paddingTop: '8px' }}>
                    <button
                      onClick={() => {
                        approveRequest(group.id, req.id, false);
                      }}
                      className="interactive-scale"
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(255, 99, 132, 0.08)',
                        color: '#FF6384',
                        border: 'none',
                        fontSize: '8px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={10} strokeWidth={2.5} />
                      <span>拒绝</span>
                    </button>
                    <button
                      onClick={() => {
                        approveRequest(group.id, req.id, true);
                      }}
                      className="interactive-scale"
                      style={{
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--m-sage-light)',
                        color: '#5B7A63',
                        border: 'none',
                        fontSize: '8px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      <Check size={10} strokeWidth={2.5} />
                      <span>同意加入</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 0', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🎉</span>
              <span style={{ fontSize: '9px', color: 'var(--m-text-muted)', textAlign: 'center' }}>
                目前没有需要审核的入团申请啦！
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
