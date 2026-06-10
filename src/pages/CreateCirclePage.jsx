import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send } from 'lucide-react';

export default function CreateCirclePage() {
  const { createCircle, popRoute } = useApp();
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !intro.trim()) {
      alert('请填入同好营核心信息！');
      return;
    }

    createCircle(name, intro, tags);
    alert('恭喜你，同好营自建成功！已为您自动加入该营。');
    popRoute();
  };

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      
      <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '14px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>同好营名称 (必填)</span>
            </label>
            <input 
              type="text" 
              placeholder="例如：乌野高校排球应援组"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                height: '32px',
                backgroundColor: '#F8F9FA',
                border: '1px solid var(--m-border)',
                borderRadius: '8px',
                padding: '0 10px',
                fontSize: '9.5px',
                color: 'var(--m-text-main)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>同好营简介 (必填)</label>
            <textarea 
              rows="4"
              placeholder="简述同好营的建立宗旨，欢迎哪一类同好，比如：面向江浙沪排少同好，主要交流吃谷与线下观影、聚餐面基活动。"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: '#F8F9FA',
                border: '1px solid var(--m-border)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '9.5px',
                color: 'var(--m-text-main)',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>同好标签 (空格/逗号分隔)</label>
            <input 
              type="text" 
              placeholder="例如：排球少年 乌野 吃谷 面基"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{
                width: '100%',
                height: '32px',
                backgroundColor: '#F8F9FA',
                border: '1px solid var(--m-border)',
                borderRadius: '8px',
                padding: '0 10px',
                fontSize: '9.5px',
                color: 'var(--m-text-main)',
                outline: 'none'
              }}
            />
          </div>

        </div>

      </form>

      {/* 底部操作栏 */}
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
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 40
        }}
      >
        <button 
          type="button" 
          onClick={popRoute}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--m-text-sub)',
            cursor: 'pointer'
          }}
        >
          取消
        </button>
        
        <button 
          onClick={handleSubmit}
          className="btn-round btn-primary interactive-scale"
          style={{
            padding: '8px 20px',
            fontSize: '10px',
            gap: '4px'
          }}
        >
          <Send size={11} />
          <span>确认创建</span>
        </button>
      </div>

    </div>
  );
}
