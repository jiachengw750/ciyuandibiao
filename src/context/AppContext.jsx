import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // 1. 用户与登录状态 (头像使用高质量 Unsplash 占位符，不使用 Emoji)
  const [user, setUser] = useState({
    name: '木子李_Muzi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    bio: '魔都排少、原神双修，谷子收集狂热粉',
    badges: ['痛包达人', '展会常客']
  });

  // 模拟登录回调栈
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingLoginCallback, setPendingLoginCallback] = useState(null);

  // 2. 路由导航栈 (用于单页模拟的多层页面切换)
  const [routeStack, setRouteStack] = useState([
    { page: 'circles', params: {} } // 初始页为同好营（发现Tab）
  ]);
  const [sourceParam, setSourceParam] = useState('circles'); // 跟踪来源

  // 全局发布选择弹窗状态
  const [showGlobalPublishSheet, setShowGlobalPublishSheet] = useState(false);
  const [globalPublishCircleId, setGlobalPublishCircleId] = useState(null);

  const openPublishFlow = (circleId = null) => {
    setGlobalPublishCircleId(circleId);
    setShowGlobalPublishSheet(true);
  };

  const closePublishFlow = () => {
    setShowGlobalPublishSheet(false);
    setGlobalPublishCircleId(null);
  };

  // 草稿箱状态
  const [drafts, setDrafts] = useState([
    {
      id: 'draft-001',
      type: 'image',
      title: '大悦城吃谷小分队招人啦',
      content: '想建一个魔都吃谷面基群，平时一起拼谷、逛快闪、喝主题咖啡。要求：不跨圈ky，主吃排少/原神/铁道。有兴趣的留言我拉你~',
      tags: ['同好扩列', '吃谷面基'],
      circleId: 'cir-001',
      images: [],
      createdAt: '2026-05-24 10:30'
    },
    {
      id: 'draft-002',
      type: 'video',
      title: '漫展宅舞舞台直拍测试',
      content: '录了今天现场的宅舞，等回去把剪辑好的高清版放上来...',
      tags: ['漫展现场', '宅舞'],
      circleId: 'cir-004',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happy-in-the-city-43152-large.mp4',
      images: ['https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=300&q=80'],
      createdAt: '2026-05-23 18:15'
    }
  ]);

  const saveDraft = (draftData) => {
    const newDraft = {
      id: draftData.id || `draft-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
      ...draftData
    };
    setDrafts(prev => {
      const exists = prev.some(d => d.id === newDraft.id);
      if (exists) {
        return prev.map(d => d.id === newDraft.id ? newDraft : d);
      }
      return [newDraft, ...prev];
    });
  };

  const deleteDraft = (draftId) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };



  // 导航操作
  const pushRoute = (page, params = {}, source = '') => {
    if (source) setSourceParam(source);
    setRouteStack(prev => [...prev, { page, params }]);
  };

  const popRoute = () => {
    if (routeStack.length > 1) {
      setRouteStack(prev => prev.slice(0, -1));
    }
  };

  const resetToTab = (tabName) => {
    setRouteStack([{ page: tabName, params: {} }]);
    setSourceParam(tabName);
  };

  const checkLogin = (onSuccess) => {
    if (user) {
      onSuccess();
    } else {
      setPendingLoginCallback(() => onSuccess);
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setUser({
      name: '木子李_Muzi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      bio: '魔都排少、原神双修，谷子收集狂热粉',
      badges: ['痛包达人', '展会常客']
    });
    setShowLoginModal(false);
    if (pendingLoginCallback) {
      pendingLoginCallback();
      setPendingLoginCallback(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    resetToTab('circles');
  };

  // 3. 漫展/主题活动 Mock 数据 (完全符合 PRD 字段，不带 Emoji)
  const [activities, setActivities] = useState([
    {
      id: 'act-001',
      title: 'CP30 动漫同人博览会',
      type: 'comic_con',
      tags: ['热门展会', '限定周边', '需提前购票'],
      city: '上海',
      location: '国家会展中心 (上海市青浦区崧泽大道333号)',
      lat: 31.192,
      lng: 121.298,
      date: '2026-07-18 至 2026-07-20',
      startTime: '2026-07-18T09:00:00',
      endTime: '2026-07-20T17:00:00',
      status: 'upcoming', // upcoming, ongoing, ended
      cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      heatScore: 98,
      wantedCount: 3840,
      favoritedCount: 2980,
      intro: '国内规模最大的同人原创交流展，CP30 正式登陆虹桥国展中心！汇集全国优秀社团与万名同人创作者。'
    },
    {
      id: 'act-002',
      title: 'BW2026 哔哩哔哩世界',
      type: 'comic_con',
      tags: ['官方大型展', '嘉宾签售', '名额紧缺'],
      city: '上海',
      location: '上海新国际博览中心 (浦东新区龙阳路2345号)',
      lat: 31.214,
      lng: 121.573,
      date: '2026-07-25 至 2026-07-27',
      startTime: '2026-07-25T09:00:00',
      endTime: '2026-07-27T18:00:00',
      status: 'upcoming',
      cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
      heatScore: 95,
      wantedCount: 4500,
      favoritedCount: 3120,
      intro: '由 Bilibili 主办的大型线下同好聚会，嘉宾云集，汇聚动漫、游戏、电竞、UP主线下见面会。'
    },
    {
      id: 'act-003',
      title: '排球少年!! 主题唯美快闪展',
      type: 'popup',
      tags: ['官方正版授权', '打卡必去', '免费入场'],
      city: '上海',
      location: '静安大悦城北座9楼中庭 (静安区西藏北路166号)',
      lat: 31.246,
      lng: 121.474,
      date: '2026-05-10 至 2026-06-15',
      startTime: '2026-05-10T10:00:00',
      endTime: '2026-06-15T22:00:00',
      status: 'ongoing',
      cover: 'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=600&q=80',
      heatScore: 89,
      wantedCount: 1540,
      favoritedCount: 920,
      intro: '排球少年!! 官方授权主题快闪店上海站，还原经典乌野高中排球部休息室场景，提供超过100款限定谷子贩售。'
    },
    {
      id: 'act-004',
      title: '次元谷子同人手工市集 (徐汇站)',
      type: 'goods_market',
      tags: ['吃谷圣地', '免门票', '露天手工'],
      city: '上海',
      location: '美罗城B1区广场 (徐汇区肇嘉浜路1111号)',
      lat: 31.194,
      lng: 121.437,
      date: '2026-05-20 至 2026-05-24',
      startTime: '2026-05-20T11:00:00',
      endTime: '2026-05-24T21:00:00',
      status: 'ongoing',
      cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      heatScore: 82,
      wantedCount: 890,
      favoritedCount: 650,
      intro: '专为吃谷、手工同人打造的微型街头集市，这里有同人自制徽章、明信片、粘土人手作及各类同人本交换。'
    },
    {
      id: 'act-005',
      title: '原神FES 2026 线下嘉年华',
      type: 'theme_event',
      tags: ['大型游园会', '原神官方', '兑换码福利'],
      city: '上海',
      location: '上海世博展览馆4号馆 (浦东新区博成路850号)',
      lat: 31.185,
      lng: 121.491,
      date: '2026-08-12 至 2026-08-15',
      startTime: '2026-08-12T09:00:00',
      endTime: '2026-08-15T18:00:00',
      status: 'upcoming',
      cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      heatScore: 97,
      wantedCount: 4200,
      favoritedCount: 3500,
      intro: '原神官方年度线下盛典！沉浸式大世界场景还原，现场挑战小游戏获取精美周边，知名COSER互动签售。'
    }
  ]);

  // 4. 拼团/开团 Mock 数据 (完全符合 PRD 字段，不带 Emoji)
  const [groups, setGroups] = useState([
    {
      id: 'grp-001',
      title: '排球少年大悦城快闪-吃谷拼单痛包团',
      type: 'exchange', // visit, dinner, exchange, photo
      relatedActivityId: 'act-003',
      city: '上海',
      meetingAddress: '静安大悦城北座9楼快闪店入口左侧人形立牌处',
      meetingAddressDetail: '仅团员可见：本人当天身穿音驹高中红色外套，手抱孤爪研磨痛包，在研磨立牌下等候。',
      lat: 31.2465,
      lng: 121.4745,
      startTime: '2026-05-23T14:00:00',
      maxMembers: 6,
      currentMembers: 3,
      price: 'AA制',
      status: 'recruiting', // recruiting, full, ended, cancelled
      requirementSummary: '自带排球痛包，主吃乌野/音驹角色谷子，现场方便互相换谷。',
      locationVisibleRule: 'after_join',
      creator: {
        name: '猫又教研组长',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80'
      },
        members: [
          { name: '猫又教研组长', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80', role: 'owner' },
          { name: '小黑猫_研磨', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80', role: 'member' },
          { name: '日向家小暖', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&h=100&q=80', role: 'member' },
          { name: '木子李_Muzi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', role: 'member' }
        ],
        pendingRequests: [
          { id: 'req-101', name: '影山飞雄吹', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80', message: '求加入，带影山痛包 and 拍立得交换！' }
        ]
      },
      {
        id: 'grp-002',
        title: '徐汇美罗城谷子市集-Coser互拍搭子',
        type: 'photo',
        relatedActivityId: 'act-004',
        city: '上海',
        meetingAddress: '美罗城负一层星巴克门口长椅',
        meetingAddressDetail: '仅团员可见：本人当天COS原神芙宁娜，随行有手机自拍三脚架。',
        lat: 31.1945,
        lng: 121.4365,
        startTime: '2026-05-24T13:30:00',
        maxMembers: 4,
        currentMembers: 4,
        price: '免费',
        status: 'full',
        requirementSummary: '需要自带Cos服，互相拍照返图，新手友好不嫌弃手机出片。',
        locationVisibleRule: 'after_join',
        creator: {
          name: '夏沫之歌Cos',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80'
        },
        members: [
          { name: '夏沫之歌Cos', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80', role: 'owner' },
          { name: '云川晴空', avatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&w=100&h=100&q=80', role: 'member' },
          { name: '卡芙卡单推人', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&h=100&q=80', role: 'member' },
          { name: '流萤小宝贝', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80', role: 'member' }
        ],
        pendingRequests: []
      },
      {
        id: 'grp-003',
        title: 'CP30展后周边无代差火锅狂欢聚餐',
        type: 'dinner',
        relatedActivityId: 'act-001',
        city: '上海',
        meetingAddress: '国家会展中心旁虹桥天地海底捞',
        meetingAddressDetail: '仅团员可见：已预订了当晚18:30大桌，包房名“桃源乡”。现场联系电话：13816668888。',
        lat: 31.1915,
        lng: 121.2995,
        startTime: '2026-07-18T18:30:00',
        maxMembers: 10,
        currentMembers: 6,
        price: 'AA均摊约100',
        status: 'recruiting',
        requirementSummary: '逛完CP第一天一起聚餐吹水，纯吃货/同好均可，不限IP。',
        locationVisibleRule: 'after_join',
        creator: {
          name: '干饭人阿杰',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80'
        },
        members: [
          { name: '干饭人阿杰', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80', role: 'owner' }
        ],
        pendingRequests: []
      }
    ]);

    // 5. 活动参与关系 (我想去的 / 我收藏的)
    const [activityRelations, setActivityRelations] = useState({
      'act-001': { wanted: true, favorited: false },
      'act-003': { wanted: false, favorited: true }
    });

    const toggleWanted = (activityId) => {
      checkLogin(() => {
        setActivityRelations(prev => {
          const current = prev[activityId] || { wanted: false, favorited: false };
          return {
            ...prev,
            [activityId]: { ...current, wanted: !current.wanted }
          };
        });
      });
    };

    const toggleFavorited = (activityId) => {
      checkLogin(() => {
        setActivityRelations(prev => {
          const current = prev[activityId] || { wanted: false, favorited: false };
          return {
            ...prev,
            [activityId]: { ...current, favorited: !current.favorited }
          };
        });
      });
    };

    // 6. 圈子列表 (完全不带 Emoji)
    const [circles, setCircles] = useState([
      { id: 'cir-001', name: '排球少年同好营', avatar: '排球', avatarBg: '#E9C6C6', memberCount: 1540, postCount: 284, intro: '乌野、音驹、青城、枭谷！全国大赛，在这里集结！', tags: ['运动番', '排球少年', '吃谷交换'] },
      { id: 'cir-002', name: '原神提瓦特同盟', avatar: '原神', avatarBg: '#D2DCD0', memberCount: 3980, postCount: 541, intro: '提瓦特大陆旅行者根据地。分享日常、游戏攻略与角色Cos。', tags: ['米哈游', '原神', 'Cosplay'] },
      { id: 'cir-003', name: '崩坏星穹铁道分部', avatar: '铁道', avatarBg: '#C7D7E8', memberCount: 2200, postCount: 310, intro: '愿此行，终抵群星。星穹列车开拓者沙龙。', tags: ['米哈游', '星穹铁道', '周边同人'] },
      { id: 'cir-004', name: 'CP同人创作交流会', avatar: '同人', avatarBg: '#E6D7E8', memberCount: 1890, postCount: 198, intro: 'Comicup 线下大本营，交流同人本、无偿图、自制谷子情报。', tags: ['同人志', '无偿交换', '画师企划'] }
    ]);

    // 圈子加入状态
    const [circleMemberships, setCircleMemberships] = useState({
      'cir-001': true,
      'cir-002': false
    });

    const toggleJoinCircle = (circleId) => {
      checkLogin(() => {
        setCircleMemberships(prev => {
          const isJoined = !!prev[circleId];
          // 更新圈子成员数
          setCircles(old => old.map(c => {
            if (c.id === circleId) {
              return { ...c, memberCount: c.memberCount + (isJoined ? -1 : 1) };
            }
            return c;
          }));
          return {
            ...prev,
            [circleId]: !isJoined
          };
        });
      });
    };

    // 创建圈子 (CIR-010 自建圈子功能)
    const createCircle = (name, intro, tagsString) => {
      const tags = tagsString.split(/[,，\s]+/).filter(Boolean);
      const newCircle = {
        id: `cir-${Date.now()}`,
        name,
        avatar: name.substring(0, 2),
        avatarBg: '#EBDCD8',
        memberCount: 1,
        postCount: 0,
        intro,
        tags
      };
      setCircles(prev => [newCircle, ...prev]);
      setCircleMemberships(prev => ({ ...prev, [newCircle.id]: true }));
    };

    // 7. 动态列表 (去 Emoji)
    const [posts, setPosts] = useState([
      {
        id: 'post-user-001',
        circleId: 'cir-001',
        author: {
          name: '木子李_Muzi',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
        },
        content: '晒一下新入手的音驹痛包！挂满了研磨和黑尾的徽章，准备去大悦城快闪面基咯！求同好面基扩列！',
        createdAt: '2026-05-24 12:00',
        images: [
          'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80'
        ],
        likeCount: 18,
        commentCount: 2,
        liked: false,
        collected: false,
        status: 'normal',
        comments: [
          { author: '小黑猫_研磨', content: '好痛！痛包好好看，下午大悦城见！', time: '12:15' }
        ]
      },
      {
        id: 'post-user-002',
        circleId: 'cir-001',
        author: {
          name: '木子李_Muzi',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
        },
        content: '下午有人在大悦城吃谷吗？手头有几个多余的盲盒求当面交换，主求排球少年和原神！有的滴滴我呀~',
        createdAt: '2026-05-24 14:00',
        images: [],
        likeCount: 5,
        commentCount: 0,
        liked: false,
        collected: false,
        status: 'normal',
        comments: []
      },
      {
        id: 'post-001',
        circleId: 'cir-001',
        author: {
          name: '影山飞雄家的牛奶盒',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'
        },
        content: '今天在大悦城排队三小时终于拿到了研磨限定立牌！顺便求助一下，有没有同好主吃日向和影山想换研磨/黑尾的？我手头多了一个研磨立牌，可面交或挂闲鱼。',
        createdAt: '2026-05-22 14:32',
        images: [
          'https://images.unsplash.com/photo-1541562232579-512a21360020?auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80'
        ],
        likeCount: 42,
        commentCount: 8,
        liked: false,
        collected: false,
        status: 'normal',
        comments: [
          { author: '音驹小野猫', content: '我这里有多出来的日向徽章，下午三点在大悦城见面换吗？', time: '14:40' },
          { author: '翔阳小飞人', content: '排一个！想要研磨！', time: '14:55' }
        ]
      },
      {
        id: 'post-002',
        circleId: 'cir-002',
        author: {
          name: '提瓦特头号吟游诗人',
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&h=100&q=80'
        },
        content: '原神FES入场券终于抢到了！有第一天（8月12号）一起结伴去博览馆排队刷任务的小伙伴吗？我是温迪单推人，现场打算COS温迪，招募同伴！',
        createdAt: '2026-05-22 11:20',
        images: [
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80'
        ],
        likeCount: 65,
        commentCount: 12,
        liked: true,
        collected: true,
        status: 'normal',
        comments: [
          { author: '钟离单推老兵', content: '蹲一个，第一天我也去，打算COS帝君！', time: '11:35' },
          { author: '胡桃的小棺材', content: '啊啊啊温迪！现场求扩列！', time: '12:01' }
        ]
      }
  ]);

  const toggleLikePost = (postId) => {
    checkLogin(() => {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const newLiked = !p.liked;
          return {
            ...p,
            liked: newLiked,
            likeCount: p.likeCount + (newLiked ? 1 : -1)
          };
        }
        return p;
      }));
    });
  };

  const addCommentToPost = (postId, commentText) => {
    if (!commentText.trim()) return;
    checkLogin(() => {
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentCount: p.commentCount + 1,
            comments: [
              ...p.comments,
              { author: user.name, content: commentText, time: '刚刚' }
            ]
          };
        }
        return p;
      }));
    });
  };

  const createPost = (circleId, content, images = [], topics = [], title = '', videoUrl = '') => {
    if (!content.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      circleId,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      title: title || '',
      content,
      createdAt: '刚刚',
      images,
      videoUrl,
      likeCount: 0,
      commentCount: 0,
      liked: false,
      collected: false,
      status: 'normal',
      comments: [],
      topics
    };
    setPosts(prev => [newPost, ...prev]);
    // 更新对应圈子动态计数
    setCircles(old => old.map(c => {
      if (c.id === circleId) {
        return { ...c, postCount: c.postCount + 1 };
      }
      return c;
    }));
  };


  // 8. 开团申请与成员联动 (符合 PRD 开团群消息要求)
  const [messages, setMessages] = useState([
    {
      id: 'chat-001',
      title: '排球少年大悦城快闪拼单群',
      isGroup: true,
      relatedGroupId: 'grp-001',
      avatar: '🏐',
      lastMessage: '猫又教研组长：大家明天的面基痛包记得带齐哦！',
      time: '18:12',
      unread: 1,
      chatHistory: [
        { sender: '猫又教研组长', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80', content: '欢迎加入本群！我们明天14点大悦城9楼立牌下集合。', time: '16:00', isSystem: false },
        { sender: '小黑猫_研磨', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80', content: '收到，我带了研磨的拍立得和痛包。', time: '16:15', isSystem: false },
        { sender: '猫又教研组长', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80', content: '大家明天的面基痛包记得带齐哦！', time: '18:12', isSystem: false }
      ]
    },
    {
      id: 'chat-sys',
      title: '系统通知',
      isGroup: false,
      relatedGroupId: null,
      avatar: '🔔',
      lastMessage: '您申请加入的【徐汇美罗城谷子市集-Coser互拍搭子】已成功入团。',
      time: '上午10:15',
      unread: 0,
      chatHistory: [
        { sender: '系统', avatar: '', content: '您申请加入的【徐汇美罗城谷子市集-Coser互拍搭子】已成功入团。开团群聊已自动为您创建，可直接进入群聊与团员交流。', time: '10:15', isSystem: true }
      ]
    }
  ]);

  const [unreadCount, setUnreadCount] = useState(1);

  // 申请加入拼团 (GRP-002)
  const applyJoinGroup = (groupId, messageText = '') => {
    checkLogin(() => {
      setGroups(prev => prev.map(g => {
        if (g.id === groupId) {
          // 如果已经在等待名单或成员名单，不要重复添加
          const alreadyPending = g.pendingRequests.some(r => r.name === user.name);
          const alreadyMember = g.members.some(m => m.name === user.name);
          if (alreadyPending || alreadyMember) return g;

          return {
            ...g,
            pendingRequests: [
              ...g.pendingRequests,
              {
                id: `req-${Date.now()}`,
                name: user.name,
                avatar: user.avatar,
                message: messageText || '求加入拼团，结伴同行！'
              }
            ]
          };
        }
        return g;
      }));
    });
  };

  // 团主审批申请 (通过/拒绝)
  const approveRequest = (groupId, requestId, isApproved) => {
    let approvedUser = null;
    
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const reqIndex = g.pendingRequests.findIndex(r => r.id === requestId);
        if (reqIndex === -1) return g;
        
        const req = g.pendingRequests[reqIndex];
        approvedUser = { name: req.name, avatar: req.avatar };
        
        const newPending = g.pendingRequests.filter(r => r.id !== requestId);
        const newMembers = isApproved 
          ? [...g.members, { name: req.name, avatar: req.avatar, role: 'member' }]
          : g.members;
          
        return {
          ...g,
          pendingRequests: newPending,
          members: newMembers,
          currentMembers: newMembers.length,
          status: newMembers.length >= g.maxMembers ? 'full' : g.status
        };
      }
      return g;
    }));

    if (isApproved && approvedUser) {
      // 联动消息群：如果是本团群，自动拉入群聊
      setMessages(prev => prev.map(chat => {
        if (chat.relatedGroupId === groupId) {
          return {
            ...chat,
            chatHistory: [
              ...chat.chatHistory,
              { sender: '系统', avatar: '', content: `✨ ${approvedUser.name} 已获准加入本团并进入群聊。`, time: '刚刚', isSystem: true }
            ]
          };
        }
        return chat;
      }));
    }
  };

  // 创建开团 (MAP-030 / GRP-001)
  const createGroup = (activityId, title, price, totalLimit, addressSummary, addressDetail, tag) => {
    checkLogin(() => {
      const newGroup = {
        id: `grp-${Date.now()}`,
        title,
        type: tag === '约人面基' ? 'visit' : tag === '周边合购' ? 'exchange' : 'dinner',
        relatedActivityId: activityId,
        city: '上海',
        meetingAddress: addressSummary,
        meetingAddressDetail: addressDetail,
        lat: 31.2 + (Math.random() - 0.5) * 0.08, // 随机在该市活动中心附近
        lng: 121.4 + (Math.random() - 0.5) * 0.08,
        startTime: new Date(Date.now() + 86400000).toISOString(), // 默认明天
        maxMembers: parseInt(totalLimit, 10) || 5,
        currentMembers: 1,
        price: price === '0' || !price ? 'AA制' : `AA制人均 ¥${price}`,
        status: 'recruiting',
        requirementSummary: '有兴趣同人创作和吃谷的小伙伴速来！',
        locationVisibleRule: 'after_join',
        creator: {
          name: user.name,
          avatar: user.avatar
        },
        members: [
          { name: user.name, avatar: user.avatar, role: 'owner' }
        ],
        pendingRequests: []
      };

      setGroups(prev => [newGroup, ...prev]);

      // 同时自动创建对应的拼团群聊 (PRD GRP-004联动)
      const newChat = {
        id: `chat-${Date.now()}`,
        title: `${title} 拼团群`,
        isGroup: true,
        relatedGroupId: newGroup.id,
        avatar: '💬',
        lastMessage: '系统：拼团群创建成功，拉入团主。',
        time: '刚刚',
        unread: 0,
        chatHistory: [
          { sender: '系统', avatar: '', content: `🎉 【${title}】拼团群建立。团主已自动入群。加群成员通过审核后会自动进入该群交流。`, time: '刚刚', isSystem: true }
        ]
      };
      setMessages(prev => [newChat, ...prev]);
    });
  };

  // 发送消息
  const sendMessage = (chatId, text) => {
    if (!text.trim()) return;
    setMessages(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          lastMessage: `${user.name}：${text}`,
          time: '刚刚',
          chatHistory: [
            ...chat.chatHistory,
            { sender: user.name, avatar: user.avatar, content: text, time: '刚刚', isSystem: false }
          ]
        };
      }
      return chat;
    }));
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      showLoginModal,
      setShowLoginModal,
      handleLoginSuccess,
      handleLogout,
      
      routeStack,
      pushRoute,
      popRoute,
      resetToTab,
      sourceParam,
      checkLogin,
      
      activities,
      setActivities,
      groups,
      setGroups,
      activityRelations,
      toggleWanted,
      toggleFavorited,
      
      circles,
      circleMemberships,
      toggleJoinCircle,
      createCircle,
      
      posts,
      toggleLikePost,
      addCommentToPost,
      createPost,
      
      messages,
      unreadCount,
      setUnreadCount,
      applyJoinGroup,
      approveRequest,
      createGroup,
      sendMessage,

      showGlobalPublishSheet,
      globalPublishCircleId,
      openPublishFlow,
      closePublishFlow,

      drafts,
      saveDraft,
      deleteDraft
    }}>
      {children}
    </AppContext.Provider>
  );
}
