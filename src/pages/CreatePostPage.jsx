import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, Globe, MapPin, Hash, Check, 
  ChevronRight, Plus, X, Image as ImageIcon, 
  Film, ArrowLeft, Play, AlertCircle
} from 'lucide-react';

export default function CreatePostPage() {
  const { routeStack, circles, circleMemberships, activities, createPost, popRoute, saveDraft, deleteDraft } = useApp();
  const fileInputRef = useRef(null);
  
  // 获取当前路由参数，检查是否有外部传入的类别或圈子
  const currentRoute = routeStack[routeStack.length - 1];
  const routeCircleId = currentRoute.params?.circleId;
  const initialDraft = currentRoute.params?.draft;

  // 1. 初始化发布流状态
  const [selectedType, setSelectedType] = useState(initialDraft?.type || currentRoute.params?.type || 'image');

  // 2. 发帖编辑区核心状态
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [content, setContent] = useState(initialDraft?.content || '');
  const [selectedActivityId, setSelectedActivityId] = useState('none');
  const [selectedTags, setSelectedTags] = useState(initialDraft?.tags || []);
  const [showTagsDrawer, setShowTagsDrawer] = useState(false);

  // 图文流：已选图片列表
  const [selectedImages, setSelectedImages] = useState(initialDraft?.images || []);

  // 视频流：已选视频与封面
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(initialDraft?.videoUrl || '');
  const [selectedVideoCover, setSelectedVideoCover] = useState(initialDraft?.type === 'video' ? initialDraft?.images?.[0] || '' : '');

  // 筛选用户加入的圈子
  const joinedCircles = circles.filter(c => circleMemberships[c.id]);
  const [selectedCircleId, setSelectedCircleId] = useState(initialDraft?.circleId || routeCircleId || 'none');


  // 热门话题列表
  const trendingTags = ['吃谷打卡', 'Coser返图', '神仙太太', '求面基扩列', '战利品展示', '吐槽树洞'];

  // 预置的高清模拟视频池 (ACG漫展主题)
  const mockVideoPool = [
    {
      id: 'mv-1',
      title: 'BW2026 宅舞舞台返图.mp4',
      cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-cosplay-girl-in-neon-lighting-40010-large.mp4'
    },
    {
      id: 'mv-2',
      title: 'CP30 痛包集锦 Vlog.mp4',
      cover: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=150&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-signboard-light-40008-large.mp4'
    },
    {
      id: 'mv-3',
      title: '大悦城快闪漫展现场.mp4',
      cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=80',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-cosplaying-a-character-40009-large.mp4'
    }
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  // 处理本地图片模拟上传
  const handleLocalUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(prev => [...prev, ...newImageUrls]);
    e.target.value = '';
  };

  // 提交发布
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // 强制媒体校验
    if (selectedType === 'video' && !selectedVideoUrl) return;

    let finalContent = content;
    if (selectedTags.length > 0) {
      finalContent += '\n\n' + selectedTags.map(t => `#${t}`).join(' ');
    }

    if (selectedActivityId !== 'none') {
      const act = activities.find(a => a.id === selectedActivityId);
      if (act) {
        finalContent = `📍【关联活动：${act.title}】\n` + finalContent;
      }
    }

    const targetCircleId = selectedCircleId === 'none' ? null : selectedCircleId;
    
    // 如果没有上传图片，我们将随机生成一个精致的二次元插画卡片背景
    let finalImages = selectedImages;
    if (selectedType === 'image' && selectedImages.length === 0) {
      const placeholders = [
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80', // 二次元插画风格
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80', // 星空幻想
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80', // 霓虹街景
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'  // 唯美粉色云海
      ];
      // 简单散列算法保证相同的文本内容渲染相同的背景
      const hash = content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = Math.abs(hash) % placeholders.length;
      finalImages = [placeholders[index]];
    } else if (selectedType === 'video') {
      finalImages = [selectedVideoCover];
    }

    createPost(targetCircleId, finalContent, finalImages, selectedTags, title, selectedVideoUrl);
    if (initialDraft) {
      deleteDraft(initialDraft.id);
    }
    popRoute();
  };

  // 保存草稿
  const handleSaveDraft = () => {
    if (!title.trim() && !content.trim()) {
      alert('请输入标题或内容再保存草稿！');
      return;
    }
    saveDraft({
      id: initialDraft?.id,
      type: selectedType,
      title,
      content,
      tags: selectedTags,
      circleId: selectedCircleId,
      images: selectedImages,
      videoUrl: selectedVideoUrl
    });
    alert('已成功保存至草稿箱！');
    popRoute();
  };


  const selectedCircleName = selectedCircleId === 'none' 
    ? '不关联任何圈子' 
    : (circles.find(c => c.id === selectedCircleId)?.name || '不关联任何圈子');

  const selectedActivityName = selectedActivityId === 'none'
    ? '不关联线下活动'
    : (activities.find(a => a.id === selectedActivityId)?.title?.substring(0, 10) + '...' || '不关联线下活动');

  // 判断是否满足提交条件 (允许图文动态不上传图片，此时后台会自动生成精致插图海报卡片)
  const isSubmitDisabled = !content.trim() || 
    (selectedType === 'video' && !selectedVideoUrl);

  const isDraftDisabled = !title.trim() && !content.trim();


  // ==================== 视图 1：选择发布类型 (发图文 / 发视频) ====================
  if (selectedType === null) {
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '16px',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* 顶部标题栏 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '36px' }}>
          <button 
            onClick={popRoute}
            style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--m-text-sub)', fontWeight: 800, cursor: 'pointer' }}
          >
            取消
          </button>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--m-text-main)' }}>选择发布类型</span>
          <div style={{ width: '24px' }} />
        </div>

        {/* 两个大型宫格选项 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center', padding: '0 8px' }}>
          
          {/* 发图文卡片 */}
          <div 
            onClick={() => setSelectedType('image')}
            className="interactive-scale"
            style={{
              padding: '24px',
              borderRadius: '20px',
              backgroundColor: 'var(--m-primary-light)',
              border: '1.5px solid var(--m-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              boxShadow: 'var(--m-shadow-md)'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--m-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <ImageIcon size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#B56767' }}>发图文</span>
              <span style={{ fontSize: '8.5px', color: '#B56767', opacity: 0.85, fontWeight: 700 }}>记录同好集邮、返图与吃谷心得</span>
            </div>
          </div>

          {/* 发视频卡片 */}
          <div 
            onClick={() => setSelectedType('video')}
            className="interactive-scale"
            style={{
              padding: '24px',
              borderRadius: '20px',
              backgroundColor: 'var(--m-secondary-light)',
              border: '1.5px solid var(--m-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              boxShadow: 'var(--m-shadow-md)'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--m-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Film size={24} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#557591' }}>发视频</span>
              <span style={{ fontSize: '8.5px', color: '#557591', opacity: 0.85, fontWeight: 700 }}>分享舞台宅舞、漫展短视频瞬间</span>
            </div>
          </div>

        </div>

        {/* 提示栏 */}
        <div style={{ textAlign: 'center', fontSize: '8px', color: 'var(--m-text-muted)', fontWeight: 700, paddingBottom: '12px' }}>
          次元地标支持高清同好图文及漫展短视频展示
        </div>
      </div>
    );
  }

  // ==================== 视图 2：编辑器表单 (图文/视频共用结构) ====================
  return (
    <div className="w-full h-full bg-[#FFFFFF] flex flex-col relative select-none">
      
      {/* 隐藏的本地图片 input */}
      <input 
        type="file" 
        multiple 
        accept="image/*"
        ref={fileInputRef}
        onChange={handleLocalUpload}
        style={{ display: 'none' }}
      />

      {/* 顶栏 */}
      <div 
        style={{
          height: '44px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--m-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          flexShrink: 0
        }}
      >
        <button 
          onClick={popRoute}
          className="interactive-scale"

          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'none',
            border: 'none',
            fontSize: '10px',
            fontWeight: 800,
            color: 'var(--m-text-sub)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={14} />
          <span>返回</span>
        </button>
        
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--m-text-main)' }}>
          {selectedType === 'image' ? '发布图文动态' : '发布视频动态'}
        </span>
        
        <div style={{ width: '40px' }} />
      </div>

      {/* 编辑区 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '70px' }}>
        
        {/* 标题 & 内容输入框 */}
        <div 
          style={{ 
            backgroundColor: '#F8F9FA', 
            borderRadius: '12px', 
            padding: '12px', 
            border: '1px solid rgba(226, 229, 232, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <input 
            type="text"
            placeholder={selectedType === 'image' ? "为图文拟个吸引同好的标题吧..." : "为视频写个震撼的现场标题吧..."}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={30}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(226, 229, 232, 0.6)',
              paddingBottom: '8px',
              outline: 'none',
              fontSize: '11px',
              fontWeight: 800,
              color: 'var(--m-text-main)'
            }}
          />
          
          <textarea 
            rows="5"
            placeholder={selectedType === 'image' ? "分享一下今天面基集邮、吃谷的有趣瞬间吧~" : "写点视频简介吧，比如Cos的角色、展会名称等~"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '9.5px',
              color: 'var(--m-text-main)',
              lineHeight: '1.6',
              minHeight: '90px'
            }}
          />
        </div>

        {/* ==================== 2.1 图文流专属：相册图片上传 ==================== */}
        {selectedType === 'image' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid rgba(226,229,232,0.4)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--m-text-sub)' }}>
                添加图片 (首张图将作为网格封面)
              </span>
              {selectedImages.length === 0 && (
                <span style={{ fontSize: '7.5px', color: 'var(--m-text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span>可选，不选则自动生成封面</span>
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 2px 6px 2px' }}>
              <div 
                onClick={() => fileInputRef.current.click()}
                className="interactive-scale"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  border: '1.5px dashed var(--m-border)',
                  backgroundColor: '#F8F9FA',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  gap: '2px',
                  color: 'var(--m-text-sub)'
                }}
              >
                <Plus size={16} className="text-neutral-400" />
                <span style={{ fontSize: '7px', fontWeight: 800 }}>本地相册</span>
              </div>

              {selectedImages.map((url, index) => (
                <div 
                  key={index}
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    flexShrink: 0
                  }}
                >
                  <img 
                    src={url} 
                    alt={`uploaded-${index}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1.5px solid var(--m-primary)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: '#FF5E5E',
                      color: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }}
                  >
                    <X size={8} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 2.2 视频流专属：视频库选择 ==================== */}
        {selectedType === 'video' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderBottom: '1px solid rgba(226,229,232,0.4)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '8px', fontWeight: 800, color: 'var(--m-text-sub)' }}>
                选择漫展视频录像
              </span>
              {!selectedVideoUrl && (
                <span style={{ fontSize: '7.5px', color: '#FF6384', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <AlertCircle size={9} />
                  <span>必须选择一段视频</span>
                </span>
              )}
            </div>

            {/* 三个预置的高质量模拟视频列表 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {mockVideoPool.map(video => {
                const isSelected = selectedVideoUrl === video.url;
                return (
                  <div 
                    key={video.id}
                    onClick={() => {
                      setSelectedVideoUrl(video.url);
                      setSelectedVideoCover(video.cover);
                    }}
                    className="interactive-scale"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid var(--m-secondary)' : '1px solid var(--m-border)',
                      backgroundColor: isSelected ? 'var(--m-secondary-light)' : '#F8F9FA',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={video.cover} alt="v_cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                        <Play size={14} fill="#FFFFFF" />
                      </div>
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '8.5px', fontWeight: 800, color: 'var(--m-text-main)' }}>
                        {video.title}
                      </span>
                      <span style={{ fontSize: '7px', color: 'var(--m-text-muted)' }}>
                        视频时长: 0:15 | 点击选择
                      </span>
                    </div>

                    {isSelected && (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'var(--m-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 下拉表单配置项 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* 关联同好圈 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px', borderBottom: '1px solid rgba(226,229,232,0.45)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={13} className="text-neutral-500" />
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>分发到同好圈</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '8.5px', color: selectedCircleId === 'none' ? 'var(--m-text-muted)' : 'var(--m-primary)', fontWeight: 800 }}>
                {selectedCircleName}
              </span>
              <ChevronRight size={12} className="text-neutral-400" />
            </div>

            {!routeCircleId && (
              <select
                value={selectedCircleId}
                onChange={(e) => setSelectedCircleId(e.target.value)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="none">不关联任何圈子 (仅发布至发现广场)</option>
                {joinedCircles.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* 关联现场地标 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px', borderBottom: '1px solid rgba(226,229,232,0.45)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={13} className="text-neutral-500" />
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>关联现场地标</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '8.5px', color: selectedActivityId === 'none' ? 'var(--m-text-muted)' : 'var(--m-text-sub)', fontWeight: 800 }}>
                {selectedActivityName}
              </span>
              <ChevronRight size={12} className="text-neutral-400" />
            </div>

            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              <option value="none">不关联任何线下地标活动</option>
              {activities.map(act => (
                <option key={act.id} value={act.id}>{act.title}</option>
              ))}
            </select>
          </div>

          {/* 附加话题标签 */}
          <div 
            onClick={() => setShowTagsDrawer(!showTagsDrawer)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px', borderBottom: '1px solid rgba(226,229,232,0.45)', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Hash size={13} className="text-neutral-500" />
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--m-text-main)' }}>添加话题标签</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '8.5px', color: selectedTags.length === 0 ? 'var(--m-text-muted)' : 'var(--m-primary)', fontWeight: 800 }}>
                {selectedTags.length === 0 ? '添加话题' : `已选 #${selectedTags[0]}${selectedTags.length > 1 ? ` 等${selectedTags.length}个` : ''}`}
              </span>
              <ChevronRight size={12} className="text-neutral-400" style={{ transform: showTagsDrawer ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </div>

          {showTagsDrawer && (
            <div 
              style={{ 
                backgroundColor: '#F8F9FA', 
                borderRadius: '0 0 12px 12px', 
                padding: '10px', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '6px',
                border: '1px solid rgba(226, 229, 232, 0.45)',
                borderTop: 'none'
              }}
            >
              {trendingTags.map((tag, idx) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`badge ${isSelected ? 'badge-primary' : 'badge-slate'} interactive-scale`}
                    style={{
                      padding: '4px 10px',
                      fontSize: '8px',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* 底部发送栏 (有条件置灰发布按钮) */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid rgba(226, 229, 232, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 12px',
          zIndex: 40
        }}
      >
        {/* 保存草稿 */}
        <button 
          onClick={handleSaveDraft}
          disabled={isDraftDisabled}
          className="interactive-scale"
          style={{
            padding: '6px 16px',
            fontSize: '9px',
            fontWeight: 800,
            borderRadius: '9999px',
            border: '1px solid var(--m-primary)',
            backgroundColor: '#FFFFFF',
            color: 'var(--m-primary)',
            cursor: isDraftDisabled ? 'not-allowed' : 'pointer',
            opacity: isDraftDisabled ? 0.5 : 1,
            marginRight: '8px',
            display: 'flex',
            alignItems: 'center',
            height: '28px'
          }}
        >
          保存草稿
        </button>

        {/* 发布动态 */}
        <button 
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="btn-round interactive-scale"
          style={{
            padding: '6px 20px',
            fontSize: '9px',
            fontWeight: 800,
            gap: '4px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: isSubmitDisabled ? '#E2E5E8' : 'var(--m-primary)',
            color: isSubmitDisabled ? 'var(--m-text-muted)' : '#FFFFFF',
            border: 'none',
            borderRadius: '9999px',
            cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
            boxShadow: isSubmitDisabled ? 'none' : '0 4px 10px rgba(229, 169, 169, 0.25)',
            height: '28px'
          }}
        >
          <Send size={10} />
          <span>发布动态</span>
        </button>
      </div>

    </div>
  );
}
