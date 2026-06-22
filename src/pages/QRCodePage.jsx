import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';
import ErrorState from '../components/ErrorState';

export default function QRCodePage() {
  const { popRoute, routeStack, user } = useApp();

  const currentRoute = routeStack[routeStack.length - 1];
  const { ticket } = currentRoute?.params || {};

  const [brightness, setBrightness] = useState(100);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // 模拟提高屏幕亮度
    setBrightness(100);
    return () => {
      setBrightness(80); // 恢复原亮度
    };
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // 登录拦截：电子票二维码需登录
  if (!user) {
    return (
      <LoginGuard
        icon={AlertCircle}
        title="登录后查看电子票"
        desc="登录环境账户后即可出示入场二维码"
        showBack
      />
    );
  }

  if (!ticket) {
    return (
      <ErrorState
        title="票务信息加载失败"
        desc="该电子票可能已失效，请返回票夹重试"
      />
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1A1A1A'
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#1A1A1A',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0
      }}>
        <button
          onClick={() => popRoute()}
          className="interactive-scale"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowLeft size={18} className="text-[#FFFFFF]" />
        </button>
        <h1 style={{
          fontSize: '12px',
          fontWeight: 800,
          color: '#FFFFFF',
          margin: 0,
          flex: 1
        }}>
          入场核销码
        </h1>
        <ReqBadge id="QR-CODE" />
      </div>

      {/* 核销码区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        gap: '20px'
      }}>
        {/* 活动信息 */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 8px 0'
          }}>
            {ticket.activity.name}
          </h2>
          <div style={{
            fontSize: '8.5px',
            color: '#9CA3AF',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center'
          }}>
            <span>📅 {ticket.activity.date} {ticket.activity.time}</span>
            <span>📍 {ticket.activity.location}</span>
          </div>
        </div>

        {/* 二维码 */}
        <div style={{
          width: '220px',
          height: '220px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          filter: `brightness(${brightness}%)`
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect x='10' y='10' width='15' height='15' fill='%23fff'/%3E%3Crect x='30' y='10' width='5' height='5' fill='%23fff'/%3E%3Crect x='40' y='10' width='10' height='5' fill='%23fff'/%3E%3Crect x='55' y='10' width='5' height='5' fill='%23fff'/%3E%3Crect x='65' y='10' width='5' height='5' fill='%23fff'/%3E%3Crect x='75' y='10' width='15' height='15' fill='%23fff'/%3E%3Crect x='10' y='30' width='5' height='5' fill='%23fff'/%3E%3Crect x='30' y='30' width='10' height='10' fill='%23fff'/%3E%3Crect x='50' y='30' width='5' height='10' fill='%23fff'/%3E%3Crect x='60' y='30' width='10' height='5' fill='%23fff'/%3E%3Crect x='75' y='30' width='5' height='5' fill='%23fff'/%3E%3Crect x='10' y='40' width='5' height='10' fill='%23fff'/%3E%3Crect x='30' y='45' width='5' height='5' fill='%23fff'/%3E%3Crect x='40' y='40' width='10' height='10' fill='%23fff'/%3E%3Crect x='60' y='45' width='5' height='5' fill='%23fff'/%3E%3Crect x='75' y='40' width='5' height='10' fill='%23fff'/%3E%3Crect x='10' y='55' width='5' height='5' fill='%23fff'/%3E%3Crect x='30' y='60' width='10' height='5' fill='%23fff'/%3E%3Crect x='50' y='55' width='5' height='10' fill='%23fff'/%3E%3Crect x='65' y='60' width='5' height='5' fill='%23fff'/%3E%3Crect x='75' y='55' width='5' height='5' fill='%23fff'/%3E%3Crect x='10' y='65' width='5' height='5' fill='%23fff'/%3E%3Crect x='30' y='70' width='5' height='5' fill='%23fff'/%3E%3Crect x='45' y='65' width='10' height='10' fill='%23fff'/%3E%3Crect x='60' y='70' width='10' height='5' fill='%23fff'/%3E%3Crect x='75' y='65' width='5' height='5' fill='%23fff'/%3E%3Crect x='10' y='75' width='15' height='15' fill='%23fff'/%3E%3Crect x='30' y='80' width='5' height='10' fill='%23fff'/%3E%3Crect x='40' y='75' width='10' height='5' fill='%23fff'/%3E%3Crect x='55' y='80' width='5' height='10' fill='%23fff'/%3E%3Crect x='65' y='75' width='5' height='5' fill='%23fff'/%3E%3Crect x='75' y='75' width='15' height='15' fill='%23fff'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }} key={refreshKey} />
        </div>

        {/* 票务信息 */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '12px 16px',
          width: '100%',
          maxWidth: '280px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '8.5px',
            color: '#D1D5DB',
            marginBottom: '6px'
          }}>
            <span>票种</span>
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
              {ticket.ticketType === 'coser' ? 'Coser票' : '普通票'}
            </span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '8.5px',
            color: '#D1D5DB',
            marginBottom: '6px'
          }}>
            <span>实名</span>
            <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{ticket.realName}</span>
          </div>
          {ticket.coserInfo && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '8.5px',
              color: '#D1D5DB'
            }}>
              <span>角色</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{ticket.coserInfo.character}</span>
            </div>
          )}
        </div>

        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          className="interactive-scale"
          style={{
            padding: '8px 16px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            fontSize: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <RefreshCw size={12} />
          <span>刷新二维码</span>
        </button>
      </div>

      {/* 底部提示 */}
      <div style={{
        padding: '16px',
        backgroundColor: 'rgba(254,243,199,0.1)',
        borderTop: '1px solid rgba(254,243,199,0.2)',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <AlertCircle size={14} className="text-[#FCD34D]" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{
            fontSize: '7.5px',
            color: '#FCD34D',
            lineHeight: '1.5'
          }}>
            <p style={{ margin: '0 0 6px 0' }}>
              <strong>核验须知：</strong>
            </p>
            <ul style={{ margin: 0, paddingLeft: '16px' }}>
              <li>请在入场时出示此二维码</li>
              <li>工作人员会同时核验您的身份证原件</li>
              <li>Coser票需核对服装与提交信息是否一致</li>
              <li>每个二维码仅可使用一次</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
