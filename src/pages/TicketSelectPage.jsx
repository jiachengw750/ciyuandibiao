import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';

export default function TicketSelectPage() {
  const { pushRoute, popRoute, routeStack, user, checkLogin } = useApp();

  const currentRoute = routeStack[routeStack.length - 1];
  const activityId = currentRoute?.params?.activityId;

  // Mock活动信息
  const activity = {
    id: activityId,
    name: '2026 魔都动漫嘉年华',
    date: '2026-06-28',
    location: '上海新国际博览中心',
    price: { coser: 68, normal: 88 }
  };

  const [selectedTicketType, setSelectedTicketType] = useState(null);

  const handleNext = () => {
    if (!selectedTicketType) {
      alert('请选择票种');
      return;
    }

    checkLogin(() => {
      pushRoute('kyc', { activityId, ticketType: selectedTicketType }, 'ticket-select');
    });
  };

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
          选择票种
        </h1>
        <ReqBadge id="TICKET-SELECT" />
      </div>

      {/* 活动信息摘要 */}
      <div style={{
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E5E8',
        flexShrink: 0
      }}>
        <h2 style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#1A1A1A',
          margin: '0 0 8px 0'
        }}>
          {activity.name}
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          fontSize: '8.5px',
          color: '#6B7280'
        }}>
          <span>📅 {activity.date}</span>
          <span>📍 {activity.location}</span>
        </div>
      </div>

      {/* 票种选择 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Coser票 */}
        <div
          onClick={() => setSelectedTicketType('coser')}
          className="interactive-scale"
          style={{
            padding: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: `2px solid ${selectedTicketType === 'coser' ? 'var(--m-primary)' : '#E2E5E8'}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 4px 0' }}>
                Coser票
              </h3>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--m-primary)' }}>
                ¥{activity.price.coser}
              </span>
            </div>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: `2px solid ${selectedTicketType === 'coser' ? 'var(--m-primary)' : '#D1D5DB'}`,
              backgroundColor: selectedTicketType === 'coser' ? 'var(--m-primary)' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedTicketType === 'coser' && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
              )}
            </div>
          </div>
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#FEF3C7',
            borderRadius: '8px',
            fontSize: '7.5px',
            color: '#92400E',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '6px'
          }}>
            <AlertCircle size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>需提交服装信息（角色+描述+参考图），仅采集不审核。线下核验时需核对实际穿着与提交信息是否一致。</span>
          </div>
        </div>

        {/* 普通票 */}
        <div
          onClick={() => setSelectedTicketType('normal')}
          className="interactive-scale"
          style={{
            padding: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: `2px solid ${selectedTicketType === 'normal' ? 'var(--m-primary)' : '#E2E5E8'}`,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 4px 0' }}>
                普通票
              </h3>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--m-primary)' }}>
                ¥{activity.price.normal}
              </span>
            </div>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: `2px solid ${selectedTicketType === 'normal' ? 'var(--m-primary)' : '#D1D5DB'}`,
              backgroundColor: selectedTicketType === 'normal' ? 'var(--m-primary)' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selectedTicketType === 'normal' && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
              )}
            </div>
          </div>
          <p style={{ fontSize: '8px', color: '#6B7280', margin: '8px 0 0 0' }}>
            适合普通观众，无需提交服装信息
          </p>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E5E8',
        flexShrink: 0
      }}>
        <button
          onClick={handleNext}
          className="interactive-scale"
          disabled={!selectedTicketType}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: selectedTicketType ? 'var(--m-primary)' : '#D1D5DB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 800,
            cursor: selectedTicketType ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease'
          }}
        >
          下一步
        </button>
      </div>
    </div>
  );
}
