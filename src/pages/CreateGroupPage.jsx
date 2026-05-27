import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Sparkles, MapPin, DollarSign, Users, Send } from 'lucide-react';

export default function CreateGroupPage() {
  const { routeStack, activities, createGroup, popRoute } = useApp();

  // 获取当前关联活动 ID
  const currentRoute = routeStack[routeStack.length - 1];
  const activityId = currentRoute.params.activityId;

  // 1. 查找关联活动
  const activity = activities.find(a => a.id === activityId);

  // 表单状态
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('0');
  const [totalLimit, setTotalLimit] = useState('5');
  const [addressSummary, setAddressSummary] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [tag, setTag] = useState('约人面基');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !addressSummary.trim() || !addressDetail.trim()) {
      alert('请将表单核心项目填写完整！');
      return;
    }

    // 创建开团
    createGroup(
      activityId,
      title,
      price,
      totalLimit,
      addressSummary,
      addressDetail,
      tag
    );

    alert('发起拼团成功！已经自动为您创建开团群聊。');
    popRoute(); // 返回活动详情
  };

  if (!activity) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>关联活动不存在</h3>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#F6F5F2] flex flex-col relative select-none">
      
      {/* 滚动表单区 */}
      <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '60px' }}>
        
        {/* 顶部活动微卡 */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '14px', border: '1px solid var(--m-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={activity.cover} 
            alt="cover" 
            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--m-primary)', display: 'block' }}>您正在为以下活动发起面基拼团：</span>
            <h4 style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {activity.title}
            </h4>
          </div>
        </div>

        {/* 核心信息填写 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '14px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* 标题 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>1. 拼团名称/主题 (必填)</label>
            <input 
              type="text" 
              placeholder="例如：14:00场痛包扩列与吃火锅拼单"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              maxLength={40}
            />
          </div>

          {/* 团标签 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)' }}>2. 拼团类型</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {['约人面基', '周边合购', '展后聚餐'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`filter-item ${tag === t ? 'active' : ''}`}
                  style={{
                    padding: '6px 0',
                    fontSize: '9px',
                    textAlign: 'center',
                    justifyContent: 'center',
                    display: 'flex'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 费用与人数限额 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <DollarSign size={11} className="text-neutral-400" />
                人均开销 (元)
              </label>
              <input 
                type="number" 
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              <label style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Users size={11} className="text-neutral-400" />
                团队人数上限 (人)
              </label>
              <input 
                type="number" 
                min="2"
                max="50"
                value={totalLimit}
                onChange={(e) => setTotalLimit(e.target.value)}
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
          </div>

        </div>

        {/* 集合地址 */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '14px', border: '1px solid var(--m-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* 大致区域 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <MapPin size={11} className="text-neutral-400" />
              公开集合地点摘要 (所有人可见)
            </label>
            <input 
              type="text" 
              placeholder="例如：静安大悦城北座9楼中庭人形立牌下"
              value={addressSummary}
              onChange={(e) => setAddressSummary(e.target.value)}
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

          {/* 精准门牌 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--m-primary)' }}>
              私密精准集合地点指南 (仅入群成员可见)
            </label>
            <textarea 
              rows="3"
              placeholder="描述您的当天衣着特征、精准展位号或主创手机号码，这些重要隐私会在成员加入并通过审核后展示。"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
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

        </div>

      </form>

      {/* 底部按钮栏 */}
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
          <span>确认发起拼团</span>
        </button>
      </div>

    </div>
  );
}
