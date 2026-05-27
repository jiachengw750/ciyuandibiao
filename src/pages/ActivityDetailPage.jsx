import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Users, Heart, Star, Plus, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ActivityDetailPage() {
  const { 
    routeStack, 
    activities, 
    groups, 
    activityRelations, 
    toggleWanted, 
    toggleFavorited, 
    pushRoute, 
    checkLogin 
  } = useApp();

  // 获取当前路由参数中的 activityId
  const currentRoute = routeStack[routeStack.length - 1];
  const activityId = currentRoute.params.activityId;

  // 查出活动与该活动下的拼团
  const activity = activities.find(a => a.id === activityId);
  const associatedGroups = groups.filter(g => g.relatedActivityId === activityId && g.status !== 'cancelled');
  const relation = activityRelations[activityId] || { wanted: false, favorited: false };

  // 决策卡片收折状态
  const [showHelper, setShowHelper] = useState(true);

  if (!activity) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>活动数据不存在</h3>
      </div>
    );
  }

  // 计算决策建议 (去 Emoji，专业二次元面基模型)
  const getDecisionAdvice = () => {
    const isOngoing = activity.status === 'ongoing';
    const wantedRatio = activity.wantedCount > 3000 ? '极高同好流量' : '中等同好规模';
    const groupCount = associatedGroups.length;

    if (isOngoing) {
      if (groupCount > 0) {
        return {
          verdict: '极力推荐前往面基',
          detail: `当前活动正在进行中，且已有 ${groupCount} 个活跃拼团招募中。建议直接挑选心仪的拼团加入，是扩列和吃谷的绝佳时机。`
        };
      } else {
        return {
          verdict: '建议自建新团',
          detail: '活动正在进行中，但目前该地标暂无活跃面基团。建议您作为团主发起第一个拼团，吸引徐汇区附近的同好聚集。'
        };
      }
    } else {
      // 未开始
      return {
        verdict: '提前入群预约',
        detail: `活动尚处于招募预热阶段。当前有 ${activity.wantedCount} 位同好表示想去。建议提前加入对应圈子并预约首发拼团，抢占席位。`
      };
    }
  };

  const advice = getDecisionAdvice();

  // 点击开团
  const handleCreateGroupClick = () => {
    checkLogin(() => {
      pushRoute('create-group', { activityId });
    });
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      
      {/* 滚动内容区 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '60px' }}>
        
        {/* 顶部海报图 */}
        <div style={{ height: '160px', width: '100%', position: 'relative' }}>
          <img 
            src={activity.cover} 
            alt="cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
            <span className={`badge ${activity.status === 'ongoing' ? 'badge-sage' : 'badge-blue'}`}>
              {activity.status === 'ongoing' ? '活动进行中' : '活动即将开始'}
            </span>
          </div>
        </div>

        {/* 详情介绍区 */}
        <div style={{ padding: '12px 16px', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--m-border)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--m-text-main)', lineHeight: '1.4' }}>
            {activity.title}
          </h2>
          <div className="flex flex-wrap gap-1 mt-2">
            {activity.tags.map((t, i) => (
              <span key={i} className="badge badge-peach scale-95">{t}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '12px', fontSize: '9px', color: 'var(--m-text-sub)' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Calendar size={11} className="text-neutral-400 flex-shrink-0" />
              <span>时间：{activity.date}</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <MapPin size={11} className="text-neutral-400 flex-shrink-0" />
              <span>地址：{activity.location}</span>
            </div>
          </div>

          <p style={{ fontSize: '9px', color: 'var(--m-text-sub)', lineHeight: '1.5', marginTop: '12px', backgroundColor: '#F8F9FA', padding: '8px', borderRadius: '8px', border: '0.5px solid var(--m-border)' }}>
            {activity.intro}
          </p>
        </div>

        {/* ============================================================== */}
        {/* P0 独创：面基决策助手卡片 (莫兰迪风格，不带任何 Emoji) */}
        {showHelper && (
          <div 
            className="glass-panel"
            style={{
              margin: '12px 12px 0 12px',
              padding: '12px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255,255,255,0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--m-border)', paddingBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 800, color: 'var(--m-primary)' }}>
                <ShieldCheck size={13} />
                <span>次元地标决策助手</span>
              </div>
              <button 
                onClick={() => setShowHelper(false)}
                style={{ background: 'none', border: 'none', fontSize: '8px', color: 'var(--m-text-muted)', cursor: 'pointer' }}
              >
                收起
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>
                决策评级：{advice.verdict}
              </span>
              <p style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', lineHeight: '1.4' }}>
                {advice.detail}
              </p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 关联拼团板块 */}
        <div style={{ padding: '16px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', borderLeft: '3px solid var(--m-primary)', paddingLeft: '6px' }}>
              拼团面基搭子 ({associatedGroups.length})
            </h3>
            <button 
              onClick={handleCreateGroupClick}
              className="interactive-scale"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '8px',
                fontWeight: 800,
                color: 'var(--m-primary)',
                backgroundColor: 'var(--m-primary-light)',
                border: '1.5px solid var(--m-primary)',
                padding: '2px 8px',
                borderRadius: '9999px',
                cursor: 'pointer'
              }}
            >
              <Plus size={10} strokeWidth={2.5} />
              <span>发起拼团</span>
            </button>
          </div>

          {associatedGroups.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {associatedGroups.map(grp => (
                <div 
                  key={grp.id}
                  onClick={() => pushRoute('group-detail', { groupId: grp.id }, 'activity_detail')}
                  className="glass-panel interactive-scale"
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <h4 style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {grp.title}
                    </h4>
                    <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)' }}>
                      集合时间：{new Date(grp.startTime).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })} 14:00
                    </span>
                    <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)' }}>
                      要求：{grp.requirementSummary}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '4px', marginLeft: '12px' }}>
                    <span className={`badge ${grp.status === 'full' ? 'badge-slate' : 'badge-blue'}`} style={{ fontSize: '8px' }}>
                      {grp.status === 'full' ? '已满员' : `${grp.currentMembers}/${grp.maxMembers}人`}
                    </span>
                    <span style={{ fontSize: '8px', color: 'var(--m-primary)', fontWeight: 800 }}>详情→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div 
              style={{
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px dashed var(--m-border)',
                color: 'var(--m-text-muted)',
                fontSize: '9px'
              }}
            >
              当前还没有同好为此活动创建拼团。
            </div>
          )}
        </div>

      </div>

      {/* 底部悬浮操作栏 (高品质二次元风格) */}
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
        {/* 想去与收藏双击按钮 */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => toggleWanted(activity.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: relation.wanted ? 'var(--m-primary)' : 'var(--m-text-sub)',
              fontSize: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Heart size={14} className={relation.wanted ? 'fill-current' : ''} />
            <span>想去</span>
          </button>

          <button 
            onClick={() => toggleFavorited(activity.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              color: relation.favorited ? '#DAB86B' : 'var(--m-text-sub)',
              fontSize: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Star size={14} className={relation.favorited ? 'fill-current' : ''} />
            <span>收藏</span>
          </button>
        </div>

        {/* 约个同伴开团 CTA */}
        <button 
          onClick={handleCreateGroupClick}
          className="btn-round btn-primary interactive-scale"
          style={{
            padding: '8px 20px',
            fontSize: '10px'
          }}
        >
          约个同伴 (发起开团)
        </button>
      </div>

    </div>
  );
}
