# V5.4 Hotfix：修正接口契约与净化计数 bug

## 现状（外网 curl 实测）
POST /api/generate-music 返回：
```
{
  "sanitized_lyrics": "[Verse]\n晚风吹过你的发梢\n[Chorus]\n我想为你唱首歌",
  "lyrics_analysis": {
    "segments": [ {type:"structure"...}, {type:"text"...}, {type:"structure"...}, {type:"text"...} ],
    "removedCount": 0,
    "removedSamples": []
  }
}
```

## 问题
### 问题 1（关键 bug）
`sanitized_lyrics` 字符串已经正确剥离了 `[温柔地]` `[钢琴独奏]` `[女声哼唱]`，说明净化逻辑本身能工作。**但**：
- `removedCount = 0`（应为 3）
- `removedSamples = []`（应包含 `[温柔地]`、`[钢琴独奏]`、`[女声哼唱]`）
- `segments` 数组里没有任何 `type: "description"` 的段（应有 3 个）

**根因猜测**：`sanitizeLyrics` 生成 `sanitized` 字符串时正确跳过了 description 片段，但没把这些片段作为 `description` 类型 push 到 `segments` 数组里，导致 `removedCount = segments.filter(s => s.type === 'description').length = 0`。

### 问题 2（接口契约不符）
原需求指定响应字段是：
```
lyricsSanitize: { removedCount, removedSamples }
```
但当前实现使用了 `sanitized_lyrics` + `lyrics_analysis`。前端上游依赖的是 spec 里的驼峰命名。

## 修复要求

### 1. 修复 `src/lib/lyrics-sanitizer.ts`
- `analyzeLyrics` 必须完整返回**三种类型**的段：`text`、`structure`、`description`。每个 `[...]` 都要产出一个 segment（structure 或 description），中间的普通文本也要产出 text 段。
- `sanitizeLyrics` 内部要：
  1. 调 `analyzeLyrics` 得到全 segments（含 description）
  2. `sanitized` = 拼接 text 段和 structure 段的 raw
  3. `removedCount` = segments.filter(s => s.type === 'description').length
  4. `removedSamples` = segments.filter(s => s.type === 'description').slice(0,5).map(s => s.raw)
- **补充单测**：在原 case 3（`[温柔地]我爱你[停顿][钢琴独奏]`）里 assert `segments` 里恰好有 3 个 `type === 'description'`；case 4 里 assert 恰好 2 个 description、2 个 structure。

### 2. 修复 `src/app/api/generate-music/route.ts` 响应字段
- **保留** provider 拿到的 sanitized 字符串正常传给上游（这块已经对）
- 响应体在原有字段基础上，**额外**新增一个键：
  ```
  lyricsSanitize: {
    removedCount: result.removedCount,
    removedSamples: result.removedSamples
  }
  ```
- 已有的 `sanitized_lyrics` / `lyrics_analysis` **可以保留**（前端已经在读），做**双写兼容**，但 `lyricsSanitize` 必须存在
- is_instrumental === true 且 sanitized 为空 → 塞 `[Instrumental]` 的兜底逻辑保留

### 3. 修复前端 `src/app/create/page.tsx`
- 「结构分析条」用 `analyzeLyrics` 计算：
  - `structureCount = segments.filter(s => s.type === 'structure').length`
  - `descriptionCount = segments.filter(s => s.type === 'description').length`
  - 显示 `✅ 保留 X 处结构标签  ✂️ 将净化 Y 处描述词`
- 生成成功后 Toast：读 `resp.lyricsSanitize.removedCount`（新字段）**兜底** `resp.lyrics_analysis?.removedCount`（老字段）。这样即使字段迁移期也不炸。

## 验证（把每步 stdout 原样贴回）

### A. 单测
```bash
cd /workspace
if [ -f src/lib/__tests__/lyrics-sanitizer.test.ts ] && pnpm -s ls vitest >/dev/null 2>&1; then
  pnpm exec vitest run src/lib/__tests__/lyrics-sanitizer.test.ts 2>&1 | tail -60
else
  pnpm tsx scripts/test-lyrics-sanitizer.ts 2>&1 | tail -80
fi
```

### B. 直调 sanitizer 验证 removedCount / segments
```bash
cat > /tmp/verify-v54-hotfix.ts <<'EOF'
import { sanitizeLyrics, analyzeLyrics } from '../workspace/src/lib/lyrics-sanitizer';
const cases: Array<[string, string]> = [
  ['case3','[温柔地]我爱你[停顿][钢琴独奏]'],
  ['case4','[Verse 1]\n[女声轻柔]晚风吹过[Chorus]\n[激情]为你歌唱'],
  ['e2e','[Verse]\n晚风吹过[温柔地]你的发梢\n[Chorus][钢琴独奏]\n[女声哼唱]我想为你唱首歌'],
];
for (const [name, inp] of cases) {
  const r = sanitizeLyrics(inp);
  const segs = analyzeLyrics(inp);
  const structure = segs.filter(s => s.type === 'structure').length;
  const description = segs.filter(s => s.type === 'description').length;
  console.log(`[${name}] sanitized=${JSON.stringify(r.sanitized)}`);
  console.log(`[${name}] removedCount=${r.removedCount} samples=${JSON.stringify(r.removedSamples)}`);
  console.log(`[${name}] segments: text=${segs.filter(s=>s.type==='text').length}, structure=${structure}, description=${description}`);
  console.log('---');
}
EOF
cd /workspace && pnpm tsx /tmp/verify-v54-hotfix.ts 2>&1
```
**期望**：case3 removedCount=3、samples=["[温柔地]","[停顿]","[钢琴独奏]"]、segments.description=3；case4 description=2、structure=2；e2e description=3、structure=2。

### C. 沙箱内 curl 验证响应字段
```bash
curl -sS -X POST http://localhost:5000/api/generate-music \
  -H "Content-Type: application/json" \
  --max-time 260 \
  -d '{"title":"净化测试","description":"抒情钢琴","styles":["ballad","piano"],"lyrics":"[Verse]\n晚风吹过[温柔地]你的发梢\n[Chorus][钢琴独奏]\n[女声哼唱]我想为你唱首歌","duration":40,"is_instrumental":false}' \
  -o /tmp/v54-hotfix.json -w 'HTTP=%{http_code} time=%{time_total}s size=%{size_download}\n'
python3 <<'PY'
import json
d = json.load(open('/tmp/v54-hotfix.json'))
print('--- top-level keys ---')
print(list(d.keys()))
print('--- lyricsSanitize ---')
print(json.dumps(d.get('lyricsSanitize'), ensure_ascii=False, indent=2))
print('--- lyrics_analysis (legacy, if kept) ---')
print(json.dumps(d.get('lyrics_analysis'), ensure_ascii=False, indent=2)[:300])
print('--- sanitized_lyrics (legacy, if kept) ---')
print(d.get('sanitized_lyrics'))
def find(obj):
    if isinstance(obj,dict):
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
print('--- audio_url head 60 ---')
print(find(d)[:60])
PY
```
**期望**：`lyricsSanitize.removedCount === 3`，`lyricsSanitize.removedSamples` 恰好三条含方括号。

## 交付回报
- 单测 PASS/FAIL 计数
- 步骤 B 的完整 stdout（case3 / case4 / e2e 三行 segments 数字）
- 步骤 C 的完整 stdout（top-level keys / lyricsSanitize / audio_url）
- 修改的文件与行数

**不许**改 provider 层、不许改 songs 表、不许改默认 provider。**保留** V5.3 的 240s 超时。
