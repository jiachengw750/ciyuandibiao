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
    setGroups
  } = useApp();

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

      {/* 第三部分：调试与清空 */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
