import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, MapPin, Compass, Navigation, Users, Calendar, ArrowRight, X, AlertCircle, 
  Layers, Radio, ChevronUp, ChevronDown, Flame, MessageSquare, Sparkles, Ticket 
} from 'lucide-react';

export default function MapPage() {
  const { 
    activities, 
    groups, 
    pushRoute, 
    checkLogin 
  } = useApp();

  // 1. 地图视图状态 (模拟地图缩放、平移偏移量，以及用户选择的点位)
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 正常, 2 = 放大 (点击聚合点触发)
  const [selectedMarker, setSelectedMarker] = useState(null); // { type: 'activity' | 'group', id: string }
  
  // 新增高级设计状态：地图皮肤、雷达扫描、抽屉高度控制
  const [mapSkin, setMapSkin] = useState('morandi'); // morandi, cyberpunk, comic
  const [isScanning, setIsScanning] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState('half'); // peek, half, full
  const [showNearbyUsers, setShowNearbyUsers] = useState(false);

  // 2. 搜索与筛选状态
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, activity, group, upcoming

  // 3. 授权定位状态 (模拟定位成功/失败/未授权)
  const [locationStatus, setLocationStatus] = useState('granted'); // granted, denied, failed
  const [userLocation, setUserLocation] = useState({ lat: 31.218, lng: 121.450 }); // 用户坐标

  // 4. 定位重置
  const handleRecenter = () => {
    setMapOffset({ x: 0, y: 0 });
    setZoomLevel(1);
    setSelectedMarker(null);
  };

  // 5. 过滤掉已下架/已结束的活动和团
  const visibleActivities = useMemo(() => {
    return activities.filter(a => a.status !== 'offline' && a.status !== 'ended');
  }, [activities]);

  const visibleGroups = useMemo(() => {
    return groups.filter(g => g.status !== 'cancelled' && g.status !== 'ended');
  }, [groups]);

  // 6. 应用筛选器逻辑
  const filteredMarkers = useMemo(() => {
    let resultActivities = [...visibleActivities];
    let resultGroups = [...visibleGroups];

    if (activeFilter === 'activity') {
      resultGroups = [];
    } else if (activeFilter === 'group') {
      resultActivities = [];
    } else if (activeFilter === 'upcoming') {
      // 即将开始 (对于本模拟，包含所有状态为 upcoming 的活动，以及状态为 recruiting 的拼团)
      resultActivities = resultActivities.filter(a => a.status === 'upcoming');
      resultGroups = resultGroups.filter(g => g.status === 'recruiting');
    }

    // 关键词过滤
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      resultActivities = resultActivities.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.location.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      );
      resultGroups = resultGroups.filter(g => 
        g.title.toLowerCase().includes(q) || 
        g.meetingAddress.toLowerCase().includes(q) || 
        g.requirementSummary.toLowerCase().includes(q)
      );
    }

    return { activities: resultActivities, groups: resultGroups };
  }, [visibleActivities, visibleGroups, activeFilter, searchQuery]);

  // 7. 处理搜索栏回车或选择
  const handleSearchSelect = (markerType, markerId) => {
    setSelectedMarker({ type: markerType, id: markerId });
    setShowSearchResults(false);
    
    // 模拟平移地图到该点位中心
    if (markerType === 'activity') {
      const act = activities.find(a => a.id === markerId);
      if (act) {
        // 根据相对位置做偏移，使点位处于屏幕偏上方，避开下方卡片
        setMapOffset({
          x: (121.43 - act.lng) * 800,
          y: (act.lat - 31.21) * 800
        });
      }
    } else {
      const grp = groups.find(g => g.id === markerId);
      if (grp) {
        setMapOffset({
          x: (121.43 - grp.lng) * 800,
          y: (grp.lat - 31.21) * 800
        });
      }
    }
  };

  // 8. 聚合点定义 (当有多个点位间距太近时聚合，模拟 CP30 和 聚餐团 都在虹桥国展中心附近)
  // CP30: (lat: 31.192, lng: 121.298), 聚餐团: (lat: 31.1915, lng: 121.2995)
  // 如果当前是 zoomLevel 1 且未展开，显示为一个聚合标记
  const isClustered = zoomLevel === 1;

  // 点击聚合点 -> 放大地图并展开
  const handleClusterClick = (e) => {
    e.stopPropagation();
    setZoomLevel(2);
    // 模拟平移到聚合中心
    setMapOffset({ x: 104, y: 15 });
  };

  // 计算地图像素坐标的映射函数 (模拟用，以便将经纬度转为页面定位)
  const getPixelPosition = (lat, lng) => {
    // 基准中心设在静安大悦城 (31.246, 121.474)
    const baseLat = 31.21;
    const baseLng = 121.43;
    
    // 每 0.01 经纬度折合多少像素
    const scale = zoomLevel === 1 ? 1600 : 3200;
    
    const x = 160 + (lng - baseLng) * scale + mapOffset.x;
    const y = 240 - (lat - baseLat) * scale - mapOffset.y; // 纬度越高越往上 (y减)
    
    return { x, y };
  };

  // 模拟雷达扫描出的同好实时位置数据
  const mockNearbyUsers = useMemo(() => [
    {
      id: 'u-001',
      name: '小透明栗子',
      status: '大悦城排队吃谷中',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      lat: 31.238,
      lng: 121.460,
      badge: '痛包打卡'
    },
    {
      id: 'u-002',
      name: '社恐小林',
      status: 'Cos妆造中',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      lat: 31.222,
      lng: 121.410,
      badge: '排队面基'
    },
    {
      id: 'u-003',
      name: '吃土阿松',
      status: '寻同好分摊福袋',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80',
      lat: 31.201,
      lng: 121.360,
      badge: '求拼单'
    }
  ], []);

  const triggerRadarScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setShowNearbyUsers(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
    setTimeout(() => {
      setShowNearbyUsers(false);
    }, 10000); // 10秒后自动隐藏，保持大地图只显示活动和开团信息的清爽感
  };

  const getSkinStyles = () => {
    switch (mapSkin) {
      case 'cyberpunk':
        return {
          containerBg: '#090b16',
          lakeStyle: {
            background: 'linear-gradient(135deg, #ff007f 0%, #7b2cbf 100%)',
            boxShadow: '0 0 15px rgba(255, 0, 127, 0.45)',
            border: 'none',
            opacity: 0.6
          },
          parkStyle: {
            background: 'linear-gradient(135deg, #00f3ff 0%, #0077b6 100%)',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.45)',
            border: 'none',
            opacity: 0.5
          },
          roadStyle: {
            backgroundColor: '#1b1e38',
            border: 'none',
            boxShadow: '0 0 8px rgba(0, 243, 255, 0.15)'
          }
        };
      case 'comic':
        return {
          containerBg: '#FFFFFF',
          lakeStyle: {
            background: 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, transparent 2px, transparent 8px)',
            border: '2px solid #000000',
            borderRadius: '16px'
          },
          parkStyle: {
            backgroundColor: '#f0f0f0',
            backgroundImage: 'radial-gradient(#b0b0b0 10%, transparent 11%)',
            backgroundSize: '6px 6px',
            border: '2px solid #000000',
            borderRadius: '8px'
          },
          roadStyle: {
            backgroundColor: '#FFFFFF',
            borderLeft: '2px solid #000000',
            borderRight: '2px solid #000000',
            borderTop: '2px solid #000000',
            borderBottom: '2px solid #000000'
          }
        };
      case 'morandi':
      default:
        return {
          containerBg: 'var(--m-map-base)',
          lakeStyle: {
            backgroundColor: '#CADCE6'
          },
          parkStyle: {
            backgroundColor: 'var(--m-map-green)'
          },
          roadStyle: {
            backgroundColor: 'var(--m-map-road)'
          }
        };
    }
  };

  const skin = getSkinStyles();

  // 根据当前选中的 Marker 查找其详情数据
  const activeSelectedInfo = useMemo(() => {
    if (!selectedMarker) return null;
    if (selectedMarker.type === 'activity') {
      return activities.find(a => a.id === selectedMarker.id) || null;
    }
    if (selectedMarker.type === 'group') {
      return groups.find(g => g.id === selectedMarker.id) || null;
    }
    return null;
  }, [selectedMarker, activities, groups]);

  return (
    <div className="w-full h-full flex flex-col relative select-none">
      {/* CSS动画与全局滚动条/过渡注入 */}
      <style>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseRadarRing {
          0% { transform: scale(0.1); opacity: 0.8; }
          80% { opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(229, 169, 169, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(229, 169, 169, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(229, 169, 169, 0); }
        }
        @keyframes scannedUserLifecycle {
          0% { transform: translate(-50%, -70%) scale(0.4); opacity: 0; }
          6% { transform: translate(-50%, -105%) scale(1.1); opacity: 1; }
          8% { transform: translate(-50%, -100%) scale(1); opacity: 1; }
          90% { transform: translate(-50%, -100%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -100%) scale(0.4); opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: var(--m-primary);
          border-radius: 99px;
        }
        @keyframes bondDash {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes bondReveal {
          from {
            stroke-opacity: 0;
          }
          to {
            stroke-opacity: 1;
          }
        }
        @keyframes satelliteReveal {
          from {
            transform: translate(-50%, -100%) scale(0.2);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -100%) scale(1);
            opacity: 1;
          }
        }
        .satellite-reveal {
          animation: satelliteReveal 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
      
      {/* 顶部悬浮面板：搜索框与单选筛选条 */}
      <div className="floating-overlay-top">
        
        {/* 搜索框 */}
        <div 
          className="glass-panel floating-search-bar"
          style={{
            transition: 'all 0.3s ease',
            ...(mapSkin === 'comic' ? { border: '2px solid #000000', boxShadow: '3px 3px 0 #000000', background: '#FFFFFF' } : {}),
            ...(mapSkin === 'cyberpunk' ? { border: '1px solid #ff007f', background: 'rgba(9,11,22,0.85)', boxShadow: '0 0 15px rgba(255,0,127,0.25)' } : {})
          }}
        >
          <Search size={14} className={mapSkin === 'cyberpunk' ? "text-[#ff007f]" : "text-neutral-400"} />
          <input 
            type="text" 
            placeholder="搜索活动、地点、IP或拼团..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (searchQuery.length > 0) setShowSearchResults(true);
            }}
            className="floating-search-input"
            style={mapSkin === 'cyberpunk' ? { color: '#FFFFFF' } : {}}
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={13} className="text-neutral-400" />
            </button>
          )}
        </div>

        {/* 快速搜索结果抽屉 (去 Emoji 字符) */}
        {showSearchResults && (
          <div 
            className="glass-panel animate-fade-in" 
            style={{
              maxHeight: '180px',
              overflowY: 'auto',
              borderRadius: '16px',
              padding: '8px',
              marginTop: '4px',
              transition: 'all 0.3s ease',
              ...(mapSkin === 'comic' ? { border: '2px solid #000000', boxShadow: '3px 3px 0 #000000', background: '#FFFFFF' } : {}),
              ...(mapSkin === 'cyberpunk' ? { border: '1px solid #ff007f', background: 'rgba(9,11,22,0.95)', color: '#FFFFFF' } : {})
            }}
          >
            {filteredMarkers.activities.length === 0 && filteredMarkers.groups.length === 0 ? (
              <div className="py-6 text-center text-[10px] text-neutral-400">
                未找到匹配的地标或拼团
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {/* 搜到的活动 */}
                {filteredMarkers.activities.map(act => (
                  <div 
                    key={act.id}
                    onClick={() => handleSearchSelect('activity', act.id)}
                    className="p-2 hover:bg-neutral-100 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span className="badge badge-peach scale-90 origin-left">活动</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--m-text-main)', marginLeft: '6px' }}>
                        {act.title}
                      </span>
                    </div>
                    <ArrowRight size={10} className="text-neutral-400" />
                  </div>
                ))}
                
                {/* 搜到的拼团 */}
                {filteredMarkers.groups.map(grp => (
                  <div 
                    key={grp.id}
                    onClick={() => handleSearchSelect('group', grp.id)}
                    className="p-2 hover:bg-neutral-100 rounded-lg flex items-center justify-between cursor-pointer"
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span className="badge badge-blue scale-90 origin-left">拼团</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--m-text-main)', marginLeft: '6px' }}>
                        {grp.title}
                      </span>
                    </div>
                    <ArrowRight size={10} className="text-neutral-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 筛选条 (高亮莫兰迪粉，严格限定单选) */}
        <div className="filter-bar">
          {[
            { key: 'all', label: '全部地标' },
            { key: 'activity', label: '同好活动' },
            { key: 'group', label: '拼团面基' },
            { key: 'upcoming', label: '即将开始' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => {
                setActiveFilter(item.key);
                setSelectedMarker(null); // 切换筛选重置选中
              }}
              className={`filter-item ${activeFilter === item.key ? 'active' : ''}`}
              style={{
                transition: 'all 0.3s ease',
                ...(mapSkin === 'comic' ? { 
                  border: activeFilter === item.key ? '2.5px solid #000' : '1.5px solid #000', 
                  boxShadow: activeFilter === item.key ? '2px 2px 0 #000' : 'none',
                  background: activeFilter === item.key ? 'var(--m-primary)' : '#FFF'
                } : {}),
                ...(mapSkin === 'cyberpunk' ? {
                  backgroundColor: activeFilter === item.key ? 'var(--m-primary)' : 'rgba(9, 11, 22, 0.75)',
                  borderColor: activeFilter === item.key ? '#ff007f' : 'rgba(255,255,255,0.15)',
                  color: activeFilter === item.key ? '#FFF' : '#A8BDD1'
                } : {})
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* 地图底图画布 (使用 CSS 模拟精美手绘质感地图) */}
      <div 
        className="map-canvas-container"
        onClick={() => setSelectedMarker(null)} // 点击空白收起卡片
        style={{
          backgroundColor: skin.containerBg,
          transition: 'background-color 0.5s ease',
          position: 'relative'
        }}
      >
        
        {/* 模拟河流水系 */}
        <div className="map-lake" style={{ top: '180px', left: '10px', width: '90px', height: '140px', transform: 'rotate(-20deg)', ...skin.lakeStyle, transition: 'all 0.5s ease' }}></div>
        <div className="map-lake" style={{ top: '380px', right: '40px', width: '120px', height: '120px', ...skin.lakeStyle, transition: 'all 0.5s ease' }}></div>
        
        {/* 模拟公园绿化 */}
        <div className="map-park" style={{ top: '80px', left: '140px', width: '80px', height: '60px', ...skin.parkStyle, transition: 'all 0.5s ease' }}></div>
        <div className="map-park" style={{ bottom: '150px', left: '40px', width: '110px', height: '90px', ...skin.parkStyle, transition: 'all 0.5s ease' }}></div>
        
        {/* 模拟道路交叉 */}
        <div className="map-road" style={{ left: '80px', top: '0', width: '20px', height: '100%', ...skin.roadStyle, transition: 'all 0.5s ease' }}></div>
        <div className="map-road" style={{ left: '0', top: '260px', width: '100%', height: '24px', ...skin.roadStyle, transition: 'all 0.5s ease' }}></div>
        <div className="map-road" style={{ left: '260px', top: '0', width: '16px', height: '100%', ...skin.roadStyle, transition: 'all 0.5s ease' }}></div>
        
        {/* ============================================================== */}
        {/* 1. 渲染用户当前位置点 (闪烁指南星动效，不展示陌生人) */}
        {(() => {
          const pos = getPixelPosition(userLocation.lat, userLocation.lng);
          return (
            <div 
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
                pointerEvents: 'none'
              }}
            >
              {/* 粒子呼吸光环 */}
              <div 
                style={{
                  position: 'absolute',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: mapSkin === 'cyberpunk' ? 'rgba(0, 243, 255, 0.4)' : 'rgba(168, 189, 209, 0.4)',
                  left: '-12px',
                  top: '-12px',
                  animation: 'pulseRing 2s infinite'
                }}
              ></div>
              <div 
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: mapSkin === 'cyberpunk' ? '#00f3ff' : 'var(--m-secondary)',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              ></div>
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* 1.5. 渲染被激活活动下的卫星化学连接线 */}
        <svg 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 18
          }}
        >
          {filteredMarkers.activities.map(act => {
            if (isClustered && act.id === 'act-001') return null;
            
            const relatedGroups = filteredMarkers.groups.filter(g => g.relatedActivityId === act.id);
            if (relatedGroups.length === 0) return null;
            
            const isSelected = selectedMarker?.type === 'activity' && selectedMarker?.id === act.id;
            const isAnyRelatedGroupSelected = relatedGroups.some(g => selectedMarker?.type === 'group' && selectedMarker?.id === g.id);
            const showOrbitGroups = isSelected || isAnyRelatedGroupSelected || activeFilter === 'group';
            
            if (!showOrbitGroups) return null;
            
            const actPos = getPixelPosition(act.lat, act.lng);
            const centerX = actPos.x;
            const centerY = actPos.y - 15; // 中心点
            
            return relatedGroups.map((grp, idx) => {
              const getOrbitAngle = (index, total) => {
                if (total === 1) return -90;
                const startAngle = -160;
                const endAngle = -20;
                const step = (endAngle - startAngle) / (total - 1);
                return startAngle + index * step;
              };
              
              const angleRad = (getOrbitAngle(idx, relatedGroups.length) * Math.PI) / 180;
              const orbitRadius = 48;
              const groupX = centerX + orbitRadius * Math.cos(angleRad);
              const groupY = centerY + orbitRadius * Math.sin(angleRad);
              
              let strokeColor = 'rgba(168, 189, 209, 0.6)';
              if (mapSkin === 'cyberpunk') strokeColor = 'rgba(0, 243, 255, 0.7)';
              if (mapSkin === 'comic') strokeColor = '#000';
              
              return (
                <g key={`bond-${grp.id}`} className="satellite-reveal">
                  {mapSkin === 'cyberpunk' && (
                    <line 
                      x1={centerX} 
                      y1={centerY} 
                      x2={groupX} 
                      y2={groupY} 
                      stroke="#00f3ff" 
                      strokeWidth="3"
                      opacity="0.25"
                      style={{ filter: 'blur(2.5px)' }}
                    />
                  )}
                  <line 
                    x1={centerX} 
                    y1={centerY} 
                    x2={groupX} 
                    y2={groupY} 
                    stroke={strokeColor} 
                    strokeWidth={mapSkin === 'comic' ? '2.5' : '1.5'} 
                    style={{
                      strokeDasharray: mapSkin === 'comic' ? 'none' : '3, 3',
                      animation: mapSkin === 'comic' ? 'none' : 'bondDash 1.5s linear infinite'
                    }}
                  />
                </g>
              );
            });
          })}
        </svg>

        {/* ============================================================== */}
        {/* 2. 渲染地标点位 - 活动 (以及它们下属的卫星放射状拼团) */}
        {filteredMarkers.activities.map(act => {
          if (isClustered && act.id === 'act-001') return null;
          
          const pos = getPixelPosition(act.lat, act.lng);
          const isSelected = selectedMarker?.type === 'activity' && selectedMarker?.id === act.id;
          
          const relatedGroups = filteredMarkers.groups.filter(g => g.relatedActivityId === act.id);
          const isAnyRelatedGroupSelected = relatedGroups.some(g => selectedMarker?.type === 'group' && selectedMarker?.id === g.id);
          const showOrbitGroups = isSelected || isAnyRelatedGroupSelected || activeFilter === 'group';
          
          return (
            <React.Fragment key={act.id}>
              {/* 活动 Pin */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMarker({ type: 'activity', id: act.id });
                  setDrawerHeight('half');
                }}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: isSelected ? 'translate(-50%, -100%) scale(1.15)' : 'translate(-50%, -100%) scale(1)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 29 : 20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                {/* 活动小圆形 */}
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--m-primary)',
                  border: mapSkin === 'comic' ? '2px solid #000' : '2px solid #FFFFFF',
                  boxShadow: isSelected 
                    ? '0 0 0 4px rgba(255, 107, 107, 0.3), 0 4px 12px rgba(255, 107, 107, 0.5)'
                    : (mapSkin === 'comic' ? '2px 2px 0 #000' : '0 2px 8px rgba(0,0,0,0.15)'),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#FFFFFF',
                  position: 'relative'
                }}>
                  {act.type === 'comic_con' ? <Ticket size={16} /> : <MapPin size={16} />}
                  
                  {/* 下指针 */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--m-primary)',
                    borderRight: mapSkin === 'comic' ? '2px solid #000' : '2px solid #FFFFFF',
                    borderBottom: mapSkin === 'comic' ? '2px solid #000' : '2px solid #FFFFFF',
                    zIndex: -1
                  }} />
                </div>
                
                {/* 地标标题 */}
                <span 
                  style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    backgroundColor: mapSkin === 'cyberpunk' ? 'rgba(15,17,36,0.9)' : 'rgba(255,255,255,0.95)',
                    color: mapSkin === 'cyberpunk' ? '#FFF' : 'var(--m-text-main)',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    marginTop: '6px',
                    border: mapSkin === 'comic' ? '1.5px solid #000' : 'none',
                    whiteSpace: 'nowrap',
                    boxShadow: mapSkin === 'comic' ? '2px 2px 0 #000' : '0 2px 6px rgba(0,0,0,0.08)'
                  }}
                >
                  {act.title.substring(0, 4)}{act.title.length > 4 ? '...' : ''}
                </span>
              </div>

              {/* 放射卫星拼团小球 */}
              {showOrbitGroups && relatedGroups.map((grp, idx) => {
                const isGrpSelected = selectedMarker?.type === 'group' && selectedMarker?.id === grp.id;
                const centerX = pos.x;
                const centerY = pos.y - 15; // center of parent pin
                
                const getOrbitAngle = (index, total) => {
                  if (total === 1) return -90;
                  const startAngle = -160;
                  const endAngle = -20;
                  const step = (endAngle - startAngle) / (total - 1);
                  return startAngle + index * step;
                };
                
                const angleRad = (getOrbitAngle(idx, relatedGroups.length) * Math.PI) / 180;
                const orbitRadius = 48;
                const groupX = centerX + orbitRadius * Math.cos(angleRad);
                const groupY = centerY + orbitRadius * Math.sin(angleRad);
                
                return (
                  <div
                    key={grp.id}
                    className="satellite-reveal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarker({ type: 'group', id: grp.id });
                      setDrawerHeight('half');
                    }}
                    style={{
                      position: 'absolute',
                      left: `${groupX}px`,
                      top: `${groupY}px`,
                      cursor: 'pointer',
                      zIndex: isGrpSelected ? 29 : 21,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transform: isGrpSelected ? 'translate(-50%, -100%) scale(1.15)' : 'translate(-50%, -100%) scale(1)',
                      transition: 'transform 0.2s ease-out'
                    }}
                  >
                    {/* 拼团小圆形 */}
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: mapSkin === 'comic' ? '2px solid #000' : '2px solid var(--m-secondary)',
                      boxShadow: isGrpSelected 
                        ? '0 0 0 4px rgba(107, 153, 255, 0.3), 0 4px 12px rgba(107, 153, 255, 0.5)'
                        : (mapSkin === 'comic' ? '2px 2px 0 #000' : '0 2px 8px rgba(0,0,0,0.15)'),
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative'
                    }}>
                      <img 
                        src={grp.creator.avatar} 
                        alt="avatar" 
                        style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      
                      {/* 进度角标 */}
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-8px',
                        backgroundColor: grp.status === 'full' ? 'var(--m-text-muted)' : 'var(--m-secondary)',
                        color: '#FFF',
                        fontSize: '7px',
                        fontWeight: 'bold',
                        padding: '1px 4px',
                        borderRadius: '6px',
                        border: '1px solid #FFF',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}>
                        {grp.currentMembers}/{grp.maxMembers}
                      </div>
                    </div>
                    
                    {/* 拼团标题 */}
                    <span 
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        backgroundColor: mapSkin === 'cyberpunk' ? 'rgba(15,17,36,0.9)' : 'rgba(255,255,255,0.95)',
                        color: mapSkin === 'cyberpunk' ? '#FFF' : 'var(--m-text-main)',
                        padding: '2px 6px',
                        borderRadius: '12px',
                        marginTop: '6px',
                        border: mapSkin === 'comic' ? '1.5px solid #000' : 'none',
                        whiteSpace: 'nowrap',
                        boxShadow: mapSkin === 'comic' ? '2px 2px 0 #000' : '0 2px 6px rgba(0,0,0,0.08)'
                      }}
                    >
                      {grp.title.substring(0, 4)}{grp.title.length > 4 ? '...' : ''}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}

        {/* ============================================================== */}
        {/* 3. 渲染地标点位 - 独立拼团 (当且仅当切换到 "拼团面基" 过滤选项或被选中时展示) */}
        {filteredMarkers.groups.filter(g => !g.relatedActivityId).map(grp => {
          if (isClustered && grp.id === 'grp-003') return null;
          
          const isSelected = selectedMarker?.type === 'group' && selectedMarker?.id === grp.id;
          const showStandalone = activeFilter === 'group' || isSelected;
          
          if (!showStandalone) return null;
          
          const pos = getPixelPosition(grp.lat, grp.lng);
          
          return (
            <div
              key={grp.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMarker({ type: 'group', id: grp.id });
                setDrawerHeight('half');
              }}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: isSelected ? 'translate(-50%, -100%) scale(1.15)' : 'translate(-50%, -100%) scale(1)',
                cursor: 'pointer',
                zIndex: isSelected ? 29 : 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              {/* 拼团小圆形 */}
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: mapSkin === 'comic' ? '2px solid #000' : '2px solid var(--m-secondary)',
                boxShadow: isSelected 
                  ? '0 0 0 4px rgba(107, 153, 255, 0.3), 0 4px 12px rgba(107, 153, 255, 0.5)'
                  : (mapSkin === 'comic' ? '2px 2px 0 #000' : '0 2px 8px rgba(0,0,0,0.15)'),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
              }}>
                <img 
                  src={grp.creator.avatar} 
                  alt="avatar" 
                  style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                
                {/* 进度角标 */}
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  backgroundColor: grp.status === 'full' ? 'var(--m-text-muted)' : 'var(--m-secondary)',
                  color: '#FFF',
                  fontSize: '7px',
                  fontWeight: 'bold',
                  padding: '1px 4px',
                  borderRadius: '6px',
                  border: '1px solid #FFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}>
                  {grp.currentMembers}/{grp.maxMembers}
                </div>
                
                {/* 下指针 */}
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--m-secondary)',
                  borderRight: mapSkin === 'comic' ? '2px solid #000' : 'none',
                  borderBottom: mapSkin === 'comic' ? '2px solid #000' : 'none',
                  zIndex: -1
                }} />
              </div>
              
              {/* 拼团标题 */}
              <span 
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  backgroundColor: mapSkin === 'cyberpunk' ? 'rgba(15,17,36,0.9)' : 'rgba(255,255,255,0.95)',
                  color: mapSkin === 'cyberpunk' ? '#FFF' : 'var(--m-text-main)',
                  padding: '2px 6px',
                  borderRadius: '12px',
                  marginTop: '6px',
                  border: mapSkin === 'comic' ? '1.5px solid #000' : 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: mapSkin === 'comic' ? '2px 2px 0 #000' : '0 2px 6px rgba(0,0,0,0.08)'
                }}
              >
                {grp.title.substring(0, 4)}{grp.title.length > 4 ? '...' : ''}
              </span>
            </div>
          );
        })}

        {/* ============================================================== */}
        {/* 4. 模拟聚合点展示 (虹桥国展中心有 1 个大活动 + 1 个吃火锅聚餐团，在 zoom=1 时聚合) */}
        {isClustered && activeFilter !== 'activity' && activeFilter !== 'group' && (
          (() => {
            const pos = getPixelPosition(31.192, 121.299);
            return (
              <div
                onClick={handleClusterClick}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* 涟漪光圈 */}
                <div 
                  style={{
                    position: 'absolute',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(229, 169, 169, 0.2)',
                    left: '-4px',
                    top: '-4px',
                    animation: 'pulseRing 2.5s infinite'
                  }}
                ></div>
                
                {/* 聚合点数字球 (莫兰迪粉与蓝点缀) */}
                <div 
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--m-primary)',
                    border: mapSkin === 'comic' ? '2.5px solid #000' : '2px solid #FFFFFF',
                    boxShadow: mapSkin === 'comic' ? '3px 3px 0 #000' : 'var(--m-shadow-md)',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  2
                </div>
                <span 
                  style={{
                    fontSize: '7px',
                    fontWeight: 800,
                    color: 'var(--m-text-sub)',
                    backgroundColor: '#FFFFFF',
                    padding: '1px 4px',
                    borderRadius: '4px',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    border: mapSkin === 'comic' ? '1.5px solid #000' : '0.5px solid var(--m-border)'
                  }}
                >
                  虹桥国展区
                </span>
              </div>
            );
          })()
        )}

        {/* ============================================================== */}
        {/* 5. 雷达扫描动效覆盖层 */}
        {isScanning && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 15,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
          >
            {/* 渐变雷达扇形扫描线 */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '400px',
                height: '400px',
                marginTop: '-200px',
                marginLeft: '-200px',
                background: mapSkin === 'cyberpunk' 
                  ? 'conic-gradient(from 0deg, rgba(0, 243, 255, 0.4) 0deg, rgba(0, 243, 255, 0) 90deg, transparent 360deg)'
                  : 'conic-gradient(from 0deg, rgba(229, 169, 169, 0.4) 0deg, rgba(229, 169, 169, 0) 90deg, transparent 360deg)',
                borderRadius: '50%',
                animation: 'radarSweep 2.5s linear infinite'
              }}
            ></div>
            {/* 雷达扫描波圈 */}
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                marginTop: '-100px',
                marginLeft: '-100px',
                border: mapSkin === 'cyberpunk' ? '2px solid rgba(0, 243, 255, 0.6)' : '2px solid rgba(229, 169, 169, 0.6)',
                borderRadius: '50%',
                animation: 'pulseRadarRing 2s ease-out infinite'
              }}
            ></div>
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '300px',
                height: '300px',
                marginTop: '-150px',
                marginLeft: '-150px',
                border: mapSkin === 'cyberpunk' ? '1.5px solid rgba(0, 243, 255, 0.4)' : '1.5px solid rgba(229, 169, 169, 0.4)',
                borderRadius: '50%',
                animation: 'pulseRadarRing 2s ease-out infinite',
                animationDelay: '0.8s'
              }}
            ></div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. 渲染附近的同好 (Zenly 风格 Q版头像/气泡挂件 - 仅雷达扫描时显示且具有生命周期) */}
        {showNearbyUsers && mockNearbyUsers.map(user => {
          const pos = getPixelPosition(user.lat, user.lng);
          return (
            <div
              key={user.id}
              onClick={(e) => {
                e.stopPropagation();
                pushRoute('chat-window', { chatWith: user.name, avatar: user.avatar }, 'map');
              }}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                zIndex: 26,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                animation: 'scannedUserLifecycle 10s forwards'
              }}
            >
              {/* 实时动态气泡 bubble tag */}
              <div 
                style={{
                  backgroundColor: mapSkin === 'comic' ? '#FFFFFF' : (mapSkin === 'cyberpunk' ? '#161932' : 'rgba(255, 255, 255, 0.94)'),
                  border: mapSkin === 'comic' ? '1.5px solid #000000' : (mapSkin === 'cyberpunk' ? '1px solid #00f3ff' : '1px solid var(--m-border)'),
                  boxShadow: mapSkin === 'comic' ? '2px 2px 0 #000000' : '0 3px 10px rgba(0,0,0,0.1)',
                  borderRadius: '10px',
                  padding: '3px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
              >
                <Flame size={8} className="text-[#FF5E5E]" />
                <span style={{ fontSize: '7.5px', fontWeight: 800, color: mapSkin === 'cyberpunk' ? '#FFF' : 'var(--m-text-main)' }}>
                  {user.name} · <span style={{ color: 'var(--m-primary)', fontWeight: 900 }}>{user.badge}</span>
                </span>
                {/* 气泡尖角 */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: '6px',
                    height: '6px',
                    backgroundColor: mapSkin === 'comic' ? '#FFFFFF' : (mapSkin === 'cyberpunk' ? '#161932' : 'rgba(255, 255, 255, 0.94)'),
                    borderRight: mapSkin === 'comic' ? '1.5px solid #000000' : (mapSkin === 'cyberpunk' ? '1px solid #00f3ff' : '1px solid var(--m-border)'),
                    borderBottom: mapSkin === 'comic' ? '1.5px solid #000000' : (mapSkin === 'cyberpunk' ? '1px solid #00f3ff' : '1px solid var(--m-border)'),
                  }}
                ></div>
              </div>

              {/* 用户头像圆环 */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: mapSkin === 'comic' ? '2px solid #000000' : (mapSkin === 'cyberpunk' ? '2px solid #00f3ff' : '2px solid #FFFFFF'),
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <img src={user.avatar} alt="user avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              {/* 呼吸绿点 (表示在线) */}
              <div 
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#4CD964',
                  borderRadius: '50%',
                  border: '1.5px solid #FFFFFF',
                  bottom: '2px',
                  right: '6px'
                }}
              ></div>
            </div>
          );
        })}

      </div>

      {/* 右侧悬浮功能面板 (包含雷达扫描、皮肤切换、定位重置) */}
      <div 
        style={{
          position: 'absolute',
          bottom: selectedMarker ? (drawerHeight === 'full' ? '490px' : (drawerHeight === 'half' ? '280px' : '160px')) : '72px',
          right: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 32,
          transition: 'bottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* 雷达扫描 */}
        <button 
          onClick={triggerRadarScan}
          className="glass-panel interactive-scale btn-round"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: isScanning ? 'var(--m-primary)' : '#FFFFFF',
            border: mapSkin === 'comic' ? '2.5px solid #000' : (mapSkin === 'cyberpunk' ? '1.5px solid #ff007f' : '1px solid var(--m-border)'),
            boxShadow: mapSkin === 'comic' ? '2px 2px 0 #000' : 'var(--m-shadow-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isScanning ? '#FFFFFF' : 'var(--m-text-main)'
          }}
          title="雷达同好扫描"
        >
          <Radio size={14} className={isScanning ? "animate-pulse" : ""} />
        </button>

        {/* 地图图层/皮肤切换 */}
        <button 
          onClick={() => {
            const skins = ['morandi', 'cyberpunk', 'comic'];
            const nextIdx = (skins.indexOf(mapSkin) + 1) % skins.length;
            setMapSkin(skins[nextIdx]);
          }}
          className="glass-panel interactive-scale btn-round"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#FFFFFF',
            border: mapSkin === 'comic' ? '2.5px solid #000' : (mapSkin === 'cyberpunk' ? '1.5px solid #ff007f' : '1px solid var(--m-border)'),
            boxShadow: mapSkin === 'comic' ? '2px 2px 0 #000' : 'var(--m-shadow-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--m-text-main)'
          }}
          title="切换地图风格"
        >
          <Layers size={14} />
        </button>

        {/* 重新定位 */}
        <button 
          onClick={handleRecenter}
          className="glass-panel interactive-scale btn-round"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#FFFFFF',
            border: mapSkin === 'comic' ? '2.5px solid #000' : (mapSkin === 'cyberpunk' ? '1.5px solid #ff007f' : '1px solid var(--m-border)'),
            boxShadow: mapSkin === 'comic' ? '2px 2px 0 #000' : 'var(--m-shadow-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--m-text-main)'
          }}
          title="复位中心"
        >
          <Navigation size={14} />
        </button>
      </div>

      {/* ============================================================== */}
      {/* 底部点位抽屉 (支持手势点击扩展Peek/Half/Full，符合二次元潮流高品质UI设计) */}
      {selectedMarker && activeSelectedInfo && (
        <div 
          className="glass-panel bottom-summary-drawer"
          onClick={(e) => e.stopPropagation()} // 防止穿透
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '12px',
            right: '12px',
            borderRadius: '24px 24px 20px 20px',
            padding: '12px 14px',
            height: drawerHeight === 'full' ? '420px' : (drawerHeight === 'half' ? '210px' : '90px'),
            maxHeight: '420px',
            transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.5s ease, border 0.5s ease',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: mapSkin === 'cyberpunk' ? 'rgba(9, 11, 22, 0.95)' : (mapSkin === 'comic' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.95)'),
            border: mapSkin === 'comic' ? '2.5px solid #000000' : (mapSkin === 'cyberpunk' ? '1.5px solid #ff007f' : '1px solid var(--m-border)'),
            boxShadow: mapSkin === 'comic' ? '4px -4px 0 #000000' : '0 -10px 30px rgba(0,0,0,0.08)',
            zIndex: 110
          }}
        >
          {/* (样式定义已移至顶层，确保在未选中点位时动效可用) */}

          {/* 拖拽/点击扩展条 */}
          <div 
            style={{ 
              width: '40px', 
              height: '5px', 
              borderRadius: '2.5px', 
              backgroundColor: mapSkin === 'cyberpunk' ? '#ff007f' : (mapSkin === 'comic' ? '#000000' : '#E2E5E8'), 
              alignSelf: 'center', 
              marginBottom: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
            onClick={() => {
              if (drawerHeight === 'peek') setDrawerHeight('half');
              else if (drawerHeight === 'half') setDrawerHeight('full');
              else setDrawerHeight('peek');
            }}
          />

          {/* 活动点位 */}
          {selectedMarker.type === 'activity' ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              
              {/* Peek 状态简短头部 */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                <img 
                  src={activeSelectedInfo.cover} 
                  alt="cover" 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid var(--m-border)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '10.5px', fontWeight: 800, color: mapSkin === 'cyberpunk' ? '#FFFFFF' : 'var(--m-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '180px' }}>
                      {activeSelectedInfo.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button 
                        onClick={() => {
                          if (drawerHeight === 'peek') setDrawerHeight('half');
                          else if (drawerHeight === 'half') setDrawerHeight('full');
                          else setDrawerHeight('peek');
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--m-text-muted)', display: 'flex', padding: 0 }}
                      >
                        {drawerHeight === 'full' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                      <button 
                        onClick={() => setSelectedMarker(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--m-text-muted)', display: 'flex', padding: 0 }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                    <span className="badge badge-peach scale-75 origin-left">
                      {activeSelectedInfo.type === 'comic_con' ? '大型漫展' : '快闪店'}
                    </span>
                    <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)' }}>
                      想去: {activeSelectedInfo.wantedCount}人
                    </span>
                  </div>
                </div>
              </div>

              {/* 中间区：在 Half 或 Full 状态展示 */}
              {drawerHeight !== 'peek' && (
                <div 
                  className="custom-scrollbar"
                  style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    marginTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    paddingBottom: '8px'
                  }}
                >
                  {/* 横向标签和基本信息 */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {activeSelectedInfo.tags.map((t, i) => (
                      <span key={i} className="badge badge-slate scale-90 origin-left">{t}</span>
                    ))}
                  </div>

                  {/* 详细时间与地址 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '8.5px', color: 'var(--m-text-sub)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={11} className="text-neutral-400" />
                      <span>{activeSelectedInfo.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={11} className="text-neutral-400" />
                      <span style={{ wordBreak: 'break-all' }}>{activeSelectedInfo.location}</span>
                    </div>
                  </div>

                  {/* Full 状态专属扩展：介绍与本场想去同好 */}
                  {drawerHeight === 'full' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--m-border)', paddingTop: '10px' }}>
                      {/* 介绍 */}
                      <div>
                        <h4 style={{ fontSize: '9px', fontWeight: 900, color: 'var(--m-primary)', marginBottom: '3px' }}>展会介绍</h4>
                        <p style={{ fontSize: '8px', color: 'var(--m-text-sub)', lineHeight: '1.4' }}>{activeSelectedInfo.intro}</p>
                      </div>

                      {/* 想去同好 */}
                      <div>
                        <h4 style={{ fontSize: '9px', fontWeight: 900, color: 'var(--m-primary)', marginBottom: '4px' }}>想去的附近同好 (3位在线)</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {mockNearbyUsers.map(user => (
                            <div 
                              key={user.id} 
                              onClick={() => pushRoute('chat-window', { chatWith: user.name, avatar: user.avatar }, 'map')}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                backgroundColor: mapSkin === 'cyberpunk' ? '#1b1e38' : '#F6F5F2', 
                                padding: '3px 6px', 
                                borderRadius: '8px',
                                border: '0.5px solid var(--m-border)',
                                cursor: 'pointer'
                              }}
                            >
                              <img src={user.avatar} alt="avatar" style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
                              <span style={{ fontSize: '7px', fontWeight: 800, color: 'var(--m-text-main)' }}>{user.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 二次元打卡快捷交流按钮 */}
                      <button 
                        onClick={() => pushRoute('circle-detail', { circleId: 'circle-001' }, 'map')}
                        className="btn-round btn-secondary interactive-scale"
                        style={{ fontSize: '8px', padding: '6px 12px', gap: '4px', border: '1px dashed var(--m-primary)' }}
                      >
                        <Sparkles size={10} className="text-[#E5A9A9]" />
                        <span>进入该同好交流营</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 底部操作区：在 Half 或 Full 状态展示 */}
              {drawerHeight !== 'peek' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--m-border)', flexShrink: 0 }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-primary)' }}>
                    热度指数: {activeSelectedInfo.heatScore}°C
                  </span>
                  <button 
                    onClick={() => pushRoute('activity-detail', { activityId: activeSelectedInfo.id }, 'map')}
                    className="btn-round btn-primary interactive-scale"
                    style={{
                      padding: '5px 12px',
                      fontSize: '9px',
                      gap: '4px'
                    }}
                  >
                    <span>查看展会大图详情</span>
                    <ArrowRight size={10} />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* 拼团点位 */
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              
              {/* Peek 状态简短头部 */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                <img 
                  src={activeSelectedInfo.creator.avatar} 
                  alt="creator avatar" 
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1px solid var(--m-border)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '10.5px', fontWeight: 800, color: mapSkin === 'cyberpunk' ? '#FFFFFF' : 'var(--m-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '180px' }}>
                      {activeSelectedInfo.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button 
                        onClick={() => {
                          if (drawerHeight === 'peek') setDrawerHeight('half');
                          else if (drawerHeight === 'half') setDrawerHeight('full');
                          else setDrawerHeight('peek');
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--m-text-muted)', display: 'flex', padding: 0 }}
                      >
                        {drawerHeight === 'full' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>
                      <button 
                        onClick={() => setSelectedMarker(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--m-text-muted)', display: 'flex', padding: 0 }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '2px', alignItems: 'center' }}>
                    <span className="badge badge-blue scale-75 origin-left">拼团面基</span>
                    <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)' }}>
                      发起人: {activeSelectedInfo.creator.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* 中间区：在 Half 或 Full 状态展示 */}
              {drawerHeight !== 'peek' && (
                <div 
                  className="custom-scrollbar"
                  style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    marginTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    paddingBottom: '8px'
                  }}
                >
                  {/* 限额和状态 */}
                  <div style={{ display: 'flex', gap: '6px', fontSize: '8.5px', color: 'var(--m-text-sub)' }}>
                    <span>已加入: <strong style={{ color: 'var(--m-text-main)' }}>{activeSelectedInfo.currentMembers} / {activeSelectedInfo.maxMembers} 人</strong></span>
                    <span>·</span>
                    <span>要求: <strong style={{ color: 'var(--m-text-main)' }}>{activeSelectedInfo.requirementSummary}</strong></span>
                  </div>

                  {/* 集合时间与见面地址 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '8.5px', color: 'var(--m-text-sub)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={11} className="text-neutral-400" />
                      <span>{new Date(activeSelectedInfo.startTime).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={11} className="text-neutral-400" />
                      <span style={{ wordBreak: 'break-all' }}>{activeSelectedInfo.meetingAddress}</span>
                    </div>
                  </div>

                  {/* Full 状态专属扩展：团寄语与已入团团员 */}
                  {drawerHeight === 'full' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--m-border)', paddingTop: '10px' }}>
                      {/* 介绍 */}
                      <div>
                        <h4 style={{ fontSize: '9px', fontWeight: 900, color: 'var(--m-secondary)', marginBottom: '3px' }}>团长寄语</h4>
                        <p style={{ fontSize: '8px', color: 'var(--m-text-sub)', lineHeight: '1.4' }}>
                          本团为同好线下聚会，主打吃谷交易、同人交流。欢迎各位自带痛包或Cosplay入场！非诚勿扰，请准时在集合地点汇合。
                        </p>
                      </div>

                      {/* 团员 */}
                      <div>
                        <h4 style={{ fontSize: '9px', fontWeight: 900, color: 'var(--m-secondary)', marginBottom: '4px' }}>当前团员 (3人已入团)</h4>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: '#e2e5e844', padding: '3px 6px', borderRadius: '8px' }}>
                            <img src={activeSelectedInfo.creator.avatar} alt="avatar" style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
                            <span style={{ fontSize: '7px', fontWeight: 800 }}>团长 · {activeSelectedInfo.creator.name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: '#e2e5e844', padding: '3px 6px', borderRadius: '8px' }}>
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
                            <span style={{ fontSize: '7px', fontWeight: 800 }}>社友栗子</span>
                          </div>
                        </div>
                      </div>

                      {/* 快捷私聊发消息按钮 */}
                      <button 
                        onClick={() => pushRoute('chat-window', { chatWith: activeSelectedInfo.creator.name, avatar: activeSelectedInfo.creator.avatar }, 'map')}
                        className="btn-round btn-secondary interactive-scale"
                        style={{ fontSize: '8px', padding: '6px 12px', gap: '4px', border: '1px dashed var(--m-secondary)' }}
                      >
                        <MessageSquare size={10} className="text-[#A8BDD1]" />
                        <span>私聊面基团长</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 底部操作区：在 Half 或 Full 状态展示 */}
              {drawerHeight !== 'peek' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--m-border)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <img 
                      src={activeSelectedInfo.creator.avatar} 
                      alt="avatar" 
                      style={{ width: '16px', height: '16px', borderRadius: '50%', border: '0.5px solid var(--m-border)' }}
                    />
                    <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)' }}>{activeSelectedInfo.creator.name} 发起</span>
                  </div>

                  <button 
                    onClick={() => pushRoute('group-detail', { groupId: activeSelectedInfo.id }, 'map')}
                    className={`btn-round interactive-scale ${activeSelectedInfo.status === 'full' ? 'btn-secondary text-neutral-400' : 'btn-primary'}`}
                    style={{
                      padding: '5px 12px',
                      fontSize: '9px',
                      gap: '4px'
                    }}
                  >
                    <span>{activeSelectedInfo.status === 'full' ? '查看详情 (已满员)' : '申请加入本团'}</span>
                    <ArrowRight size={10} />
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      )}

    </div>
  );
}
