import { useState, useMemo } from 'react';
import { HeroTypeFilter } from '../components/business/HeroTypeFilter';
import { HeroList } from '../components/business/HeroList';
import { HeroDetailCard } from '../components/business/HeroDetailCard';
import { HeroSearch } from '../components/atomic/HeroSearch';
import { Dialog } from '../components/atomic/Dialog';
import { heroList, heroAvatarList } from '../mock/hero/index';
import type { HeroItem } from '../types';

const HERO_TYPES = [
  { id: 0, name: '全部' },
  { id: 3, name: '坦克' },
  { id: 1, name: '战士' },
  { id: 4, name: '刺客' },
  { id: 2, name: '法师' },
  { id: 5, name: '射手' },
  { id: 6, name: '辅助' }
];

export const HeroQueryPage = () => {
  const [selectedType, setSelectedType] = useState('全部');
  const [isNoviceOnly, setIsNoviceOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeroId, setSelectedHeroId] = useState<number | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 合并英雄数据与头像
  const heroesWithAvatars = useMemo(() => {
    // 将 Record<string, HeroItem[]> 展平为 HeroItem[]
    const allHeroes = Object.values(heroList).flat();
    return allHeroes.map(hero => {
      const avatarMap = heroAvatarList.find(a => a.hero === hero.heroName);
      return {
        ...hero,
        avatar: avatarMap?.hero_src
      };
    });
  }, []);

  // 使用 useMemo 缓存筛选后的英雄列表
  const filteredHeroes = useMemo(() => {
    return heroesWithAvatars.filter(hero => {
      const typeMatch = selectedType === '全部' || hero.heroType === selectedType;
      const noviceMatch = !isNoviceOnly || hero.isNewbieRecommend;
      const searchMatch = !searchQuery || hero.heroName.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && noviceMatch && searchMatch;
    });
  }, [heroesWithAvatars, selectedType, isNoviceOnly, searchQuery]);

  // 获取当前选中的英雄详情
  const selectedHero = useMemo(() => {
    return heroesWithAvatars.find(h => h.id === selectedHeroId);
  }, [heroesWithAvatars, selectedHeroId]);

  // 处理英雄选择
  const handleHeroSelect = (id: number) => {
    setSelectedHeroId(id);
    setIsDialogOpen(true);
  };

  // 计算英雄数量，以为英雄可能有多种职业，因此使用名称统计
  const totalList = filteredHeroes.reduce((acc, cur) => {
    (acc as Record<string, number>)[cur.heroName] = ((acc as Record<string, number>)[cur.heroName] || 0) + 1;
    return acc;
  }, {});
  const total = Object.values(totalList).flat().length;
  // 计算各类型的英雄数量统计
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      '全部': total,
      '坦克': heroList['坦克'].length,
      '战士': heroList['战士'].length,
      '刺客': heroList['刺客'].length,
      '辅助': heroList['辅助'].length,
      '射手': heroList['射手'].length,
      '法师': heroList['法师'].length,
    };

    return counts;
  }, [heroesWithAvatars]);

  return (
    <div className="page-container flex overflow-hidden mt-6 ml-4">
      {/* 左侧筛选区: 300px */}
      <div className="w-[300px] flex flex-col gap-module shrink-0 overflow-hidden">
        <div className="card h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="title">英雄速查</h2>
            <span className="text-[12px] bg-bg-page px-2 py-1 rounded-full text-text-secondary border border-border-light">
              共 {total} 位
            </span>
          </div>

          <div className="flex flex-col gap-6 pr-2 scrollbar-hide">
            <section>
              <h3 className="text-desc mb-2">快速搜索</h3>
              <HeroSearch value={searchQuery} onChange={setSearchQuery} />
            </section>

            <HeroTypeFilter
              types={HERO_TYPES}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              isNoviceOnly={isNoviceOnly}
              onNoviceToggle={setIsNoviceOnly}
              typeCounts={typeCounts}
            />
          </div>
        </div>
      </div>

      {/* 右侧内容区: 宽度 calc(100% - 320px) */}
      <div className="flex-1 min-w-0 flex flex-col gap-module overflow-hidden h-screen">
        <HeroList
          heroes={filteredHeroes}
          selectedHeroId={selectedHeroId}
          onHeroSelect={handleHeroSelect}
        />

      </div>
      {/* 英雄详情对话框 */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="英雄详情"
      >
        <HeroDetailCard hero={selectedHero} />
      </Dialog>
    </div>
  );
};

export default HeroQueryPage;
