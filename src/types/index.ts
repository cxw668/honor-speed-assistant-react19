export interface RouteItem {
  path: string
  element: React.ReactNode;
  label: string
}
/**
 * 王者荣耀英雄职业类型
 */
export type HeroType = '坦克' | '战士' | '刺客' | '辅助' | '射手' | '法师'

/**
 * 王者荣耀英雄信息完整TS接口
 * @params id 英雄唯一标识ID
 * @params heroName 英雄名称
 * @params heroType 英雄类型（严格匹配六大类）
 * @params corePosition 核心定位 (官方标准描述，贴合游戏内展示)
 * @params combatFeature 战斗特点 (详细描述，新手能看懂的大白话+核心特性)
 * @params difficulty 上手难度 1-5星 1=最易上手 5=最难
 * @params isNewbieRecommend 是否推荐新手使用)
 */
export interface HeroItem {
  id: number
  heroName: string
  heroType: string
  corePosition: string
  combatFeature: string
  difficulty: 1 | 2 | 3 | 4 | 5
  isNewbieRecommend: boolean
  avatar?: string
}
export interface Hero {
  id: number;
  name: string;
  avatar: string;
  type: string;
  difficulty: number;
  advantage: string;
  pitfall: string;
  skills: {
    name: string;
    desc: string;
    isCore: boolean;
  }[];
}
export const HeroTypeList = [
  { label: '坦克', value: '坦克' },
  { label: '战士', value: '战士' },
  { label: '刺客', value: '刺客' },
  { label: '辅助', value: '辅助' },
  { label: '射手', value: '射手' },
  { label: '法师', value: '法师' }
]
export interface HeroAvatarMap {
  hero: string
  hero_src: string
}