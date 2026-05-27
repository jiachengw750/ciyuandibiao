import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Calendar, MapPin, ArrowLeft, Trash2, X, AlertCircle } from 'lucide-react';

export default function ActivityListPage() {
  const { activities, activityRelations, pushRoute } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['CP30', 'BW2026', '漫展面基']);
  const [statusFilter, setStatusFilter] = useState('all'); // all, upcoming, ongoing

  // 1. 过滤掉下架活动
  const visibleActivities = activities.filter(a => a.status !== 'offline');

  // 2. 按状态和搜索词过滤主页面活动
  const filteredActivities = visibleActivities.filter(a => {
    if (statusFilter === 'upcoming' && a.status !== 'upcoming') return false;
    if (statusFilter === 'ongoing' && a.status !== 'ongoing') return false;
    return true;
  });

  // 3. 搜索面板中的活动搜索结果 (只搜索活动类型)
  const searchResultActivities = searchQuery.trim() 
    ? visibleActivities.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // 4. 通用活动卡片渲染器
  const renderActivityCard = (act) => {
    const relation = activityRelations[act.id] || { wanted: false, favorited: false };
    return (
      <div 
        key={act.id}
        onClick={() => {
          setIsSearchOverlayOpen(false); // 进入详情页时关闭搜索面板
          pushRoute('activity-detail', { activityId: act.id }, 'activity_list');
        }}
        className="glass-panel interactive-scale"
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          marginBottom: '10px',
          flexShrink: 0
        }}
      >
        {/* 封面与状态角标 */}
        <div style={{ height: '110px', width: '100%', position: 'relative' }}>
          <img 
            src={act.cover} 
            alt="cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
            <span className={`badge ${act.status === 'ongoing' ? 'badge-sage' : 'badge-blue'}`}>
              {act.status === 'ongoing' ? '进行中' : '即将开始'}
            </span>
          </div>
        </div>

        {/* 内容 */}
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', lineHeight: '1.3' }}>
            {act.title}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '8.5px', color: 'var(--m-text-sub)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={10} className="text-neutral-400" />
              <span>{act.date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={10} className="text-neutral-400" />
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{act.location}</span>
            </div>
          </div>

          {/* 社交点赞统计 */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(226, 229, 232, 0.4)',
              paddingTop: '8px',
              marginTop: '2px',
              fontSize: '8.5px',
              color: 'var(--m-text-muted)'
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <span>想去 {act.wantedCount + (relation.wanted ? 1 : 0)}</span>
              <span>收藏 {act.favoritedCount + (relation.favorited ? 1 : 0)}</span>
            </div>
            <span style={{ fontWeight: 800, color: 'var(--m-primary)' }}>查看详情 →</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col select-none relative">
      
      {/* 顶部标题与放大镜 */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          padding: '12px 16px',
          borderBottom: '1px solid var(--m-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <h1 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--m-text-main)' }}>同好活动大厅</h1>
        
        <button 
          onClick={() => setIsSearchOverlayOpen(true)}
          className="interactive-scale"
          style={{
            background: 'none',
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            color: 'var(--m-text-sub)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
        >
          <Search size={15} strokeWidth={2.5} />
        </button>
      </div>

      {/* 状态过滤切换 */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          padding: '8px 16px',
          borderBottom: '1px solid var(--m-border)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          flexShrink: 0
        }}
      >
        {[
          { key: 'all', label: '全部活动' },
          { key: 'ongoing', label: '进行中' },
          { key: 'upcoming', label: '即将开始' }
        ].map(item => (
          <button 
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            className={`filter-item ${statusFilter === item.key ? 'active' : ''}`}
            style={{ padding: '4px 10px', fontSize: '9px' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 活动列表区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredActivities.map((act) => renderActivityCard(act))}

        {filteredActivities.length === 0 && (
          <div 
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--m-text-sub)'
            }}
          >
            <AlertCircle size={32} style={{ color: 'var(--m-slate)', marginBottom: '8px' }} />
            <h3 style={{ fontSize: '11px', fontWeight: 800 }}>暂无匹配的漫展活动</h3>
            <p style={{ fontSize: '8.5px', color: 'var(--m-text-muted)', marginTop: '2px', maxWidth: '180px' }}>
              在此分类下暂时没有活动。您可以尝试查看全部活动或切换过滤状态。
            </p>
          </div>
        )}
      </div>

      {/* 抖音级沉浸式全屏活动搜索层 */}
      {isSearchOverlayOpen && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 120,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* 顶部搜索输入头部 */}
          <div 
            style={{
              height: '44px',
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid var(--m-border)',
              flexShrink: 0
            }}
          >
            {/* 返回箭头 */}
            <button 
              onClick={() => {
                setIsSearchOverlayOpen(false);
                setSearchQuery('');
              }}
              className="interactive-scale"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--m-text-main)', display: 'flex', alignItems: 'center' }}
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>

            {/* 搜索框输入容器 */}
            <div 
              style={{
                flex: 1,
                height: '30px',
                backgroundColor: '#F0F1F4',
                borderRadius: '9999px',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Search size={12} className="text-neutral-400" />
              <input 
                type="text"
                placeholder="搜索同好活动、漫展展会名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    if (!searchHistory.includes(searchQuery.trim())) {
                      setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 8));
                    }
                  }
                }}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '9.5px',
                  color: 'var(--m-text-main)'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: 'var(--m-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                >
                  <X size={10} />
                </button>
              )}
            </div>

            {/* 搜索确认按钮 */}
            <button 
              onClick={() => {
                if (searchQuery.trim()) {
                  if (!searchHistory.includes(searchQuery.trim())) {
                    setSearchHistory(prev => [searchQuery.trim(), ...prev].slice(0, 8));
                  }
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '10.5px',
                fontWeight: 800,
                color: searchQuery.trim() ? 'var(--m-primary)' : 'var(--m-text-muted)',
                cursor: 'pointer'
              }}
            >
              搜索
            </button>
          </div>

          {/* 搜索体内容区 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', backgroundColor: '#F8F9FA' }}>
            
            {/* 1. 默认展示活动推荐与历史记录 */}
            {!searchQuery.trim() ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* 历史记录 */}
                {searchHistory.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>历史搜索</span>
                      <button 
                        onClick={() => setSearchHistory([])}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '8px', color: 'var(--m-text-muted)', cursor: 'pointer' }}
                      >
                        <Trash2 size={10} />
                        <span>清空</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {searchHistory.map((item, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '9999px',
                            padding: '4px 10px',
                            border: '1px solid rgba(226,229,232,0.45)'
                          }}
                        >
                          <span 
                            onClick={() => setSearchQuery(item)}
                            style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', cursor: 'pointer', fontWeight: 800 }}
                          >
                            {item}
                          </span>
                          <button 
                            onClick={() => setSearchHistory(prev => prev.filter(h => h !== item))}
                            style={{ background: 'none', border: 'none', color: 'var(--m-text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 猜你想搜 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>猜你想搜</span>
                  
                  <div 
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '14px', 
                      padding: '12px 10px', 
                      border: '1px solid rgba(226,229,232,0.45)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      rowGap: '12px',
                      columnGap: '10px'
                    }}
                  >
                    {[
                      { word: 'CP30动漫同人展', hot: true },
                      { word: 'BW2026 哔哩哔哩世界', hot: true },
                      { word: '排球少年快闪店', hot: true },
                      { word: '大悦城吃谷地图', hot: false },
                      { word: '徐汇痛车面基会', hot: false },
                      { word: '名侦探柯南剧场版', hot: false },
                      { word: '同人摊主招募', hot: false },
                      { word: 'Coser舞台秀', hot: false }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setSearchQuery(item.word);
                          if (!searchHistory.includes(item.word)) {
                            setSearchHistory(prev => [item.word, ...prev].slice(0, 8));
                          }
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                      >
                        <span 
                          style={{ 
                            fontSize: '9px', 
                            fontWeight: 900, 
                            color: index < 3 ? 'var(--m-primary)' : 'var(--m-text-muted)',
                            width: '12px'
                          }}
                        >
                          {index + 1}
                        </span>
                        <span style={{ fontSize: '8.5px', color: 'var(--m-text-sub)', fontWeight: 800, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
                          {item.word}
                        </span>
                        {item.hot && (
                          <span style={{ fontSize: '7px', color: '#FF5E5E', fontWeight: 900, backgroundColor: 'rgba(255,94,94,0.1)', padding: '1px 3px', borderRadius: '3px' }}>
                            热
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* 2. 搜索展示结果区 (只展示活动，无其他混杂内容) */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-muted)' }}>搜索到的同好活动</span>
                
                {searchResultActivities.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {searchResultActivities.map(act => renderActivityCard(act))}
                  </div>
                ) : (
                  <div 
                    style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      color: 'var(--m-text-sub)'
                    }}
                  >
                    <AlertCircle size={24} style={{ color: 'var(--m-slate)', marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '10px', fontWeight: 800 }}>未找到相关活动</h3>
                    <p style={{ fontSize: '8px', color: 'var(--m-text-muted)', marginTop: '2px' }}>
                      请尝试输入其他关键词，如“CP30”或“快闪”。
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
