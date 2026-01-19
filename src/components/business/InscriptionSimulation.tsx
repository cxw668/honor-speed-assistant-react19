import { useState, useMemo, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useDraggable, 
  useDroppable, 
  type DragStartEvent, 
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, RotateCcw, Zap, Info } from 'lucide-react';
import epigraphData from '../../mock/equipment/epigraph.json';

interface InscriptionData {
  name: string;
  attr_detail: Record<string, number>;
  attr_desc: string;
  type: 'red' | 'blue' | 'green';
}

interface InscriptionSimulationProps {
  recommendedInscriptions?: { name: string; count: number; type: string }[];
  onClose?: () => void;
}

// 可拖拽的铭文组件
function DraggableInscription({ data, isOverlay = false }: { data: InscriptionData; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `pool-${data.name}`,
    data,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const colors = {
    red: 'bg-red-500 shadow-red-500/20',
    blue: 'bg-blue-500 shadow-blue-500/20',
    green: 'bg-green-500 shadow-green-500/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        w-10 h-10 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing
        transition-all hover:scale-105 select-none text-white font-bold text-xs md:text-sm
        ${colors[data.type]} shadow-lg border-2 border-white/20
        ${isOverlay ? 'opacity-90 scale-110 z-50 cursor-grabbing' : ''}
      `}
    >
      <span>{data.name}</span>
    </div>
  );
}

// 铭文槽位组件
function InscriptionSlot({ 
  id, 
  inscription, 
  type,
  onRemove 
}: { 
  id: string; 
  inscription: InscriptionData | null; 
  type: 'red' | 'blue' | 'green';
  onRemove: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type },
  });

  const colors = {
    red: 'border-red-500/20 bg-red-500/5',
    blue: 'border-blue-500/20 bg-blue-500/5',
    green: 'border-green-500/20 bg-green-500/5',
  };

  const activeColors = {
    red: 'border-red-500 bg-red-500/20',
    blue: 'border-blue-500 bg-blue-500/20',
    green: 'border-green-500 bg-green-500/20',
  };

  const fillColors = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-dashed flex items-center justify-center transition-all relative
        ${isOver ? activeColors[type] : inscription ? 'border-transparent' : colors[type]}
      `}
    >
      {inscription ? (
        <div 
          onClick={() => onRemove(id)}
          className={`w-full h-full rounded-full ${fillColors[type]} flex items-center justify-center text-white font-bold text-[10px] md:text-xs cursor-pointer hover:opacity-80 transition-opacity shadow-md`}
        >
          {inscription.name}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-500 rounded-full flex items-center justify-center shadow-sm scale-0 group-hover:scale-100 transition-transform">
            <Trash2 size={10} />
          </div>
        </div>
      ) : (
        <div className={`w-2 h-2 rounded-full ${fillColors[type]} opacity-20`} />
      )}
    </div>
  );
}

export function InscriptionSimulation({ recommendedInscriptions, onClose:_onClose }: InscriptionSimulationProps) {
  const [slots, setSlots] = useState<Record<string, InscriptionData | null>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<InscriptionData | null>(null);

  // 初始化槽位
  useEffect(() => {
    const initialSlots: Record<string, InscriptionData | null> = {};
    for (let i = 0; i < 10; i++) initialSlots[`red-${i}`] = null;
    for (let i = 0; i < 10; i++) initialSlots[`blue-${i}`] = null;
    for (let i = 0; i < 10; i++) initialSlots[`green-${i}`] = null;
    setSlots(initialSlots);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  // 铭文池数据
  const allInscriptions: InscriptionData[] = useMemo(() => {
    const pool: InscriptionData[] = [];
    epigraphData.red_inscriptions.forEach(ins => {
      const attrDetail: Record<string, number> = {};
      Object.entries(ins.attr_detail).forEach(([k, v]) => {
        if (typeof v === 'number') attrDetail[k] = v;
      });
      pool.push({ name: ins.name, attr_detail: attrDetail, attr_desc: ins.attr_desc, type: 'red' });
    });
    epigraphData.blue_inscriptions.forEach(ins => {
      const attrDetail: Record<string, number> = {};
      Object.entries(ins.attr_detail).forEach(([k, v]) => {
        if (typeof v === 'number') attrDetail[k] = v;
      });
      pool.push({ name: ins.name, attr_detail: attrDetail, attr_desc: ins.attr_desc, type: 'blue' });
    });
    epigraphData.green_inscriptions.forEach(ins => {
      const attrDetail: Record<string, number> = {};
      Object.entries(ins.attr_detail).forEach(([k, v]) => {
        if (typeof v === 'number') attrDetail[k] = v;
      });
      pool.push({ name: ins.name, attr_detail: attrDetail, attr_desc: ins.attr_desc, type: 'green' });
    });
    return pool;  
  }, []);

  // 计算总属性
  const totalStats = useMemo(() => {
    const stats: Record<string, number> = {};
    Object.values(slots).forEach(ins => {
      if (ins) {
        Object.entries(ins.attr_detail).forEach(([key, value]) => {
          stats[key] = (stats[key] || 0) + value;
        });
      }
    });
    return stats;
  }, [slots]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveData(event.active.data.current as InscriptionData);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setActiveId(null);
    setActiveData(null);

    if (over && over.id) {
      const slotId = over.id as string;
      const inscription = active.data.current as InscriptionData;
      const slotType = over.data.current?.type;

      // 检查铭文类型是否匹配槽位类型
      if (inscription.type === slotType) {
        setSlots(prev => ({
          ...prev,
          [slotId]: inscription,
        }));
      }
    }
  };

  const handleRemove = (id: string) => {
    setSlots(prev => ({
      ...prev,
      [id]: null,
    }));
  };

  const handleClear = () => {
    const clearedSlots: Record<string, InscriptionData | null> = {};
    Object.keys(slots).forEach(key => clearedSlots[key] = null);
    setSlots(clearedSlots);
  };

  const handleApplyRecommended = () => {
    if (!recommendedInscriptions) return;
    
    const newSlots = { ...slots };
    // 先清空
    Object.keys(newSlots).forEach(key => newSlots[key] = null);
    
    recommendedInscriptions.forEach(rec => {
      const insData = allInscriptions.find(i => i.name === rec.name);
      if (insData) {
        let count = 0;
        const type = rec.type.toLowerCase() as 'red' | 'blue' | 'green';
        for (let i = 0; i < 10 && count < rec.count; i++) {
          const slotId = `${type}-${i}`;
          if (!newSlots[slotId]) {
            newSlots[slotId] = insData;
            count++;
          }
        }
      }
    });
    setSlots(newSlots);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">铭文模拟器</h3>
            <p className="text-[10px] text-text-secondary">拖拽铭文到槽位，模拟真实加成</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleApplyRecommended}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold transition-colors"
          >
            <Zap size={14} />
            快速套用推荐
          </button>
          <button 
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-page hover:bg-red-50 text-text-secondary hover:text-red-500 rounded-lg text-xs font-bold transition-colors border border-border-light"
          >
            <RotateCcw size={14} />
            重置全部
          </button>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：铭文池 */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-bg-card p-4 rounded-3xl border border-border-light shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-text-secondary px-1">
                <Info size={14} />
                选择铭文拖拽至右侧
              </div>
              
              <div className="flex flex-col gap-6">
                {(['red', 'blue', 'green'] as const).map(type => (
                  <div key={type} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between px-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        type === 'red' ? 'text-red-500' : type === 'blue' ? 'text-blue-500' : 'text-green-500'
                      }`}>
                        {type === 'red' ? '红色铭文 (攻击/暴击)' : type === 'blue' ? '蓝色铭文 (功能/吸血)' : '绿色铭文 (穿透/防御)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {allInscriptions.filter(ins => ins.type === type).map(ins => (
                        <DraggableInscription key={ins.name} data={ins} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：槽位与属性 */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 槽位展示 */}
            <div className="bg-bg-card p-6 rounded-[40px] border border-border-light shadow-sm flex flex-col gap-8">
              {(['red', 'blue', 'green'] as const).map(type => (
                <div key={type} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 px-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      type === 'red' ? 'bg-red-500' : type === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <span className="text-xs font-bold text-text-secondary">
                      {type === 'red' ? '红色槽位' : type === 'blue' ? '蓝色槽位' : '绿色槽位'}
                    </span>
                    <span className="text-[10px] text-text-secondary/50 font-medium">
                      {Object.keys(slots).filter(k => k.startsWith(type) && slots[k]).length} / 10
                    </span>
                  </div>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <InscriptionSlot 
                        key={`${type}-${i}`} 
                        id={`${type}-${i}`} 
                        type={type}
                        inscription={slots[`${type}-${i}`]}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 属性汇总 */}
            <div className="bg-primary/5 p-6 rounded-[40px] border border-primary/10">
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <Zap size={16} fill="currentColor" />
                当前属性总成
              </h4>
              {Object.keys(totalStats).length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
                  {Object.entries(totalStats).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between group">
                      <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">{key}</span>
                      <span className="text-sm font-bold text-text-primary">
                        +{value % 1 === 0 ? value : value.toFixed(1)}{key.includes('率') || key.includes('效果') || key.includes('速度') || key.includes('吸血') || key.includes('回血') || key.includes('移速') || key.includes('缩减') ? '%' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-20 flex items-center justify-center text-text-secondary/50 text-xs italic">
                  尚未配置铭文，请从左侧拖拽开始模拟
                </div>
              )}
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId && activeData ? (
            <DraggableInscription data={activeData} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
