# SonicAI - AI 音乐创作工作站

## 项目概览

一站式 AI 音乐创作工具，用自然语言 + 精细控件生成专业质感音乐作品。

### 核心功能

1. **音乐风格选择器** - 130+ 主/细分风格的分类树
2. **歌手演唱风格库** - 国内外知名歌手的演唱风格和技巧标签
3. **深度思考歌词创作** - 接入 DeepSeek Reasoner 深度思考模式
4. **描述词输入** - 大文本框，1500 字符上限，实时字数统计
5. **歌词编辑器** - 大文本框，5000 字符上限，支持段落标签
6. **音色上传** - 上传参考音频，预留音色克隆接口
7. **音乐生成** - Suno API 为主，波形可视化播放
8. **作品库** - 用户历史生成作品列表

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **动画**: Framer Motion
- **音频可视化**: WaveSurfer.js
- **音乐 API**: Suno (第三方代理)
- **LLM**: DeepSeek API (深度思考歌词)

## 目录结构

```
src/
├── app/
│   ├── api/
│   │   ├── generate-music/     # 音乐生成 API
│   │   └── generate-lyrics/    # 歌词生成 API
│   ├── library/                # 作品库页面
│   ├── voices/                 # 音色管理页面
│   ├── settings/               # 设置页面
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 创作主页
│   └── globals.css             # 全局样式
├── components/
│   ├── ui/                     # shadcn/ui 组件
│   ├── navbar.tsx              # 导航栏
│   ├── music-style-selector.tsx # 音乐风格选择器
│   ├── singer-style-selector.tsx # 歌手风格选择器
│   ├── description-input.tsx   # 描述词输入
│   ├── lyrics-editor.tsx       # 歌词编辑器
│   ├── voice-upload.tsx        # 音色上传
│   ├── music-player.tsx        # 音乐播放器
│   └── deep-thinking-lyrics.tsx # 深度思考歌词
└── lib/
    ├── utils.ts                # 工具函数
    ├── music-styles.ts         # 音乐风格数据
    └── singer-styles.ts        # 歌手风格数据
```

## 环境变量

需要在 `.env.local` 中配置：

```bash
# Suno API 密钥（音乐生成）
SUNO_API_KEY=your_suno_api_key

# DeepSeek API 密钥（歌词创作）
DEEPSEEK_API_KEY=your_deepseek_api_key

# ElevenLabs API 密钥（可选，音色克隆）
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 类型检查
pnpm ts-check

# 代码检查
pnpm lint
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

**请求体**：
```json
{
  "styles": ["pop", "mandopop"],
  "singers": ["jay-chou"],
  "description": "一首温暖的抒情歌曲",
  "lyrics": "歌词内容",
  "voiceId": "音色ID"
}
```

**响应**：
```json
{
  "audioUrl": "音频URL",
  "taskId": "任务ID"
}
```

### POST /api/generate-lyrics

深度思考歌词创作（SSE 流式响应）

**请求体**：
```json
{
  "theme": "创作主题",
  "structure": "verse-chorus",
  "language": "chinese",
  "rhymeScheme": "aabb"
}
```

**响应**：SSE 流式数据
```
data: {"type":"step","step":"主题解构","content":"..."}
data: {"type":"lyrics","content":"..."}
data: {"type":"done"}
```

## 待办事项

- [ ] 配置真实的 Suno API 密钥
- [ ] 配置真实的 DeepSeek API 密钥
- [ ] 实现 Mureka 备选 API
- [ ] 实现 ElevenLabs 音色克隆
- [ ] Electron 桌面版打包
- [ ] 精细化的歌手技巧对照库
