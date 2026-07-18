# Melo Music V5.4 · 歌词精准控制（方括号净化）

## 背景
- 项目根：`/workspace/`
- dev server：`pnpm tsx watch src/server.ts`，端口 **5000**，`tsx watch` 会自动 reload，**无需重启**
- 默认 provider：`minimax`（`src/lib/minimax.ts`），走 dmxapi.cn/v1/responses，model:music-2.0
- V5.3 已把 MiniMax AbortController 从 120s 放宽到 240s
- V5.4 目标：让上游模型 **100% 不演唱** 歌词里方括号包裹的**描述词/演唱指示**（如 `[温柔地]` `[钢琴独奏]` `[停顿]` `[女声哼唱]`），同时**保留结构标签**（`[Verse]` `[Chorus]` 等）；前端给即时反馈，后端在发给 provider 前净化。

---

## 交付范围（严格执行，不要过度设计）

### 1) 新建 `src/lib/lyrics-sanitizer.ts`

纯函数模块，**无副作用、无外部依赖**。必须导出：

```ts
export const STRUCTURE_TAG_WHITELIST: readonly string[] = [
  'verse', 'chorus', 'bridge', 'intro', 'outro',
  'instrumental', 'hook', 'pre-chorus', 'interlude',
  'refrain', 'break', 'solo', 'ad-lib', 'end'
];

export interface LyricsSegment {
  type: 'text' | 'structure' | 'description';
  content: string;         // 不含方括号
  raw: string;             // 包含方括号的原始片段（结构/描述用）
  start: number;           // 在原字符串中的起始位置
  end: number;             // 结束位置
}

export interface SanitizeResult {
  sanitized: string;        // 净化后可直接发给上游的 lyrics
  segments: LyricsSegment[];// 用于前端高亮渲染
  removedCount: number;     // 被净化剔除的描述词数量
  removedSamples: string[]; // 被剔除内容前 5 条 raw 样例
}

export function analyzeLyrics(input: string): LyricsSegment[];
export function sanitizeLyrics(input: string): SanitizeResult;
export function isStructureTag(inner: string): boolean;
```

**判断规则**（对 `[...]` 里的内层字符串 inner）：
1. 去两侧空格 + 转小写
2. 允许尾部数字 / 空格 + 数字 / 中文数字（如 `Verse 1`、`Chorus 2`、`副歌 1` 都算白名单）
3. 允许中文别名映射：
   - `主歌`→verse、`副歌`→chorus、`前奏`→intro、`尾奏`→outro
   - `过渡`→bridge、`间奏`→interlude、`纯音乐`→instrumental、`独奏`→solo
4. 完全匹配白名单前缀或中文别名 → `structure`（**保留原文**，不做 zh→en 映射）
5. 否则 → `description`（被净化剔除）

**边界规则**：
- 嵌套 `[a[b]c]`：按最外层匹配，若最外层不是白名单则整体剔除
- 未闭合 `[Verse\n Hello`：视为普通文本，不处理
- 保留 emoji / 中文标点 / 换行符位置（sanitized 中普通文本原样保留）
- 空字符串 → `sanitized:''`, `removedCount:0`, `segments:[]`
- `sanitized` 生成规则：`text` 片段原样保留、`structure` 片段用 `raw`（含方括号）保留、`description` 片段丢弃。可能出现相邻空白，**不要 trim 内部**，但**首尾可以 trim**（避免头尾多余空白）；如果最终为空字符串就返回 `''`

**必须写单测**：新建 `src/lib/__tests__/lyrics-sanitizer.test.ts`（如果项目没有 vitest/jest，就新建 `scripts/test-lyrics-sanitizer.ts`，可以 `pnpm tsx scripts/test-lyrics-sanitizer.ts` 直接跑，跑完打印 `PASSED: X, FAILED: Y` 统计并在 FAIL 时 `process.exit(1)`）。

覆盖以下 case（**每条都要**）：
1. 空字符串 → sanitized:'', removedCount:0
2. `[Verse]\nHello\n[Chorus]\nWorld` → 全保留，removedCount:0
3. `[温柔地]我爱你[停顿][钢琴独奏]` → sanitized:'我爱你', removedCount:3, removedSamples 包含 `[温柔地]`、`[停顿]`、`[钢琴独奏]`
4. `[Verse 1]\n[女声轻柔]晚风吹过[Chorus]\n[激情]为你歌唱` → 保留 `[Verse 1]`、`[Chorus]`，剥离 `[女声轻柔]`、`[激情]`
5. `[主歌]今晚的月色真美[副歌]我想为你唱一首歌` → 主歌/副歌识别为 structure 保留原文
6. 嵌套 `[a[b]c]` → 按最外层匹配，非白名单整体剔除
7. 未闭合 `[Verse\n Hello` → 视为普通文本不处理
8. 保留 emoji / 中文标点 / 换行符位置

### 2) 修改 `src/app/api/generate-music/route.ts`

- 在 zod 校验通过后、调 provider 之前，`import { sanitizeLyrics } from '@/lib/lyrics-sanitizer'`（或对应相对路径）并调用
- 用 `sanitized` 替代原 `lyrics` 传给 provider
- 响应体额外返回 `lyricsSanitize: { removedCount, removedSamples }`（不影响原有字段）
- **is_instrumental 兜底**：如果 `is_instrumental === true` 且 sanitized 为空字符串，塞占位 `[Instrumental]`（延续 V5.2 观察到的 MiniMax 需要非空 lyrics 的坑）
- **保留原有** zod 校验、provider 工厂、错误处理逻辑，**不动**其它字段

### 3) 修改 `src/app/create/page.tsx`（歌词编辑器）

**a) 歌词输入框上方或下方新增「结构分析条」**
- 使用 `analyzeLyrics` 对 lyrics 实时分析（受控组件，onChange 时 debounce 200ms 后重算，避免每键盘一次卡顿）
- 显示：`✅ 保留 N 处结构标签  ✂️ 将净化 M 处描述词`
- 点击/hover「M 处描述词」展开详情浮层：列出被剔除的每一条 raw 内容（前 10 条足够）

**b) 生成成功后的 Toast/卡片下方**
- 如果响应带 `lyricsSanitize.removedCount > 0`，展示提示：`已智能净化 N 处描述词，仅演唱正文内容`
- 悬浮/点击展开：显示 `removedSamples` 前 5 条示例

**明确不要做**：富文本高亮（紫色胶囊、灰色删除线的 contentEditable/prosemirror 方案）**不做**，用「分析条 + 详情浮层」代替。也不动 tab 切换 / 风格标签 / 时长滑块。

### 4) 兼容性
- 老前端不传净化字段也能用（后端 sanitize 无感生效）
- 新响应字段是可选，前端读不到就当没有

---

## 红线（严禁触碰）
- 禁止 `rm -rf` 任何目录、禁止 `coze code project delete`
- 禁止修改 provider 默认值（保持 `minimax`）
- 禁止改 songs 表结构
- 禁止动 `.skills` 目录
- 不动 provider 层、不动请求 schema 已有字段、不动 tab UI

---

## 验证清单（依次执行，把每步 stdout 原样回给我，**不要省略**）

### A. 单元测试
```bash
cd /workspace
# 优先 vitest（如项目已装），否则 tsx 跑 scripts/
if [ -f src/lib/__tests__/lyrics-sanitizer.test.ts ] && pnpm -s ls vitest >/dev/null 2>&1; then
  pnpm exec vitest run src/lib/__tests__/lyrics-sanitizer.test.ts
else
  pnpm tsx scripts/test-lyrics-sanitizer.ts
fi
```
必须 **全 PASS**（FAIL 计数 = 0），否则修完再回。

### B. 沙箱内 curl
```bash
curl -sS -X POST http://localhost:5000/api/generate-music \
  -H "Content-Type: application/json" \
  --max-time 260 \
  -d '{"title":"净化测试","description":"抒情钢琴","styles":["ballad","piano"],"lyrics":"[Verse]\n晚风吹过[温柔地]你的发梢\n[Chorus][钢琴独奏]\n[女声哼唱]我想为你唱首歌","duration":40,"is_instrumental":false}' \
  -o /tmp/melo-v54.json -w 'HTTP=%{http_code} time=%{time_total}s size=%{size_download}\n'
echo '--- lyricsSanitize ---'
python3 -c "import json; d=json.load(open('/tmp/melo-v54.json')); print(json.dumps(d.get('lyricsSanitize'), ensure_ascii=False, indent=2))"
echo '--- audio_url head 60 ---'
python3 -c "
import json
d=json.load(open('/tmp/melo-v54.json'))
def find(obj):
    if isinstance(obj, dict):
        for k in ('audio_url','audioUrl','url'):
            v=obj.get(k)
            if isinstance(v,str) and v.startswith('http'): return v
        for v in obj.values():
            r=find(v)
            if r: return r
    elif isinstance(obj,list):
        for v in obj:
            r=find(v)
            if r: return r
    return ''
u=find(d); print(u[:60] if u else '(no url)')
"
```
**期望**：HTTP=200，`lyricsSanitize.removedCount === 3`，`removedSamples` 中包含 `[温柔地]`、`[钢琴独奏]`、`[女声哼唱]`。

### C. 结构标签保留验证（后端）
```bash
# 只看 sanitized 后台如何：拆一个直接调 sanitizer 的 tsx 脚本
cat > /tmp/verify-sanitize.ts <<'EOF'
import { sanitizeLyrics } from '../workspace/src/lib/lyrics-sanitizer';
const cases = [
  '',
  '[Verse]\nHello\n[Chorus]\nWorld',
  '[温柔地]我爱你[停顿][钢琴独奏]',
  '[Verse 1]\n[女声轻柔]晚风吹过[Chorus]\n[激情]为你歌唱',
  '[主歌]今晚的月色真美[副歌]我想为你唱一首歌',
  '[a[b]c]中间',
  '[Verse\n Hello'
];
for (const c of cases) {
  const r = sanitizeLyrics(c);
  console.log('INPUT :', JSON.stringify(c));
  console.log('OUT   :', JSON.stringify(r.sanitized));
  console.log('rm    :', r.removedCount, 'samples:', r.removedSamples);
  console.log('---');
}
EOF
cd /workspace && pnpm tsx /tmp/verify-sanitize.ts
```
把每条 OUT 都贴回来。

### D. 观察日志（确认 tsx watch 已 reload）
```bash
tail -n 20 /workspace/dev-server.log 2>/dev/null || tail -n 20 /tmp/dev-server.log 2>/dev/null || echo 'no dev-server.log'
```

---

## 沉淀（可选，如果时间还够）
把关键要点写进 `/workspace/V54_NOTES.md`：
- 白名单列表
- 中文别名映射
- is_instrumental 空歌词占位坑
- sanitizer 与 provider 层的调用点

---

## 交付回报格式

请在最后总结：
1. **改动文件清单**：新增（含行数） / 修改（含函数名或行号）
2. **单测结果**：PASS/FAIL 计数
3. **沙箱内 curl 结果**：HTTP、`lyricsSanitize` JSON、audio_url 前 60 字符
4. **sanitizer 直调结果**（步骤 C 全部输出）
5. **已知遗留问题 / 未来 V5.5 建议**（如观察到 MiniMax 是否吃 `[Verse]` 结构标签、中文别名是否需要转英文等）

**注意**：验证过程中如遇到 `refs/heads/main does not exist` / vefaas `instance_not_found`，是沙箱冷启动，`coze code preview` 一下再试；如遇到 `dev server 未起` 就 `nohup env MUSIC_PROVIDER=minimax pnpm tsx watch src/server.ts > /workspace/dev-server.log 2>&1 &`。
