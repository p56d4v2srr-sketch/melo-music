# V5.0 Suno 多版本选择改造

本次迭代主题：**在创作页加入 Suno 5 版本卡片选择 + 顶部模型系列 tab（其他厂商占位），后端 provider 抽象层落 AceData 单实装，为下一步接入新 provider 预留接口**。

**重要约束**：
- **不要**新建 `src/lib/apipass.ts`，**不要**加 `APIPASS_API_KEY` / `APIPASS_API_BASE` / `MUSIC_PROVIDER` 任何 env。ApiPass 因 Cloudflare 屏蔽暂不接入。
- 保留 AceData 作为唯一实装 provider（多厂商冗余的接口预留，但只实装一家）
- 不部署、不删除、不改与本次需求无关的文件
- 不消耗 AceData 积分（余额 0，真实调用会失败，只在代码路径预留 fallback）

---

## 1. 创作页 UI：顶部模型系列 tab

改动文件：`src/app/create/page.tsx`

在创作页顶部（页面主内容最上方，紧跟页面标题之下）添加一行"模型系列" tab 组，横向排列 5 个 tab，样式跟当前深色主题黑金/黑紫磨砂玻璃质感一致，激活 tab 有金色下划线或荧光渐变边框。

Tab 列表：

| Tab 名 | key | 状态 |
|---|---|---|
| **Suno** | `suno` | 激活可用（默认选中） |
| **Mureka** | `mureka` | 灰色占位，点击 toast 提示"敬请期待" |
| **MiniMax（海螺音乐）** | `minimax` | 灰色占位，点击 toast 提示"敬请期待" |
| **ACE-Step** | `acestep` | 灰色占位，点击 toast 提示"敬请期待" |
| **音色克隆** | `voice-clone` | 若代码里已有独立入口（例如 `/voice-clone` 或作品库音色 tab），就复用跳转；没有就纯占位 toast |

选中态：金色（`text-yellow-400`/`text-amber-400`）配下划线或渐变边框；未选中：`text-muted-foreground`；灰色占位 tab 直接加 `opacity-50 cursor-not-allowed`（但仍可点击触发 toast）。

## 2. Suno tab 下：5 版本卡片选择

在 Suno tab 被选中时展开一块区域（放在模型系列 tab 下面、原有创作参数区之上），用横向可滚动的卡片形式列出 5 个 Suno 版本，用户可点击选择其一（单选）。

**所有 5 个版本前端 UI 上都可选，不禁用**。

| 版本 key（代码/接口用） | 显示名 | 描述 | 计费显示 | 徽标 |
|---|---|---|---|---|
| `v5-5` | **Suno V5.5** | 最新发布实验模型，人声更细腻，输出音质提升 | 5 积分/首 | `NEW` |
| `v5` | **Suno V5.0** | 实验模型，音质细腻，默认推荐 | 5 积分/首 | `默认` |
| `v4-5-plus` | **Suno V4.5+** | 主力生成模型，最长 8 分钟 | 5 积分/首 | — |
| `v4-5` | **Suno V4.5** | 支持自然语言描述音乐风格，最长 8 分钟 | 5 积分/首 | — |
| `v4` | **Suno V4.0** | 超强音乐生成，堪比真人 | 5 积分/首 | — |

- 默认选中 `v5`
- 选中卡片：金色边框 + 微阴影，未选中：半透明玻璃质感
- 顶部角标（New 徽标给 `v5-5`，"默认"给 `v5`）
- 卡片高度紧凑（一屏能看到 3-5 张），支持横向滑动查看

选中的 `model_version` 需要在提交生成请求时作为 body 字段 `model_version` 传给 `/api/generate-music`。

## 3. 后端 provider 抽象层（只实装 AceData）

### 3.1 新建统一接口：`src/lib/music-provider.ts`

```typescript
export interface GenerateParams {
  prompt: string;
  lyric?: string;
  style?: string;
  model_version: string; // v5-5 / v5 / v4-5-plus / v4-5 / v4
  custom_mode?: boolean;
  instrumental?: boolean;
  vocal_gender?: 'male' | 'female' | 'auto';
  title?: string;
  duration?: number;
  language?: string;
  emotion?: string;
  is_public?: boolean;
  cover_style?: string;
  [key: string]: any;
}

export interface GenerateResult {
  task_id: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  provider: string;         // 例如 'acedata' / 'demo'
  model_version: string;    // 用户请求的版本
  actual_model?: string;    // 实际下发到底层 API 的模型（如 'chirp-v4'）
  warning?: string;         // 例如 'AceData 当前仅支持 v4，其他版本待接入新 provider 后启用'
  data?: any;               // 兼容当前返回结构
}

export interface TaskStatus {
  task_id: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  provider: string;
  songs?: Array<{
    id: string;
    title: string;
    audio_url?: string;
    image_url?: string;
    lyric?: string;
    duration?: number;
    [key: string]: any;
  }>;
  error?: string;
}

export interface MusicProvider {
  name: string;
  generate(params: GenerateParams): Promise<GenerateResult>;
  queryTask(taskId: string): Promise<TaskStatus>;
}

// 单实装工厂：目前只有 AceData
// 未来接入新 provider 时再在这里加分支
export function getMusicProvider(): MusicProvider;
```

### 3.2 实装 AceDataProvider

- 把现有 `src/lib/acedata.ts` 里 Suno 音乐生成、任务查询的逻辑抽出来实现 `MusicProvider` 接口
- **model_version 映射规则**：
  - AceData 底层只支持 `chirp-v4`
  - 前端传 `v5-5` / `v5` / `v4-5-plus` / `v4-5`：向 AceData 请求时传 `chirp-v4`；返回结果中 `actual_model: 'chirp-v4'`、`warning: 'AceData 当前仅支持 v4，其他版本待接入新 provider 后启用'`
  - 前端传 `v4`：向 AceData 请求时传 `chirp-v4`；`actual_model: 'chirp-v4'`；**不加 warning**
  - 无论哪种，返回体的 `model_version` 都保留用户请求的原值
- 保留 timeout 120s + AbortError 处理
- `src/lib/acedata.ts` 保留原有导出函数（供旧代码路径 fallback / 兼容），只**新增**一个导出 `AceDataProvider` 类
- 单实装工厂：

```typescript
export function getMusicProvider(): MusicProvider {
  // 目前只实装 AceData，未来接其他厂商时在这里加分支
  return new AceDataProvider();
}
```

**明确禁止**：不要新建 `src/lib/apipass.ts`，不要实现 ApiPassProvider，不要读 `APIPASS_*` / `MUSIC_PROVIDER` 任何 env。

### 3.3 改造 `POST /api/generate-music/route.ts`

- 接受新字段 `model_version`（string，默认 `v5`）
- 调用 `getMusicProvider().generate({ ...原参数, model_version })`
- 把 provider 返回的 `warning`、`provider`、`model_version`、`actual_model` 一起返回给前端
- 演示模式（AceData 无 API Key 或调用失败）：返回 mock 数据里带 `provider: 'demo'` 和用户请求的原 `model_version`（**不要**改成 chirp-v4，让 UI 能显示准确的选择）；`actual_model` 可为 `'demo'` 或不返回
- Toast 文案（前端 create page 处理）：`演示模式：{provider} 未配置，返回示例数据`
- 如果 provider 返回带 `warning`（例如 v5-5 请求被 AceData 降级），前端也需要 toast 提示这个 warning 内容（一次即可，避免刷屏）

## 4. env（本轮不加任何新 env）

**本轮不追加任何 env**：不加 `APIPASS_API_KEY`、不加 `APIPASS_API_BASE`、不加 `MUSIC_PROVIDER`。项目 env 保持现状 4 个（`ACEDATA_API_KEY` / `ACEDATA_API_BASE` / `DEEPSEEK_API_KEY` / `DEEPSEEK_API_BASE`）。

如果 `src/lib/music-provider.ts` 有硬编码 provider 选择，直接写死 AceData 即可，不要读任何 env。

## 5. 数据库 schema

`songs` 表新增两列：

- `model_version` TEXT DEFAULT `'v5'`（记录该曲用哪个版本生成的，前端展示用）
- `provider` TEXT DEFAULT `'acedata'`（记录用了哪家 provider）

在项目现用的迁移目录写迁移文件（先看当前 `supabase/migrations/` 或 `sql/` 或 `src/lib/db.ts` 是怎么放的，跟随现有惯例），文件名类似 `add_model_version_and_provider_to_songs.sql`。同时更新任何 TypeScript 类型定义（`Database` / `Song` / `Work` 等）加上这两个字段。

**同时**：在生成成功入库时，把 `model_version`（用户请求的原值）和 `provider`（`'acedata'` 或 `'demo'`）写进去。演示模式下也要落库 `provider='demo'` + `model_version=用户选择值`。

## 6. 演示模式兼容

- 无 API Key 时（当前 AceData 余额已耗尽也算），仍能选版本
- Mock 数据里 `provider: 'demo'`、`model_version: 用户选择值`
- 前端 Toast：`演示模式：demo 未配置，返回示例数据`（或直接读接口返回的 provider 字段拼接）

## 7. 验证要求

完成开发后请给出：

1. **改动清单**：每个新增/修改文件一行说明
2. **新增文件路径确认**：至少列出 `src/lib/music-provider.ts` 和迁移 SQL 的完整路径
3. **curl 验证**：`curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5000/create` 应返回 200
4. **type check / lint 无错**（或说明剩余告警）
5. **不要执行部署**
6. **确认没有创建 `src/lib/apipass.ts`**、**没有引用 `APIPASS_*` 或 `MUSIC_PROVIDER` 任何 env**

---

请把所有改动一次性完成，最后统一汇报。
