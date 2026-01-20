import { LayoutGrid, Shield, Swords, Zap, Wand2, Crosshair, Heart, Sparkles } from 'lucide-react';

interface HeroType {
  id: number;
  name: string;
}

interface HeroTypeFilterProps {
  types: HeroType[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  isNoviceOnly: boolean;
  onNoviceToggle: (val: boolean) => void;
  typeCounts?: Record<string, number>;
}

const typeIconMap: Record<string, any> = {
  '全部': LayoutGrid,
  '坦克': Shield,
  '战士': Swords,
  '刺客': Zap,
  '法师': Wand2,
  '射手': Crosshair,
  '辅助': Heart
};

export const HeroTypeFilter = ({ 
  types, 
  selectedType, 
  onTypeChange, 
  isNoviceOnly, 
  onNoviceToggle,
  typeCounts = {}
}: HeroTypeFilterProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(255,159,0,0.6)]" />
          <h3 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider">英雄定位</h3>
        </div>
        <div className="flex flex-col gap-2.5">
          {types.map(type => {
            const Icon = typeIconMap[type.name] || LayoutGrid;
            const isSelected = selectedType === type.name;
            
            return (
              <button
                key={type.id}
                onClick={() => onTypeChange(type.name)}
                className={`
                  group relative px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-300 border-none cursor-pointer
                  flex items-center justify-between overflow-hidden
                  ${isSelected 
                    ? 'bg-linear-to-r from-primary to-[#FF7A00] text-white shadow-[0_4px_12px_rgba(255,159,0,0.25)]' 
                    : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white'}
                `}
              >
                {/* 选中时的背景发光效果 */}
                {isSelected && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                )}
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300
                    ${isSelected ? 'bg-white/20' : 'bg-bg-page/50 group-hover:bg-primary/10 group-hover:text-primary'}
                  `}>
                    <Icon size={16} />
                  </div>
                  <span>{type.name}</span>
                </div>

                <div className={`
                  text-[11px] px-2 py-0.5 rounded-full min-w-7 text-center font-bold relative z-10
                  ${isSelected 
                    ? 'bg-black/20 text-white' 
                    : 'bg-bg-page/50 text-text-secondary group-hover:text-primary group-hover:bg-primary/10'}
                `}>
                  {typeCounts[type.name] || 0}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1 h-4 bg-success rounded-full shadow-[0_0_8px_rgba(46,204,113,0.6)]" />
          <h3 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider">新手筛选</h3>
        </div>
        
        <button
          onClick={() => onNoviceToggle(!isNoviceOnly)}
          className={`
            w-full group px-4 py-4 rounded-2xl transition-all duration-300 border-none cursor-pointer
            flex flex-col gap-2 text-left relative overflow-hidden
            ${isNoviceOnly 
              ? 'bg-linear-to-br from-success/20 to-[#27AE60]/5 border-2 border-success/30 shadow-[0_8px_20px_rgba(46,204,113,0.1)]' 
              : 'bg-white/5 border-2 border-transparent hover:bg-white/10'}
          `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5">
              <div className={`
                w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
                ${isNoviceOnly ? 'bg-success text-white shadow-lg shadow-success/30' : 'bg-bg-page/50 text-text-secondary group-hover:text-success group-hover:bg-success/10'}
              `}>
                <Sparkles size={18} />
              </div>
              <span className={`font-bold transition-colors ${isNoviceOnly ? 'text-success' : 'text-text-primary group-hover:text-success'}`}>
                新手推荐
              </span>
            </div>
            
            {/* 模拟 Switch 效果 */}
            <div className={`
              w-10 h-5 rounded-full relative transition-all duration-300
              ${isNoviceOnly ? 'bg-success' : 'bg-bg-page/50'}
            `}>
              <div className={`
                absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm
                ${isNoviceOnly ? 'left-6' : 'left-1'}
              `} />
            </div>
          </div>
          
          <p className={`text-[11px] leading-relaxed transition-colors ${isNoviceOnly ? 'text-success/80' : 'text-text-secondary group-hover:text-text-secondary/80'}`}>
            筛选上手难度 ⭐-⭐⭐ 的英雄，助你快速上分
          </p>
        </button>
      </div>
    </div>
  );
};
