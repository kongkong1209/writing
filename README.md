# 手把手带你练写作 (Gu's Method)

基于《手把手教你雅思写作》的 AI 辅助写作训练平台。

## 🎨 设计风格

采用 **Shopify Dark Bento** 设计语言：
- 极致深黑背景 (`#0B0C0E`)
- 深灰色卡片 (`#1A1C1E`)
- 荧光绿主色调 (`#96BF48`)
- Bento Grid 模块化布局
- 微交互动画效果

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 运行开发服务器

```bash
npm run dev
# 或
pnpm dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页 (Dashboard)
│   ├── journey/           # 写作之旅页
│   ├── studio/            # AI 演练场页
│   ├── profile/           # 个人中心页
│   ├── layout.tsx         # 根布局（包含导航）
│   └── globals.css        # 全局样式
├── components/
│   ├── layout/            # 布局组件
│   │   └── Navigation.tsx # 底部导航（移动端）+ 侧边栏（桌面端）
│   ├── ui/                # 通用 UI 组件
│   │   ├── BentoCard.tsx
│   │   ├── Button.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── StatCard.tsx
│   │   ├── Timeline.tsx
│   │   ├── InputGroup.tsx
│   │   ├── WordCapsule.tsx
│   │   ├── FlipCard.tsx
│   │   └── GrammarCard.tsx # 带输入检查的语法卡片
│   └── pages/             # 页面组件
│       ├── Dashboard.tsx   # 首页（重构）
│       ├── Journey.tsx     # 写作之旅（游戏化路线图）
│       ├── AIStudio.tsx    # AI 演练场（工具箱）
│       └── Profile.tsx     # 个人中心（错题本、徽章）
└── package.json
```

## 🎯 核心功能（4 个主要 Tab）

### 1. 首页 (Dashboard)
- **当前任务**: 显示 "Day 5: 律法城 (Crime)"
- **每日金句**: 随机句子练习（带输入检查功能）
- **数据统计**: 词伙掌握数、逻辑得分
- **最近完成**: 显示已完成的任务记录

### 2. 写作之旅 (Journey)
- **游戏化路线图**: 31 天学习路径可视化
- **主题城市**: Day 1-23 显示为"主题城"
- **工业区**: Day 24-31 显示为"工业区"（图表/数据）
- **状态可视化**:
  - 🔒 已锁定：模糊效果
  - ✨ 进行中：荧光绿高亮 + 发光动画
  - 🏆 已完成：金色标记

### 3. AI 演练场 (AI Studio)
三个独立工具：
- **作文评分器**: 上传文章 → AI 评分 + 反馈
- **逻辑实验室**: ABC 逻辑链练习
- **词伙猎人**: 按主题搜索词伙

### 4. 我的 (Profile)
- **错题本**: 记录错误、纠正、示例
- **徽章系统**: 成就徽章收集（网格布局）
- **主题切换**: 深色/浅色模式切换

## 🎨 交互特性

### GrammarCard 组件升级
- **输入状态**: 显示中文句子 → 用户输入翻译
- **检查功能**: 点击"检查答案" → 验证输入
- **3D 翻转**: 显示标准答案 + AI 反馈
- **相似度计算**: 显示翻译相似度百分比

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **语言**: TypeScript

## 📱 响应式设计

- **移动端**: 底部导航栏（4 个 Tab）
- **桌面端**: 左侧固定侧边栏
- **自适应布局**: 所有页面支持响应式

## 📝 开发说明

当前版本为 **UI First** 阶段，所有数据均为 Mock Data。后续将接入：
- AI 交互逻辑
- 后端 API
- 用户认证
- 数据持久化

## 🎨 设计规范

### 颜色系统
- `background`: `#0B0C0E`
- `surface`: `#1A1C1E`
- `primary`: `#96BF48`
- `text-primary`: `#FFFFFF`
- `text-secondary`: `#9CA3AF`

### 间距系统
- 卡片圆角: `16px`
- 按钮圆角: `12px`
- 统一间距: `6px` 的倍数

### 动画
- 悬停缩放: `1.02-1.05`
- 点击反馈: `0.95-0.98`
- 过渡时长: `200-300ms`
- Tab 切换: Spring 动画（stiffness: 380, damping: 30）

## 📄 License

MIT
