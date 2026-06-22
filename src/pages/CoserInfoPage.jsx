import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';

export default function CoserInfoPage() {
  const { pushRoute, popRoute, routeStack, user } = useApp();

  const currentRoute = routeStack[routeStack.length - 1];
  const { activityId, ticketType, realName, idNumber } = currentRoute?.params || {};

  const [character, setCharacter] = useState('');
  const [description, setDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState(null);

  const handleImageUpload = () => {
    // 模拟图片上传
    setReferenceImage('/avatar_cos.png');
  };

  const handleSubmit = () => {
    if (!character.trim()) {
      alert('请填写角色名称');
      return;
    }
    if (!description.trim()) {
      alert('请填写服装描述');
      return;
    }
    if (!referenceImage) {
      alert('请上传参考图片');
      return;
    }

    // 提交后进入支付
    pushRoute('payment', {
      activityId,
      ticketType,
      realName,
      idNumber,
      coserInfo: { character, description, referenceImage }
    }, 'coser-info');
  };

  // 登录拦截：Coser 信息登记需登录
  if (!user) {
    return (
      <LoginGuard
        icon={Upload}
        title="登录后登记 Coser 信息"
        desc="Coser 票需登录后登记返图信息"
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
          服装信息采集
        </h1>
        <ReqBadge id="COSER-INFO" />
      </div>

      {/* 说明提示 */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#FEF3C7',
        borderBottom: '1px solid #FDE68A',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <AlertCircle size={16} className="text-[#92400E]" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '8px', color: '#92400E', lineHeight: '1.5' }}>
            <strong>仅采集不审核：</strong>提交后即可购票。线下核验时需核对实际穿着与提交信息是否一致，如不一致且不符合规定，将由主办方执行退票处理。
          </div>
        </div>
      </div>

      {/* 表单内容 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* 角色名称 */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '9px',
            fontWeight: 800,
            color: '#374151',
            marginBottom: '6px'
          }}>
            角色名称 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            placeholder="例如：甘雨 / 雷电将军 / 日向翔阳"
            maxLength={50}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '9px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              outline: 'none',
              backgroundColor: '#FFFFFF'
            }}
          />
        </div>

        {/* 服装描述 */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '9px',
            fontWeight: 800,
            color: '#374151',
            marginBottom: '6px'
          }}>
            服装描述 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请描述服装颜色、款式、特征等（例如：白色长袍+蓝发+羊角+紫色铃铛）"
            maxLength={200}
            rows={4}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '9px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ textAlign: 'right', fontSize: '7px', color: '#9CA3AF', marginTop: '4px' }}>
            {description.length}/200
          </div>
        </div>

        {/* 参考图片 */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '9px',
            fontWeight: 800,
            color: '#374151',
            marginBottom: '6px'
          }}>
            参考图片 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <p style={{ fontSize: '7.5px', color: '#6B7280', margin: '0 0 8px 0' }}>
            可上传角色官图、设定图或您的cos照片
          </p>
          {referenceImage ? (
            <div style={{
              width: '100%',
              height: '180px',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              border: '2px solid var(--m-primary)'
            }}>
              <img
                src={referenceImage}
                alt="参考图"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setReferenceImage(null)}
                className="interactive-scale"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '7px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                重新上传
              </button>
            </div>
          ) : (
            <button
              onClick={handleImageUpload}
              className="interactive-scale"
              style={{
                width: '100%',
                height: '120px',
                border: '2px dashed #D1D5DB',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Upload size={24} className="text-[#9CA3AF]" />
              <span style={{ fontSize: '9px', color: '#6B7280' }}>点击上传图片</span>
            </button>
          )}
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
          onClick={handleSubmit}
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
          提交并继续支付
        </button>
      </div>
    </div>
  );
}
