import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroSelect } from '../components/business/HeroSelect';
import { EquipmentList } from '../components/business/EquipmentList';
import { CopyBtn } from '../components/atomic/CopyBtn';
import { Button } from '../components/atomic/Button';
import { useHeroData } from '../hooks/useHeroData';
import heroDetailsData from '../mock/hero/hero_details.json';
import summonerSkills from '../mock/equipment/summonerSkills.json';
import toolsData from '../mock/equipment/tools.json';
import toolsDetailData from '../mock/equipment/tools_detail.json';

const CATEGORIES = [
  { id: 0, name: '全部' },
  { id: 1, name: '攻击' },
  { id: 2, name: '法术' },
  { id: 3, name: '防御' },
  { id: 4, name: '移动' },
  { id: 5, name: '打野' },
  { id: 7, name: '游走' },
];

interface Equipment {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

interface EquipmentSet {
  items: Equipment[];
  tips: string;
}

export default function EquipmentRecommendPage() {
  const { heroList: allHeroes } = useHeroData();
  const [searchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'equipment' | 'skills' | 'tools') || 'equipment';
  
  // 计算默认选中的英雄 ID（hero_details.json 中的第一条数据）
  const defaultHeroId = useMemo(() => {
    const firstHeroName = (heroDetailsData as any[])[0]?.name;
    if (!firstHeroName) return 1;
    // 处理名称，去除括号
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

  const [equipmentSets, setEquipmentSets] = useState<EquipmentSet[]>([]);
  const [toolSearch, setToolSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);

  // 获取英雄名称的辅助函数
  const getHeroNameById = (id: number) => {
    const hero = allHeroes.find(h => h.id === id);
    return hero?.heroName || '';
  };

  // 将装备名称列表转换为 Equipment 对象列表
  const mapItemNamesToEquipment = (itemNames: string[]) => {
    return itemNames.map((name, index) => {
      const tool = toolsData.find(t => t.tool === name);
      const detail = (toolsDetailData as any[]).find(d => d.item_name === name);
      return {
        id: detail?.item_id?.toString() || `${name}-${index}`,
        name: name,
        icon: tool?.tool_src || '',
        desc: detail?.des1?.replace(/<[^>]+>/g, '') || '暂无描述'
      };
    });
  };

  // 监听英雄或场景变化，更新出装方案
  useEffect(() => {
    const heroName = getHeroNameById(selectedHeroId);
    
    // 优先从 hero_details.json 获取数据，支持多职业匹配
    const heroDetail = (heroDetailsData as any[]).find(h => 
      h.name === heroName || h.name.startsWith(`${heroName}(`)
    );
    
    if (heroDetail && heroDetail.equipment && heroDetail.equipment.length > 0) {
      const sets = heroDetail.equipment.map((set: any) => ({
        items: mapItemNamesToEquipment(set.items),
        tips: set.tips || ''
      }));
      setEquipmentSets(sets);
    } else {
      setEquipmentSets([]);
    }
  }, [selectedHeroId]);

  const copyText = useMemo(() => {
    if (equipmentSets.length === 0) return '';
    const heroName = getHeroNameById(selectedHeroId);
    let text = `【${heroName}】智能推荐出装方案：\n\n`;
    
    equipmentSets.forEach((set, setIdx) => {
      const itemsText = set.items.map((e, i) => `${i + 1}.${e.name}`).join(' -> ');
      text += `方案${setIdx + 1}：${itemsText}\n`;
      if (set.tips) {
        text += `思路：${set.tips.replace('Tips：', '')}\n`;
      }
      text += '\n';
    });
    
    return text.trim();
  }, [equipmentSets, selectedHeroId]);

  const filteredTools = useMemo(() => {
    return toolsData.filter(tool => {
      const matchesSearch = tool.tool.toLowerCase().includes(toolSearch.toLowerCase());
      if (!matchesSearch) return false;
      
      if (activeCategory === 0) return true;
      
      const detail = (toolsDetailData as any[]).find(d => d.item_name === tool.tool);
      return detail?.item_type === activeCategory;
    });
  }, [toolSearch, activeCategory]);

  // 获取道具详细信息的辅助函数
  const getToolDetail = (name: string) => {
    const detail = (toolsDetailData as any[]).find(item => item.item_name === name);
    if (detail) {
      return {
        price: detail.total_price,
        stats: detail.des1 || '',
        passive: detail.des2 || '',
        found: true
      };
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg-page overflow-hidden">
      {activeTab === 'equipment' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 顶部选择区: 80px */}
          <div className="h-[120px] md:h-[80px] flex flex-col md:flex-row items-center justify-center gap-6 shadow-sm shrink-0 z-10 bg-bg-card border-b border-border-light">
            <div className="flex w-full md:w-64">
              <label className='text-desc text-sm font-bold min-w-14 mr-1'>英雄名称</label>
              <HeroSelect value={selectedHeroId} onChange={setSelectedHeroId} />
            </div>
          </div>

          {/* 主体展示区: calc(100% - 80px) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10">
              {equipmentSets.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {equipmentSets.map((set, setIdx) => (
                      <div key={setIdx} className="flex flex-col gap-6 p-5 md:p-6 bg-bg-card rounded-3xl border border-border-light shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${setIdx * 150}ms` }}>
                        <section>
                          <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-primary font-bold flex items-center gap-2">
                              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">
                                {setIdx + 1}
                              </span>
                              推荐出装方案
                            </h3>
                            <span className="text-[10px] md:text-xs text-text-secondary bg-bg-page px-2 py-1 rounded-full border border-border-light">
                              点击装备可进行替换
                            </span>
                          </div>
                          <EquipmentList
                            list={set.items}
                            onUpdateList={(newList) => {
                              const newSets = [...equipmentSets];
                              newSets[setIdx] = { ...newSets[setIdx], items: newList };
                              setEquipmentSets(newSets);
                            }}
                          />
                        </section>

                        {set.tips && (
                          <section className="mt-auto">
                            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                              <h4 className="text-primary font-bold mb-2 flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                方案思路
                              </h4>
                              <p className="text-text-secondary text-xs leading-relaxed italic">
                                {set.tips.replace('Tips：', '')}
                              </p>
                            </div>
                          </section>
                        )}
                      </div>
                    ))}
                  </div>

                  <section className="flex justify-center mt-4">
                    <CopyBtn text={copyText} />
                  </section>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-text-secondary gap-4">
                  <div className="p-6 bg-bg-card rounded-full shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  </div>
                  <p className="font-bold">暂无该英雄的出装推荐数据</p>
                  <Button variant="secondary" size="sm" onClick={() => setSelectedHeroId(1)}>返回默认推荐</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === 'skills' ? (
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-bg-page">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
            {summonerSkills.map((skill, index) => (
              <div
                key={skill.name}
                className="flex items-center gap-4 p-5 bg-bg-card rounded-2xl shadow-sm border border-border-light hover:border-primary/30 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img src={skill.icon} alt={skill.name} className="w-16 h-16 rounded-2xl shadow-md" />
                <div className="flex-1">
                  <h4 className="font-bold text-text-primary text-lg">{skill.name}</h4>
                  <p className="text-text-secondary text-sm mt-1 leading-snug">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 搜索与分类区 */}
          <div className="p-4 bg-bg-card shadow-sm border-b border-border-light flex flex-col items-center gap-4 sticky top-0 z-20">
            {/* 搜索框 */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="搜索道具名称..."
                className="w-full px-10 py-2.5 bg-bg-page border border-border-light rounded-full text-sm focus:outline-none focus:border-primary/50 transition-all shadow-inner"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
              />
              <svg 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" 
                xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              {toolSearch && (
                <button 
                  onClick={() => setToolSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </div>

            {/* 分类筛选 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                      : 'bg-bg-page text-text-secondary border-border-light hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* 道具列表 */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
            <div className="max-w-6xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4 pt-4 pb-20">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => {
                  const toolInfo = getToolDetail(tool.tool);
                  // 从图片链接提取 ID (例如 .../1111.png -> 1111)
                  const itemId = tool.tool_src.split('/').pop()?.split('.')[0] || '';
                  
                  return (
                    <div
                      key={`${tool.tool}-${index}`}
                      data-itemid={itemId}
                      className="group relative flex flex-col items-center gap-2 p-2 bg-bg-card rounded-xl border border-border-light hover:border-primary/30 hover:shadow-md transition-all animate-in fade-in zoom-in-95 duration-300"
                      style={{ animationDelay: `${Math.min(index * 10, 500)}ms` }}
                    >
                      {/* 道具图片 */}
                      <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                        <img 
                          src={tool.tool_src} 
                          alt={tool.tool} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      {/* 道具名称 */}
                      <span className="text-[10px] md:text-xs font-medium text-text-primary text-center line-clamp-1 group-hover:text-primary transition-colors">
                        {tool.tool}
                      </span>

                      {/* 官网风格的 Hover 详情弹窗 */}
                      <div className="absolute left-full top-0 ml-3 w-64 p-4 bg-black/90 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                        {/* 装饰三角形 */}
                        <div className="absolute right-full top-6 border-8 border-transparent border-r-black/90"></div>
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h5 className="text-primary font-bold text-sm">{tool.tool}</h5>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500 text-[10px]">●</span>
                              <span className="text-white/60 text-[10px]">售价: {toolInfo?.price}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {/* 属性信息 */}
                            <div 
                              className="text-white/90 text-[11px] leading-relaxed [&>p]:mb-1 [&>p:last-child]:mb-0"
                              dangerouslySetInnerHTML={{ __html: toolInfo?.stats }}
                            />
                            
                            {/* 被动效果 */}
                            {toolInfo?.passive && (
                              <div 
                                className="mt-1 pt-2 border-t border-white/5 text-primary text-[11px] leading-relaxed [&>p]:mb-1 [&>p:last-child]:mb-0"
                                dangerouslySetInnerHTML={{ __html: toolInfo.passive }}
                              />
                            )}
                            
                            <div className="mt-1 pt-1 border-t border-white/10">
                              <p className="text-white/40 text-[9px] italic text-right">
                                * 数据参考官网：pvp.qq.com
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-text-secondary gap-3">
                  <div className="p-4 bg-bg-card rounded-full shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <p>未找到相关道具</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
