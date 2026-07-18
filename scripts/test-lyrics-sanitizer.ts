/**
 * Lyrics Sanitizer 单元测试
 * 运行: npx tsx scripts/test-lyrics-sanitizer.ts
 */

import { sanitizeLyrics, analyzeLyrics, isStructureTag } from '../src/lib/lyrics-sanitizer';

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
  assertEqual(result.sanitized, input, '结构标签和文本完整保留');
  assertEqual(result.removedCount, 0, '无描述词被剔除');
  assertEqual(result.removedSamples, [], 'removedSamples 为空');
}

console.log('\n=== Test 2: 描述词被剔除 ===');
{
  const input = `[Verse]
Hello world
[温柔地]
[Chorus]
La la la
[钢琴伴奏]`;
  const result = sanitizeLyrics(input);
  assertEqual(result.removedCount, 2, '2个描述词被剔除');
  assertEqual(result.removedSamples, ['[温柔地]', '[钢琴伴奏]'], 'removedSamples 正确');
  assertEqual(result.sanitized.includes('[温柔地]'), false, 'sanitized 不含 [温柔地]');
  assertEqual(result.sanitized.includes('[钢琴伴奏]'), false, 'sanitized 不含 [钢琴伴奏]');
  assertEqual(result.sanitized.includes('[Verse]'), true, 'sanitized 保留 [Verse]');
  assertEqual(result.sanitized.includes('[Chorus]'), true, 'sanitized 保留 [Chorus]');
}

console.log('\n=== Test 3: 中文别名 ===');
{
  const input = `[主歌]
第一句歌词
[副歌]
副歌歌词
[前奏]
[间奏]
[尾奏]`;
  const result = sanitizeLyrics(input);
  assertEqual(result.removedCount, 0, '中文结构标签全部保留');
  assertEqual(result.sanitized.includes('[主歌]'), true, '保留 [主歌]');
  assertEqual(result.sanitized.includes('[副歌]'), true, '保留 [副歌]');
  assertEqual(result.sanitized.includes('[前奏]'), true, '保留 [前奏]');
  assertEqual(result.sanitized.includes('[间奏]'), true, '保留 [间奏]');
  assertEqual(result.sanitized.includes('[尾奏]'), true, '保留 [尾奏]');
}

console.log('\n=== Test 4: 嵌套方括号 ===');
{
  const input = `[Verse [温柔地] 1]
Hello world`;
  const result = sanitizeLyrics(input);
  // 最外层 [Verse [温柔地] 1] 被当作一个整体
  // 内部 "Verse [温柔地] 1" 不是结构标签（因为包含 [温柔地]）
  // 所以整个被当作描述词剔除
  assertEqual(result.removedCount, 1, '嵌套方括号整体被当作描述词');
}

console.log('\n=== Test 5: 未闭合方括号 ===');
{
  const input = `[Verse
Hello world
[Chorus]
La la la`;
  const result = sanitizeLyrics(input);
  // 第一个 [Verse 未闭合，视为普通文本
  // [Chorus] 是结构标签，保留
  assertEqual(result.sanitized.includes('[Verse'), true, '未闭合的 [Verse 作为文本保留');
  assertEqual(result.sanitized.includes('[Chorus]'), true, '[Chorus] 作为结构标签保留');
}

console.log('\n=== Test 6: 空输入 ===');
{
  const result = sanitizeLyrics('');
  assertEqual(result.sanitized, '', '空输入返回空字符串');
  assertEqual(result.segments, [], '空输入 segments 为空');
  assertEqual(result.removedCount, 0, '空输入 removedCount 为 0');
}

console.log('\n=== Test 7: 纯文本无方括号 ===');
{
  const input = 'Just some plain text\nNo brackets here';
  const result = sanitizeLyrics(input);
  assertEqual(result.sanitized, input, '纯文本完整保留');
  assertEqual(result.removedCount, 0, '无描述词被剔除');
}

console.log('\n=== Test 8: isStructureTag 边界测试 ===');
{
  // 结构标签
  assertEqual(isStructureTag('Verse'), true, 'Verse 是结构标签');
  assertEqual(isStructureTag('verse'), true, 'verse 是结构标签');
  assertEqual(isStructureTag('VERSE'), true, 'VERSE 是结构标签');
  assertEqual(isStructureTag('Verse 1'), true, 'Verse 1 是结构标签');
  assertEqual(isStructureTag('Chorus2'), true, 'Chorus2 是结构标签');
  assertEqual(isStructureTag('主歌'), true, '主歌 是结构标签');
  assertEqual(isStructureTag('副歌 1'), true, '副歌 1 是结构标签');
  
  // 描述词
  assertEqual(isStructureTag('温柔地'), false, '温柔地 不是结构标签');
  assertEqual(isStructureTag('钢琴伴奏'), false, '钢琴伴奏 不是结构标签');
  assertEqual(isStructureTag('女声哼唱'), false, '女声哼唱 不是结构标签');
  assertEqual(isStructureTag('高潮部分'), false, '高潮部分 不是结构标签');
  assertEqual(isStructureTag('渐强'), false, '渐强 不是结构标签');
}

console.log('\n=== Test 9: 复杂混合场景 ===');
{
  const input = `[Intro]
[钢琴独奏]
[Verse 1]
月光洒在窗前
[温柔地]
思念化成诗篇
[Chorus]
[高潮部分]
爱你的心不变
[渐强]
直到永远`;
  const result = sanitizeLyrics(input);
  // 保留: [Intro], [Verse 1], [Chorus]
  // 剔除: [钢琴独奏], [温柔地], [高潮部分], [渐强]
  assertEqual(result.removedCount, 4, '4个描述词被剔除');
  assertEqual(result.sanitized.includes('[Intro]'), true, '保留 [Intro]');
  assertEqual(result.sanitized.includes('[Verse 1]'), true, '保留 [Verse 1]');
  assertEqual(result.sanitized.includes('[Chorus]'), true, '保留 [Chorus]');
  assertEqual(result.sanitized.includes('[钢琴独奏]'), false, '剔除 [钢琴独奏]');
  assertEqual(result.sanitized.includes('[温柔地]'), false, '剔除 [温柔地]');
  assertEqual(result.sanitized.includes('[高潮部分]'), false, '剔除 [高潮部分]');
  assertEqual(result.sanitized.includes('[渐强]'), false, '剔除 [渐强]');
}

console.log('\n=== Test 10: segments 结构验证 ===');
{
  const input = '[Verse]\nHello\n[温柔地]';
  const result = analyzeLyrics(input);
  assertEqual(result.length, 3, '3个segments');
  assertEqual(result[0].type, 'structure', '第1个是structure');
  assertEqual(result[0].content, 'Verse', '第1个content是Verse');
  assertEqual(result[1].type, 'text', '第2个是text');
  assertEqual(result[1].content, '\nHello\n', '第2个content是\\nHello\\n');
  assertEqual(result[2].type, 'description', '第3个是description');
  assertEqual(result[2].content, '温柔地', '第3个content是温柔地');
  assertEqual(result[2].raw, '[温柔地]', '第3个raw是[温柔地]');
}

console.log(`\n========================================`);
console.log(`Total: ${passed + failed} tests`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`========================================\n`);

process.exit(failed > 0 ? 1 : 0);
