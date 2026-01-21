import { useMemo } from 'react';
import { heroList, heroAvatarList } from '../mock/hero/index';
import type { HeroItem } from '../types';

export interface HeroWithClasses extends Omit<HeroItem, 'heroType'> {
  heroTypes: string[];
  heroSrc: string;
}

/**
 * 自定义 Hook：处理英雄列表数据
 * 1. 去除重复英雄（如亚瑟同时在坦克和战士列表中）
 * 2. 合并多职业英雄（如元流之子的不同职业形态合并为同一个英雄项）
 * 3. 关联英雄头像数据
 */
export const useHeroData = () => {
  const processedHeroList = useMemo(() => {
    const heroMap = new Map<string, HeroWithClasses>();

    // 获取所有英雄数据并拍平
    const allRawHeroes = Object.values(heroList).flat();

    allRawHeroes.forEach((hero) => {
      // 处理英雄名称，提取基础名称（去除括号及其内容，如 "元流之子(坦克)" -> "元流之子"）
      const baseName = hero.heroName.replace(/\(.*\)/, '').trim();
      
      if (heroMap.has(baseName)) {
        // 如果已存在，合并职业
        const existingHero = heroMap.get(baseName)!;
        if (!existingHero.heroTypes.includes(hero.heroType)) {
          existingHero.heroTypes.push(hero.heroType);
        }
      } else {
        // 如果不存在，创建新条目
        // 查找头像，优先使用原始名称查找，找不到再用基础名称查找
        const avatarInfo = heroAvatarList.find(a => a.hero === hero.heroName) || 
                          heroAvatarList.find(a => a.hero === baseName);

        heroMap.set(baseName, {
          ...hero,
          heroName: baseName, // 统一使用基础名称
          heroTypes: [hero.heroType],
          heroSrc: avatarInfo?.hero_src || ''
        });
      }
    });

    return Array.from(heroMap.values());
  }, []);

  return useMemo(() => ({
    heroList: processedHeroList,
    // 提供一个按职业过滤的方法
    getHeroesByType: (type: string) => {
      if (type === '全部') return processedHeroList;
      return processedHeroList.filter(hero => hero.heroTypes.includes(type));
    }
  }), [processedHeroList]);
};
