import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  Compass, 
  Coins, 
  Play, 
  Layers, 
  Users, 
  MessageSquare, 
  ShieldAlert, 
  BadgeCheck 
} from 'lucide-react';
import { ReqBadge } from '../components/ReqAnnotation';

export default function PresentationPage() {
  const { resetToTab } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // Slide 1: Cover
    {
      title: "次元地标",
      subtitle: "二次元线下社交与商业数字生态平台",
      tag: "商业路演 PPT",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '14px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: 'var(--m-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 900,
            boxShadow: '0 8px 20px rgba(229,169,169,0.3)'
          }}>
            次
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
            <span style={{ fontSize: '7px', fontWeight: 800, backgroundColor: 'rgba(229,169,169,0.15)', color: 'var(--m-primary)', padding: '2px 6px', borderRadius: '4px' }}>O2O 社交</span>
            <span style={{ fontSize: '7px', fontWeight: 800, backgroundColor: 'rgba(91,122,99,0.15)', color: 'var(--m-sage)', padding: '2px 6px', borderRadius: '4px' }}>同人确权</span>
            <span style={{ fontSize: '7px', fontWeight: 800, backgroundColor: 'rgba(168,189,209,0.15)', color: 'var(--m-secondary)', padding: '2px 6px', borderRadius: '4px' }}>AI 陪伴</span>
          </div>
          <p style={{ fontSize: '9px', color: 'var(--m-text-sub)', lineHeight: '1.5', maxWidth: '260px', marginTop: '10px' }}>
            彻底打通二次元人群“线上社交讨论”到“线下场景消费”的生态超级入口
          </p>
        </div>
      )
    },
    // Slide 2: Pain points
    {
      title: "行业痛点：破碎的二次元线下消费",
      subtitle: "用户为了完成一次逛展或面基，需跨越 4-5 个平台",
      tag: "痛点分析",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { tag: "购票决策", app: "B站会员购/大麦", desc: "纯票务工具，不关心用户买票后的社交与组局需求。" },
            { tag: "找人搭子", app: "小红书/贴吧/私域群", desc: "发帖无结构化，效率极其低下，且易受泛流量骚扰。" },
            { tag: "约拍妆造", app: "闲鱼/QQ群/微博", desc: "纯野生撮合，缺乏行业标准，资金缺乏第三方担保。" },
            { tag: "装备回血", app: "闲鱼交易", desc: "泛二手平台，黑话门槛高，缺乏二次元圈层信任背书。" }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '8px 10px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '0.5px solid var(--m-border)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '7.5px', fontWeight: 800, backgroundColor: 'rgba(74, 62, 86, 0.08)', color: '#4A3E56', padding: '1px 4px', borderRadius: '3px', whiteSpace: 'nowrap', marginTop: '1px' }}>{item.tag}</div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--m-text-main)' }}>{item.app}</span>
                <p style={{ margin: '1px 0 0 0', fontSize: '7.5px', color: 'var(--m-text-sub)', lineHeight: '1.3' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Slide 3: Core MVP Solution
    {
      title: "第一阶段：以活动与拼团沉淀关系",
      subtitle: "通过核心出行决策和社交，洗掉野生流量",
      tag: "MVP 战略",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--m-primary-light)', padding: '10px', borderRadius: '12px', border: '1px solid var(--m-primary)' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-primary)', display: 'block', marginBottom: '3px' }}>1. 拼团与强绑定活动</span>
              <p style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', margin: 0, lineHeight: '1.3' }}>
                在具体的漫展/主题店下发起“拼车、拼房、约妆造、拼谷”等具有极强标签目的的拼团，精准破冰。
              </p>
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--m-secondary-light)', padding: '10px', borderRadius: '12px', border: '1px solid var(--m-secondary)' }}>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-secondary)', display: 'block', marginBottom: '3px' }}>2. 官方同好营回流</span>
              <p style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', margin: 0, lineHeight: '1.3' }}>
                通过“展后发图、晒谷、扩列”将线下发生的关系沉淀在官方社区中，构筑高粘性私域。
              </p>
            </div>
          </div>
          <div style={{ backgroundColor: '#F8F9FA', border: '0.5px solid var(--m-border)', borderRadius: '10px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>💡</span>
            <p style={{ fontSize: '7.5px', color: 'var(--m-text-main)', margin: 0, lineHeight: '1.3' }}>
              <strong>避开重资金链</strong>：P0 阶段不直接做交易系统，而是通过轻量级的拼团目的标签切入，用社交撬动商业资产。
            </p>
          </div>
        </div>
      )
    },
    // Slide 4: O2O Business monetisation
    {
      title: "第二阶段：垂直服务交易标准化",
      subtitle: "流量积累后的自然变现通道",
      tag: "商业化路径 I",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { icon: <Compass size={14} />, title: "自营与代理票务分销", desc: "从Only展和快闪票务分销切入，打通电子票与线下实体卡双端，赚取分销费。" },
            { icon: <Users size={14} />, title: "约拍与妆造标准化担保交易", desc: "将野生的化妆、摄影服务价格标准化，提供平台中介担保，按单抽取佣金。" },
            { icon: <Layers size={14} />, title: "二手Cos装备交易市场", desc: "结合社区同好的强信任机制，提供细分垂直领域的Cos假发服饰的担保买卖。" }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '0.5px solid var(--m-border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ color: 'var(--m-primary)', backgroundColor: 'var(--m-primary-light)', padding: '6px', borderRadius: '8px' }}>{item.icon}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-main)', display: 'block' }}>{item.title}</span>
                <span style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', display: 'block', marginTop: '1px', lineHeight: '1.2' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Slide 5: Local merchant integration
    {
      title: "第三阶段：线下联机基地（本地生活）",
      subtitle: "打通线上到线下（O2O）的最终消费场景",
      tag: "商业化路径 II",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, border: '0.5px solid var(--m-border)', padding: '10px', borderRadius: '12px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
              <span style={{ fontSize: '18px', display: 'block', marginBottom: '3px' }}>🏰</span>
              <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-main)', display: 'block' }}>实体商家入驻</span>
              <span style={{ fontSize: '7px', color: 'var(--m-text-sub)', display: 'block', marginTop: '2px', lineHeight: '1.2' }}>
                卡牌桌游店、女仆咖啡厅、动漫主题餐饮、实体谷子店入驻。
              </span>
            </div>
            <div style={{ flex: 1, border: '0.5px solid var(--m-border)', padding: '10px', borderRadius: '12px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
              <span style={{ fontSize: '18px', display: 'block', marginBottom: '3px' }}>📍</span>
              <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-main)', display: 'block' }}>打卡引流与分成</span>
              <span style={{ fontSize: '7px', color: 'var(--m-text-sub)', display: 'block', marginTop: '2px', lineHeight: '1.2' }}>
                用户通过“拼团面基到店”或“AR地标打卡”引流，平台按到店人数抽佣。
              </span>
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--m-sage-light)', border: '1px solid var(--m-sage)', borderRadius: '10px', padding: '8px 10px', fontSize: '7.5px', color: '#5B7A63', lineHeight: '1.3' }}>
            <strong>远期愿景</strong>：让「次元地标」成为物理世界中二次元用户的终极社交导航仪，实现“线上交流找组织，线下联机去地标”的超级闭环。
          </div>
        </div>
      )
    },
    // Slide 6: Consortium Blockchain & Digital Assetization
    {
      title: "前瞻创新：同人作品联盟链确权",
      subtitle: "保护创作创造力，国内合规法币结算",
      tag: "科技商业路径",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ backgroundColor: 'rgba(168,189,209,0.08)', border: '1px dashed var(--m-secondary)', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BadgeCheck size={12} />
              <span>联盟链（Consortium Blockchain）确权</span>
            </span>
            <p style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', margin: 0, lineHeight: '1.35' }}>
              将同人小说、画作、线稿上传至国内合规联盟链（如蚂蚁链、至信链），进行上链存证确权。为画师和同人作家提供极低成本的版权所属保护。
            </p>
          </div>
          <div style={{ backgroundColor: '#F8F9FA', border: '0.5px solid var(--m-border)', borderRadius: '12px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Coins size={12} className="text-neutral-500" />
              <span>合法法币人民币（CNY）交易闭环</span>
            </span>
            <p style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', margin: 0, lineHeight: '1.35' }}>
              规避虚拟代币，完全通过微信、支付宝或数字人民币进行购买与版权授权费的清算，从根本上符合国内金融与版权监管。
            </p>
          </div>
        </div>
      )
    },
    // Slide 7: AI Digital Human & Companion Economy
    {
      title: "前瞻创新：AI数字人与陪伴经济",
      subtitle: "大模型复刻虚拟灵魂，打造AR线下联机助手",
      tag: "未来科技应用",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { icon: "💬", title: "线上1对1情感陪伴", desc: "基于大语言模型复刻二次元IP角色，提供语音聊天、虚拟扩列、以及全天候的情感倾听，提供会员包月订阅（SaaS模式）变现。" },
            { icon: "🗺️", title: "线下AR漫展导航与看板娘", desc: "在漫展地标，用户使用手机AR扫描即可浮现AI数字人。不仅能生动地担任“虚拟导游”介绍看点、摊位，还能提供合影收费变现。" },
            { icon: "🎭", title: "商家代言与推广", desc: "线下二次元商铺可在次元地标定制自己专属的 AI 娘进行交互，平台通过技术分成并提供商家广告返利。" }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#F8F9FA', border: '0.5px solid var(--m-border)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '14px', marginTop: '1px' }}>{item.icon}</span>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--m-text-main)' }}>{item.title}</span>
                <p style={{ margin: '1px 0 0 0', fontSize: '7.5px', color: 'var(--m-text-sub)', lineHeight: '1.3' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )
    },
    // Slide 8: Closing
    {
      title: "汇报总结与开始体验",
      subtitle: "次元地标 —— 激发每个同好的线下能量",
      tag: "商业价值总结",
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '14px', textAlign: 'center' }}>
          <div style={{
            padding: '12px',
            borderRadius: '16px',
            backgroundColor: '#F8F9FA',
            border: '0.5px solid var(--m-border)',
            maxWidth: '280px'
          }}>
            <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--m-primary)', display: 'block', marginBottom: '4px' }}>给漫展主创方的利益点：</span>
            <p style={{ fontSize: '7.5px', color: 'var(--m-text-sub)', margin: 0, lineHeight: '1.4' }}>
              不仅仅是卖票，更是帮助您把“三天的活动”变成“全年的同好社交与交易中心”，激活私域，倍增摊商与用户的长尾价值。
            </p>
          </div>

          <button
            onClick={() => resetToTab('circles')}
            className="btn-round btn-primary interactive-scale"
            style={{
              height: '36px',
              padding: '0 24px',
              fontSize: '10px',
              fontWeight: 800,
              gap: '6px',
              marginTop: '8px',
              boxShadow: '0 6px 16px rgba(229,169,169,0.25)'
            }}
          >
            <Play size={12} fill="#FFFFFF" />
            <span>开始高保真产品体验</span>
          </button>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div className="w-full h-full bg-[#16161A] flex flex-col relative select-none" style={{ color: '#E2E5E8' }}>
      
      {/* 顶部指示器 */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #232329',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles size={11} className="text-[#E5A9A9]" />
          <span style={{ fontSize: '8px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
            {slide.tag}
          </span>
        </div>
        <span style={{ fontSize: '8px', fontWeight: 700, color: 'var(--m-text-muted)' }}>
          Slide {currentSlide + 1} / {slides.length}
        </span>
      </div>

      {/* 幻灯片内容区 */}
      <div style={{
        flex: 1,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: currentSlide === 0 || currentSlide === slides.length - 1 ? 'center' : 'flex-start',
        overflowY: 'auto',
        gap: '12px'
      }}>
        
        {/* 标题 */}
        {currentSlide !== 0 && currentSlide !== slides.length - 1 && (
          <div style={{ borderBottom: '1px solid #232329', paddingBottom: '6px', flexShrink: 0 }}>
            <h2 style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: '1.3' }}>
              {slide.title}
            </h2>
            <p style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0 0', lineHeight: '1.2' }}>
              {slide.subtitle}
            </p>
          </div>
        )}

        {/* 主体卡片 */}
        <div style={{
          flexShrink: 0,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {slide.content}
        </div>
      </div>

      {/* 底部导航栏与进度条 */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid #232329',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
        backgroundColor: '#1C1C1E'
      }}>
        {/* 进度条 */}
        <div style={{
          width: '100%',
          height: '2.5px',
          backgroundColor: '#232329',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
            height: '100%',
            backgroundColor: 'var(--m-primary)',
            transition: 'width 0.2s ease-out'
          }} />
        </div>

        {/* 翻页按钮 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="interactive-scale"
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: currentSlide === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
              color: currentSlide === 0 ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
              border: 'none',
              fontSize: '8.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={12} />
            <span>上一页</span>
          </button>

          <span style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.3)' }}>
            支持键盘 ← / → / 空格 翻页
          </span>

          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="interactive-scale"
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              backgroundColor: currentSlide === slides.length - 1 ? 'rgba(255,255,255,0.03)' : 'var(--m-primary)',
              color: currentSlide === slides.length - 1 ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
              border: 'none',
              fontSize: '8.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <span>下一页</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

    </div>
  );
}
