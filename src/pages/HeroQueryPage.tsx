import { Users } from 'lucide-react';
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
    const baseHeroes = allHeroes.filter(h => {
      const noviceMatch = !isNoviceOnly || h.isNewbieRecommend;
      const searchMatch = !searchQuery || h.heroName.toLowerCase().includes(searchQuery.toLowerCase());
      return noviceMatch && searchMatch;
    });
    
    const counts: Record<string, number> = {
      '全部': baseHeroes.length,
      '坦克': baseHeroes.filter(h => h.heroTypes.includes('坦克')).length,
      '战士': baseHeroes.filter(h => h.heroTypes.includes('战士')).length,
      '刺客': baseHeroes.filter(h => h.heroTypes.includes('刺客')).length,
      '辅助': baseHeroes.filter(h => h.heroTypes.includes('辅助')).length,
      '射手': baseHeroes.filter(h => h.heroTypes.includes('射手')).length,
      '法师': baseHeroes.filter(h => h.heroTypes.includes('法师')).length,
    };

    return counts;
  }, [allHeroes, isNoviceOnly, searchQuery]);

  return (
    <div className="w-full h-full bg-bg-page overflow-hidden relative">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-success/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto h-full flex gap-6 p-6 overflow-hidden relative z-10">
        {/* 左侧筛选区: 320px */}
        <div className="w-[320px] flex flex-col gap-module shrink-0 overflow-hidden">
          <div className="glass-card h-full overflow-hidden flex flex-col rounded-[32px] border-white/10 shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="p-6 pb-4 shrink-0">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Users size={22} />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-black text-text-primary tracking-tight">英雄速查</h2>
                    <p className="text-[11px] text-text-secondary font-medium uppercase tracking-widest opacity-60">Hero Database</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[18px] font-black text-primary leading-none">{total}</span>
                  <span className="text-[10px] text-text-secondary font-bold uppercase mt-1">Total</span>
                </div>
              </div>

              <section className="shrink-0">
                <HeroSearch value={searchQuery} onChange={setSearchQuery} />
              </section>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 px-6 pb-8 overflow-y-auto scrollbar-beauty">
              <HeroTypeFilter
                types={HERO_TYPES}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                isNoviceOnly={isNoviceOnly}
                onNoviceToggle={setIsNoviceOnly}
                typeCounts={typeCounts}
              />
              
              {/* 底部装饰 */}
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-[11px] text-text-secondary/40 font-medium italic">
                  数据更新至 Season 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 min-w-0 flex flex-col gap-module overflow-hidden">
          <HeroList
            heroes={filteredHeroes}
            selectedHeroId={selectedHeroId}
            onHeroSelect={handleHeroSelect}
          />
        </div>
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
