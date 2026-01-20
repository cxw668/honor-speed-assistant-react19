interface Equipment {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

interface EquipmentListProps {
  list: Equipment[];
  onUpdateList: (newList: Equipment[]) => void;
  tooltipSide?: 'left' | 'right';
}

export const EquipmentList = ({ list, tooltipSide = 'right' }: EquipmentListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {list.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="group relative">
            {/* 装备项主容器 */}
            <div 
              className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group/item hover:scale-[1.02] active:scale-[0.98] relative hover:z-110"
            >
              <div className="relative shrink-0">
                <img 
                  src={item.icon} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover/item:border-primary/30 transition-colors"
                />
                <div className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-bg-card/80 backdrop-blur-md rounded-lg flex items-center justify-center text-[10px] font-black text-primary border border-primary/20 shadow-sm">
                  {idx + 1}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-black text-white group-hover/item:text-primary transition-colors truncate">{item.name}</div>
                <div className="text-[10px] text-text-secondary line-clamp-1 mt-0.5 opacity-60 group-hover/item:opacity-100 transition-opacity font-medium">
                  {item.desc}
                </div>
              </div>

              {/* Hover 提示弹窗 */}
              <div className={`
                absolute top-1/2 -translate-y-1/2 w-64 p-4 bg-bg-card/95 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-300 z-100 pointer-events-none
                ${tooltipSide === 'right' ? 'left-[calc(100%+12px)]' : 'right-[calc(100%+12px)]'}
              `}>
                <div className="flex items-start gap-3 mb-3">
                  <img src={item.icon} alt={item.name} className="w-10 h-10 rounded-lg border border-white/10" />
                  <div>
                    <h4 className="text-sm font-black text-white">{item.name}</h4>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">局内道具详情</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[11px] text-text-primary leading-relaxed italic">
                      “{item.desc}”
                    </p>
                  </div>
                  {/* 预留数据展示位置 */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-text-secondary font-bold uppercase">核心属性</span>
                    <span className="text-[10px] text-success font-black">已生效</span>
                  </div>
                </div>
                {/* 装饰三角形 */}
                <div className={`
                  absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent
                  ${tooltipSide === 'right' ? 'right-full border-r-white/10' : 'left-full border-l-white/10'}
                `} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
