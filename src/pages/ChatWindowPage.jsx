import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Calendar, MapPin, LogOut } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';

export default function ChatWindowPage() {
  const { routeStack, messages, sendMessage, user, groups, activities, exitGroup, pushRoute } = useApp();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // 1. 获取对应的聊天群
  const currentRoute = routeStack[routeStack.length - 1];
  const chatId = currentRoute.params.chatId;
  const chat = messages.find(c => c.id === chatId);
  const relatedGroup = chat?.relatedGroupId ? groups.find(group => group.id === chat.relatedGroupId) : null;
  const relatedActivity = relatedGroup ? activities.find(activity => activity.id === relatedGroup.relatedActivityId) : null;
  const isGroupMember = relatedGroup && user && relatedGroup.members.some(member => member.name === user.name);
  const isCreator = relatedGroup && user && relatedGroup.creator.name === user.name;

  useEffect(() => {
    // 自动滚动到底部
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.chatHistory]);

  if (!chat) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>聊天窗不存在</h3>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (inputText.length > 800) {
      alert('消息文本最多 800 字符');
      return;
    }
    sendMessage(chat.id, inputText);
    setInputText('');
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">

      {relatedGroup && (
        <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--m-border)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0, position: 'relative' }}>
          <ReqBadge id="GRP-CHAT" style={{ top: '6px', right: '8px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {relatedActivity?.title || relatedGroup.title}
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginTop: '3px', fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Calendar size={9} />{new Date(relatedGroup.startTime).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><MapPin size={9} />{relatedGroup.meetingAddress}</span>
              </div>
            </div>
            <button
              onClick={() => pushRoute('group-detail', { groupId: relatedGroup.id }, 'chat_window')}
              style={{ border: 'none', backgroundColor: 'var(--m-primary-light)', color: 'var(--m-primary)', borderRadius: '9999px', padding: '5px 9px', fontSize: '8px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              看详情
            </button>
            {isGroupMember && !isCreator && relatedGroup.status !== 'cancelled' && (
              <button
                onClick={() => {
                  if (confirm('确定退出该开团群吗？退出后会同步退出开团。')) exitGroup(relatedGroup.id);
                }}
                style={{ border: 'none', backgroundColor: 'var(--m-slate-light)', color: 'var(--m-text-sub)', borderRadius: '9999px', padding: '5px 8px', fontSize: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                <LogOut size={10} /> 退出
              </button>
            )}
          </div>
        </div>
      )}

      {/* 消息滚动历史 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '60px', position: 'relative' }}>
        <ReqBadge id="MSG-CHAT" style={{ top: '8px', right: '8px' }} />

        {chat.chatHistory.map((msg, idx) => {
          if (msg.isSystem) {
            return (
              <div
                key={idx}
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'rgba(122, 129, 138, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '7.5px',
                  color: 'var(--m-text-sub)',
                  textAlign: 'center',
                  maxWidth: '80%',
                  margin: '4px 0'
                }}
              >
                {msg.content}
              </div>
            );
          }

          const isMe = user && msg.sender === user.name;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignSelf: isMe ? 'end' : 'start',
                flexDirection: isMe ? 'row-reverse' : 'row',
                gap: '8px',
                maxWidth: '85%'
              }}
            >
              {/* 头像 */}
              {msg.avatar ? (
                <img
                  src={msg.avatar}
                  alt="av"
                  style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--m-secondary)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800, flexShrink: 0 }}>
                  {msg.sender.substring(0, 1)}
                </div>
              )}

              {/* 气泡 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'end' : 'start', gap: '2px' }}>
                <span style={{ fontSize: '7px', color: 'var(--m-text-muted)' }}>{msg.sender}</span>
                <div
                  style={{
                    backgroundColor: isMe ? 'var(--m-primary)' : '#FFFFFF',
                    color: isMe ? '#FFFFFF' : 'var(--m-text-main)',
                    border: '1px solid var(--m-border)',
                    padding: '6px 10px',
                    borderRadius: isMe ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                    fontSize: '9px',
                    lineHeight: '1.4',
                    boxShadow: 'var(--m-shadow-sm)',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef}></div>
      </div>

      {/* 底部输入框 */}
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
          padding: '0 12px',
          zIndex: 40
        }}
      >
        <form onSubmit={handleSend} style={{ width: '100%', display: 'flex', gap: '8px' }}>
	          <input
	            type="text"
	            placeholder="写下你要发的消息..."
	            value={inputText}
	            onChange={(e) => setInputText(e.target.value)}
	            maxLength={800}
	            required
            style={{
              flex: 1,
              height: '34px',
              borderRadius: '9999px',
              border: '1px solid var(--m-border)',
              padding: '0 14px',
              fontSize: '9.5px',
              color: 'var(--m-text-main)',
              backgroundColor: '#F8F9FA'
            }}
          />
          <button
            type="submit"
            className="btn-round btn-primary interactive-scale"
            style={{
              height: '34px',
              width: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <Send size={12} />
            <ReqBadge id="MSG-CHAT" style={{ top: '-10px', right: '-10px' }} />
          </button>
        </form>
      </div>

    </div>
  );
}
