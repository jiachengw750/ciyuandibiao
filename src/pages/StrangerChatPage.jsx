import { useState } from 'react';
import { Send, ShieldAlert, Ban, Flag, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';
import ErrorState from '../components/ErrorState';

export default function StrangerChatPage() {
  const {
    routeStack,
    visibleStrangerMessages,
    sendStrangerReply,
    deleteStrangerThread,
    blockStranger,
    reportStranger,
    pushRoute,
    user
  } = useApp();
  const currentRoute = routeStack[routeStack.length - 1];
  const threadId = currentRoute.params.threadId;
  const thread = visibleStrangerMessages.find(item => item.id === threadId);
  const [inputText, setInputText] = useState('');
  const [riskNotice, setRiskNotice] = useState('');

  // 登录拦截：未登录不展示陌生人私信内容
  if (!user) {
    return (
      <LoginGuard
        title="登录后查看私信"
        desc="登录环境账户后即可查看并回复陌生人消息"
        showBack
      />
    );
  }

  if (!thread) {
    return (
      <ErrorState
        title="消息不存在"
        desc="该陌生人消息可能已被隐藏、删除或对方已被拉黑"
      />
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    const result = sendStrangerReply(thread.id, inputText);
    if (!result.ok) {
      setRiskNotice(result.reason);
      return;
    }
    setInputText('');
    setRiskNotice('');
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      <div style={{ backgroundColor: '#FFFFFF', padding: '12px 16px', borderBottom: '1px solid var(--m-border)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <img src={thread.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {thread.sender}
            <ReqBadge id="MSG-RISK" style={{ position: 'relative', top: '-1px' }} />
          </h1>
          <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 700 }}>
            回复前剩余可发纯文本 {thread.countBeforeReply} 条
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '106px' }}>
        <div style={{ padding: '10px 12px', borderRadius: '14px', backgroundColor: '#FFF8E7', border: '1px solid #F1D69A', color: '#8C6F3D', fontSize: '8.5px', lineHeight: '1.45', display: 'flex', gap: '8px' }}>
          <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span>陌生人会话正在安全模式中。平台会拦截联系方式、链接、图片视频、语音和严重涉诈话术。</span>
        </div>

        {riskNotice && (
          <div style={{ padding: '8px 10px', borderRadius: '10px', backgroundColor: 'rgba(255,99,132,0.08)', color: '#FF6384', fontSize: '8.5px', fontWeight: 800 }}>
            {riskNotice}
          </div>
        )}

        {thread.chatHistory.map((msg, idx) => {
          if (msg.isSystem) {
            return (
              <div key={idx} style={{ alignSelf: 'center', backgroundColor: 'rgba(122,129,138,0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '7.5px', color: 'var(--m-text-sub)', maxWidth: '82%', textAlign: 'center' }}>
                {msg.content}
              </div>
            );
          }
          const isMe = msg.sender !== thread.sender;
          return (
            <div key={idx} style={{ alignSelf: isMe ? 'end' : 'start', maxWidth: '84%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'end' : 'start', gap: '2px' }}>
              <span style={{ fontSize: '7px', color: 'var(--m-text-muted)' }}>{msg.sender}</span>
              <div style={{ backgroundColor: isMe ? 'var(--m-primary)' : '#FFFFFF', color: isMe ? '#FFFFFF' : 'var(--m-text-main)', border: '1px solid var(--m-border)', borderRadius: isMe ? '12px 2px 12px 12px' : '2px 12px 12px 12px', padding: '7px 10px', fontSize: '9px', lineHeight: '1.45', wordBreak: 'break-word' }}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '50px', height: '42px', backgroundColor: '#FFFFFF', borderTop: '1px solid rgba(226,229,232,0.5)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', padding: '6px 12px' }}>
        <button onClick={() => {
          if (confirm('确定删除这条陌生人会话记录吗？')) {
            deleteStrangerThread(thread.id);
            pushRoute('messages');
          }
        }} style={{ border: 'none', backgroundColor: '#F8F9FA', color: 'var(--m-text-sub)', fontSize: '8px', fontWeight: 800, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
          <Trash2 size={10} /> 删除
        </button>
        <button onClick={() => {
          if (confirm('拉黑后将拒收并隐藏对方消息，确定继续吗？')) {
            blockStranger(thread.id);
            pushRoute('messages');
          }
        }} style={{ border: 'none', backgroundColor: 'var(--m-slate-light)', color: 'var(--m-text-sub)', fontSize: '8px', fontWeight: 800, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
          <Ban size={10} /> 拉黑
        </button>
        <button onClick={() => {
          const reason = prompt('请选择或输入举报类型：诈骗 / 骚扰 / 虚假信息', '诈骗');
          if (reason) reportStranger(thread.id, reason);
        }} style={{ border: 'none', backgroundColor: 'rgba(255,99,132,0.08)', color: '#FF6384', fontSize: '8px', fontWeight: 800, borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
          <Flag size={10} /> 举报
        </button>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--m-border)', display: 'flex', alignItems: 'center', padding: '0 12px', zIndex: 40 }}>
        <form onSubmit={handleSend} style={{ width: '100%', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            maxLength={800}
            placeholder={thread.countBeforeReply <= 0 ? "等待对方回复后即可继续发送" : "仅可回复纯文本..."}
            disabled={thread.countBeforeReply <= 0}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ 
              flex: 1, 
              height: '34px', 
              borderRadius: '9999px', 
              border: '1px solid var(--m-border)', 
              padding: '0 14px', 
              fontSize: '9.5px', 
              color: 'var(--m-text-main)', 
              backgroundColor: thread.countBeforeReply <= 0 ? '#EFEFEF' : '#F8F9FA',
              cursor: thread.countBeforeReply <= 0 ? 'not-allowed' : 'text'
            }}
          />
          <button 
            type="submit" 
            disabled={thread.countBeforeReply <= 0}
            className={`btn-round btn-primary ${thread.countBeforeReply <= 0 ? '' : 'interactive-scale'}`} 
            style={{ 
              height: '34px', 
              width: '34px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              position: 'relative',
              opacity: thread.countBeforeReply <= 0 ? 0.4 : 1,
              cursor: thread.countBeforeReply <= 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={12} />
            <ReqBadge id="MSG-RISK" style={{ top: '-10px', right: '-10px' }} />
          </button>
        </form>
      </div>
    </div>
  );
}
