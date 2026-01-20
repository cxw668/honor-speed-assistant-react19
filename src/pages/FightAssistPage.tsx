import { HeroRelationshipAnalysis } from '../components/business/HeroRelationshipAnalysis';
import { Swords, Info } from 'lucide-react';

export default function FightAssistPage() {
  return (
    <div className="h-full bg-bg-page relative overflow-hidden flex flex-col">
      {/* 动态背景装饰 */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-success/5 rounded-full blur-[120px] translate-y-1/2" />

      {/* 顶部标题区 */}
      <div className="relative z-10 pt-8 pb-4 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-primary/20">
                Assistant Tools
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter flex items-center gap-3">
              阵容克制分析
              <Swords className="text-primary hidden md:block" size={32} />
            </h1>
          </div>
        </div>
      </div>

      {/* 主体内容区 */}
      <div className="relative z-10 flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <HeroRelationshipAnalysis />
        </div>
      </div>
      
      {/* 底部小贴士 */}
      <div className="relative z-10 pb-8 px-6">
        <div className="max-w-2xl mx-auto bg-primary/5 backdrop-blur-sm border border-primary/10 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="p-2 bg-primary/10 rounded-xl text-primary mt-0.5">
            <Info size={18} />
          </div>
          <div className="text-sm text-text-secondary leading-relaxed">
            <strong className="text-text-primary block mb-1">实战建议：</strong>
            阵容分析功能基于英雄关系数据，实时计算双方英雄的克制与搭档关系，帮助你在 BP 阶段或对战中快速定位核心威胁。
          </div>
        </div>
      </div>
    </div>
  );
}
