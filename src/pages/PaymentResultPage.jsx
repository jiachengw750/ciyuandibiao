import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';

export default function PaymentResultPage() {
  const { pushRoute, popRoute, routeStack, clearRouteStack, user } = useApp();

  const currentRoute = routeStack[routeStack.length - 1];
  const { activityId, ticketType, realName, idNumber, coserInfo, orderId, success } = currentRoute?.params || {};

  useEffect(() => {
    // 3秒后自动跳转到我的票夹
    if (success) {
      const timer = setTimeout(() => {
        clearRouteStack();
        pushRoute('my-tickets', {}, 'root');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, clearRouteStack, pushRoute]);

  const handleViewTickets = () => {
    clearRouteStack();
    pushRoute('my-tickets', {}, 'root');
  };

  const handleRetry = () => {
    popRoute();
  };

  // 登录拦截：订单结果页需登录
  if (!user) {
    return (
      <LoginGuard
        icon={CheckCircle}
        title="登录后查看订单结果"
        desc="登录环境账户后即可查看支付结果与电子票"
        showBack
      />
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F8F9FA'
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E5E8',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0
      }}>
        <h1 style={{
          fontSize: '12px',
          fontWeight: 800,
          color: '#1A1A1A',
          margin: 0,
          flex: 1
        }}>
          {success ? '支付成功' : '支付失败'}
        </h1>
        <ReqBadge id="PAYMENT-RESULT" />
      </div>

      {/* 结果内容 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '40px 16px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {success ? (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <CheckCircle size={48} className="text-[#10B981]" />
            </div>
            <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 8px 0' }}>
              购票成功！
            </h2>
            <p style={{ fontSize: '9px', color: '#6B7280', textAlign: 'center', marginBottom: '32px' }}>
              订单号：{orderId}
            </p>

            {/* 订单详情 */}
            <div style={{
              width: '100%',
              maxWidth: '320px',
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E5E8'
            }}>
              <h3 style={{ fontSize: '10px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 12px 0' }}>
                票务信息
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '8.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>票种</span>
                  <span style={{ color: '#1A1A1A', fontWeight: 700 }}>
                    {ticketType === 'coser' ? 'Coser票' : '普通票'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>实名信息</span>
                  <span style={{ color: '#1A1A1A', fontWeight: 700 }}>
                    {realName}
                  </span>
                </div>
                {coserInfo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>角色</span>
                    <span style={{ color: '#1A1A1A', fontWeight: 700 }}>{coserInfo.character}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>支付金额</span>
                  <span style={{ color: 'var(--m-primary)', fontWeight: 800 }}>
                    ¥{ticketType === 'coser' ? 68 : 88}
                  </span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '8px', color: '#9CA3AF', textAlign: 'center', marginTop: '24px', lineHeight: '1.6' }}>
              3秒后自动跳转到我的票夹<br />
              活动当天请携带身份证入场核验
            </p>
          </>
        ) : (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <XCircle size={48} className="text-[#EF4444]" />
            </div>
            <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 8px 0' }}>
              支付失败
            </h2>
            <p style={{ fontSize: '9px', color: '#6B7280', textAlign: 'center', marginBottom: '32px' }}>
              订单号：{orderId}<br />
              支付未完成，名额已释放
            </p>

            <div style={{
              width: '100%',
              maxWidth: '320px',
              padding: '12px',
              backgroundColor: '#FEF3C7',
              borderRadius: '12px',
              fontSize: '8px',
              color: '#92400E',
              textAlign: 'center'
            }}>
              可能原因：余额不足、网络异常、支付超时<br />
              请重新选择票种并完成支付
            </div>
          </>
        )}
      </div>

      {/* 底部操作栏 */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E5E8',
        flexShrink: 0
      }}>
        {success ? (
          <button
            onClick={handleViewTickets}
            className="interactive-scale"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--m-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            查看我的票夹
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                clearRouteStack();
                pushRoute('home', {}, 'root');
              }}
              className="interactive-scale"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#F3F4F6',
                color: '#6B7280',
                border: 'none',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              返回首页
            </button>
            <button
              onClick={handleRetry}
              className="interactive-scale"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'var(--m-primary)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              重新支付
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
