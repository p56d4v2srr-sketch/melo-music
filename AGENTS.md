# SonicAI - AI 音乐创作工作站

## 项目概览

一站式 AI 音乐创作 + 社交发现平台，用自然语言 + 精细控件生成专业质感音乐作品，同时提供抖音式音乐发现、排行榜、AI 深度分析等社交功能。

### 核心功能

**创作模块**
1. **音乐风格选择器** - 130+ 主/细分风格的分类树
2. **歌手演唱风格库** - 国内外知名歌手的演唱风格和技巧标签
3. **深度思考歌词创作** - 接入 DeepSeek Reasoner 深度思考模式
4. **描述词输入** - 大文本框，1500 字符上限，实时字数统计
5. **歌词编辑器** - 大文本框，5000 字符上限，支持段落标签
6. **音色上传** - 上传参考音频，预留音色克隆接口
7. **音乐生成** - Suno API 为主，波形可视化播放
8. **作品库** - 用户历史生成作品列表

**社交发现模块**
9. **发现主页** - 抖音式上下滑动播放，全屏沉浸式体验
10. **排行榜** - 歌曲 TOP 100（热门/飙升/新歌/原创）+ AI 音乐人排行
11. **热搜系统** - 分类热搜榜（歌曲/歌手/风格/话题）+ 搜索联想
12. **AI 音乐人主页** - 公开 Profile + 代表作 + 作品瀑布流
13. **AI 深度分析** - 歌词逐句解读 + 多维度评分卡 + 雷达图
14. **私人空间** - 数据仪表盘 + 私信 + 粉丝 + 草稿箱
15. **通知中心** - 点赞/评论/关注/@提及通知
16. **社交互动** - 点赞/评论/收藏/关注

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **动画**: Framer Motion
- **音频可视化**: WaveSurfer.js
- **数据库**: Supabase (PostgreSQL + Drizzle ORM)
- **音乐 API**: Suno (第三方代理)
- **LLM**: DeepSeek API (深度思考歌词 + AI 分析)

## 目录结构

```
src/
├── app/
│   ├── api/
│   │   ├── generate-music/        # 音乐生成 API
│   │   ├── generate-lyrics/       # 歌词生成 API
│   │   ├── analyze-song/          # AI 歌曲分析 API
│   │   └── interactions/          # 社交互动 API
│   │       ├── like/              # 点赞
│   │       ├── collect/           # 收藏
│   │       ├── follow/            # 关注
│   │       └── comment/           # 评论
│   ├── (pages)
│   │   ├── page.tsx               # 发现主页（抖音式滑动）
│   │   ├── create/                # 创作工作台
│   │   ├── charts/                # 排行榜
│   │   ├── hot/                   # 热搜页
│   │   ├── artist/[id]/           # AI 音乐人主页
│   │   ├── song/[id]/             # 单曲详情 + AI 分析
│   │   ├── studio/                # 私人空间
│   │   ├── notifications/         # 通知中心
│   │   ├── library/               # 作品库
│   │   ├── voices/                # 音色管理
│   │   └── settings/              # 设置
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                        # shadcn/ui 组件
│   ├── navbar.tsx                 # 导航栏
│   ├── music-style-selector.tsx   # 音乐风格选择器
│   ├── singer-style-selector.tsx  # 歌手风格选择器
│   ├── description-input.tsx      # 描述词输入
│   ├── lyrics-editor.tsx          # 歌词编辑器
│   ├── voice-upload.tsx           # 音色上传
│   ├── music-player.tsx           # 音乐播放器
│   └── deep-thinking-lyrics.tsx   # 深度思考歌词
├── lib/
│   ├── utils.ts                   # 工具函数
│   ├── music-styles.ts            # 音乐风格数据
│   ├── singer-styles.ts           # 歌手风格数据
│   └── mock-data.ts               # 社交功能演示数据
└── storage/
    └── database/
        └── shared/
            └── schema.ts          # Drizzle 数据库 Schema
```

## 路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 发现主页 | 抖音式上下滑动播放 |
| `/create` | 创作工作台 | AI 音乐创作 |
| `/charts` | 排行榜 | 歌曲 + 音乐人排行 |
| `/hot` | 热搜页 | 热搜榜 + 搜索 |
| `/artist/[id]` | 音乐人主页 | 公开 Profile |
| `/song/[id]` | 单曲详情 | AI 深度分析 |
| `/studio` | 私人空间 | 数据仪表盘 |
| `/notifications` | 通知中心 | 互动通知 |
| `/library` | 作品库 | 历史作品 |
| `/voices` | 音色管理 | 音色上传 |
| `/settings` | 设置 | API 配置 |

## 数据库表

| 表名 | 说明 |
|------|------|
| `users` | 用户（AI 音乐人） |
| `songs` | 歌曲 |
| `plays` | 播放记录 |
| `likes` | 点赞 |
| `collects` | 收藏 |
| `follows` | 关注 |
| `comments` | 评论（支持楼中楼） |
| `hot_search` | 热搜 |
| `ai_analysis` | AI 分析缓存 |
| `notifications` | 通知 |

## 环境变量

```bash
# Suno API 密钥（音乐生成）
SUNO_API_KEY=your_suno_api_key

# DeepSeek API 密钥（歌词创作 + AI 分析）
DEEPSEEK_API_KEY=your_deepseek_api_key

# ElevenLabs API 密钥（可选，音色克隆）
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## 开发命令

```bash
pnpm install        # 安装依赖
pnpm dev            # 启动开发服务器
pnpm build          # 构建生产版本
pnpm start          # 启动生产服务器
pnpm ts-check       # 类型检查
pnpm lint           # 代码检查
```

## 设计规范

详见 `DESIGN.md` 文件。

### 视觉风格

- **深色主题**：黑金/黑紫配色，音乐工作站质感
- **磨砂玻璃**：backdrop-blur 效果，半透明卡片
- **光晕效果**：金色/紫色柔和光晕
- **音频可视化**：流动的波形动画

### 色彩方案

- 深空黑：`#0a0a0f` - 背景主色
- 流金：`#d4af37` - 主强调色
- 电紫：`#8b5cf6` - 次强调色

## API 接口

### POST /api/generate-music
生成音乐

### POST /api/generate-lyrics
深度思考歌词创作（SSE 流式响应）

### POST /api/analyze-song
AI 歌曲深度分析（SSE 流式响应）

### POST /api/interactions/like
点赞/取消点赞

### POST /api/interactions/collect
收藏/取消收藏

### POST /api/interactions/follow
关注/取消关注

### POST /api/interactions/comment
发表评论

### GET /api/interactions/comment
获取评论列表
