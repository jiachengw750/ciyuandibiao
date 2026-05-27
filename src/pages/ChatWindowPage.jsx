import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send } from 'lucide-react';

export default function ChatWindowPage() {
  const { routeStack, messages, sendMessage, user } = useApp();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // 1. 获取对应的聊天群
  const currentRoute = routeStack[routeStack.length - 1];
  const chatId = currentRoute.params.chatId;
  const chat = messages.find(c => c.id === chatId);

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
    sendMessage(chat.id, inputText);
    setInputText('');
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      
      {/* 消息滚动历史 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '60px' }}>
        
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
              justifyContent: 'center'
            }}
          >
            <Send size={12} />
          </button>
        </form>
      </div>

    </div>
  );
}
