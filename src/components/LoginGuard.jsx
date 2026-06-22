import { Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * 统一登录拦截引导组件
 *
 * 用途：所有「需登录才能访问」的页面，在 !user 时直接渲染本组件，
 * 而不是展示真实内容。彻底消除「未登录用户能看到隐私内容」的歧义。
 *
 * Props:
 *  - icon:    顶部图标组件（lucide-react），默认 Lock
 *  - title:   主标题，如「登录后查看消息」
 *  - desc:    副说明文案
 *  - showBack: 是否展示返回按钮（详情类二级页需要 true，Tab 主页面 false）
 *  - onBack:  返回回调
 */
export default function LoginGuard({
  icon: Icon = Lock,
  title = '登录后即可使用',
  desc = '该功能需要登录环境账户后访问',
  showBack = false,
  onBack
}) {
  const { handleLoginSuccess, popRoute } = useApp();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--m-bg-card)'
      }}
    >
      {/* 顶部导航栏：仅二级详情页需要返回 */}
      {showBack && (
        <div
          style={{
            height: '44px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            borderBottom: '1px solid var(--m-border)'
          }}
        >
          <button
            onClick={onBack || popRoute}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '10px',
              color: 'var(--m-text-sub)',
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ← 返回
          </button>
        </div>
      )}

      {/* 居中引导内容 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          padding: '0 32px',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--m-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon size={26} color="var(--m-primary)" strokeWidth={2.2} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)' }}>
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: '9px', color: 'var(--m-text-sub)', lineHeight: 1.6 }}>
            {desc}
          </p>
        </div>

        <button
          onClick={handleLoginSuccess}
          className="btn-round btn-primary interactive-scale"
          style={{ padding: '8px 28px', fontSize: '10px', fontWeight: 700, marginTop: '4px' }}
        >
          登录环境账户
        </button>

        <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)' }}>
          登录即代表同意《用户协议》与《隐私政策》
        </span>
      </div>
    </div>
  );
}
