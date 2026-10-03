# 施工日志

## 2026-10-03 · 阶段一：计划与环境（已完成）

- 环境勘察：node 24.11 / pnpm 10.21 / gh 2.94（账号 `honlnk`，SSH 协议）/ aliyun CLI（`dns-operator` profile 可用）。
- 参考项目：`~/project/honlnk-home/.github/workflows/deploy.yml`（pnpm + configure-pages@v5 + deploy-pages@v4 模式）与 `~/project/calorie-studio/deploy-pages.yml`。
- DNS 现状：honlnk.com 已有多个子域 CNAME → `honlnk.github.io`（draw、fourier、dsh-input-assist），新子域 `history` 照抄该模式。
- 计划定稿 → `docs/plan.md`。

## 2026-10-03 · 阶段二：实现（已完成，验收通过）

- 技术栈：Vite 8 + Vue 3.5 + TS 6 + Tailwind 4.3（`@tailwindcss/vite` 插件，`@theme` 令牌）+ `@fontsource/noto-serif-sc` 自托管宋体（400/600/900，unicode-range 分片按需加载）。
- `pnpm build`（vue-tsc -b + vite build）零错误通过。
- 浏览器实测（IAB 1440×900 / 390×844）：
  - 桌面首屏视觉评审 9/10（修复了：中段空隙、夏前多余色带、乱世红/近现代红混淆、纪年小字亮度、印章位置）。
  - 悬停 tooltip 内容五要素齐全；印章放大+发光反馈正常。
  - 点击印章 → 右侧故事面板（评审 9/10）；「下一章」翻页正常（唐→五代十国）；ESC 关闭正常。
  - 移动端纵向时间轴评审 9/10；底部抽屉面板 8.5/10 → 已修底部导航 iPhone 安全区（`env(safe-area-inset-bottom)` + `viewport-fit=cover`）。

### 偏差与发现（对照计划）

1. **色带宽度未按计划线性比例**，改为 `108 + 13.5×√(年数)` 开方缩放：严格等比会让秦（15 年）色带不可见。属计划 §3 预留的"半比例"实现，记录选型。
2. **自动化环境伪问题**：IAB 无绘制帧时 Vue Transition 的 rAF 类推进被节流，面板过渡类卡在 `*-enter-from`/`*-leave-from`；强制绘制后过渡立即完成。真实浏览器可见即绘制，不受影响，**非应用 bug**，无需修复。
3. **Playwright locator click 在本项目两处超时**（滚动容器内印章、Teleport 面板内按钮），坐标点击与元素级 `click()` 均正常——判定为自动化后端兼容性问题，非页面缺陷。
4. 移动端列表避免按钮嵌套：`DynastySeal` 增加 `decorative` 属性（渲染为非交互元素）。

## 2026-10-03 · 阶段三：发布（已完成）

- 仓库：`github.com/honlnk/china-history-timeline`（public，SSH remote，推送成功无网络问题）。
- CI：`.github/workflows/deploy.yml`。首次运行全绿（build 17s + deploy 9s）；`https://honlnk.github.io/china-history-timeline/` 返回 200。
- DNS：阿里云新增 `history` CNAME → `honlnk.github.io`（RecordId 2106166023748950016，TTL 600）；权威 DNS 已生效。
- 自定义域名：Pages cname=history.honlnk.com 已设置；`http://history.honlnk.com/` 返回 200。
- HTTPS：GitHub 证书签发中（API 报 "The certificate does not exist yet"），属计划 §5 预案内等待项；签发后需在 Settings → Pages 勾选 Enforce HTTPS（或 `gh api -X PUT .../pages -F https_enforced=true`）。
- 工作流注解仅为 Node20 弃用警告（actions 官方迁移期），不影响构建。

## 交付摘要（2026-10-03）

- 线上（HTTP 已通，HTTPS 待证书）：http://history.honlnk.com
- 备用地址：https://honlnk.github.io/china-history-timeline/
- 全部验收点状态见 `plan.md` §5；唯一未闭环项为 HTTPS 证书签发等待。

## 2026-10-03 · 变更一：三国两晋南北朝拆分（用户决策，已上线）

- 用户提出"三国两晋南北朝"应为三段历史 → 拆为三国（220–280）/ 两晋（266–420）/ 南北朝（420–589），节点 16→18，均为大乱世类。
- 亮点：三国点评点破副标题「分久必合，合久必分」出自《三国演义》开篇；两晋点评引入"失败的接盘侠"（西晋统一 37 年与隋同长却无制度遗产）反例叙事。
- 同轮修复：桌面端面板打开时，激活节点锚定滚动到面板（480px）左侧可见区中心——修复"隋被面板遮挡"评审必修项（复评 9/10）。
- 评审"色带 3px 分段缝/同色段辨识度"两项判定为全轴统一设计语言，保留不改（如需无缝可再议）。
- CI 全绿（run 37080557620，commit 9c6fdd2），生产已验证新 bundle（18 节点 + 十八段纪元）。
- HTTPS 证书仍为签发中（cert: null），持续等待 GitHub 自动完成。
