import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, MapPin, User, ChevronRight } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';

export default function MyTicketsPage() {
  const { pushRoute, popRoute, user, routeStack } = useApp();

  // 支持测试面板一键直达票夹空状态：params.empty = true 时不展示任何票
  const forceEmpty = routeStack?.[routeStack.length - 1]?.params?.empty === true;

  // Mock票务数据
  const [tickets] = useState(forceEmpty ? [] : [
    {
      id: 'TKT001',
      orderId: 'ORD1719123456789',
      activity: {
        id: 'ACT001',
        name: '2026 魔都动漫嘉年华',
        date: '2026-06-28',
        time: '09:00-18:00',
        location: '上海新国际博览中心'
      },
      ticketType: 'coser',
      realName: '张三',
      idNumber: '310101199001011234',
      coserInfo: {
        character: '甘雨',
        description: '白色长袍+蓝发+羊角+紫色铃铛',
        referenceImage: '/avatar_cos.png'
      },
      price: 68,
      status: 'valid', // valid | used | cancelled
      purchaseTime: '2026-06-20 14:30:22'
    },
    {
      id: 'TKT002',
      orderId: 'ORD1719023456789',
      activity: {
        id: 'ACT002',
        name: 'ComicUp 30',
        date: '2026-07-15',
        time: '10:00-17:00',
        location: '国家会议中心'
      },
      ticketType: 'normal',
      realName: '张三',
      idNumber: '310101199001011234',
      price: 88,
      status: 'valid',
      purchaseTime: '2026-06-18 10:15:33'
    }
  ]);

  const getStatusTag = (status) => {
    const styles = {
      valid: { bg: '#D1FAE5', color: '#065F46', text: '有效' },
      used: { bg: '#E5E7EB', color: '#6B7280', text: '已使用' },
      cancelled: { bg: '#FEE2E2', color: '#991B1B', text: '已退票' }
    };
    const s = styles[status];
    return (
      <span style={{
        padding: '2px 8px',
        backgroundColor: s.bg,
        color: s.color,
        borderRadius: '4px',
        fontSize: '7px',
        fontWeight: 700
      }}>
        {s.text}
      </span>
    );
  };

  const handleViewQRCode = (ticket) => {
    if (ticket.status !== 'valid') {
      alert('该票已失效');
      return;
    }
    pushRoute('qr-code', { ticket }, 'my-tickets');
  };

  // 登录拦截：我的票夹需登录
  if (!user) {
    return (
      <LoginGuard
        icon={Calendar}
        title="登录后查看我的票夹"
        desc="登录环境账户后即可查看已购电子票"
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
          我的票夹
        </h1>
        <ReqBadge id="MY-TICKETS" />
      </div>

      {/* 票务列表 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {tickets.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={32} className="text-[#9CA3AF]" />
            </div>
            <p style={{ fontSize: '9px', color: '#6B7280' }}>
              暂无购买的票务
            </p>
          </div>
        ) : (
          tickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => handleViewQRCode(ticket)}
              className="interactive-scale"
              style={{
                padding: '16px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E5E8',
                cursor: ticket.status === 'valid' ? 'pointer' : 'default',
                opacity: ticket.status === 'valid' ? 1 : 0.6
              }}
            >
              {/* 活动名称 + 状态 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#1A1A1A',
                  margin: 0,
                  flex: 1
                }}>
                  {ticket.activity.name}
                </h3>
                {getStatusTag(ticket.status)}
              </div>

              {/* 活动信息 */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '8px',
                color: '#6B7280',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={12} />
                  <span>{ticket.activity.date} {ticket.activity.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={12} />
                  <span>{ticket.activity.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={12} />
                  <span>
                    {ticket.realName} | {ticket.ticketType === 'coser' ? 'Coser票' : '普通票'}
                    {ticket.coserInfo && ` | ${ticket.coserInfo.character}`}
                  </span>
                </div>
              </div>

              {/* 底部信息 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #F3F4F6'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '7px', color: '#9CA3AF' }}>订单号：{ticket.orderId}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-primary)' }}>
                    ¥{ticket.price}
                  </span>
                </div>
                {ticket.status === 'valid' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '8px',
                    color: 'var(--m-primary)',
                    fontWeight: 700
                  }}>
                    <span>查看核销码</span>
                    <ChevronRight size={14} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
