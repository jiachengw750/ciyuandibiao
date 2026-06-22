import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Heart, Star, Plus, ShieldCheck, Ticket } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import ErrorState from '../components/ErrorState';
import { CalendarX } from 'lucide-react';

export default function ActivityDetailPage() {
  const {
    routeStack,
    activities,
	    groups,
	    circles,
	    circleMemberships,
	    activityRelations,
	    toggleWanted,
	    toggleFavorited,
	    toggleJoinCircle,
	    pushRoute,
	    checkLogin
	  } = useApp();

  // 获取当前路由参数中的 activityId
  const currentRoute = routeStack[routeStack.length - 1];
  const activityId = currentRoute.params.activityId;

  // 查出活动与该活动下的拼团
  const activity = activities.find(a => a.id === activityId);

  // 错误兜底：活动不存在时直接渲染缺省页，避免后续访问 activity.title 报错
  if (!activity) {
    return (
      <ErrorState
        icon={CalendarX}
        title="活动不存在"
        desc="该活动可能已下架、已结束或链接已失效"
      />
    );
  }

  const associatedGroups = groups.filter(g => g.relatedActivityId === activityId && g.status !== 'cancelled');
  const associatedCircles = circles.filter(circle => {
    const haystack = `${circle.name} ${circle.intro} ${circle.tags.join(' ')} ${activity.title} ${activity.tags.join(' ')}`;
    return activity.tags.some(tag => haystack.includes(tag.replace('热门', '').replace('官方', ''))) ||
      circle.tags.some(tag => activity.title.includes(tag.replace('同好', '').replace('相关', ''))) ||
      (activity.type === 'comic_con' && circle.tags.includes('同人志')) ||
      (activity.type === 'theme_event' && circle.tags.some(tag => ['原神', '米哈游'].includes(tag))) ||
      (activity.type === 'goods_market' && circle.tags.some(tag => ['吃谷交换', '周边同人'].includes(tag)));
  }).slice(0, 3);
  const relation = activityRelations[activityId] || { wanted: false, favorited: false };

  const getPurposeTag = (type) => {
    const map = {
      exchange: { label: '拼单交换', class: 'badge-peach' },
      photo: { label: '互相拍照', class: 'badge-blue' },
      dinner: { label: '约饭聚餐', class: 'badge-sage' },
      visit: { label: '结伴逛展', class: 'badge-slate' }
    };
    return map[type] || { label: '面基搭子', class: 'badge-slate' };
  };





  // 点击开团
  const handleCreateGroupClick = () => {
    checkLogin(() => {
      pushRoute('create-group', { activityId });
    });
  };

  // 点击购票
  const handleBuyTicket = () => {
    checkLogin(() => {
      pushRoute('ticket-select', { activityId });
    });
  };

  return (
    <div className="w-full h-full flex flex-col relative select-none" style={{ backgroundColor: 'var(--m-bg-canvas)' }}>

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
        <div style={{ padding: '12px 16px', backgroundColor: 'var(--m-bg-card)', borderBottom: '1px solid #EEEEEE' }}>
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
              <span>地址：{activity.city} · {activity.address} ({activity.location})</span>
            </div>
          </div>

          <p style={{ fontSize: '9px', color: 'var(--m-text-sub)', lineHeight: '1.5', marginTop: '12px', backgroundColor: '#F8F9FA', padding: '8px', borderRadius: '8px', border: '0.5px solid var(--m-border)' }}>
            {activity.intro}
            <ReqBadge id="ACT-DETAIL" style={{ position: 'relative', top: '-1px', marginLeft: '4px' }} />
          </p>
        </div>



        {/* ============================================================== */}
        {/* 关联同好营板块 */}
        <div style={{ padding: '16px 12px 0 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', borderLeft: '3px solid var(--m-secondary)', paddingLeft: '6px' }}>
              关联同好营 ({associatedCircles.length})
              <ReqBadge id="ACT-GROUPS" style={{ position: 'relative', top: '-1px', marginLeft: '4px' }} />
            </h3>
          </div>

          {associatedCircles.length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
              {associatedCircles.map(circle => {
                const joined = !!circleMemberships[circle.id];
                return (
                  <div key={circle.id} className="glass-panel interactive-scale" style={{ flexShrink: 0, width: '150px', backgroundColor: 'var(--m-bg-card)', borderRadius: '12px', padding: '10px', boxShadow: 'none', border: '1px solid #EEEEEE', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div onClick={() => pushRoute('circle-detail', { circleId: circle.id }, 'activity_detail')} style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                      {circle.avatarImg ? (
                        <img 
                          src={circle.avatarImg} 
                          alt="c_av" 
                          style={{ 
                            width: '34px', 
                            height: '34px', 
                            borderRadius: '10px', 
                            objectFit: 'cover',
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: circle.avatarBg, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 900, flexShrink: 0 }}>
                          {circle.avatar}
                        </div>
                      )}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{circle.name}</h4>
                        <p style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', margin: '2px 0 0 0' }}>{circle.memberCount} 同好</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', lineHeight: '1.35', height: '30px', overflow: 'hidden', margin: 0 }}>
                      {circle.intro}
                    </p>
                    <button
                      onClick={() => !joined && toggleJoinCircle(circle.id)}
                      disabled={joined}
                      style={{ border: 'none', borderRadius: '9999px', padding: '5px 0', backgroundColor: joined ? 'var(--m-slate-light)' : 'var(--m-primary)', color: joined ? 'var(--m-text-sub)' : '#FFFFFF', fontSize: '8px', fontWeight: 800, cursor: joined ? 'default' : 'pointer' }}
                    >
                      {joined ? '已加入' : '一键加入'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '18px', textAlign: 'center', backgroundColor: 'var(--m-bg-card)', borderRadius: '12px', border: '1px solid #EEEEEE', color: 'var(--m-text-muted)', fontSize: '9px' }}>
              暂无可关联同好营
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 关联拼团板块 */}
        <div style={{ padding: '16px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', borderLeft: '3px solid var(--m-primary)', paddingLeft: '6px' }}>
              拼团面基搭子 ({associatedGroups.length})
              <ReqBadge id="ACT-GROUPS" style={{ position: 'relative', top: '-1px', marginLeft: '4px' }} />
            </h3>
            {(activity.status !== 'ended' && activity.status !== 'cancelled') && (
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
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <Plus size={10} strokeWidth={2.5} />
                <span>发起拼团</span>
                <ReqBadge id="ACT-GROUPS" style={{ top: '-10px', right: '-10px' }} />
              </button>
            )}
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
                    backgroundColor: 'var(--m-bg-card)',
                    border: '1px solid #EEEEEE',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      <span className={`badge ${getPurposeTag(grp.type).class}`} style={{ transform: 'scale(0.85)', transformOrigin: 'left center', padding: '1px 5px', fontSize: '7px', flexShrink: 0 }}>
                        {getPurposeTag(grp.type).label}
                      </span>
                      <h4 style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--m-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', margin: 0, flex: 1 }}>
                        {grp.title}
                      </h4>
                    </div>
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
                backgroundColor: 'var(--m-bg-card)',
                borderRadius: '12px',
                border: '1px solid #EEEEEE',
                color: 'var(--m-text-muted)',
                fontSize: '9px',
                position: 'relative'
              }}
            >
              <ReqBadge id="ACT-GROUPS" style={{ top: '8px', right: '8px' }} />
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
          backgroundColor: 'var(--m-bg-card)',
          borderTop: '1px solid #EEEEEE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 40
        }}
      >
        {/* 想去与收藏双击按钮 */}
        <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
          <ReqBadge id="ACT-DETAIL" style={{ top: '-10px', right: '-10px' }} />
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
        {activity.status === 'ended' || activity.status === 'cancelled' ? (
          <button
            disabled
            className="btn-round btn-secondary"
            style={{
              padding: '8px 20px',
              fontSize: '10px',
              cursor: 'not-allowed',
              opacity: 0.6,
              boxShadow: 'none'
            }}
          >
            {activity.status === 'ended' ? '活动已结束，无法发起新拼团' : '活动已取消'}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button
              onClick={handleBuyTicket}
              className="btn-round interactive-scale"
              style={{
                flex: 1,
                padding: '8px 16px',
                fontSize: '10px',
                backgroundColor: '#FFFFFF',
                color: 'var(--m-primary)',
                border: '2px solid var(--m-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Ticket size={14} />
              <span>立即购票</span>
            </button>
            <button
              onClick={handleCreateGroupClick}
              className="btn-round btn-primary interactive-scale"
              style={{
                flex: 1,
                padding: '8px 16px',
                fontSize: '10px',
                position: 'relative'
              }}
            >
              约个同伴
              <ReqBadge id="ACT-DETAIL" style={{ top: '-10px', right: '-10px' }} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
