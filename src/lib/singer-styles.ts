export interface SingerStyle {
  id: string;
  name: string;
  nameEn: string;
  region: 'chinese' | 'western' | 'korean' | 'japanese';
  gender: 'male' | 'female';
  tags: string[];
  techniques: string[];
  description: string;
  representativeWorks?: string[];
}

// Re-export all regional data
export { chineseSingers } from './singers/chinese';
export { westernSingers } from './singers/western';
export { koreanSingers } from './singers/korean';
export { japaneseSingers } from './singers/japanese';

// Lazy-load all singers
let _allSingers: SingerStyle[] | null = null;

export function getAllSingers(): SingerStyle[] {
  if (!_allSingers) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { chineseSingers } = require('./singers/chinese');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { westernSingers } = require('./singers/western');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { koreanSingers } = require('./singers/korean');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { japaneseSingers } = require('./singers/japanese');
    _allSingers = [...chineseSingers, ...westernSingers, ...koreanSingers, ...japaneseSingers];
  }
  return _allSingers;
}

// For backward compatibility - static import
import { chineseSingers } from './singers/chinese';
import { westernSingers } from './singers/western';
import { koreanSingers } from './singers/korean';
import { japaneseSingers } from './singers/japanese';

export const singerStyles: SingerStyle[] = [
  ...chineseSingers,
  ...westernSingers,
  ...koreanSingers,
  ...japaneseSingers,
];

export const techniqueCategories = {
  vocal: ['高音', '中音', '低音', '假声', '气声', '胸声', '头声'],
  style: ['R&B转音', '颤音', '嘶吼', '耳语', '叙事', '说唱式'],
  emotion: ['情感爆发', '情感细腻', '情感内敛', '情感张力'],
  special: ['海豚音', '花腔', 'loop', 'ASMR感', '氛围感'],
};

export function getSingersByRegion(region: SingerStyle['region']): SingerStyle[] {
  return singerStyles.filter((s) => s.region === region);
}

export function getSingersByGender(gender: SingerStyle['gender']): SingerStyle[] {
  return singerStyles.filter((s) => s.gender === gender);
}

export function searchSingers(query: string): SingerStyle[] {
  const lowerQuery = query.toLowerCase();
  return singerStyles.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.nameEn.toLowerCase().includes(lowerQuery) ||
      s.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
      s.techniques.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}
