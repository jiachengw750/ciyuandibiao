import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, DollarSign, Users, Send } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';

export default function CreateGroupPage() {
  const { routeStack, activities, createGroup, popRoute, pushRoute, user } = useApp();

  // 获取当前关联活动 ID (允许为空)
  const currentRoute = routeStack[routeStack.length - 1];
  const initialActivityId = currentRoute.params?.activityId || null;
  const [activeId, setActiveId] = useState(initialActivityId);

  // 1. 查找关联活动与可选择活动列表
  const activity = activities.find(a => a.id === activeId);
  const selectableActivities = activities.filter(a => a.status === 'upcoming' || a.status === 'ongoing');

  // 表单状态
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('0');
  const [totalLimit, setTotalLimit] = useState('5');
  const [addressSummary, setAddressSummary] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [tag, setTag] = useState('约人面基');
  const [meetingTime, setMeetingTime] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setMinutes(0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [description, setDescription] = useState('');
  const [requirementSummary, setRequirementSummary] = useState('');
  const [locationVisibleRule, setLocationVisibleRule] = useState('after_join');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !totalLimit) {
      alert('请填写拼团名称和团队人数上限！');
      return;
    }

    if (['ended', 'cancelled', 'removed'].includes(activity.status)) {
      alert('已结束、已取消或已下架的活动不可创建开团。');
      return;
    }

    // 创建开团 (精简版，默认时空坐标由入群后沟通商定)
    const createdGroupId = createGroup(
      activeId,
      title,
      '0', // price -> 默认 0 对应 'AA制'
      totalLimit,
      '群内沟通决定', // addressSummary -> 默认“群内沟通决定”
      '加入群聊后由成员共同沟通商定具体集合细节。', // addressDetail -> 引导入群商定
      tag,
      {
        description,
        requirementSummary: requirementSummary.trim() || undefined,
        locationVisibleRule: 'after_join'
      }
    );

    alert('发起拼团成功！已经自动为您创建开团群聊。');
    if (createdGroupId) {
      pushRoute('group-detail', { groupId: createdGroupId }, 'create_group');
    } else {
      popRoute();
    }
  };

  // 登录拦截：未登录不可发起拼团
  if (!user) {
    return (
      <LoginGuard
        icon={Users}
        title="登录后发起拼团"
        desc="登录环境账户后即可发起约人面基 / 拼单开团"
        showBack
      />
    );
  }

  if (!activity) {
    return (
      <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
        {/* 顶部指示栏 */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '14px 16px', borderBottom: '1px solid var(--m-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <h2 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-primary)' }}>
            第一步：请选择要发团的同好活动
          </h2>
          <button 
            onClick={popRoute}
            style={{ background: 'none', border: 'none', color: 'var(--m-text-sub)', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
          >
            返回
          </button>
        </div>

        {/* 活动列表 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {selectableActivities.length > 0 ? (
            selectableActivities.map(act => (
              <div
                key={act.id}
                onClick={() => setActiveId(act.id)}
                className="glass-panel interactive-scale"
                style={{
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--m-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={act.cover} 
                  alt="cover" 
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span className={`badge ${act.status === 'ongoing' ? 'badge-sage' : 'badge-blue'}`} style={{ alignSelf: 'start', fontSize: '7px', transform: 'scale(0.9)', transformOrigin: 'left center', padding: '1px 4px' }}>
                    {act.status === 'ongoing' ? '进行中' : '即将开始'}
                  </span>
                  <h4 style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {act.title}
                  </h4>
                  <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)' }}>
                    时间：{act.date.split(' 至 ')[0]} 起
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--m-text-sub)', fontSize: '10px' }}>
              暂无可开团的活跃活动。
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      
      {/* 滚动表单区 */}
      <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '60px' }}>
        
        {/* 顶部活动微卡 */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '14px', border: '1px solid var(--m-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={activity.cover} 
            alt="cover" 
            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--m-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>您正在为以下活动发起面基拼团：</span>
                <ReqBadge id="GRP-CREATE" style={{ position: 'relative', top: '-1px' }} />
              </span>
              {!initialActivityId && (
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: 'var(--m-text-muted)',
                    fontSize: '8px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  更换活动
                </button>
              )}
            </div>
            <h4 style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '2px' }}>
              {activity.title}
            </h4>
          </div>
        </div>

        {/* 核心信息填写 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '14px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
          <ReqBadge id="GRP-CREATE" style={{ top: '-6px', right: '-6px' }} />
          
          {/* 标题 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>1. 拼团名称/主题 (必填)</label>
            <input 
              type="text" 
              placeholder="例如：14:00场痛包扩列与吃火锅拼单"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                height: '32px',
                backgroundColor: '#F8F9FA',
                border: '1px solid var(--m-border)',
                borderRadius: '8px',
                padding: '0 10px',
                fontSize: '9.5px',
                color: 'var(--m-text-main)',
                outline: 'none'
              }}
              maxLength={40}
            />
          </div>

          {/* 团标签 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>2. 拼团类型</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['约人面基', '周边合购', '展后聚餐'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`filter-item ${tag === t ? 'active' : ''}`}
                  style={{
                    padding: '6px 0',
                    fontSize: '9px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    display: 'flex'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 团队人数上限 (预招募人数) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Users size={12} className="text-neutral-400" />
              <span>3. 团队人数上限 (必填，最高40人)</span>
            </label>
            <input 
              type="number" 
              min="2"
              max="40"
              value={totalLimit}
              onChange={(e) => setTotalLimit(e.target.value)}
              required
              style={{
                width: '100%',
                height: '32px',
                backgroundColor: '#F8F9FA',
                border: '1px solid var(--m-border)',
                borderRadius: '8px',
                padding: '0 10px',
                fontSize: '9.5px',
                color: 'var(--m-text-main)',
                outline: 'none'
              }}
            />
          </div>

          {/* 加入要求 (选填) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>4. 加入要求 (选填)</label>
            <textarea
              rows="3"
              placeholder="（非必填）输入对同伴的要求，例如：主吃排少/原神，不接受黄牛转票。"
              value={requirementSummary}
              onChange={(e) => setRequirementSummary(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#F8F9FA',
                border: '1px solid var(--m-border)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '9.5px',
                color: 'var(--m-text-main)',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* 详细说明 (选填) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>5. 详细说明 (选填)</label>
            <textarea
              rows="3"
              placeholder="（非必填）补充面基说明或注意事项。"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#F8F9FA',
                border: '1px solid var(--m-border)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '9.5px',
                color: 'var(--m-text-main)',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

        </div>

      </form>

      {/* 底部按钮栏 */}
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
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 40
        }}
      >
        <button 
          type="button" 
          onClick={popRoute}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--m-text-sub)',
            cursor: 'pointer'
          }}
        >
          取消
        </button>
        <button 
          onClick={handleSubmit}
          className="btn-round btn-primary interactive-scale"
          style={{
            padding: '8px 20px',
            fontSize: '10px',
            gap: '4px',
            position: 'relative'
          }}
        >
          <Send size={11} />
          <span>确认发起拼团</span>
          <ReqBadge id="GRP-CREATE" style={{ top: '-10px', right: '-10px' }} />
        </button>
      </div>

    </div>
  );
}
