import { useState, useEffect, useMemo, useRef } from 'react';
import { HeroSelect } from '../components/business/HeroSelect';
import { Toast } from '../components/atomic/Toast';
import { InscriptionSimulation, type InscriptionSimulationHandle } from '../components/business/InscriptionSimulation';
import { CopyBtn } from '../components/atomic/CopyBtn';
import { Zap, RotateCcw } from 'lucide-react';
import { useHeroData } from '../hooks/useHeroData';
import heroDetailsData from '../mock/hero/hero_details.json';
import inscriptionListData from '../mock/equipment/inscriptionList.json';

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

// 计算默认选中的英雄 ID（hero_details.json 中的第一条数据）
// const getDefaultHeroId = () => {
//   const firstHeroName = (heroDetailsData as any[])[0]?.name;
//   if (!firstHeroName) return 1;
//   const allHeroes = Object.values(heroList).flatMap(list => list);
//   const foundHero = allHeroes.find(h => h.heroName === firstHeroName);
//   return foundHero?.id || 1;
// };

export default function InscriptionMatchPage() {
  const { heroList: allHeroes } = useHeroData();
  const simulationRef = useRef<InscriptionSimulationHandle>(null);
  
  // 计算默认选中的英雄 ID
  const defaultHeroId = useMemo(() => {
    const firstHeroName = (heroDetailsData as any[])[0]?.name;
    if (!firstHeroName) return 1;
    const baseName = firstHeroName.replace(/\(.*\)/, '').trim();
    const foundHero = allHeroes.find(h => h.heroName === baseName);
    return foundHero?.id || 1;
  }, [allHeroes]);

  const [selectedHeroId, setSelectedHeroId] = useState<number>(0);

  useEffect(() => {
    if (selectedHeroId === 0 && defaultHeroId !== 0) {
      setSelectedHeroId(defaultHeroId);
    }
  }, [defaultHeroId, selectedHeroId]);

  const [currentInscriptions, setCurrentInscriptions] = useState<Inscription[]>([]);
  const [recommendDesc, setRecommendDesc] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg] = useState('');

  // 铭文类型映射
  const inscriptionTypeMap: Record<string, 'red' | 'blue' | 'green'> = {
    // 红色
    '宿命': 'red', '无双': 'red', '圣人': 'red', '梦魇': 'red', '异变': 'red', 
    '纷争': 'red', '凶兆': 'red', '祸源': 'red', '红月': 'red', '传承': 'red',
    // 蓝色
    '调和': 'blue', '夺萃': 'blue', '轮回': 'blue', '狩猎': 'blue', '贪婪': 'blue', 
    '隐匿': 'blue', '冥想': 'blue', '繁荣': 'blue', '兽痕': 'blue', '长生': 'blue',
    // 绿色
    '虚空': 'green', '鹰眼': 'green', '献祭': 'green', '心眼': 'green', '怜悯': 'green', 
    '敬畏': 'green', '回声': 'green', '霸者': 'green', '均衡': 'green', '灵山': 'green'
  };

  // 获取英雄名称的辅助函数
  const getHeroNameById = (id: number) => {
    const hero = allHeroes.find(h => h.id === id);
    return hero?.heroName || '';
  };

  // 监听英雄或场景变化
  useEffect(() => {
    const heroName = getHeroNameById(selectedHeroId);
    if (!heroName) return;
    
    // 优先从 hero_details.json 获取数据
    const heroDetail = (heroDetailsData as any[]).find(h => 
      h.name === heroName || h.name.startsWith(`${heroName}(`)
    );
    
    if (heroDetail && heroDetail.inscriptions) {
      const insList = heroDetail.inscriptions.list.map((ins: any) => ({
        name: ins.name,
        count: 10, // 默认10个
        type: inscriptionTypeMap[ins.name] || 'red'
      }));
      setCurrentInscriptions(insList);
      setRecommendDesc(heroDetail.inscriptions.tips || '');
    } else {
      // 备选方案
      const recommendation = (inscriptionListData as InscriptionRecommendation[]).find(
        item => item.heroId === selectedHeroId
      );

      if (recommendation) {
        setCurrentInscriptions(recommendation.inscriptionList);
        setRecommendDesc(recommendation.desc);
      } else {
        setCurrentInscriptions([]);
        setRecommendDesc('');
      }
    }
  }, [selectedHeroId, allHeroes]);

  const copyText = useMemo(() => {
    if (currentInscriptions.length === 0) return '';
    const combo = currentInscriptions.map(ins => `${ins.name}×${ins.count}`).join(' + ');
    return `${combo} → ${recommendDesc}`;
  }, [currentInscriptions, recommendDesc]);

  return (
    <div className="h-full flex flex-col bg-bg-page overflow-hidden">
      {/* 主体展示区 */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col gap-6">
          
          {/* 英雄选择与头部信息 - 集成到 content */}
          <div className="max-h-[150px] bg-bg-card rounded-[24px] border border-white/10 p-5 flex items-center gap-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="shrink-0 group">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-[20px] overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-500 shadow-lg">
                <img
                  src={allHeroes.find(h => h.id === selectedHeroId)?.heroSrc || allHeroes.find(h => h.id === selectedHeroId)?.avatar}
                  alt="Hero"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span className="text-white font-black tracking-tight text-xs">
                    {getHeroNameById(selectedHeroId)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-between gap-6">
              <div className="space-y-1 hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(255,159,0,0.8)]" />
                  <h2 className="text-lg font-black text-white tracking-tight">铭文搭配实验室</h2>
                </div>
                <p className="text-text-secondary text-[11px] font-medium">模拟真实铭文搭配，实时查看属性加成</p>
              </div>

              <div className="flex-1 flex items-center gap-4 max-w-2xl">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">更换目标英雄</label>
                  <div className="bg-white/5 rounded-xl p-1 border border-white/10 hover:border-primary/30 transition-colors">
                    <HeroSelect value={selectedHeroId} onChange={setSelectedHeroId} />
                  </div>
                </div>

                <div className="flex flex-col justify-end h-[42px] mb-0.5">
                  <div className="flex gap-1.5">
                    {allHeroes.find(h => h.id === selectedHeroId)?.heroTypes.map(type => (
                      <span key={type} className="px-2 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-lg border border-primary/20 uppercase">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button 
                  onClick={() => simulationRef.current?.applyRecommended()}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all border border-primary/20"
                >
                  <Zap size={14} fill="currentColor" />
                  一键套用
                </button>
                <button 
                  onClick={() => simulationRef.current?.clear()}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded-xl text-xs font-bold transition-all border border-white/10 hover:border-red-500/50"
                >
                  <RotateCcw size={14} />
                  重置
                </button>
                <div className="w-40 flex flex-col justify-center">
                  <CopyBtn 
                    text={copyText} 
                    title={recommendDesc?.replace('Tips：', '')} 
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-[calc(100%-150px)] flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InscriptionSimulation 
              ref={simulationRef}
              recommendedInscriptions={currentInscriptions} 
              recommendDesc={recommendDesc}
              copyText={copyText}
            />
          </div>
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
