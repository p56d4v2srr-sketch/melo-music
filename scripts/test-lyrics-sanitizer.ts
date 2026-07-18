/**
 * Lyrics Sanitizer 单元测试
 * 运行: npx tsx scripts/test-lyrics-sanitizer.ts
 */

import { sanitizeLyrics, analyzeLyrics } from '../src/lib/lyrics-sanitizer';

let passed = 0;
let failed = 0;

function assertEqual(actual: unknown, expected: unknown, name: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr === expectedStr) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    console.log(`    expected: ${expectedStr}`);
    console.log(`    actual:   ${actualStr}`);
    failed++;
  }
}

console.log('\n=== Test 1: 简单结构标签保留 ===');
{
  const input = `[Verse]
Hello world
[Chorus]
La la la`;
  const result = sanitizeLyrics(input);
  assertEqual(result.cleaned, input, 'cleaned 等于原始输入');
  assertEqual(result.structureTagCount, 2, '识别到 2 个标签');
  assertEqual(result.bracketTags, ['[Verse]', '[Chorus]'], '标签列表正确');
}

console.log('\n=== Test 2: 配器描述标签保留 ===');
{
  const input = `[Verse]
Hello world
[Instrumental 晨间鸟鸣 远处钟声 风铃轻摇]
[Chorus]
La la la`;
  const result = sanitizeLyrics(input);
  assertEqual(result.cleaned, input, 'cleaned 等于原始输入，配器描述完整保留');
  assertEqual(result.structureTagCount, 3, '识别到 3 个标签');
  assertEqual(result.bracketTags.includes('[Instrumental 晨间鸟鸣 远处钟声 风铃轻摇]'), true, '配器描述标签在列表中');
}

console.log('\n=== Test 3: 混合标签保留 ===');
{
  const input = `[Chorus Outro 渐弱]
风吹过原野
[Intro]
阳光洒落`;
  const result = sanitizeLyrics(input);
  assertEqual(result.cleaned, input, 'cleaned 等于原始输入');
  assertEqual(result.structureTagCount, 2, '识别到 2 个标签');
  assertEqual(result.bracketTags, ['[Chorus Outro 渐弱]', '[Intro]'], '标签列表正确');
}

console.log('\n=== Test 4: 空输入 ===');
{
  const result = sanitizeLyrics('');
  assertEqual(result.cleaned, '', 'cleaned 为空字符串');
  assertEqual(result.structureTagCount, 0, '无标签');
  assertEqual(result.bracketTags, [], '标签列表为空');
  assertEqual(result.totalLines, 0, '总行数为 0');
}

console.log('\n=== Test 5: 纯文本无标签 ===');
{
  const input = `风吹过原野
阳光洒落大地`;
  const result = sanitizeLyrics(input);
  assertEqual(result.cleaned, input, 'cleaned 等于原始输入');
  assertEqual(result.structureTagCount, 0, '无标签');
  assertEqual(result.bracketTags, [], '标签列表为空');
  assertEqual(result.totalLines, 2, '总行数为 2');
}

console.log('\n=== Test 6: analyzeLyrics 别名 ===');
{
  const input = `[Verse]
Test lyrics`;
  const result = analyzeLyrics(input);
  assertEqual(result.cleaned, input, 'analyzeLyrics 返回 cleaned 等于输入');
  assertEqual(result.structureTagCount, 1, 'analyzeLyrics 识别到 1 个标签');
}

console.log('\n=== Test 7: 所有标准结构标签 ===');
{
  const input = `[Verse]
[Chorus]
[Bridge]
[Intro]
[Outro]
[Pre-Chorus]
[Hook]
[Interlude]
[Solo]
[Break]
[Refrain]`;
  const result = sanitizeLyrics(input);
  assertEqual(result.structureTagCount, 11, '识别到 11 个标准结构标签');
  assertEqual(result.cleaned, input, '所有标签原样保留');
}

console.log('\n=== Test 8: null/undefined 输入 ===');
{
  const result1 = sanitizeLyrics(null as unknown as string);
  assertEqual(result1.cleaned, '', 'null 输入返回空字符串');
  
  const result2 = sanitizeLyrics(undefined as unknown as string);
  assertEqual(result2.cleaned, '', 'undefined 输入返回空字符串');
}

console.log('\n=== Test 9: totalLines 计算 ===');
{
  const input = `[Verse]

Hello world

[Chorus]

La la la
`;
  const result = sanitizeLyrics(input);
  assertEqual(result.totalLines, 4, '非空行数为 4（忽略空行）');
}

console.log('\n=== Summary ===');
console.log(`Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
}
