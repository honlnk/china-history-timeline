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

## 2026-10-03 · 阶段三：发布（进行中）

- 仓库：`github.com/honlnk/china-history-timeline`（public，SSH remote）。
- CI：`.github/workflows/deploy.yml`（push main / 手动触发 → 类型检查+构建 → Pages 部署）。
- 域名：`history.honlnk.com` CNAME → `honlnk.github.io`（TTL 600）。
