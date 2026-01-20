import { useState, useMemo } from 'react';
import { HeroTypeFilter } from '../components/business/HeroTypeFilter';
import { HeroList } from '../components/business/HeroList';
import { HeroDetailCard } from '../components/business/HeroDetailCard';
import { HeroSearch } from '../components/atomic/HeroSearch';
import { Dialog } from '../components/atomic/Dialog';
import { useHeroData } from '../hooks/useHeroData';

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
  const { heroList: allHeroes } = useHeroData();
  const [selectedType, setSelectedType] = useState('全部');
  const [isNoviceOnly, setIsNoviceOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHeroId, setSelectedHeroId] = useState<number | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 使用 useMemo 缓存筛选后的英雄列表
  const filteredHeroes = useMemo(() => {
    return allHeroes.filter(hero => {
      const typeMatch = selectedType === '全部' || hero.heroTypes.includes(selectedType);
      const noviceMatch = !isNoviceOnly || hero.isNewbieRecommend;
      const searchMatch = !searchQuery || hero.heroName.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && noviceMatch && searchMatch;
    });
  }, [allHeroes, selectedType, isNoviceOnly, searchQuery]);

  // 获取当前选中的英雄详情
  const selectedHero = useMemo(() => {
    return allHeroes.find(h => h.id === selectedHeroId);
  }, [allHeroes, selectedHeroId]);

  // 处理英雄选择
  const handleHeroSelect = (id: number) => {
    setSelectedHeroId(id);
    setIsDialogOpen(true);
  };

  // 计算英雄数量
  const total = filteredHeroes.length;

  // 计算各类型的英雄数量统计
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      '全部': allHeroes.length,
      '坦克': allHeroes.filter(h => h.heroTypes.includes('坦克')).length,
      '战士': allHeroes.filter(h => h.heroTypes.includes('战士')).length,
      '刺客': allHeroes.filter(h => h.heroTypes.includes('刺客')).length,
      '辅助': allHeroes.filter(h => h.heroTypes.includes('辅助')).length,
      '射手': allHeroes.filter(h => h.heroTypes.includes('射手')).length,
      '法师': allHeroes.filter(h => h.heroTypes.includes('法师')).length,
    };

    return counts;
  }, [allHeroes]);

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
