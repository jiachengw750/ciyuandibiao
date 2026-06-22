import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Calendar, MapPin, LogOut, ShieldAlert, MoreVertical, Ban, Flag, Trash2 } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import ErrorState from '../components/ErrorState';
import { MessageSquareX } from 'lucide-react';

export default function ChatWindowPage() {
  const { routeStack, messages, sendMessage, user, groups, activities, exitGroup, pushRoute, deleteConversation, popRoute } = useApp();
  const [inputText, setInputText] = useState('');
  // 支持测试面板一键直达：params.openMenu = true 时进入即展开私聊更多菜单
  const [showMoreMenu, setShowMoreMenu] = useState(routeStack?.[routeStack.length - 1]?.params?.openMenu === true);
  const chatEndRef = useRef(null);

  // 1. 获取对应的聊天群
  const currentRoute = routeStack[routeStack.length - 1];
  const chatId = currentRoute.params.chatId;
  const chat = messages.find(c => c.id === chatId);
  const relatedGroup = chat?.relatedGroupId ? groups.find(group => group.id === chat.relatedGroupId) : null;
  const relatedActivity = relatedGroup ? activities.find(activity => activity.id === relatedGroup.relatedActivityId) : null;
  const isGroupMember = relatedGroup && user && relatedGroup.members.some(member => member.name === user.name);
  const isCreator = relatedGroup && user && relatedGroup.creator.name === user.name;

  const hasRiskKeyword = chat?.chatHistory?.some(msg => {
    if (msg.isSystem) return false;
    return /转账|红包|钱|微信|vx|开房|定金/i.test(msg.content || '');
  });

  useEffect(() => {
    // 自动滚动到底部
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat?.chatHistory]);

  useEffect(() => {
    // 点击外部关闭菜单
    const handleClickOutside = () => {
      if (showMoreMenu) setShowMoreMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMoreMenu]);

  if (!chat) {
    return (
      <ErrorState
        icon={MessageSquareX}
        title="聊天会话不存在"
        desc="该会话可能已被删除或已退出群聊"
      />
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

      {/* 1v1私聊Header */}
      {!relatedGroup && !chat.isGroup && chat.id !== 'chat-sys' && (
        <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--m-border)', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, position: 'relative' }}>
          <img src={chat.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0 }}>
              {chat.title}
            </h3>
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreMenu(!showMoreMenu);
              }}
              style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            >
              <MoreVertical size={16} className="text-[#6B7280]" />
            </button>
            {showMoreMenu && (
              <div onClick={(e) => e.stopPropagation()} style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '120px',
                zIndex: 50,
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => {
                    if (confirm('确定删除此会话吗？')) {
                      deleteConversation(chat.id);
                      setShowMoreMenu(false);
                      popRoute();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '8.5px',
                    fontWeight: 700,
                    color: 'var(--m-text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={12} />
                  删除会话
                </button>
                <button
                  onClick={() => {
                    if (confirm('拉黑后将拒收对方消息并移除该会话，确定继续吗？')) {
                      deleteConversation(chat.id);
                      setShowMoreMenu(false);
                      popRoute();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '8.5px',
                    fontWeight: 700,
                    color: 'var(--m-text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Ban size={12} />
                  拉黑用户
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('请选择或输入举报类型：诈骗 / 骚扰 / 虚假信息', '诈骗');
                    if (reason) {
                      alert(`已提交举报：${reason}，我们将在 24 小时内核实处理。`);
                      setShowMoreMenu(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontSize: '8.5px',
                    fontWeight: 700,
                    color: '#EF4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Flag size={12} />
                  举报用户
                </button>
              </div>
            )}
          </div>
          <ReqBadge id="MSG-RISK" style={{ top: '6px', right: '48px' }} />
        </div>
      )}

      {hasRiskKeyword && (
        <div style={{
          backgroundColor: '#FFF8E7',
          borderBottom: '1px solid #F1D69A',
          padding: '8px 12px',
          color: '#8C6F3D',
          fontSize: '8.5px',
          lineHeight: '1.45',
          display: 'flex',
          gap: '6px',
          alignItems: 'flex-start',
          flexShrink: 0,
          zIndex: 30
        }}>
          <ShieldAlert size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>⚠️ 安全提示：对方提及资金或线下敏感场景，请勿轻易转账或前往私密场所，线下见面请选择展会等公共区域。</span>
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
