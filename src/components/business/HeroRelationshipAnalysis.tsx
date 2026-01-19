import React, { useState, useMemo } from 'react';
import { HeroSelect } from './HeroSelect';
import { Swords, Users, ShieldAlert, Zap, TrendingUp, Info, Trash2, X } from 'lucide-react';
import heroDetailsData from '../../mock/hero/hero_details.json';
import { heroList, heroAvatarList } from '../../mock/hero/index';

interface Hero {
  id: number;
  heroName: string;
  heroSrc: string;
}

interface RelationshipData {
  heroes: { ename: string; cname: string }[];
  descriptions: string[];
}

interface HeroDetail {
  name: string;
  relationships?: {
    "最佳搭档"?: RelationshipData;
    "压制英雄"?: RelationshipData;
    "被压制英雄"?: RelationshipData;
  };
}

const allHeroes = Object.values(heroList).flat().map(hero => ({
  ...hero,
  heroSrc: heroAvatarList.find(a => a.hero === hero.heroName)?.hero_src || ''
}));

export const HeroRelationshipAnalysis: React.FC = () => {
  const [myTeam, setMyTeam] = useState<(number | null)[]>(Array(5).fill(null));
  const [enemyTeam, setEnemyTeam] = useState<(number | null)[]>(Array(5).fill(null));
  const [selectingSlot, setSelectingSlot] = useState<{ team: 'my' | 'enemy', index: number } | null>(null);

  const handleSelectHero = (heroId: number) => {
    if (!selectingSlot) return;
    
    const { team, index } = selectingSlot;
    if (team === 'my') {
      const newTeam = [...myTeam];
      newTeam[index] = heroId;
      setMyTeam(newTeam);
    } else {
      const newTeam = [...enemyTeam];
      newTeam[index] = heroId;
      setEnemyTeam(newTeam);
    }
    setSelectingSlot(null);
  };

  const clearTeams = () => {
    setMyTeam(Array(5).fill(null));
    setEnemyTeam(Array(5).fill(null));
  };

  const analysisResults = useMemo(() => {
    const myHeroes = myTeam.filter((id): id is number => id !== null).map(id => allHeroes.find(h => h.id === id)).filter(Boolean);
    const enemyHeroes = enemyTeam.filter((id): id is number => id !== null).map(id => allHeroes.find(h => h.id === id)).filter(Boolean);

    const partnerships: { hero: string; partner: string; desc: string }[] = [];
    const mySuppression: { hero: string; enemy: string; desc: string }[] = [];
    const enemySuppression: { enemy: string; hero: string; desc: string }[] = [];

    // 1. 分析最佳搭档 (己方内部)
    myHeroes.forEach(hero => {
      const detail = (heroDetailsData as HeroDetail[]).find(d => d.name === hero?.heroName);
      if (detail?.relationships?.["最佳搭档"]) {
        detail.relationships["最佳搭档"].heroes.forEach((p, idx) => {
          if (myHeroes.some(h => h?.heroName === p.cname)) {
            if (!partnerships.some(item => (item.hero === hero!.heroName && item.partner === p.cname) || (item.hero === p.cname && item.partner === hero!.heroName))) {
              partnerships.push({
                hero: hero!.heroName,
                partner: p.cname,
                desc: detail.relationships!["最佳搭档"]!.descriptions[idx]
              });
            }
          }
        });
      }
    });

    // 2. 分析压制关系 (己方 vs 敌方)
    // 检查己方英雄的克制列表
    myHeroes.forEach(hero => {
      const detail = (heroDetailsData as HeroDetail[]).find(d => d.name === hero?.heroName);
      
      // 己方压制敌方
      if (detail?.relationships?.["压制英雄"]) {
        detail.relationships["压制英雄"].heroes.forEach((e, idx) => {
          if (enemyHeroes.some(h => h?.heroName === e.cname)) {
            mySuppression.push({
              hero: hero!.heroName,
              enemy: e.cname,
              desc: detail.relationships!["压制英雄"]!.descriptions[idx]
            });
          }
        });
      }

      // 己方被敌方压制
      if (detail?.relationships?.["被压制英雄"]) {
        detail.relationships["被压制英雄"].heroes.forEach((e, idx) => {
          if (enemyHeroes.some(h => h?.heroName === e.cname)) {
            enemySuppression.push({
              enemy: e.cname,
              hero: hero!.heroName,
              desc: detail.relationships!["被压制英雄"]!.descriptions[idx]
            });
          }
        });
      }
    });

    // 补充：检查敌方英雄的克制列表 (双向分析)
    enemyHeroes.forEach(enemy => {
      const detail = (heroDetailsData as HeroDetail[]).find(d => d.name === enemy?.heroName);
      
      // 敌方压制己方
      if (detail?.relationships?.["压制英雄"]) {
        detail.relationships["压制英雄"].heroes.forEach((p, idx) => {
          if (myHeroes.some(h => h?.heroName === p.cname)) {
            // 如果还没记录这个关系，则添加
            if (!enemySuppression.some(s => s.enemy === enemy!.heroName && s.hero === p.cname)) {
              enemySuppression.push({
                enemy: enemy!.heroName,
                hero: p.cname,
                desc: detail.relationships!["压制英雄"]!.descriptions[idx]
              });
            }
          }
        });
      }

      // 敌方被己方压制
      if (detail?.relationships?.["被压制英雄"]) {
        detail.relationships["被压制英雄"].heroes.forEach((p, idx) => {
          if (myHeroes.some(h => h?.heroName === p.cname)) {
            // 如果还没记录这个关系，则添加
            if (!mySuppression.some(s => s.hero === p.cname && s.enemy === enemy!.heroName)) {
              mySuppression.push({
                hero: p.cname,
                enemy: enemy!.heroName,
                desc: detail.relationships!["被压制英雄"]!.descriptions[idx]
              });
            }
          }
        });
      }
    });

    return { partnerships, mySuppression, enemySuppression };
  }, [myTeam, enemyTeam]);

  const TeamSlot = ({ team, index, id }: { team: 'my' | 'enemy', index: number, id: number | null }) => {
    const hero = id ? allHeroes.find(h => h.id === id) : null;
    return (
      <div 
        onClick={() => setSelectingSlot({ team, index })}
        className={`relative group w-full aspect-square rounded-2xl border-2 transition-all duration-300 overflow-hidden cursor-pointer ${
          team === 'my' 
            ? 'border-primary/20 bg-primary/5 hover:border-primary/50' 
            : 'border-danger/20 bg-danger/5 hover:border-danger/50'
        } ${selectingSlot?.team === team && selectingSlot?.index === index ? 'ring-2 ring-offset-2 ring-primary scale-105' : ''}`}
      >
        {hero ? (
          <img src={hero.heroSrc} alt={hero.heroName} className="w-full h-full object-cover animate-in fade-in zoom-in-95" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <TrendingUp size={24} className={team === 'my' ? 'text-primary/30' : 'text-danger/30'} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        {hero && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 px-1 text-[10px] text-white text-center font-bold">
            {hero.heroName}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 bg-bg-card rounded-[40px] shadow-2xl border-2 border-primary/10 h-full relative overflow-hidden group">
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-xl font-black text-text-primary flex items-center gap-2">
          <Swords size={20} className="text-primary" />
          阵容克制关系分析
        </h3>
        <button 
          onClick={clearTeams}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-text-secondary hover:text-danger hover:bg-danger/5 transition-all border border-transparent hover:border-danger/20"
        >
          <Trash2 size={14} />
          重置阵容
        </button>
      </div>

      {/* 5V5 阵容选择区 */}
      <div className="grid grid-cols-2 gap-8 relative z-10">
        {/* 己方阵容 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2">
            <Users size={16} className="text-primary" />
            <span className="text-sm font-black text-primary uppercase tracking-wider">己方阵容</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {myTeam.map((id, idx) => <TeamSlot key={`my-${idx}`} team="my" index={idx} id={id} />)}
          </div>
        </div>

        {/* 敌方阵容 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-2 justify-end">
            <span className="text-sm font-black text-danger uppercase tracking-wider">敌方阵容</span>
            <Zap size={16} className="text-danger" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {enemyTeam.map((id, idx) => <TeamSlot key={`enemy-${idx}`} team="enemy" index={idx} id={id} />)}
          </div>
        </div>
      </div>

      {/* 英雄选择浮层 */}
      {selectingSlot && (
        <div className="absolute inset-0 z-50 bg-bg-card/95 backdrop-blur-md animate-in fade-in duration-300 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-6 rounded-full ${selectingSlot.team === 'my' ? 'bg-primary' : 'bg-danger'}`} />
              <h4 className="text-lg font-black text-text-primary">
                选择{selectingSlot.team === 'my' ? '己方' : '敌方'}第 {selectingSlot.index + 1} 位英雄
              </h4>
            </div>
            <button 
              onClick={() => setSelectingSlot(null)}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors text-text-secondary hover:text-primary"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <HeroSelect 
              value={selectingSlot.team === 'my' ? (myTeam[selectingSlot.index] || 0) : (enemyTeam[selectingSlot.index] || 0)} 
              onChange={handleSelectHero} 
              isStatic={true}
            />
          </div>
          <div className="mt-4 text-center text-xs text-text-secondary italic">
            提示：在上方搜索框输入英雄名或直接从列表中选择英雄
          </div>
        </div>
      )}

      {/* 分析结果区 */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10 min-h-[300px]">
        {analysisResults.partnerships.length === 0 && 
         analysisResults.mySuppression.length === 0 && 
         analysisResults.enemySuppression.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-50 py-12">
            <Info size={48} className="mb-4" />
            <p className="text-sm font-bold">选择英雄开始分析克制关系</p>
          </div>
        ) : (
          <>
            {/* 最佳搭档 */}
            {analysisResults.partnerships.length > 0 && (
              <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 text-success font-black text-xs uppercase tracking-widest px-1">
                  <TrendingUp size={14} /> 最佳搭档
                </div>
                {analysisResults.partnerships.map((p, i) => (
                  <div key={i} className="bg-success/5 border border-success/10 p-3 rounded-2xl text-xs">
                    <div className="font-bold text-success mb-1">{p.hero} & {p.partner}</div>
                    <p className="text-text-secondary leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 我方压制 */}
            {analysisResults.mySuppression.length > 0 && (
              <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300 delay-75">
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest px-1">
                  <Zap size={14} /> 我方压制
                </div>
                {analysisResults.mySuppression.map((s, i) => (
                  <div key={i} className="bg-primary/5 border border-primary/10 p-3 rounded-2xl text-xs">
                    <div className="font-bold text-primary mb-1">{s.hero} <span className="mx-1 text-text-secondary">压制</span> {s.enemy}</div>
                    <p className="text-text-secondary leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 敌方压制 */}
            {analysisResults.enemySuppression.length > 0 && (
              <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300 delay-150">
                <div className="flex items-center gap-2 text-danger font-black text-xs uppercase tracking-widest px-1">
                  <ShieldAlert size={14} /> 敌方压制
                </div>
                {analysisResults.enemySuppression.map((s, i) => (
                  <div key={i} className="bg-danger/5 border border-danger/10 p-3 rounded-2xl text-xs">
                    <div className="font-bold text-danger mb-1">{s.enemy} <span className="mx-1 text-text-secondary">压制</span> {s.hero}</div>
                    <p className="text-text-secondary leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 装饰 */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
    </div>
  );
};
