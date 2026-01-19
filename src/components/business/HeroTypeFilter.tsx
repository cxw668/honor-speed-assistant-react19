import { Tag } from '../atomic/Tag';

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

export const HeroTypeFilter = ({ 
  types, 
  selectedType, 
  onTypeChange, 
  isNoviceOnly, 
  onNoviceToggle,
  typeCounts = {}
}: HeroTypeFilterProps) => {
  return (
    <div className="flex flex-col gap-element-large">
      <div>
        <h3 className="text-desc mb-2">英雄定位</h3>
        <div className="flex flex-col gap-2">
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.name)}
              data-type={type.id}
              className={`
                group px-4 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-200 border-none cursor-pointer
                flex items-center justify-between
                ${selectedType === type.name 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white text-text-main hover:bg-[#F0F0F0]'}
              `}
            >
              <span>{type.name}</span>
              <span className={`
                text-[11px] px-1.5 py-0.5 rounded-md min-w-6 text-center
                ${selectedType === type.name 
                  ? 'bg-white/20 text-white' 
                  : 'bg-bg-light text-text-secondary group-hover:bg-white'}
              `}>
                {typeCounts[type.name] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-desc mb-2">新手筛选</h3>
        <Tag 
          active={isNoviceOnly} 
          onClick={() => onNoviceToggle(!isNoviceOnly)}
        >
          新手推荐 (难度⭐-⭐⭐)
        </Tag>
      </div>
    </div>
  );
};
