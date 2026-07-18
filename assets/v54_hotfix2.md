# V5.4 Hotfix #2：is_instrumental 空歌词兜底缺失

## 症状
外网 curl 实测：
```
POST /api/generate-music
body: {"is_instrumental": true, "lyrics": "[钢琴独奏][温柔地]", ...}
→ HTTP 502
   {"ok":false,"error_type":"provider_error",
    "message":"MiniMax HTTP 400: \"invalid params, lyrics is required\""}
```

## 根因
`[钢琴独奏]` 内层 `钢琴独奏` 不完全匹配白名单/别名（别名是 `独奏`→solo，不匹配 `钢琴独奏`），所以被判为 description → 剔除；`[温柔地]` 同理剔除。最终 sanitized 变成空字符串。

原 spec 明确要求：
> **is_instrumental 兜底**：如果 `is_instrumental === true` 且 sanitized 为空字符串，塞占位 `[Instrumental]`（延续 V5.2 观察到的 MiniMax 需要非空 lyrics 的坑）

**当前 route.ts 没有这个兜底**，直接把空串传给 MiniMax → 上游 400 → 我们 502。

## 修复要求

### 1. `src/app/api/generate-music/route.ts`
在调用 `sanitizeLyrics(lyrics)` 拿到 `sanitizeResult` 之后、传给 provider 之前，加：

```ts
let lyricsForProvider = sanitizeResult.sanitized;
if (parsed.is_instrumental && lyricsForProvider.trim() === '') {
  lyricsForProvider = '[Instrumental]';
}
// 后续调 provider 用 lyricsForProvider
```

**同时**：`sanitized_lyrics` 响应字段依然返回 sanitize 原结果（不要变成 `[Instrumental]`，那是给上游用的），或者你也可以选择返回兜底后的字符串，只要行为一致、别炸即可。选一种保持一致就行，写清楚。

**推荐**（更清晰）：
- `sanitized_lyrics`: 净化后的原字符串（可能为空）
- provider 收到的：兜底后的字符串
- 响应额外新增 `lyricsForProvider` 字段？—— **不用**，别加新字段污染响应，只要行为对就行。

### 2. `src/lib/lyrics-sanitizer.ts`
**不用改**。sanitizer 保持纯净，兜底逻辑属于业务层（route.ts）。

### 3. 单测补 1 条
在 `scripts/test-lyrics-sanitizer.ts` 里追加 case：
```
input: '[钢琴独奏][温柔地]'
expected sanitized: '' (空字符串，trim 后)
expected removedCount: 2
expected samples: ['[钢琴独奏]', '[温柔地]']
```
验证：`钢琴独奏` **不**匹配 `独奏` 别名（只有内层完全等于 `独奏` 才走别名映射）。

## 验证（把每步 stdout 原样贴回）

### A. 单测
```bash
cd /workspace
pnpm tsx scripts/test-lyrics-sanitizer.ts 2>&1 | tail -30
```

### B. 沙箱内 curl 空歌词兜底
```bash
curl -sS -X POST http://localhost:5000/api/generate-music \
  -H "Content-Type: application/json" \
  --max-time 260 \
  -d '{"title":"纯乐器","description":"钢琴独奏","styles":["piano"],"lyrics":"[钢琴独奏][温柔地]","duration":30,"is_instrumental":true}' \
  -o /tmp/v54-instrumental.json -w 'HTTP=%{http_code} time=%{time_total}s\n'
python3 <<'PY'
import json
d = json.load(open('/tmp/v54-instrumental.json'))
print('top-level keys:', list(d.keys()))
print('lyricsSanitize:', json.dumps(d.get('lyricsSanitize'), ensure_ascii=False))
print('sanitized_lyrics:', repr(d.get('sanitized_lyrics')))
print('audioUrl:', (d.get('audioUrl') or '')[:80])
print('error:', d.get('error_type'), d.get('message'))
PY
```
**期望**：HTTP=200、`lyricsSanitize.removedCount === 2`、`removedSamples` 包含 `[钢琴独奏]` 和 `[温柔地]`、`audioUrl` 非空。

### C. 回归：原歌词场景不能因此崩
```bash
curl -sS -X POST http://localhost:5000/api/generate-music \
  -H "Content-Type: application/json" \
  --max-time 260 \
  -d '{"title":"回归测试","description":"抒情钢琴","styles":["ballad"],"lyrics":"[Verse]\n晚风吹过[温柔地]你的发梢\n[Chorus][钢琴独奏]\n[女声哼唱]我想为你唱首歌","duration":40,"is_instrumental":false}' \
  -o /tmp/v54-regression.json -w 'HTTP=%{http_code} time=%{time_total}s\n'
python3 -c "import json; d=json.load(open('/tmp/v54-regression.json')); print('lyricsSanitize:', json.dumps(d.get('lyricsSanitize'), ensure_ascii=False)); print('audioUrl:', (d.get('audioUrl') or '')[:80])"
```
**期望**：HTTP=200、removedCount=3。

## 回报
- 改的文件与行数
- A/B/C 全部原样 stdout
- 不许改 provider 层、不许改默认 provider、不许改 songs 表
