import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';
import LoginGuard from '../components/LoginGuard';

export default function KYCPage() {
  const { pushRoute, popRoute, routeStack, user } = useApp();

  const currentRoute = routeStack[routeStack.length - 1];
  const { activityId, ticketType } = currentRoute?.params || {};

  // 支持测试面板一键直达指定步骤：params.initialStep
  const [step, setStep] = useState(currentRoute?.params?.initialStep || 'info'); // 'info' | 'id-card' | 'face' | 'verifying' | 'success'
  const [realName, setRealName] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const handleStartIDCard = () => {
    setStep('id-card');
    // 模拟OCR识别
    setTimeout(() => {
      setRealName('张三');
      setIdNumber('310101199001011234');
      setStep('face');
    }, 2000);
  };

  const handleStartFace = () => {
    setStep('verifying');
    // 模拟人脸识别+公安库比对
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        if (ticketType === 'coser') {
          pushRoute('coser-info', { activityId, ticketType, realName, idNumber }, 'kyc');
        } else {
          pushRoute('payment', { activityId, ticketType, realName, idNumber }, 'kyc');
        }
      }, 1500);
    }, 3000);
  };

  // 登录拦截：实名认证必须登录
  if (!user) {
    return (
      <LoginGuard
        icon={CheckCircle}
        title="登录后进行实名认证"
        desc="购票需先登录并完成实名认证"
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
          实名认证
        </h1>
        <ReqBadge id="KYC-PAGE" />
      </div>

      {/* 内容区 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* 说明文案 */}
        {step === 'info' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#E8F4F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <AlertCircle size={36} className="text-[#3B82F6]" />
            </div>
            <h2 style={{ fontSize: '12px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 8px 0' }}>
              为什么需要实名认证？
            </h2>
            <p style={{ fontSize: '9px', color: '#6B7280', textAlign: 'center', lineHeight: '1.6', margin: '0 0 24px 0', maxWidth: '260px' }}>
              根据《营业性演出管理条例》及新疆文旅监管要求，大型文化活动需实名购票，线下核验身份证入场。您的信息将安全存储，仅用于本次活动核验。
            </p>

            <div style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#FEF3C7',
              borderRadius: '12px',
              fontSize: '8px',
              color: '#92400E',
              marginBottom: '24px'
            }}>
              <strong>隐私保护承诺：</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                <li>身份证原始图片不存储</li>
                <li>人脸数据实时比对后删除</li>
                <li>仅保留脱敏后的认证结果</li>
              </ul>
            </div>

            <button
              onClick={handleStartIDCard}
              className="interactive-scale"
              style={{
                width: '100%',
                maxWidth: '280px',
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
              开始认证
            </button>
          </>
        )}

        {/* 身份证OCR */}
        {step === 'id-card' && (
          <>
            <div style={{
              width: '240px',
              height: '150px',
              borderRadius: '12px',
              backgroundColor: '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Camera size={32} className="text-[#9CA3AF]" />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: 'var(--m-primary)',
                animation: 'scan 2s ease-in-out infinite'
              }} />
            </div>
            <p style={{ fontSize: '10px', color: '#6B7280', textAlign: 'center' }}>
              正在识别身份证信息...
            </p>
          </>
        )}

        {/* 活体检测 */}
        {step === 'face' && (
          <>
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              backgroundColor: '#E8F4F8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              border: '3px dashed var(--m-primary)'
            }}>
              <span style={{ fontSize: '48px' }}>👤</span>
            </div>
            <h3 style={{ fontSize: '11px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 8px 0' }}>
              请完成人脸识别
            </h3>
            <p style={{ fontSize: '9px', color: '#6B7280', textAlign: 'center', marginBottom: '24px' }}>
              请将面部放入框内，保持光线充足
            </p>
            <button
              onClick={handleStartFace}
              className="interactive-scale"
              style={{
                padding: '12px 32px',
                backgroundColor: 'var(--m-primary)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              开始识别
            </button>
          </>
        )}

        {/* 验证中 */}
        {step === 'verifying' && (
          <>
            <div className="loading-spinner" style={{
              width: '48px',
              height: '48px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid var(--m-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }} />
            <p style={{ fontSize: '10px', color: '#6B7280', textAlign: 'center' }}>
              正在核验身份信息...
            </p>
          </>
        )}

        {/* 成功 */}
        {step === 'success' && (
          <>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#D1FAE5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <CheckCircle size={48} className="text-[#10B981]" />
            </div>
            <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#1A1A1A', margin: '0 0 8px 0' }}>
              实名认证成功
            </h3>
            <p style={{ fontSize: '9px', color: '#6B7280', textAlign: 'center' }}>
              姓名：{realName} | 身份证：{idNumber.substring(0, 6)}******{idNumber.substring(14)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
