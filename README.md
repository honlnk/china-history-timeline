# 中国历史长河：从夏朝到现代

> 「短命王朝是清道夫，强盛王朝是接盘侠。分久必合，合久必分。」

单页维基式中国历史时间线：十八个时代节点沿一条"长河"排开，按 **文明源头 / 大一统·强盛 / 大乱世 / 短命清道夫 / 近现代** 五类色标区分；悬停查看朝代与纪年，点击印章展开故事面板（150–200 字史略 + 乱世与大一统主题点评）。

另含 **「欧亚对照」** 视图：欧亚两大陆大事双泳道真比例排布（0.85px/年），欧洲以整合期色带（罗马 / 东罗马 / 查理曼…）对照中国朝代带，中国侧事件提示卡自动标注"时值中国 · XX 朝"，附轴心时代、汉·罗马并立、蒙古时代、大分流四个时代标尺。

**线上地址**：<https://history.honlnk.com>

## 技术栈

- [Vue 3](https://vuejs.org/) + `<script setup>` + TypeScript
- [Vite 8](https://vite.dev/) 构建（`base: './'`，单页无路由）
- [Tailwind CSS 4](https://tailwindcss.com/)（`@tailwindcss/vite` 插件 + `@theme` 设计令牌）
- [Noto Serif SC](https://fontsource.org/) 自托管宋体分片
- pnpm 包管理

## 本地开发

```bash
pnpm install
pnpm dev       # 开发服务器
pnpm build     # vue-tsc 类型检查 + 生产构建（输出 dist/）
pnpm preview   # 本地预览构建产物
```

## 部署

推送到 `main` 分支即触发 GitHub Actions（`.github/workflows/deploy.yml`）：

1. pnpm 安装依赖（带缓存）
2. `pnpm build`（含类型检查门禁）
3. 产物上传并部署到 GitHub Pages

自定义域名 `history.honlnk.com`（阿里云 DNS CNAME → `honlnk.github.io`），在仓库 Settings → Pages 配置。

## 结构

```
src/
  data/dynasties.ts      # 18 个时代节点内置数据（时间/分类/标签/史略/点评）+ dynastyAt()
  data/eurasiaEvents.ts  # 欧亚对照：亚洲 21 + 欧洲 26 件大事、欧洲整合期色带、时代标尺
  components/
    SiteHeader.vue       # 标题、副标题引文、朱印、视图切换
    LegendBar.vue        # 五类色标图例
    TimelineDesktop.vue  # 桌面横向长河（滚轮/拖拽横移，宽度∝√国祚）
    TimelineMobile.vue   # 移动端纵向时间轴
    DynastySeal.vue      # 印章节点 + 悬停提示
    StoryPanel.vue       # 故事面板（桌面右侧滑入 / 移动端底部抽屉）
    EurasiaCompare.vue   # 欧亚对照双轨真比例时间图（点击固定提示卡 + 时值朝代联动）
docs/
  plan.md                # 施工计划（决策与验收标准）
  devlog.md              # 施工日志
```

## 说明

内容依据通识史料整理，仅供学习参考。
