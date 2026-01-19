import { useState, useEffect, useMemo } from 'react';
import { HeroSelect } from '../components/business/HeroSelect';
import { SceneFilter } from '../components/business/SceneFilter';
import { CopyBtn } from '../components/atomic/CopyBtn';
import { Button } from '../components/atomic/Button';
import { Toast } from '../components/atomic/Toast';
import inscriptionListData from '../mock/equipment/inscriptionList.json';
import epigraphData from '../mock/equipment/epigraph.json';

interface Inscription {
  name: string;
  count: number;
  type: 'red' | 'blue' | 'green';
}

interface InscriptionRecommendation {
  heroId: number;
  heroName: string;
  scene: string;
  inscriptionList: Inscription[];
  desc: string;
  adjustTips: {
    increase: string;
    decrease: string;
  };
}

export default function InscriptionMatchPage() {
  const [selectedHeroId, setSelectedHeroId] = useState<number>(1);
  const [selectedScene, setSelectedScene] = useState<string>('常规');
  const [currentInscriptions, setCurrentInscriptions] = useState<Inscription[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [adjustingIdx, setAdjustingIdx] = useState<number | null>(null);
  const [adjustTip, setAdjustTip] = useState<string | null>(null);

  // 监听英雄或场景变化
  useEffect(() => {
    const recommendation = (inscriptionListData as InscriptionRecommendation[]).find(
      item => item.heroId === selectedHeroId && item.scene === selectedScene
    );

    if (recommendation) {
      setCurrentInscriptions(recommendation.inscriptionList);
    } else {
      // 默认空状态或根据英雄类型分配默认铭文（此处简化处理）
      setCurrentInscriptions([]);
    }
  }, [selectedHeroId, selectedScene]);

  const copyText = useMemo(() => {
    if (currentInscriptions.length === 0) return '';
    const combo = currentInscriptions.map(ins => `${ins.name}×${ins.count}`).join(' + ');
    const recommendation = (inscriptionListData as InscriptionRecommendation[]).find(
      item => item.heroId === selectedHeroId && item.scene === selectedScene
    );
    return `${combo} → ${recommendation?.desc || ''}`;
  }, [currentInscriptions, selectedHeroId, selectedScene]);

  const handleCountAdjust = (index: number, delta: number) => {
    const newList = [...currentInscriptions];
    const newCount = Math.min(10, Math.max(1, newList[index].count + delta));
    
    if (newCount === newList[index].count) return;

    newList[index] = { ...newList[index], count: newCount };
    setCurrentInscriptions(newList);

    // 显示调整提示
    const recommendation = (inscriptionListData as InscriptionRecommendation[]).find(
      item => item.heroId === selectedHeroId && item.scene === selectedScene
    );
    if (recommendation) {
      setAdjustTip(delta > 0 ? recommendation.adjustTips.increase : recommendation.adjustTips.decrease);
      setTimeout(() => setAdjustTip(null), 2000);
    }
  };

  const getInscriptionIcon = (type: string) => {
    // 这里可以使用颜色块或简单的图标代替
    const colors = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className="h-full flex flex-col bg-bg-page overflow-hidden">
      {/* 顶部选择区 */}
      <div className="h-[120px] md:h-[80px] flex flex-col md:flex-row items-center justify-center gap-6 px-6 bg-bg-card shadow-sm shrink-0 z-10">
        <div className="w-full md:w-64">
          <HeroSelect value={selectedHeroId} onChange={setSelectedHeroId} />
        </div>
        <div className="w-full md:w-auto">
          <SceneFilter activeScene={selectedScene} onSceneChange={setSelectedScene} />
        </div>
      </div>

      {/* 主体展示区 */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
          {currentInscriptions.length > 0 ? (
            <>
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="title">推荐铭文组合</h3>
                  <span className="text-xs text-text-secondary">点击数量可进行微调</span>
                </div>

                <div className="flex flex-col gap-6">
                  {currentInscriptions.map((ins, idx) => (
                    <div 
                      key={`${ins.name}-${idx}`}
                      className="group flex items-center justify-between p-6 bg-bg-card rounded-3xl shadow-md border-2 border-transparent hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${getInscriptionIcon(ins.type)} flex items-center justify-center text-white font-bold text-xl shadow-inner`}>
                          {ins.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary text-lg">{ins.name}</h4>
                          <p className="text-text-secondary text-xs mt-0.5">5级铭文</p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setAdjustingIdx(adjustingIdx === idx ? null : idx)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary/5 hover:bg-primary/10 rounded-xl border border-primary/10 transition-colors"
                        >
                          <span className="text-primary font-bold text-xl">×{ins.count}</span>
                          <svg className={`w-4 h-4 text-primary transition-transform ${adjustingIdx === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* 数量调整弹窗 */}
                        {adjustingIdx === idx && (
                          <div className="absolute top-full right-0 mt-2 p-3 bg-bg-card rounded-2xl shadow-xl border border-border-light z-20 flex items-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                            <button 
                              onClick={() => handleCountAdjust(idx, -1)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-page hover:bg-primary/10 text-text-primary hover:text-primary transition-colors border border-border-light"
                            >
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                            </button>
                            <span className="text-xl font-bold text-primary w-8 text-center">{ins.count}</span>
                            <button 
                              onClick={() => handleCountAdjust(idx, 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-page hover:bg-primary/10 text-text-primary hover:text-primary transition-colors border border-border-light"
                            >
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 实时调整提示 */}
              {adjustTip && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-primary/90 text-white rounded-full shadow-2xl font-bold animate-in zoom-in fade-in duration-300 z-[100]">
                  调整后效果：{adjustTip}
                </div>
              )}

              <section className="bg-bg-card p-8 rounded-[40px] shadow-lg border-2 border-primary/10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <h4 className="title text-center mb-6">铭文方案说明</h4>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 flex-wrap justify-center text-lg font-medium text-text-primary">
                    {currentInscriptions.map((ins, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {ins.name}×{ins.count}
                        {i < currentInscriptions.length - 1 && <span className="text-primary/40 mx-1">+</span>}
                      </span>
                    ))}
                    <span className="text-primary mx-3">→</span>
                    <span className="text-primary font-bold">
                      {(inscriptionListData as InscriptionRecommendation[]).find(i => i.heroId === selectedHeroId)?.desc}
                    </span>
                  </div>
                  <p className="text-text-secondary text-center text-sm leading-relaxed mt-4 max-w-md">
                    铭文是前期的核心优势。这套组合能让你在开局就拥有不俗的属性，更容易打出优势。
                  </p>
                </div>
                <div className="mt-8">
                  <CopyBtn text={copyText} />
                </div>
              </section>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-text-secondary gap-4">
              <div className="p-6 bg-bg-card rounded-full shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <p className="font-bold">暂无该英雄的铭文推荐数据</p>
              <Button variant="secondary" size="sm" onClick={() => setSelectedHeroId(1)}>返回默认推荐</Button>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <Toast 
          message={toastMsg} 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
}
