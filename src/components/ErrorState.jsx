import { AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * 统一错误/空数据缺省页组件
 *
 * 用途：页面查询不到对应数据（活动不存在、聊天窗不存在、票务加载失败等）时，
 * 渲染本组件代替简陋的红字提示，保持与应用整体设计一致。
 *
 * Props:
 *  - icon:    顶部图标组件（lucide-react），默认 AlertCircle
 *  - title:   主标题，如「活动不存在」
 *  - desc:    副说明文案
 *  - showBack: 是否展示返回按钮，默认 true
 *  - onBack:  返回回调，默认 popRoute
 */
export default function ErrorState({
  icon: Icon = AlertCircle,
  title = '内容不存在',
  desc = '该内容可能已被删除或链接已失效',
  showBack = true,
  onBack
}) {
  const { popRoute } = useApp();

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
      {/* 顶部导航栏 */}
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

      {/* 居中缺省内容 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '0 32px',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#F4F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon size={26} color="var(--m-text-muted)" strokeWidth={2} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)' }}>
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: '9px', color: 'var(--m-text-sub)', lineHeight: 1.6 }}>
            {desc}
          </p>
        </div>

        {showBack && (
          <button
            onClick={onBack || popRoute}
            className="btn-round interactive-scale"
            style={{
              padding: '7px 24px',
              fontSize: '9.5px',
              fontWeight: 700,
              marginTop: '2px',
              backgroundColor: '#F4F4F6',
              color: 'var(--m-text-main)',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            返回上一页
          </button>
        )}
      </div>
    </div>
  );
}
