import { createContext, useContext, useState, useEffect, useRef } from 'react';

const ReqAnnotationContext = createContext();

function useReqAnnotation() {
  return useContext(ReqAnnotationContext);
}

// 需求详细数据。Key 对应页面上的橙色需求角标，内容直接列出 PRD 编号。
const reqMarkdownData = {
  'CIR-HOME': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">同好营首页 / 发现与关注</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>CIR-001</strong>：关注 Tab 顶部「圈子动态 / 关注的人」可切换。</li>
  <li><strong>CIR-002</strong>：圈子动态展示已加入圈子的动态，2 列瀑布流。</li>
  <li><strong>CIR-003</strong>：关注的人展示已关注用户的公开动态。</li>
  <li><strong>CIR-004</strong>：未登录、无加入圈子、无关注时展示引导或空状态。</li>
  <li><strong>CIR-005</strong>：动态卡片按瀑布流卡片规范展示。</li>
  <li><strong>CIR-010</strong>：发现 Tab 顶部横向可滚动分类标签。</li>
  <li><strong>CIR-011</strong>：选中标签高亮并带下划线指示。</li>
  <li><strong>CIR-012</strong>：发现 Tab 下方展示全部公开动态 2 列瀑布流。</li>
  <li><strong>CIR-013</strong>：按作者选择的话题标签映射到主分类展示。</li>
</ul>
`,
  'CIR-DIR': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">圈子目录与加入</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>CIR-014</strong>：顶部分类筛选 Pill：全部圈子 / 动漫相关 / 游戏同好 / 周边吃谷。</li>
  <li><strong>CIR-015</strong>：「我加入的圈子」横向滚动，Story 风格头像卡片，按最近活跃排序。</li>
  <li><strong>CIR-016</strong>：「发现更多同好圈子」2 列网格，展示名称、成员数、简介、快速加入。</li>
  <li><strong>CIR-017</strong>：点击 + 一键加入，memberCount +1，并加入「我加入的圈子」。</li>
</ul>
`,
  'CIR-SEARCH': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">同好营全局搜索</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>CIR-057</strong>：点击搜索图标打开全屏 overlay。</li>
  <li><strong>CIR-058</strong>：空搜索态展示搜索历史 chips（最多 8 条）和「猜你想搜」。</li>
  <li><strong>CIR-059</strong>：搜索结果固定「相关同好营」在上、「相关同好动态」在下。</li>
  <li><strong>CIR-060</strong>：无结果展示「未找到相关的同好动态」。</li>
</ul>
`,
  'CIR-DETAIL': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">圈子详情与圈内动态</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>CIR-019</strong>：封面图 110px + 渐变遮罩 + 左上角返回按钮。</li>
  <li><strong>CIR-020</strong>：信息卡片含头像、名称、成员数/动态数、简介、标签 Pill。</li>
  <li><strong>CIR-021</strong>：圈内动态流展示作者、时间、正文、图片缩略图、点赞/评论数。</li>
  <li><strong>CIR-022</strong>：空动态展示「本同好营还没有人发布动态...」。</li>
  <li><strong>CIR-027</strong>：公开圈支持一键加入。</li>
  <li><strong>CIR-028</strong>：加入后 memberCount +1，并出现在「我加入的圈子」横滑。</li>
  <li><strong>CIR-029</strong>：加入后可发布动态、评论、收藏。</li>
</ul>
`,
  'POST-DETAIL': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">动态详情与互动</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>CIR-006</strong>：在动态详情页作者旁点击「关注」按钮关注作者。</li>
  <li><strong>CIR-007</strong>：已关注用户再次点击取消关注。</li>
  <li><strong>CIR-008</strong>：未登录点击关注引导登录。</li>
  <li><strong>CIR-042</strong>：顶部固定栏含返回、作者头像昵称、关注按钮、分享图标。</li>
  <li><strong>CIR-043</strong>：主图最大 220px，多图显示 1/N 和讨论人数浮层。</li>
  <li><strong>CIR-044</strong>：标题 + 圈子热度榜徽章。</li>
  <li><strong>CIR-045</strong>：正文完整展示 + 圈子标签 Pill + 话题标签。</li>
  <li><strong>CIR-046</strong>：展示日期、热度、收藏 toggle。</li>
  <li><strong>CIR-047</strong>：评论列表含昵称、时间、内容、点赞数。</li>
  <li><strong>CIR-048</strong>：子回复展示「展开更多 N 条回复」。</li>
  <li><strong>CIR-049</strong>：空评论展示「暂无同好评论...」。</li>
</ul>
`,
  'PUB-SHEET': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">+ 号发布面板</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>CIR-034</strong>：从 FAB 进入，先选择发布类型：图文 / 视频。</li>
  <li><strong>PUB-001</strong>：底部导航中间 + 号点击弹出发布面板。</li>
  <li><strong>PUB-002</strong>：底部浮层 + 半透明遮罩，点击遮罩或 X 关闭。</li>
  <li><strong>PUB-003</strong>：展示发图文 / 发视频两个类型卡片。</li>
  <li><strong>PUB-004</strong>：选择类型后进入 CreatePostPage 并传入 type。</li>
  <li><strong>PUB-005</strong>：从圈子详情触发时传入 circleId 预填圈子。</li>
  <li><strong>PUB-016</strong>：未登录用户点击 + 号引导登录。</li>
</ul>
`,
  'PUB-EDITOR': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">动态编辑器</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>CIR-035</strong>：图文模式：标题、正文、图片选择器。</li>
  <li><strong>CIR-036</strong>：视频模式：从用户相册选择视频。</li>
  <li><strong>CIR-037</strong>：配置区：目标圈子、关联活动、话题标签抽屉。</li>
  <li><strong>PUB-006</strong>：标题输入框 max 30 字，可选。</li>
  <li><strong>PUB-007</strong>：正文 textarea，5 行，必填。</li>
  <li><strong>PUB-008</strong>：图片选择器横向滚动，支持添加和删除，图片不设上限。</li>
  <li><strong>PUB-009</strong>：图片从用户相册选择。</li>
  <li><strong>PUB-010</strong>：纯文字动态允许发布，自动生成渐变封面。</li>
  <li><strong>PUB-011</strong>：视频从用户相册选择。</li>
  <li><strong>PUB-012</strong>：视频选择后展示封面预览。</li>
  <li><strong>PUB-013</strong>：目标圈子选择器展示已加入圈子；无圈子时发布到发现广场。</li>
  <li><strong>PUB-014</strong>：关联活动选择器可选。</li>
  <li><strong>PUB-015</strong>：话题标签按主分类分组展示，最多选择 3 个。</li>
  <li><strong>PUB-017</strong>：返回时若有未保存内容，提示是否保存草稿。</li>
</ul>
`,
  'PUB-ACTION': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">发布与草稿</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>CIR-038</strong>：底部栏展示「保存草稿」+「发布动态」。</li>
  <li><strong>CIR-039</strong>：草稿本地保存、删除、恢复编辑；上限 5 条。</li>
  <li><strong>CIR-040</strong>：发布成功后返回上一页。</li>
  <li><strong>PUB-018</strong>：保存草稿到 LocalStorage，Key 为 aqiu_drafts，支持 upsert，上限 5 条。</li>
  <li><strong>PUB-019</strong>：发布动态，正文必填，标题、图片、视频可选。</li>
  <li><strong>PUB-020</strong>：正文为空时不允许发布或保存草稿。</li>
  <li><strong>PUB-021</strong>：发布成功后返回上一页。</li>
  <li><strong>PUB-022</strong>：草稿可在个人主页草稿箱查看、恢复编辑、删除，恢复后从草稿箱移除。</li>
</ul>
`,
  'ACT-LIST': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">活动首页 / 列表筛选</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>ACT-001</strong>：底部导航「活动」进入 ActivityListPage。</li>
  <li><strong>ACT-002</strong>：顶部展示搜索图标，点击打开全屏搜索 overlay。</li>
  <li><strong>ACT-003</strong>：状态筛选 pill：全部活动 / 进行中 / 即将开始。</li>
  <li><strong>ACT-004</strong>：当前选中 pill 高亮。</li>
  <li><strong>ACT-005</strong>：列表为单一扁平列表，无分节模块。</li>
  <li><strong>活动卡片</strong>：封面 110px、状态角标、标题、日期地点、想去/收藏统计、查看详情入口。</li>
  <li><strong>排序规则</strong>：即将开始优先，进行中次之，已结束最后。</li>
</ul>
`,
  'ACT-SEARCH': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">活动搜索 Overlay</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>PRD 5.2</strong>：搜索为 ActivityListPage 内全屏 overlay，非独立页面。</li>
  <li><strong>空搜索态</strong>：搜索输入框、最近搜索 chips（最多 8 条，可逐条删除）、猜你想搜 2 列推荐。</li>
  <li><strong>有查询态</strong>：忽略当前筛选，按活动标题 / 地点 / 标签模糊匹配。</li>
  <li><strong>无结果</strong>：展示「暂时没有找到相关活动」。</li>
</ul>
`,
  'ACT-DETAIL': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">活动详情与底部决策</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>PRD 5.3</strong>：活动详情自上而下展示封面、标题、标签、时间地点、简介、决策助手、关联开团、底部栏。</li>
  <li><strong>P0 决策助手</strong>：ongoing + 有团显示「极力推荐前往面基」；ongoing + 无团显示「建议自建新团」；upcoming 显示「提前入群预约」。</li>
  <li><strong>PRD 5.4</strong>：想去 / 收藏 toggle 即时更新；发起开团进入创建开团页并预填活动。</li>
  <li><strong>异常状态</strong>：活动不存在/下架、加载失败需展示异常或重试入口。</li>
</ul>
`,
  'ACT-GROUPS': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">活动关联开团</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>ACT-039</strong>：活动详情展示该活动下关联开团列表，按创建时间倒序。</li>
  <li><strong>ACT-039a</strong>：列表区域支持上下滑动，滑到底部自动加载更多。</li>
  <li><strong>ACT-040</strong>：开团卡片点击进入开团详情页。</li>
  <li><strong>ACT-041</strong>：无关联开团时展示空状态和「发起拼团」按钮。</li>
  <li><strong>ACT-042</strong>：点击「发起拼团」进入创建开团页并预填当前活动。</li>
  <li><strong>ACT-043</strong>：活动详情还需关联同好营卡片。</li>
  <li><strong>ACT-044</strong>：关联圈子卡片点击跳转圈子详情页。</li>
  <li><strong>ACT-045</strong>：关联圈子卡片支持一键加入或展示已加入状态。</li>
  <li style="color:#5B7A63;"><strong>承接说明</strong>：ActivityDetailPage 已补关联同好营卡片、圈子跳转和一键加入/已加入状态。</li>
</ul>
`,
  'GRP-CREATE': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">创建开团</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>GRP-001</strong>：只有登录用户可创建开团。</li>
  <li><strong>GRP-002</strong>：创建开团必须从 activity_id 发起。</li>
  <li><strong>GRP-003</strong>：已取消、已结束、已下架活动不可创建开团。</li>
  <li><strong>GRP-004</strong>：进行中活动创建开团需提示确认集合时间。</li>
  <li><strong>GRP-005</strong>：创建成功后 creator 自动成为成员。</li>
  <li><strong>GRP-006</strong>：创建成功后自动创建开团群。</li>
  <li><strong>GRP-007</strong>：创建成功后进入开团详情页。</li>
  <li><strong>创建字段</strong>：activity_id、type、purpose_tags、title、description、requirement_summary、meeting_time、max_members、location_summary、location_detail、location_visible_rule。</li>
  <li style="color:#5B7A63;"><strong>承接说明</strong>：创建页已补 meeting_time、description、requirement_summary、location_visible_rule 等字段控件。</li>
</ul>
`,
  'GRP-DETAIL': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">开团详情与申请权限</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>GRP-008</strong>：未登录点击申请先登录，登录后回到开团详情。</li>
  <li><strong>GRP-009</strong>：group_status=recruiting 时可申请。</li>
  <li><strong>GRP-010</strong>：full / ended / cancelled 时不可申请。</li>
  <li><strong>GRP-011</strong>：提交申请后 application_status=pending。</li>
  <li><strong>GRP-012</strong>：团主收到新申请通知。</li>
  <li><strong>GRP-013</strong>：pending 不可查看完整集合地点，不可进入开团群。</li>
  <li><strong>GRP-014</strong>：同一用户同一开团同时只能有一条有效申请。</li>
  <li><strong>GRP-014A</strong>：申请页提供申请理由输入框 apply_note。</li>
  <li><strong>GRP-014B</strong>：pending 状态展示「申请待处理」，允许撤销申请。</li>
  <li><strong>GRP-014C</strong>：pending 可看团主信息、成员预览、地点摘要和加入要求。</li>
  <li><strong>GRP-014D</strong>：外部分享进入详情后，登录成功回到当前开团详情。</li>
</ul>
`,
  'GRP-APPLY': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">团主审批申请</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>GRP-015</strong>：团主可查看 pending 申请列表。</li>
  <li><strong>GRP-016</strong>：团主可通过申请。</li>
  <li><strong>GRP-017</strong>：团主可拒绝申请。</li>
  <li><strong>GRP-018</strong>：通过后 application_status=approved，并生成 GroupMember。</li>
  <li><strong>GRP-019</strong>：通过后申请人自动加入开团群。</li>
  <li><strong>GRP-020</strong>：通过后申请人收到申请通过通知。</li>
  <li><strong>GRP-021</strong>：拒绝后申请人收到申请拒绝通知。</li>
  <li><strong>GRP-022</strong>：通过导致 current_members=max_members 时 group_status=full。</li>
  <li><strong>GRP-022A</strong>：团主处理时可看 apply_note、申请人轻量资料、共同圈子/兴趣标签。</li>
  <li><strong>GRP-022B</strong>：拒绝申请时 P0 不要求填写拒绝原因。</li>
</ul>
`,
  'GRP-CHAT': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">开团群联动</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>GRP-023</strong>：创建成功后创建 conversation_type=group_up 会话。</li>
  <li><strong>GRP-024</strong>：conversation_id 写入 GroupUp。</li>
  <li><strong>GRP-025</strong>：团主自动成为开团群 owner。</li>
  <li><strong>GRP-026</strong>：群内自动发送系统消息「开团已创建」。</li>
  <li><strong>GRP-027</strong>：approved_member 和 creator 可看到「进入开团群」。</li>
  <li><strong>GRP-028</strong>：pending / rejected / none 不可看到进群入口。</li>
  <li><strong>GRP-029</strong>：点击进群跳转消息模块会话页。</li>
  <li><strong>GRP-030</strong>：开团群不可用时展示「开团群暂不可用」。</li>
  <li><strong>GRP-030A</strong>：群顶部卡片展示活动名称、集合时间、地点摘要。</li>
  <li><strong>GRP-030B</strong>：开团开始前提醒点击可落到开团详情或开团群。</li>
  <li><strong>GRP-031</strong>：approved_member 可在开团未结束/未取消前退出。</li>
  <li><strong>GRP-032</strong>：退出后 member.status=exited。</li>
  <li><strong>GRP-033</strong>：退出后 current_members -1。</li>
  <li><strong>GRP-034</strong>：full 开团有人退出后回到 recruiting。</li>
  <li><strong>GRP-035</strong>：退出后不可见完整集合地点，不可进群。</li>
  <li><strong>GRP-036</strong>：团主不可退出，只能取消开团。</li>
  <li><strong>GRP-037</strong>：团主可取消未结束开团。</li>
  <li><strong>GRP-038</strong>：取消后 group_status=cancelled。</li>
  <li><strong>GRP-039</strong>：所有 pending 申请转为 cancelled。</li>
  <li><strong>GRP-040</strong>：所有成员收到取消通知。</li>
  <li><strong>GRP-041</strong>：取消后开团群保留，成员可继续聊天或手动退出。</li>
  <li><strong>GRP-042</strong>：活动、我的列表展示已取消状态或降权隐藏。</li>
  <li><strong>GRP-043</strong>：撤销 pending 后保留 withdrawn 历史态。</li>
  <li><strong>GRP-044</strong>：退出或取消前需二次确认。</li>
  <li><strong>GRP-045</strong>：团主可移出 approved_member。</li>
  <li><strong>GRP-046</strong>：移出后 member.status=exited，current_members -1。</li>
  <li><strong>GRP-047</strong>：full 开团踢人后回到 recruiting。</li>
  <li><strong>GRP-048</strong>：被移出成员失去地点和进群权限。</li>
  <li><strong>GRP-049</strong>：被移出成员自动从群聊移除并发送系统消息。</li>
  <li style="color:#5B7A63;"><strong>承接说明</strong>：开团详情与群聊页已补撤销申请、退出、取消开团、移出成员和对应系统消息。</li>
</ul>
`,
  'MSG-HOME': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">消息首页</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MSG-001</strong>：底部导航「聊天」进入消息首页。</li>
  <li><strong>MSG-002</strong>：消息首页为单页滚动布局，顶部 4 个通知磁贴 + 下方会话列表。</li>
  <li><strong>MSG-003</strong>：会话列表按最后消息时间倒序。</li>
  <li><strong>MSG-004</strong>：底部导航红点展示总未读数。</li>
  <li><strong>MSG-005</strong>：无会话展示空状态。</li>
  <li><strong>MSG-006</strong>：未登录进入消息首页展示登录引导。</li>
  <li><strong>MSG-012</strong>：会话列表混合开团群会话与 1v1 互关好友私聊。</li>
  <li><strong>MSG-012a</strong>：陌生人消息作为独立入口在列表底端，不计入底部红点。</li>
  <li><strong>MSG-013</strong>：会话按最后消息时间倒序。</li>
  <li><strong>MSG-014</strong>：开团群头像按 2-3 人双头像、&gt;3 人四分格；1v1 单头像。</li>
  <li><strong>MSG-015</strong>：系统通知通过磁贴承接，不混入会话列表。</li>
</ul>
`,
  'MSG-NOTIF': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">通知磁贴与子页面</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MSG-007</strong>：每个磁贴右上角展示未读数字角标。</li>
  <li><strong>MSG-008</strong>：点击磁贴进入对应分类子页面。</li>
  <li><strong>MSG-009</strong>：子页面顶部左上角返回按钮 + 分类标题。</li>
  <li><strong>MSG-010</strong>：子页面展示 mock 通知卡片列表。</li>
  <li><strong>MSG-011</strong>：子页面底部「返回聊天列表」按钮。</li>
</ul>
`,
  'MSG-CHAT': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">开团群聊天</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MSG-024</strong>：开团创建成功后自动生成对应会话。</li>
  <li><strong>MSG-025</strong>：团主自动加入。</li>
  <li><strong>MSG-026</strong>：申请人审批通过后，系统消息推送至群内。</li>
  <li><strong>MSG-026a</strong>：成员退出后自动从群聊移除，并发送系统消息。</li>
  <li><strong>MSG-026b</strong>：成员被团主移出后自动从群聊移除，并发送系统消息。</li>
  <li><strong>MSG-026c</strong>：团主取消开团后，群聊发送系统提示。</li>
  <li><strong>MSG-027</strong>：开团结束后群聊继续保留，成员仍可发消息。</li>
  <li><strong>MSG-028</strong>：用户可手动退出群聊。</li>
  <li><strong>MSG-030</strong>：系统消息居中、我方右对齐、他人左对齐。</li>
  <li><strong>MSG-031</strong>：消息含头像、昵称、内容、时间。</li>
  <li><strong>MSG-032</strong>：底部输入栏为 Pill 输入框 + 圆形发送按钮。</li>
  <li><strong>MSG-033</strong>：消息文本上限 800 字符。</li>
  <li><strong>MSG-034</strong>：发送后输入框清空。</li>
</ul>
`,
  'MSG-RISK': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">1v1 私聊与风控</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MSG-040</strong>：互关私聊无频次限制，直接进入主会话列表。</li>
  <li><strong>MSG-041</strong>：非互关私聊折叠到「陌生人消息」。</li>
  <li><strong>MSG-042</strong>：接收方回复前最多发送 3 条纯文本。</li>
  <li><strong>MSG-043</strong>：回复前拦截图片、视频、链接、电话、微信号、语音等。</li>
  <li><strong>MSG-044</strong>：接收方回复后移出陌生人消息并解除限制。</li>
  <li><strong>MSG-045</strong>：敏感词触发黄色安全提示。</li>
  <li><strong>MSG-046</strong>：严重涉诈话术直接拦截。</li>
  <li><strong>MSG-047</strong>：拉黑后拒收消息并在列表隐藏对方。</li>
  <li><strong>MSG-048</strong>：举报功能提供举报类型和聊天记录凭证。</li>
  <li><strong>MSG-049</strong>：长按或左滑删除私聊会话，清空本地记录。</li>
  <li style="color:#5B7A63;"><strong>承接说明</strong>：消息模块已补陌生人消息独立入口、拉黑/举报/删除菜单、纯文本限制、安全提示和严重涉诈拦截。</li>
</ul>
`,
  'MINE-HOME': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">个人主页主体</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MINE-001</strong>：底部导航「我的」进入个人主页。</li>
  <li><strong>MINE-002</strong>：未登录展示登录引导 + 登录按钮。</li>
  <li><strong>MINE-003</strong>：已登录展示封面 110px + 个人信息卡片。</li>
  <li><strong>MINE-004</strong>：头像 58px 悬浮在卡片顶部 -29px。</li>
  <li><strong>MINE-005</strong>：粉丝数 / 关注数可点击，获赞数只展示。</li>
  <li><strong>MINE-006</strong>：编辑资料按钮进入编辑资料全屏浮层。</li>
  <li><strong>MINE-007</strong>：昵称右侧展示性别 Pill + MBTI Pill。</li>
  <li><strong>MINE-008</strong>：UID 行包含 ID、复制按钮、IP 属地。</li>
  <li><strong>MINE-009</strong>：个人签名和标签 Badge Pill 展示。</li>
  <li><strong>MINE-010</strong>：我的同好营横向滚动，含加入同好营 CTA。</li>
  <li><strong>MINE-011</strong>：二级 Tab：作品 / 喜欢 / 收藏。</li>
  <li><strong>MINE-012</strong>：作品 3 列方形网格，仅展示已发布动态。</li>
  <li><strong>MINE-013</strong>：喜欢 3 列方形网格，展示我点赞过的动态。</li>
  <li><strong>MINE-014</strong>：收藏 3 列方形网格，展示我收藏过的动态。</li>
  <li><strong>MINE-015</strong>：点击网格项进入对应动态详情。</li>
  <li><strong>CIR-009</strong>：个人主页展示粉丝数、关注数、获赞数。</li>
</ul>
`,
  'MINE-EDIT': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">编辑资料</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MINE-024</strong>：封面点击更换。</li>
  <li><strong>MINE-025</strong>：头像点击更换。</li>
  <li><strong>MINE-026</strong>：UID 展示 + 一键复制。</li>
  <li><strong>MINE-027</strong>：昵称输入 max 12。</li>
  <li><strong>MINE-028</strong>：性别底部选择器。</li>
  <li><strong>MINE-029</strong>：生日日期选择器。</li>
  <li><strong>MINE-030</strong>：MBTI 4 列网格选择。</li>
  <li><strong>MINE-031</strong>：个人标签自由输入、添加、删除，最多 8 个。</li>
  <li><strong>MINE-032</strong>：个人签名 textarea max 100，并显示计数器。</li>
  <li><strong>MINE-033</strong>：顶部取消 / 保存，取消需二次确认。</li>
</ul>
`,
  'MINE-ASSETS': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">我的资产与草稿</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MINE-016</strong>：草稿列表展示图文/视频类型角标、标题、保存时间。</li>
  <li><strong>MINE-017</strong>：草稿上限 5 条，超出提示删除旧草稿。</li>
  <li><strong>MINE-018</strong>：点击草稿恢复编辑，草稿从草稿箱移除。</li>
  <li><strong>MINE-019</strong>：支持删除草稿，需二次确认。</li>
  <li><strong>MINE-020</strong>：加入的拼团面基按加入时间倒序展示。</li>
  <li><strong>MINE-021</strong>：想去的展会活动展示封面、标题、日期。</li>
  <li><strong>MINE-022</strong>：收藏的活动展示封面、标题、日期。</li>
  <li><strong>MINE-023</strong>：点击进入拼团详情或活动详情。</li>
  <li><strong>PUB-022</strong>：草稿箱查看、恢复编辑、删除，恢复后移除草稿。</li>
  <li style="color:#5B7A63;"><strong>承接说明</strong>：个人页活动 Tab 已补收藏活动列表，点击进入活动详情。</li>
</ul>
`,
  'MINE-SOCIAL': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">关注 / 粉丝列表</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MINE-034</strong>：粉丝数 / 关注数可点击进入对应列表。</li>
  <li><strong>MINE-035</strong>：列表支持滚动分页加载。</li>
  <li><strong>MINE-036</strong>：关注列表展示头像、昵称、签名、已关注按钮，点击可取消关注。</li>
  <li><strong>MINE-037</strong>：粉丝列表展示关注 / 已关注状态。</li>
  <li><strong>MINE-038</strong>：列表为空展示空状态。</li>
  <li><strong>MINE-039</strong>：从个人主页 push 进入，返回时保留主页状态。</li>
  <li style="color:#5B7A63;"><strong>承接说明</strong>：已新增粉丝/关注独立列表页，支持关注/取消关注和空状态。</li>
</ul>
`,
  'MINE-SET': `
<div class="req-sect-title" style="font-weight:800;color:#6b5387;margin-bottom:8px;font-size:13px;">设置与账号合规</div>
<ul style="margin:0 0 10px 16px;padding:0;">
  <li><strong>MINE-040</strong>：右上角齿轮进入独立设置全屏页。</li>
  <li><strong>MINE-041a</strong>：手机号绑定展示。</li>
  <li><strong>MINE-041b</strong>：手机号换绑流程：原手机号验证、新手机号验证、成功后强退登录。</li>
  <li><strong>MINE-041c</strong>：第三方账号绑定/解绑，并保留至少手机号一种绑定源。</li>
  <li><strong>MINE-041d</strong>：账号注销前校验未完成拼团等强拦截条件。</li>
  <li><strong>MINE-041e</strong>：注销确认、风险告知、短信确认、30 天冷冻期。</li>
  <li><strong>MINE-042a</strong>：私聊发起人限制。</li>
  <li><strong>MINE-042b</strong>：动态可见性开关。</li>
  <li><strong>MINE-042c</strong>：位置与 IP 属地隐藏。</li>
  <li><strong>MINE-043a</strong>：拼团审核通过推送通知开关。</li>
  <li><strong>MINE-043b</strong>：点赞收藏、评论@、新增关注通知开关。</li>
  <li><strong>MINE-044a</strong>：缓存大小展示与清理。</li>
  <li><strong>MINE-044b</strong>：版本展示。</li>
  <li><strong>MINE-044c</strong>：退出登录二次确认并清除 Token。</li>
  <li style="color:#5B7A63;"><strong>承接说明</strong>：设置弹窗已补手机号换绑、第三方绑定、注销校验、隐私和通知开关。</li>
</ul>
`,
  1: '<p style="margin:0;">旧编号 [1] 已归并到 <strong>CIR-HOME</strong>。</p>',
  2: '<p style="margin:0;">旧编号 [2] 已归并到 <strong>POST-DETAIL</strong>。</p>',
  3: '<p style="margin:0;">旧编号 [3] 已归并到 <strong>PUB-SHEET / PUB-EDITOR / PUB-ACTION</strong>。</p>',
  4: '<p style="margin:0;">旧编号 [4] 已归并到 <strong>ACT-LIST / ACT-SEARCH</strong>。</p>',
  5: '<p style="margin:0;">旧编号 [5] 已归并到 <strong>ACT-DETAIL / ACT-GROUPS</strong>。</p>',
  6: '<p style="margin:0;">旧编号 [6] 已归并到 <strong>GRP-CREATE</strong>。</p>',
  7: '<p style="margin:0;">旧编号 [7] 已归并到 <strong>GRP-DETAIL / GRP-APPLY / GRP-CHAT</strong>。</p>',
  8: '<p style="margin:0;">旧编号 [8] 已归并到 <strong>MSG-HOME / MSG-NOTIF / MSG-CHAT / MSG-RISK</strong>。</p>',
  9: '<p style="margin:0;">旧编号 [9] 已归并到 <strong>MINE-SET</strong>。</p>'
};

export const ReqAnnotationProvider = ({ children }) => {
  const [activeTooltipId, setActiveTooltipId] = useState(null);
  const [position, setPosition] = useState({ left: 100, top: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const tooltipStart = useRef({ left: 0, top: 0 });
  const tooltipRef = useRef(null);

  const openReqTooltip = (id, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      if (event.nativeEvent) {
        event.nativeEvent.stopImmediatePropagation();
      }
    }
    setActiveTooltipId(id);

    // 计算初始定位：默认在事件源按钮的左侧或下方
    const rect = event ? event.target.getBoundingClientRect() : null;
    let left = rect ? rect.left - 450 - 8 : window.innerWidth / 2 - 225;
    let top = rect ? rect.bottom + 8 : window.innerHeight / 2 - 150;

    // 智能避让
    if (left < 10) left = rect ? rect.right + 8 : 10;
    if (left + 450 > window.innerWidth) left = window.innerWidth - 460;
    if (top + 350 > window.innerHeight) top = window.innerHeight - 380;
    if (top < 10) top = 10;

    setPosition({ left, top });

    // GSAP 弹性动效
    setTimeout(() => {
      if (window.gsap && tooltipRef.current) {
        window.gsap.fromTo(
          tooltipRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(1.5)" }
        );
      }
    }, 10);
  };

  const closeReqTooltip = () => {
    if (window.gsap && tooltipRef.current) {
      window.gsap.to(tooltipRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          setActiveTooltipId(null);
        }
      });
    } else {
      setActiveTooltipId(null);
    }
  };

  // 拖拽逻辑
  const handleHeaderMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    tooltipStart.current = { left: position.left, top: position.top };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      let newLeft = tooltipStart.current.left + dx;
      let newTop = tooltipStart.current.top + dy;

      // 视口边界限制
      if (newLeft < 0) newLeft = 0;
      if (newLeft > window.innerWidth - 450) newLeft = window.innerWidth - 450;
      if (newTop < 0) newTop = 0;
      const height = tooltipRef.current ? tooltipRef.current.offsetHeight : 300;
      if (newTop > window.innerHeight - height) newTop = window.innerHeight - height;

      setPosition({ left: newLeft, top: newTop });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  return (
    <ReqAnnotationContext.Provider value={{ openReqTooltip, closeReqTooltip, activeTooltipId }}>
      {children}
      
      {/* 全局需求详情浮窗 */}
      {activeTooltipId && (
        <div
          ref={tooltipRef}
          onClick={(e) => {
            e.stopPropagation();
            if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
          }}
          style={{
            position: 'fixed',
            width: '450px',
            backgroundColor: '#f0efef',
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)',
            zIndex: 99999,
            color: '#40364d',
            fontFamily: "'Outfit', 'Noto Sans SC', sans-serif",
            overflow: 'hidden',
            left: `${position.left}px`,
            top: `${position.top}px`,
            cursor: 'default',
            display: 'block',
            border: '1px solid #d4d2d2'
          }}
        >
          {/* 标题栏 */}
          <div
            onMouseDown={handleHeaderMouseDown}
            style={{
              padding: '10px 14px',
              backgroundColor: '#e5e3e3',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'move',
              borderBottom: '1px solid #d4d2d2',
              userSelect: 'none'
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#6b5387',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span
                style={{
                  backgroundColor: 'rgb(250, 173, 20)',
                  color: '#ffffff',
                  padding: '0px 4px',
                  borderRadius: '2px',
                  fontSize: '9px'
                }}
              >
                [{activeTooltipId}]
              </span>
              <span>PRD 需求指标定义</span>
            </div>
            <button
              onClick={closeReqTooltip}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#8c8297',
                lineHeight: 1,
                padding: '2px'
              }}
            >
              ×
            </button>
          </div>
          
          {/* 内容区 */}
          <div
            dangerouslySetInnerHTML={{ __html: reqMarkdownData[activeTooltipId] }}
            style={{
              padding: '14px',
              maxHeight: '380px',
              overflowY: 'auto',
              fontSize: '12px',
              lineHeight: 1.6
            }}
          />
        </div>
      )}
    </ReqAnnotationContext.Provider>
  );
};

// 橙色标注角标组件
export const ReqBadge = ({ id, style = {} }) => {
  const { openReqTooltip } = useReqAnnotation();
  const isInline = style.position === 'relative';
  const badgeStyle = {
    display: 'inline-block',
    verticalAlign: 'top',
    backgroundColor: 'rgb(250, 173, 20)',
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: isInline ? '9px' : '8px',
    fontWeight: 'bold',
    lineHeight: isInline ? '12px' : '10px',
    padding: isInline ? '0px 3px' : '0px 2px',
    borderRadius: '2px',
    border: 'none',
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 9990,
    boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
    opacity: 0.9,
    whiteSpace: 'nowrap',
    transformOrigin: 'center',
    ...style
  };

  if (!isInline && !style.transform) {
    badgeStyle.transform = 'translate(68%, -58%) scale(0.78)';
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
        openReqTooltip(id, e);
      }}
      className="req-badge-component"
      style={badgeStyle}
    >
      {id}
    </div>
  );
};
