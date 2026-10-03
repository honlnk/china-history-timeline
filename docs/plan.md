# 中国历史长河 · 时间线 Wiki — 施工计划

> 状态：已定稿（2026-10-03）
> 来源：用户提示词全套需求 + 本地环境勘察（~/project 参考项目）

## 1. 目标

单页「中国历史时间线」Wiki 式网页：16 个朝代/时期节点，色标分类，悬停出提示，点击弹故事面板；Vue3 + TS + Tailwind 技术栈，pnpm 管理；GitHub 公开仓库 + Actions CI/CD 自动发布 GitHub Pages；自定义域名 **history.honlnk.com**（阿里云 DNS 解析，照抄现有 `draw`/`fourier` 子域模式）。

## 2. 已拍死的决策（无开放选择题）

| 决策点 | 结论 | 依据 |
|---|---|---|
| 视觉风格 | **深色学术风**（墨色底 + 金色点缀 + 宋体衬线） | 用户授权二选一；暗底对金/暗红/紫/亮红蓝四类状态色区分度最佳，羊皮纸底会淹没"深红/暗灰"乱世节点 |
| 时间轴方向 | 桌面（≥768px）**横向滚动**：滚轮自动转横向 + 鼠标拖拽 + 触控板原生横滑，首屏显示操作提示；移动端（<768px）**纵向时间轴**（左轴线+右内容，交替错落） | 用户要求双端自适应且美观 |
| 故事面板 | 桌面：右侧滑入 Sidebar（≈480px）；移动端：底部抽屉（bottom sheet）；遮罩模糊，ESC/点遮罩/关闭键三途径关闭，进出均平滑过渡 | 用户要求 |
| 节点色标 | 大一统/强盛=**金**；大乱世=**暗红/灰**；短命清道夫=**紫**；近现代=**亮蓝（民国）/正红（共和国）**；另补第 5 类**文明源头（古铜）= 夏、商** | 用户四类体系 + 夏商骨架未归类，补决策；须在汇报中说明 |
| 宋朝归类 | 金色（强盛）+ 「局部统一」标签 | 用户骨架原文"局部统一，经济巅峰" |
| 项目目录 | `~/note/china-history-timeline` | 用户指令 |
| 仓库名 | `china-history-timeline`（public，SSH remote） | 用户 GitHub 规范（SSH 一律不改为 HTTPS） |
| 子域名 | `history.honlnk.com` → CNAME → `honlnk.github.io`，TTL 600，Line default，profile `dns-operator` | 与现有 DNS 记录模式一致 |
| Vite base | `'./'` 相对路径 | 对 Pages 子路径预览与自定义域名同时安全（无路由的单页） |
| CI 模板 | 仿 `~/project/honlnk-home/.github/workflows/deploy.yml`：checkout@v4 → setup-node@v4(22) → pnpm/action-setup@v4(10) → pnpm cache → install --frozen-lockfile → configure-pages@v5 → build(含 vue-tsc) → upload-pages-artifact@v3 → deploy-pages@v4；push main + workflow_dispatch 触发；concurrency 防串 | 用户指定参考 ~/project CI/CD |
| 字体 | `@fontsource/noto-serif-sc`（自托管 400/600/900，unicode-range 分片按需加载）+ 系统宋体回退 | 视觉高级感 + 不依赖 Google Fonts |
| 节点徽记 | 圆形"印章"节点，内书朝代首字（如 秦/汉/唐），尺寸随国祚长短分 3 档 | 历史厚重感 + 长短一眼可辨 |

## 3. 数据模型（16 节点，严格按用户骨架）

```ts
interface Dynasty {
  id: string
  name: string              // 秦
  shortYears: string        // 前221–前206（悬停提示用）
  period: string            // 面板完整时间描述
  startYear: number         // 负数=公元前（节点排序/年代刻度用）
  endYear: number
  category: 'origin' | 'unified' | 'chaos' | 'sweeper' | 'modern'
  tags: string[]            // 大一统、清道夫、乱世…
  summary: string           // 150–200 字核心历史简介
  commentary: string        // 「乱世与大一统」主题点评
}
```

节点清单（name / years / category）：夏(约前2070–前1600/origin) 商(约前1600–前1046/origin) 周(前1046–前256/unified) 春秋战国(前770–前221/chaos) 秦(前221–前206/sweeper) 汉(前202–220/unified) 三国两晋南北朝(220–589/chaos) 隋(581–618/sweeper) 唐(618–907/unified) 五代十国(907–960/chaos) 宋(960–1279/unified·局部统一) 元(1271–1368/sweeper) 明(1368–1644/unified) 清(1636–1912/unified) 民国(1912–1949/modern) 中华人民共和国(1949–今/modern)。

> 注意：周作为整段节点（含东周），时间与春秋战国重叠 — 轴上按骨架顺序排布（半比例：相邻重叠段用错层带表现），不追求严格等比（严格等比会让秦/隋节点不可见，违背可用性）。节点下沿配"世纪刻度尺"辅助时间感。

## 4. 组件结构

```
src/
  main.ts / App.vue / style.css(Tailwind4 @theme)
  data/dynasties.ts        # 16 节点内置数据
  components/
    SiteHeader.vue         # 标题+副标题+印章装饰
    LegendBar.vue          # 五类色标图例
    TimelineDesktop.vue    # 横向滚动轴（滚轮/拖拽/边缘渐隐）
    TimelineMobile.vue     # 纵向轴
    DynastySeal.vue        # 印章节点 + 悬停 tooltip
    StoryPanel.vue         # 故事面板（桌面侧栏/移动抽屉双形态）
```

## 5. 验收点（全部可执行）

1. `pnpm build` 通过，vue-tsc 零错误。
2. 桌面 1440px + 移动 390px 真实浏览器实测：标题/副标题/图例/16 节点渲染完整；悬停 tooltip 显示名称+时间段；点击弹面板（含名称、存续、标签、简介、点评）；关闭动画平滑；横向滚动（滚轮+拖拽）可用。
3. GitHub Actions 首次 run 绿灯；`https://honlnk.github.io/china-history-timeline/` 返回 200。
4. `dig history.honlnk.com` CNAME = honlnk.github.io；Pages cname 设置成功。
5. `https://history.honlnk.com/` 返回 200。**降级预案**：GitHub 自定义域证书签发最长可拖延数小时 — 若未就绪，用 `gh api .../pages` 证书状态作证并在汇报中说明等待，不算验收失败。

## 6. 明确不做清单（本期诱惑项排除）

- 不做 主题切换（羊皮纸主题）、i18n、URL 路由/分享锚点
- 不做 后端/评论/统计、搜索、PWA
- 不做 单元测试框架（内容驱动静态页，门禁=类型检查+构建+真机视觉验收；如后续加组件逻辑再引入）
- 不做 严格等比时间轴（可见性问题，见 §3）

## 7. 文档同步计划

- 本文件：状态流转 + 决策变更随手更新。
- `docs/devlog.md`：施工日志（日期/阶段/验收结论/偏差），每阶段门禁时追加。
- 结项时 README.md 汇总：本地开发、部署、域名架构。

## 8. 偏差记录（随施工追加）

- 2026-10-03 定稿：暂无。
- 2026-10-03 用户决策：原「三国两晋南北朝」单节点拆分为 **三国（220–280）/ 两晋（266–420）/ 南北朝（420–589）** 三节点，节点总数 16 → 18；页脚「十六段纪元」同步改「十八段纪元」。两晋色带自 280 年起画（bandStart，避免与三国带重叠，同周朝带处理逻辑）。春秋战国经评估**保留单节点**（骨架定性"五百年大乱世"整体叙事，百家争鸣横跨两段；用户如需拆分再改）。
