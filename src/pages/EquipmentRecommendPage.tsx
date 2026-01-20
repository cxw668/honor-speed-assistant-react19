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
    <div className="h-full bg-bg-page overflow-hidden flex flex-col">
      {/* 顶部标签切换 - 已根据需求注释，转为二级导航形式 
      <div className="flex justify-center bg-bg-card border-b border-white/5 py-2 shrink-0">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {[
            { id: 'equipment', label: '出装推荐' },
            { id: 'skills', label: '召唤师技能' },
            { id: 'tools', label: '局内道具' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('tab', tab.id);
                window.location.hash = `#/equipment?${params.toString()}`;
              }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all border-none cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      */}

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧二级导航菜单 - 区分于一级导航，体现层级感 */}
        <aside className="w-20 md:w-64 shrink-0 border-r border-white/5 bg-bg-card/30 backdrop-blur-md flex flex-col py-8 px-4 gap-2">
          <div className="px-4 mb-6 hidden md:block">
            <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-50">实验室模块</h3>
          </div>
          {[
            { id: 'equipment', label: '出装推荐', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
            { id: 'skills', label: '召唤师技能', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4 4 4-4 4-4-4z" /><path d="M3.34 7a10 10 0 1 1 17.32 0" /></svg> },
            { id: 'tools', label: '局内道具', icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('tab', tab.id);
                window.location.hash = `#/equipment?${params.toString()}`;
              }}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 border-none cursor-pointer group ${activeTab === tab.id
                ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1'
                : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
            >
              <span className={`shrink-0 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {tab.icon}
              </span>
              <span className="font-bold text-sm hidden md:block tracking-wide">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] hidden md:block animate-pulse" />
              )}
            </button>
          ))}

          {/* 底部装饰 */}
          <div className="mt-auto p-4 hidden md:block">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] text-text-secondary leading-relaxed font-medium">
                当前版本: v1.0.4<br />
                数据同步: 实时
              </p>
            </div>
          </div>
        </aside>

        {/* 主内容区 */}
        <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 gap-6">
          <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col gap-6 overflow-hidden">
            {activeTab === 'equipment' ? (
              <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                {/* 英雄选择面板 - 更加紧凑的设计 */}
                <div className="shrink-0 bg-bg-card rounded-[24px] border border-white/10 p-5 flex items-center gap-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-700">
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
                        <h2 className="text-lg font-black text-white tracking-tight">智能出装实验室</h2>
                      </div>
                      <p className="text-text-secondary text-[11px] font-medium">官网实时同步最优方案</p>
                    </div>

                    <div className="flex-1 flex items-center gap-4 max-w-2xl">
                      <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">更换目标英雄</label>
                        <div className="bg-white/5 rounded-xl p-1 border border-white/10 hover:border-primary/30 transition-colors">
                          <HeroSelect value={selectedHeroId} onChange={setSelectedHeroId} />
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-col justify-end space-y-1.5">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1">实战数据</label>
                        <div className="flex gap-2 bg-white/5 rounded-xl p-2 border border-white/10 h-[42px] items-center px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-text-secondary font-bold">胜率</span>
                            <span className="text-[11px] font-black text-success">--</span>
                          </div>
                          <div className="w-px h-3 bg-white/10" />
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-text-secondary font-bold">登场</span>
                            <span className="text-[11px] font-black text-white">--</span>
                          </div>
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

                    <div className="shrink-0">
                      <CopyBtn text={copyText} />
                    </div>
                  </div>
                </div>

                {equipmentSets.length > 0 ? (
                  <div className="flex-1 overflow-hidden flex flex-col gap-4">
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-5 overflow-hidden">
                      {equipmentSets.slice(0, 2).map((set, setIdx) => (
                        <div 
                          key={setIdx} 
                          className="flex flex-col bg-bg-card rounded-[24px] border border-white/10 shadow-lg hover:border-primary/20 transition-all animate-in fade-in zoom-in-95 duration-500 relative z-10 hover:z-30" 
                          style={{ animationDelay: `${setIdx * 100}ms` }}
                        >
                          {/* 方案头部 */}
                          <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white text-sm font-black shadow-md shadow-primary/20">
                                {setIdx + 1}
                              </div>
                              <div>
                                <h3 className="text-sm font-black text-white tracking-tight">推荐方案</h3>
                                <p className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">Official Set</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                              <span className="text-[9px] text-text-secondary font-black">同步中</span>
                            </div>
                          </div>

                          {/* 装备列表区 - 自动填充剩余空间 */}
                          <div className="flex-1 p-5 flex flex-col gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 shrink-0">
                              <EquipmentList 
                                onUpdateList={()=>{}} 
                                list={set.items} 
                                tooltipSide={setIdx === 0 ? 'right' : 'left'}
                              />
                            </div>

                            {set.tips && (
                              <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex items-center gap-2 px-1 mb-2 shrink-0">
                                  <div className="w-1 h-1 rounded-full bg-primary" />
                                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest">思路分析</h4>
                                </div>
                                <div className="flex-1 p-4 bg-linear-to-br from-primary/10 via-transparent to-transparent border border-primary/10 rounded-2xl relative group/tips overflow-y-auto scrollbar-beauty">
                                  <p className="text-[11px] text-text-primary leading-relaxed font-medium italic">
                                    “{set.tips.replace('Tips：', '')}”
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-text-secondary gap-6">
                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-white tracking-tight">暂无出装数据</p>
                      <p className="text-sm text-text-secondary mt-1">请尝试选择其他英雄</p>
                    </div>
                    <Button variant="primary" size="lg" onClick={() => setSelectedHeroId(1)}>
                      重置为默认英雄
                    </Button>
                  </div>
                )}
              </div>
            ) : activeTab === 'skills' ? (
              <div className="flex-1 overflow-y-auto scrollbar-hide px-2">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 pb-10">
                  {summonerSkills.map((skill, index) => (
                    <div
                      key={skill.name}
                      className="flex items-center gap-4 p-5 bg-bg-card rounded-[24px] border border-white/10 shadow-lg hover:border-primary/30 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="relative shrink-0">
                        <img src={skill.icon} alt={skill.name} className="w-16 h-16 rounded-[16px] shadow-2xl relative z-10" />
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full z-0" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-white text-lg tracking-tight mb-0.5">{skill.name}</h4>
                        <p className="text-text-secondary text-[12px] leading-snug font-medium line-clamp-2">{skill.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 搜索与分类区 - 固定在顶部 */}
                <div className="mb-6 flex flex-col items-center gap-4 shrink-0">
                  <div className="relative w-full max-w-lg group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="搜索局内道具名称..."
                      className="w-full pl-11 pr-11 py-3 bg-bg-card border-2 border-white/5 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all shadow-xl"
                      value={toolSearch}
                      onChange={(e) => setToolSearch(e.target.value)}
                    />
                    {toolSearch && (
                      <button
                        onClick={() => setToolSearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors border-none bg-transparent cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-1.5 rounded-lg text-[11px] font-black transition-all whitespace-nowrap border-2 ${activeCategory === cat.id
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-white/5 text-text-secondary border-transparent hover:border-white/10 hover:text-white'
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide px-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-10">
                    {filteredTools.length > 0 ? (
                      filteredTools.map((tool, index) => {
                        const toolInfo = getToolDetail(tool.tool);
                        const isLastInRow = (index + 1) % 6 === 0;
                        const isSecondToLastInRow = (index + 1) % 6 === 5;
                        const showTooltipLeft = isLastInRow || isSecondToLastInRow;

                        return (
                          <div
                            key={`${tool.tool}-${index}`}
                            className="group relative flex flex-col items-center gap-3 p-4 bg-bg-card rounded-[24px] border border-white/5 hover:border-primary/30 hover:shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-300"
                            style={{ animationDelay: `${Math.min(index * 10, 500)}ms` }}
                          >
                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-[20px] overflow-hidden shadow-2xl">
                              <img
                                src={tool.tool_src}
                                alt={tool.tool}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[13px] font-bold text-text-primary text-center group-hover:text-primary transition-colors">
                              {tool.tool}
                            </span>

                            <div className={`
                              absolute top-0 w-72 p-5 bg-bg-card/95 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-110 pointer-events-none
                              ${showTooltipLeft ? 'right-[calc(100%+16px)]' : 'left-[calc(100%+16px)]'}
                            `}>
                              <div className={`
                                absolute top-8 border-10 border-transparent
                                ${showTooltipLeft ? 'left-full border-l-bg-card/95' : 'right-full border-r-bg-card/95'}
                              `}></div>
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                  <h5 className="text-primary font-black text-base tracking-tight">{tool.tool}</h5>
                                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full">
                                    <span className="text-yellow-500 font-black text-[11px]">¥ {toolInfo?.price}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                  <div
                                    className="text-text-primary text-[12px] leading-relaxed font-medium [&>p]:mb-2 [&>p:last-child]:mb-0"
                                    dangerouslySetInnerHTML={{ __html: toolInfo?.stats }}
                                  />
                                  {toolInfo?.passive && (
                                    <div
                                      className="pt-3 border-t border-white/5 text-primary text-[12px] leading-relaxed italic [&>p]:mb-2 [&>p:last-child]:mb-0"
                                      dangerouslySetInnerHTML={{ __html: toolInfo.passive }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full py-32 flex flex-col items-center justify-center text-text-secondary gap-4">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        </div>
                        <p className="font-bold text-lg">未找到相关道具</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
