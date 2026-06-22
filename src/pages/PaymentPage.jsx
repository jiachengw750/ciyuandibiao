import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Clock } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';

export default function PaymentPage() {
  const { pushRoute, popRoute, routeStack, user } = useApp();

  const currentRoute = routeStack[routeStack.length - 1];
  const { activityId, ticketType, realName, idNumber, coserInfo } = currentRoute?.params || {};

  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [timeLeft, setTimeLeft] = useState(900); // 15分钟倒计时

  // Mock价格
  const price = ticketType === 'coser' ? 68 : 88;

  // 倒计时
  useState(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('支付超时，名额已释放');
          popRoute();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePay = () => {
    // 模拟支付
    pushRoute('payment-result', {
      activityId,
      ticketType,
      realName,
      idNumber,
      coserInfo,
      orderId: `ORD${Date.now()}`,
      success: true
    }, 'payment');
  };

  // 登录拦截：支付必须登录
  if (!user) {
    return (
      <LoginGuard
        icon={Clock}
        title="登录后完成支付"
        desc="登录环境账户后即可完成订单支付"
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
          <ArrowLeft size={18} className="text-[#1A1A1A]" />
        </button>
        <h1 style={{
          fontSize: '12px',
          fontWeight: 800,
          color: '#1A1A1A',
          margin: 0,
          flex: 1
        }}>
          确认支付
        </h1>
        <ReqBadge id="PAYMENT" />
      </div>

      {/* 倒计时提示 */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: '#FEF3C7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontSize: '8.5px',
        color: '#92400E',
        flexShrink: 0
      }}>
        <Clock size={14} />
        <span>请在 <strong>{formatTime(timeLeft)}</strong> 内完成支付，超时名额将释放</span>
      </div>

      {/* 订单信息 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* 票务信息 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E5E8'
        }}>
          <h3 style={{ fontSize: '10px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 12px 0' }}>
            订单信息
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
                {realName} | {idNumber?.substring(0, 6)}******{idNumber?.substring(14)}
              </span>
            </div>
            {coserInfo && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>角色</span>
                <span style={{ color: '#1A1A1A', fontWeight: 700 }}>{coserInfo.character}</span>
              </div>
            )}
          </div>
        </div>

        {/* 支付方式 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E5E8'
        }}>
          <h3 style={{ fontSize: '10px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 12px 0' }}>
            支付方式
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* 微信支付 */}
            <div
              onClick={() => setPaymentMethod('wechat')}
              className="interactive-scale"
              style={{
                padding: '12px',
                border: `2px solid ${paymentMethod === 'wechat' ? 'var(--m-primary)' : '#E5E7EB'}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#09BB07',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800
                }}>
                  W
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#1A1A1A' }}>微信支付</span>
              </div>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: `2px solid ${paymentMethod === 'wechat' ? 'var(--m-primary)' : '#D1D5DB'}`,
                backgroundColor: paymentMethod === 'wechat' ? 'var(--m-primary)' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {paymentMethod === 'wechat' && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                )}
              </div>
            </div>

            {/* 支付宝 */}
            <div
              onClick={() => setPaymentMethod('alipay')}
              className="interactive-scale"
              style={{
                padding: '12px',
                border: `2px solid ${paymentMethod === 'alipay' ? 'var(--m-primary)' : '#E5E7EB'}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  backgroundColor: '#1677FF',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 800
                }}>
                  A
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, color: '#1A1A1A' }}>支付宝</span>
              </div>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                border: `2px solid ${paymentMethod === 'alipay' ? 'var(--m-primary)' : '#D1D5DB'}`,
                backgroundColor: paymentMethod === 'alipay' ? 'var(--m-primary)' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {paymentMethod === 'alipay' && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部支付栏 */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E5E8',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '9px', color: '#6B7280' }}>实付金额</span>
          <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--m-primary)' }}>
            ¥{price}
          </span>
        </div>
        <button
          onClick={handlePay}
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
          确认支付 ¥{price}
        </button>
      </div>
    </div>
  );
}
