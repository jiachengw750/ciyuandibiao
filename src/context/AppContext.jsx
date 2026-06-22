import { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // 1. 用户与登录状态 (头像使用高质量 Unsplash 占位符，不使用 Emoji)
  const [user, setUser] = useState({
    id: '1057860',
    name: '木子李_Muzi',
    avatar: '/avatar_muzi.png',
    cover: '/cover_muzi.png',
    bio: '魔都排少、原神双修，谷子收集狂热粉',
    gender: '保密',
    birthday: '2004-10-12',
    mbti: 'INFP',
    phone: '138****8888',
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
      images: ['/cover_sakura.png'],
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
    
    // 自动清除对应会话的未读数 (MSG-004)
    if (page === 'chat-window' && params.chatId) {
      setMessages(prev => prev.map(chat => 
        chat.id === params.chatId ? { ...chat, unread: 0 } : chat
      ));
    }
  };

  const popRoute = () => {
    if (routeStack.length > 1) {
      setRouteStack(prev => prev.slice(0, -1));
    }
  };

  const resetToTab = (tabName, params = {}) => {
    setRouteStack([{ page: tabName, params }]);
    setSourceParam(tabName);
  };

  const clearRouteStack = () => {
    setRouteStack([{ page: 'circles', params: {} }]);
    setSourceParam('circles');
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
      id: '1057860',
      name: '木子李_Muzi',
      avatar: '/avatar_muzi.png',
      cover: '/cover_muzi.png',
      bio: '魔都排少、原神双修，谷子收集狂热粉',
      gender: '保密',
      birthday: '2004-10-12',
      mbti: 'INFP',
      phone: '138****8888',
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

  const [socialProfiles, setSocialProfiles] = useState([
    {
      id: 'u-001',
      name: '猫又教研组长',
      avatar: '/avatar_neko.png',
      bio: '排少同好营主理人，周末常驻静安大悦城。',
      tags: ['排少', '吃谷交换'],
      isFollower: true,
      isFollowing: true
    },
    {
      id: 'u-002',
      name: '秋叶原常驻喵',
      avatar: '/avatar_neko.png',
      bio: '谷子市集巡游者，喜欢帮同好找摊位。',
      tags: ['同人市集', '扩列'],
      isFollower: true,
      isFollowing: false
    },
    {
      id: 'u-003',
      name: '提瓦特头号吟游诗人',
      avatar: '/avatar_poet.png',
      bio: '原神 FES 攻略整理中，欢迎互关约展。',
      tags: ['原神', '攻略'],
      isFollower: false,
      isFollowing: true
    },
    {
      id: 'u-004',
      name: '夏沫之歌Cos',
      avatar: '/avatar_cos.png',
      bio: '周末互拍返图，手机和微单都可。',
      tags: ['Cosplay', '返图'],
      isFollower: false,
      isFollowing: true
    }
  ]);

  const toggleFollowUser = (profileId) => {
    checkLogin(() => {
      setSocialProfiles(prev => prev.map(profile => (
        profile.id === profileId
          ? { ...profile, isFollowing: !profile.isFollowing }
          : profile
      )));
    });
  };

  const [accountBindings, setAccountBindings] = useState({
    phone: '138****8888',
    wechat: true,
    qq: false,
    bilibili: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    dmScope: 'mutual_or_same_circle',
    publicPosts: true,
    hideLocation: false,
    hideIp: false,
    allowNearby: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    groupApproved: true,
    likesAndCollects: true,
    commentsAndMentions: true,
    newFollowers: true
  });

  const [accountCancellation, setAccountCancellation] = useState(null);

  const updatePrivacySetting = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNotificationSetting = (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  const rebindPhone = (newPhone) => {
    if (!/^1\d{10}$/.test(newPhone)) {
      return { ok: false, reason: '请输入 11 位手机号' };
    }
    const masked = `${newPhone.slice(0, 3)}****${newPhone.slice(7)}`;
    setAccountBindings(prev => ({ ...prev, phone: masked }));
    setUser(prev => prev ? { ...prev, phone: masked } : prev);
    setUser(null);
    resetToTab('circles');
    return { ok: true };
  };

  const toggleThirdPartyBinding = (provider) => {
    setAccountBindings(prev => {
      const nextValue = !prev[provider];
      const enabledSources = [
        prev.phone,
        provider === 'wechat' ? nextValue : prev.wechat,
        provider === 'qq' ? nextValue : prev.qq,
        provider === 'bilibili' ? nextValue : prev.bilibili
      ].filter(Boolean).length;
      if (!nextValue && enabledSources < 1) return prev;
      return { ...prev, [provider]: nextValue };
    });
  };

  // 关联的想去与收藏活动状态
  const [activityRelations, setActivityRelations] = useState({});

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
      cover: '/cover_sky.png',
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
      cover: '/cover_sakura.png',
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
      cover: '/cover_muzi.png',
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
      cover: '/cover_sakura.png',
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
      cover: '/cover_sky.png',
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
        name: '木子李_Muzi',
        avatar: '/avatar_muzi.png'
      },
        members: [
          { name: '木子李_Muzi', avatar: '/avatar_muzi.png', role: 'owner' },
          { name: '小黑猫_研磨', avatar: '/avatar_neko.png', role: 'member' },
          { name: '日向家小暖', avatar: '/avatar_muzi.png', role: 'member' }
        ],
        pendingRequests: [
          { id: 'req-101', name: '影山飞雄吹', avatar: '/avatar_poet.png', message: '求加入，带影山痛包 and 拍立得交换！' }
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
          avatar: '/avatar_cos.png'
        },
        members: [
          { name: '夏沫之歌Cos', avatar: '/avatar_cos.png', role: 'owner' },
          { name: '木子李_Muzi', avatar: '/avatar_muzi.png', role: 'member' },
          { name: '猫又教研组长', avatar: '/avatar_neko.png', role: 'member' },
          { name: '影山飞雄家的牛奶盒', avatar: '/avatar_poet.png', role: 'member' }
        ],
        pendingRequests: []
      }
    ]);

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
      { id: 'cir-001', name: '排球少年同好营', avatar: '排球', avatarImg: '/avatar_neko.png', avatarBg: '#E9C6C6', coverImg: '/cover_sakura.png', memberCount: 1540, postCount: 284, intro: '乌野、音驹、青城、枭谷！全国大赛，在这里集结！', tags: ['运动番', '排球少年', '吃谷交换'] },
      { id: 'cir-002', name: '原神提瓦特同盟', avatar: '原神', avatarImg: '/avatar_cos.png', avatarBg: '#D2DCD0', coverImg: '/cover_sky.png', memberCount: 3980, postCount: 541, intro: '提瓦特大陆旅行者根据地。分享日常、游戏攻略与角色Cos。', tags: ['米哈游', '原神', 'Cosplay'] },
      { id: 'cir-003', name: '崩坏星穹铁道分部', avatar: '铁道', avatarImg: '/avatar_poet.png', avatarBg: '#C7D7E8', coverImg: '/cover_sky.png', memberCount: 2200, postCount: 310, intro: '愿此行，终抵群星。星穹列车开拓者沙龙。', tags: ['米哈游', '星穹铁道', '周边同人'] },
      { id: 'cir-004', name: 'CP同人创作交流会', avatar: '同人', avatarImg: '/avatar_muzi.png', avatarBg: '#E6D7E8', coverImg: '/cover_muzi.png', memberCount: 1890, postCount: 198, intro: 'Comicup 线下大本营，交流同人本、无偿图、自制谷子情报。', tags: ['同人志', '无偿交换', '画师企划'] },
      { id: 'cir-005', name: '蓝色监狱·Egoist社', avatar: '蓝监', avatarImg: '/avatar_neko.png', avatarBg: '#D6E4F0', coverImg: '/cover_sakura.png', memberCount: 1340, postCount: 156, intro: '寻找最强前锋，蓝色监狱同好集结地。分享漫画进度、日常扩列。', tags: ['运动番', '蓝色监狱', '二次元'] },
      { id: 'cir-006', name: '绝区零绳网新艾利都', avatar: '绝区', avatarImg: '/avatar_cos.png', avatarBg: '#F3E5F5', coverImg: '/cover_sky.png', memberCount: 2100, postCount: 245, intro: '绳匠日常联络网。分享最新走格子攻略、音像店日常与朱鸢、艾莲Cos！', tags: ['米哈游', '绝区零', '游戏同好'] },
      { id: 'cir-007', name: '明日方舟罗德岛沙龙', avatar: '方舟', avatarImg: '/avatar_poet.png', avatarBg: '#E0F2F1', coverImg: '/cover_sky.png', memberCount: 3120, postCount: 410, intro: '罗德岛博士线下事务室。精美周边吃谷展示、源石创作交流。', tags: ['游戏同好', '明日方舟', '周边同人'] },
      { id: 'cir-008', name: '排球少年上海应援会', avatar: '排沪', avatarImg: '/avatar_neko.png', avatarBg: '#FFF3E0', coverImg: '/cover_sakura.png', memberCount: 950, postCount: 78, intro: '小排球上海地区同好交流，线下观影会、拼团吃谷以及痛包交流！', tags: ['运动番', '排球少年', '吃谷交换'] },
      { id: 'cir-009', name: '三丽鸥吃谷互助会', avatar: '萌物', avatarImg: '/avatar_muzi.png', avatarBg: '#FCE4EC', coverImg: '/cover_muzi.png', memberCount: 1780, postCount: 165, intro: '库洛米、美乐蒂、大耳狗！正版三丽鸥盲盒、毛绒周边吃谷拼团互助。', tags: ['吃谷交换', '周边同人', '三丽鸥'] },
      { id: 'cir-010', name: '国漫OC与企划工坊', avatar: '企划', avatarImg: '/avatar_muzi.png', avatarBg: '#E8EAF6', coverImg: '/cover_muzi.png', memberCount: 880, postCount: 64, intro: '原创角色（OC）人设展示，画师稿件交流，自制周边同人谷子企划！', tags: ['画师企划', '周边同人', '吃谷交换'] }
    ]);

    // 圈子加入状态
    const [circleMemberships, setCircleMemberships] = useState({
      'cir-001': true,
      'cir-002': false,
      'cir-003': true,
      'cir-004': false,
      'cir-005': true,
      'cir-006': false,
      'cir-007': false,
      'cir-008': false,
      'cir-009': false,
      'cir-010': false
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



    // 7. 动态列表 (去 Emoji)
    const [posts, setPosts] = useState([
      {
        id: 'post-user-001',
        circleId: 'cir-001',
        author: {
          name: '木子李_Muzi',
          avatar: '/avatar_muzi.png'
        },
        content: '晒一下新入手的音驹痛包！挂满了研磨和黑尾的徽章，准备去大悦城快闪面基咯！求同好面基扩列！',
        createdAt: '2026-05-24 12:00',
        images: [
          '/cover_muzi.png'
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
          avatar: '/avatar_muzi.png'
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
          avatar: '/avatar_poet.png'
        },
        content: '今天在大悦城排队三小时终于拿到了研磨限定立牌！顺便求助一下，有没有同好主吃日向和影山想换研磨/黑尾的？我手头多了一个研磨立牌，可面交或挂闲鱼。',
        createdAt: '2026-05-22 14:32',
        images: [
          '/cover_sakura.png',
          '/cover_sky.png'
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
          avatar: '/avatar_poet.png'
        },
        content: '原神FES入场券终于抢到了！有第一天（8月12号）一起结伴去博览馆排队刷任务的小伙伴吗？我是温迪单推人，现场打算COS温迪，招募同伴！',
        createdAt: '2026-05-22 11:20',
        images: [
          '/cover_sky.png'
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
        { sender: '猫又教研组长', avatar: '/avatar_neko.png', content: '欢迎加入本群！我们明天14点大悦城9楼立牌下集合。', time: '16:00', isSystem: false },
        { sender: '小黑猫_研磨', avatar: '/avatar_neko.png', content: '收到，我带了研磨的拍立得和痛包。', time: '16:15', isSystem: false },
        { sender: '猫又教研组长', avatar: '/avatar_neko.png', content: '大家明天的面基痛包记得带齐哦！', time: '18:12', isSystem: false }
      ]
    },
    {
      id: 'chat-002',
      title: '研磨厨_阿七',
      isGroup: false,
      relatedGroupId: null,
      avatar: '/avatar_neko.png',
      lastMessage: '好呀，那周末漫展见，记得带返图！',
      time: '昨天',
      unread: 0,
      chatHistory: [
        { sender: '研磨厨_阿七', avatar: '/avatar_neko.png', content: '在吗？看到你也关注了排球少年快闪～', time: '昨天 20:01', isSystem: false },
        { sender: '木子', avatar: '/avatar_muzi.png', content: '在的！我准备周末去现场，你也去吗？', time: '昨天 20:05', isSystem: false },
        { sender: '研磨厨_阿七', avatar: '/avatar_neko.png', content: '好呀，那周末漫展见，记得带返图！', time: '昨天 20:08', isSystem: false }
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

  const [notificationUnreads, setNotificationUnreads] = useState({
    system: 2,
    likes: 1,
    followers: 0,
    comments: 3
  });

  const resetNotificationUnread = (type) => {
    setNotificationUnreads(prev => ({
      ...prev,
      [type]: 0
    }));
  };

  const unreadCount = useMemo(() => {
    const chatUnread = messages.reduce((sum, chat) => sum + (chat.unread || 0), 0);
    const notifUnread = Object.values(notificationUnreads).reduce((sum, count) => sum + count, 0);
    return chatUnread + notifUnread;
  }, [messages, notificationUnreads]);

  const [strangerMessages, setStrangerMessages] = useState([
    {
      id: 'str-001',
      sender: '票务急售_小陈',
      avatar: '/avatar_neko.png',
      preview: 'CP30 内场票低价转，先加微信确认。',
      time: '16:40',
      countBeforeReply: 3,
      riskLevel: 'warning',
      blocked: false,
      reported: false,
      chatHistory: [
        { sender: '票务急售_小陈', content: 'CP30 内场票低价转，先加微信确认。', time: '16:34', isSystem: false },
        { sender: '系统', content: '安全提示：陌生人消息包含交易、联系方式等敏感内容，请谨慎核验。', time: '16:35', isSystem: true },
        { sender: '票务急售_小陈', content: '只剩一张，先付定金我给你留。', time: '16:40', isSystem: false }
      ]
    },
    {
      id: 'str-002',
      sender: '同城返图搭子',
      avatar: '/avatar_cos.png',
      preview: '看到你也想去美罗城市集，可以互拍吗？',
      time: '昨天',
      countBeforeReply: 1,
      riskLevel: 'normal',
      blocked: false,
      reported: false,
      chatHistory: [
        { sender: '同城返图搭子', content: '看到你也想去美罗城市集，可以互拍吗？', time: '昨天', isSystem: false }
      ]
    }
  ]);

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [reportedRecords, setReportedRecords] = useState([]);

  const visibleStrangerMessages = strangerMessages.filter(item => !item.blocked);

  const shouldBlockSevereFraud = (text) => /保证金|刷流水|返利|解冻|银行卡|验证码|先转账|代付/.test(text);
  const shouldWarnRisk = (text) => /微信|vx|电话|手机号|链接|http|定金|转账|私下/.test(text);

  const sendStrangerReply = (threadId, text) => {
    if (!text.trim()) return { ok: false, reason: '消息不能为空' };
    
    const thread = strangerMessages.find(t => t.id === threadId);
    if (!thread) return { ok: false, reason: '会话不存在' };
    
    if (thread.countBeforeReply <= 0) {
      return { ok: false, reason: '等待对方回复后即可继续发送' };
    }

    if (shouldBlockSevereFraud(text)) {
      return { ok: false, severe: true, reason: '系统检测到违规风险，内容已被自动拦截。' };
    }
    
    if (/\.(jpg|png|mp4|webp)|图片|视频|语音|http|微信|电话|手机号|vx/i.test(text)) {
      return { ok: false, reason: '对方回复前暂不支持发送多媒体内容' };
    }

    setStrangerMessages(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      const newCount = Math.max(0, t.countBeforeReply - 1);
      const warning = shouldWarnRisk(text)
        ? [{ sender: '系统', content: '安全提示：消息包含联系方式或交易暗示，请勿脱离平台交易。', time: '刚刚', isSystem: true }]
        : [];
      return {
        ...t,
        countBeforeReply: newCount,
        riskLevel: warning.length ? 'warning' : t.riskLevel,
        preview: text,
        time: '刚刚',
        chatHistory: [
          ...t.chatHistory,
          { sender: user.name, content: text, time: '刚刚', isSystem: false },
          ...warning
        ]
      };
    }));

    // 模拟对方回复，回复后将该陌生人消息自动升级并移入直聊会话 (MSG-044)
    setTimeout(() => {
      setStrangerMessages(prev => {
        const currentThread = prev.find(t => t.id === threadId);
        if (!currentThread) return prev;

        const newChatId = `chat-pv-str-${Date.now()}`;
        const newChat = {
          id: newChatId,
          title: currentThread.sender,
          isGroup: false,
          relatedGroupId: null,
          avatar: currentThread.avatar,
          lastMessage: `${currentThread.sender}：收到！很高兴能认识你。`,
          time: '刚刚',
          unread: 1,
          chatHistory: [
            ...currentThread.chatHistory,
            { sender: currentThread.sender, avatar: currentThread.avatar, content: '收到！很高兴能认识你。', time: '刚刚', isSystem: false }
          ]
        };
        setMessages(old => [newChat, ...old]);
        return prev.filter(t => t.id !== threadId);
      });
    }, 2000);

    return { ok: true };
  };

  const deleteConversation = (chatId) => {
    setMessages(prev => prev.filter(chat => chat.id !== chatId));
  };

  const deleteStrangerThread = (threadId) => {
    setStrangerMessages(prev => prev.filter(thread => thread.id !== threadId));
  };

  const blockStranger = (threadId) => {
    setStrangerMessages(prev => prev.map(thread => {
      if (thread.id !== threadId) return thread;
      setBlockedUsers(old => old.includes(thread.sender) ? old : [...old, thread.sender]);
      return { ...thread, blocked: true };
    }));
  };

  const reportStranger = (threadId, reason) => {
    setStrangerMessages(prev => prev.map(thread => {
      if (thread.id !== threadId) return thread;
      setReportedRecords(old => [
        {
          id: `report-${Date.now()}`,
          target: thread.sender,
          reason,
          evidenceCount: thread.chatHistory.length,
          createdAt: '刚刚'
        },
        ...old
      ]);
      return { ...thread, reported: true };
    }));
  };

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
    let targetGroupTitle = '';
    
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const reqIndex = g.pendingRequests.findIndex(r => r.id === requestId);
        if (reqIndex === -1) return g;
        
        const req = g.pendingRequests[reqIndex];
        approvedUser = { name: req.name, avatar: req.avatar };
        targetGroupTitle = g.title;
        
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
      setMessages(prev => prev.map(chat => chat.id === 'chat-sys'
        ? {
          ...chat,
          lastMessage: `系统：${approvedUser.name} 的入团申请已通过。`,
          time: '刚刚',
          chatHistory: [
            ...chat.chatHistory,
            { sender: '系统', avatar: '', content: `【${targetGroupTitle}】申请已通过，${approvedUser.name} 已加入开团群。`, time: '刚刚', isSystem: true }
          ]
        }
        : chat
      ));
    } else if (!isApproved && approvedUser) {
      setMessages(prev => prev.map(chat => chat.id === 'chat-sys'
        ? {
          ...chat,
          lastMessage: `系统：${approvedUser.name} 的入团申请已拒绝。`,
          time: '刚刚',
          chatHistory: [
            ...chat.chatHistory,
            { sender: '系统', avatar: '', content: `【${targetGroupTitle}】申请已拒绝，P0 原型不要求填写拒绝原因。`, time: '刚刚', isSystem: true }
          ]
        }
        : chat
      ));
    }
  };

  // 创建开团 (MAP-030 / GRP-001)
  const createGroup = (activityId, title, price, totalLimit, addressSummary, addressDetail, tag, options = {}) => {
    let createdGroupId = null;
    checkLogin(() => {
      const timestamp = Date.now();
      const newGroup = {
        id: `grp-${timestamp}`,
        title,
        type: tag === '约人面基' ? 'visit' : tag === '周边合购' ? 'exchange' : 'dinner',
        relatedActivityId: activityId,
        city: '上海',
        meetingAddress: addressSummary,
        meetingAddressDetail: addressDetail,
        lat: 31.2 + (Math.random() - 0.5) * 0.08, // 随机在该市活动中心附近
        lng: 121.4 + (Math.random() - 0.5) * 0.08,
        startTime: options.meetingTime || new Date(Date.now() + 86400000).toISOString(),
        maxMembers: parseInt(totalLimit, 10) || 5,
        currentMembers: 1,
        price: price === '0' || !price ? 'AA制' : `AA制人均 ¥${price}`,
        status: 'recruiting',
        requirementSummary: options.requirementSummary || '有兴趣同人创作和吃谷的小伙伴速来！',
        description: options.description || '团主暂未填写详细说明。',
        locationVisibleRule: options.locationVisibleRule || 'after_join',
        conversationId: `chat-${timestamp}`,
        creator: {
          name: user.name,
          avatar: user.avatar
        },
        members: [
          { name: user.name, avatar: user.avatar, role: 'owner' }
        ],
        pendingRequests: []
      };

      createdGroupId = newGroup.id;
      setGroups(prev => [newGroup, ...prev]);

      // 同时自动创建对应的拼团群聊 (PRD GRP-004联动)
      const newChat = {
        id: newGroup.conversationId,
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
    return createdGroupId;
  };

  const withdrawGroupApplication = (groupId) => {
    setGroups(prev => prev.map(group => {
      if (group.id !== groupId || !user) return group;
      const pending = group.pendingRequests.find(req => req.name === user.name);
      if (!pending) return group;
      return {
        ...group,
        pendingRequests: group.pendingRequests.filter(req => req.name !== user.name),
        applicationHistory: [
          ...(group.applicationHistory || []),
          { ...pending, status: 'withdrawn', updatedAt: '刚刚' }
        ]
      };
    }));
  };

  const exitGroup = (groupId) => {
    if (!user) return;
    let exitedName = user.name;
    setGroups(prev => prev.map(group => {
      if (group.id !== groupId || group.creator.name === user.name) return group;
      const isMember = group.members.some(member => member.name === user.name);
      if (!isMember) return group;
      const nextMembers = group.members.filter(member => member.name !== user.name);
      return {
        ...group,
        members: nextMembers,
        currentMembers: nextMembers.length,
        status: group.status === 'full' ? 'recruiting' : group.status,
        memberHistory: [
          ...(group.memberHistory || []),
          { name: user.name, status: 'exited', updatedAt: '刚刚' }
        ]
      };
    }));
    setMessages(prev => prev.map(chat => chat.relatedGroupId === groupId
      ? {
        ...chat,
        chatHistory: [
          ...chat.chatHistory,
          { sender: '系统', avatar: '', content: `${exitedName} 已退出开团，完整集合地点权限已关闭。`, time: '刚刚', isSystem: true }
        ]
      }
      : chat
    ));
  };

  const cancelGroup = (groupId) => {
    let groupTitle = '';
    setGroups(prev => prev.map(group => {
      if (group.id !== groupId || !user || group.creator.name !== user.name) return group;
      groupTitle = group.title;
      return {
        ...group,
        status: 'cancelled',
        pendingRequests: [],
        applicationHistory: [
          ...(group.applicationHistory || []),
          ...group.pendingRequests.map(req => ({ ...req, status: 'cancelled', updatedAt: '刚刚' }))
        ]
      };
    }));
    setMessages(prev => prev.map(chat => {
      if (chat.relatedGroupId === groupId) {
        return {
          ...chat,
          lastMessage: `系统：${groupTitle || '开团'} 已取消。`,
          time: '刚刚',
          chatHistory: [
            ...chat.chatHistory,
            { sender: '系统', avatar: '', content: `团主已取消【${groupTitle || '本开团'}】。开团群保留，原成员仍可继续沟通后续安排。`, time: '刚刚', isSystem: true }
          ]
        };
      }
      if (chat.id === 'chat-sys') {
        return {
          ...chat,
          lastMessage: `系统：${groupTitle || '开团'} 已取消。`,
          time: '刚刚',
          chatHistory: [
            ...chat.chatHistory,
            { sender: '系统', avatar: '', content: `【${groupTitle || '开团'}】已取消，所有待审核申请已转为 cancelled。`, time: '刚刚', isSystem: true }
          ]
        };
      }
      return chat;
    }));
  };

  const removeGroupMember = (groupId, memberName) => {
    setGroups(prev => prev.map(group => {
      if (group.id !== groupId || !user || group.creator.name !== user.name || memberName === group.creator.name) return group;
      const target = group.members.find(member => member.name === memberName);
      if (!target) return group;
      const nextMembers = group.members.filter(member => member.name !== memberName);
      return {
        ...group,
        members: nextMembers,
        currentMembers: nextMembers.length,
        status: group.status === 'full' ? 'recruiting' : group.status,
        memberHistory: [
          ...(group.memberHistory || []),
          { ...target, status: 'exited', removedByOwner: true, updatedAt: '刚刚' }
        ]
      };
    }));
    setMessages(prev => prev.map(chat => chat.relatedGroupId === groupId
      ? {
        ...chat,
        chatHistory: [
          ...chat.chatHistory,
          { sender: '系统', avatar: '', content: `${memberName} 已被团主移出开团群，地点和进群权限已关闭。`, time: '刚刚', isSystem: true }
        ]
      }
      : chat
    ));
  };

  const requestAccountCancellation = () => {
    const activeOwnedGroup = groups.find(group => user && group.creator.name === user.name && ['recruiting', 'full'].includes(group.status));
    if (activeOwnedGroup) {
      return { ok: false, reason: `仍有未完成拼团【${activeOwnedGroup.title}】，需取消或完成后再注销。` };
    }
    setAccountCancellation({
      requestedAt: '刚刚',
      freezeDays: 30,
      status: 'cooling'
    });
    return { ok: true };
  };

  // 发送消息
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

    // 自动模拟回复机制 (针对 1v1 私聊，方便验证敏感词黄色横幅与未读数变化)
    const chat = messages.find(c => c.id === chatId);
    if (chat && !chat.isGroup) {
      setTimeout(() => {
        setMessages(prev => prev.map(c => {
          if (c.id === chatId) {
            let replyText = '收到！面基记得带痛包和谷子。';
            if (/转账|定金|红包|钱|微信|vx/i.test(text)) {
              replyText = '好啊，要不你先把定金转给我？我们加个微信私聊。';
            }
            return {
              ...c,
              lastMessage: `${c.title}：${replyText}`,
              time: '刚刚',
              unread: c.unread + 1,
              chatHistory: [
                ...c.chatHistory,
                { sender: c.title, avatar: c.avatar, content: replyText, time: '刚刚', isSystem: false }
              ]
            };
          }
          return c;
        }));
      }, 1500);
    }
  };

  // 主动发起私聊 (直聊与陌生人折叠智能分流，MSG-012, MSG-040, MSG-041)
  const startPrivateChat = (profileId) => {
    checkLogin(() => {
      const profile = socialProfiles.find(p => p.id === profileId);
      if (!profile) return;

      const isMutual = profile.isFollowing && profile.isFollower;

      if (isMutual) {
        // 互关好友直聊
        const existing = messages.find(m => !m.isGroup && m.title === profile.name);
        if (existing) {
          pushRoute('chat-window', { chatId: existing.id }, 'profile');
        } else {
          const newChatId = `chat-pv-${Date.now()}`;
          const newChat = {
            id: newChatId,
            title: profile.name,
            isGroup: false,
            relatedGroupId: null,
            avatar: profile.avatar,
            lastMessage: '暂无消息，开始打个招呼吧~',
            time: '刚刚',
            unread: 0,
            chatHistory: []
          };
          setMessages(prev => [newChat, ...prev]);
          pushRoute('chat-window', { chatId: newChatId }, 'profile');
        }
      } else {
        // 非好友折叠入陌生人消息
        const existing = strangerMessages.find(s => s.sender === profile.name);
        if (existing) {
          pushRoute('stranger-chat', { threadId: existing.id }, 'profile');
        } else {
          const newThreadId = `str-pv-${Date.now()}`;
          const newThread = {
            id: newThreadId,
            sender: profile.name,
            avatar: profile.avatar,
            preview: '暂无消息，开始打个招呼吧~',
            time: '刚刚',
            countBeforeReply: 3,
            riskLevel: 'normal',
            blocked: false,
            reported: false,
            chatHistory: []
          };
          setStrangerMessages(prev => [newThread, ...prev]);
          pushRoute('stranger-chat', { threadId: newThreadId }, 'profile');
        }
      }
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      showLoginModal,
      setShowLoginModal,
      handleLoginSuccess,
      handleLogout,
      socialProfiles,
      toggleFollowUser,
      accountBindings,
      privacySettings,
      notificationSettings,
      accountCancellation,
      updatePrivacySetting,
      updateNotificationSetting,
      rebindPhone,
      toggleThirdPartyBinding,
      requestAccountCancellation,
      
      routeStack,
      pushRoute,
      popRoute,
      resetToTab,
      clearRouteStack,
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
      
      posts,
      toggleLikePost,
      addCommentToPost,
      createPost,
      
      notificationUnreads,
      resetNotificationUnread,
      startPrivateChat,
      messages,
      unreadCount,
      visibleStrangerMessages,
      blockedUsers,
      reportedRecords,
      sendStrangerReply,
      deleteConversation,
      deleteStrangerThread,
      blockStranger,
      reportStranger,
      applyJoinGroup,
      approveRequest,
      createGroup,
      withdrawGroupApplication,
      exitGroup,
      cancelGroup,
      removeGroupMember,
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
