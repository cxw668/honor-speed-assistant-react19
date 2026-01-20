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
import { Trash2, RotateCcw, Zap, Info, LayoutGrid } from 'lucide-react';
import epigraphData from '../../mock/equipment/epigraph.json';
import epigraphImgData from '../../mock/equipment/epigraph_img.json';

// 铭文图标映射表
const EPIGRAPH_ICONS: Record<string, string> = {};
epigraphImgData.forEach(item => {
  // 将 "铭文狩猎" 转换为 "狩猎" 作为键
  const shortName = item.name.replace('铭文', '');
  EPIGRAPH_ICONS[shortName] = item.src;
});

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

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        w-12 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing
        transition-all hover:scale-110 select-none
        ${isOverlay ? 'opacity-90 scale-125 z-50 cursor-grabbing' : ''}
      `}
      style={style}
    >
      {EPIGRAPH_ICONS[data.name] ? (
        <img 
          src={EPIGRAPH_ICONS[data.name]} 
          alt={data.name} 
          className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
        />
      ) : (
        <div className={`
          w-10 h-10 flex items-center justify-center text-[10px] md:text-xs leading-none rounded-full border border-white/20 bg-white/5
        `}>
          {data.name.substring(0, 2)}
        </div>
      )}
    </div>
  );
}

// 铭文槽位组件 - 六边形样式
function InscriptionSlot({ 
  id, 
  inscription, 
  type,
  onRemove,
  style
}: { 
  id: string; 
  inscription: InscriptionData | null; 
  type: 'red' | 'blue' | 'green';
  onRemove: (id: string) => void;
  style?: React.CSSProperties;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type },
  });

  const colors = {
    red: 'text-[#ff4d4f] border-[#ff4d4f]/30 bg-[#ff4d4f]/5',
    blue: 'text-[#1890ff] border-[#1890ff]/30 bg-[#1890ff]/5',
    green: 'text-[#52c41a] border-[#52c41a]/30 bg-[#52c41a]/5',
  };

  const activeColors = {
    red: 'text-[#ff4d4f] border-[#ff4d4f] bg-[#ff4d4f]/20',
    blue: 'text-[#1890ff] border-[#1890ff] bg-[#1890ff]/20',
    green: 'text-[#52c41a] border-[#52c41a] bg-[#52c41a]/20',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        absolute w-14 h-16 transition-all duration-300 group
        ${isOver ? 'scale-110' : ''}
      `}
    >
      {/* 外层发光效果 */}
      {isOver && (
        <div 
          className="absolute inset-[-4px] opacity-40 blur-md animate-pulse"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'currentColor'
          }}
        />
      )}

      {/* 六边形底座 */}
      <div 
        className={`
          w-full h-full relative flex items-center justify-center
          transition-all duration-300 overflow-hidden
          ${isOver ? activeColors[type] : colors[type]}
        `}
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
        }}
      >
        {/* 边框模拟 (由于 clip-path 会裁剪掉 border) */}
        <div 
          className="absolute inset-0 border border-current opacity-30"
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        />

        {inscription ? (
          <div 
            onClick={() => onRemove(id)}
            className="w-full h-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform relative z-10"
          >
            {EPIGRAPH_ICONS[inscription.name] ? (
              <img 
                src={EPIGRAPH_ICONS[inscription.name]} 
                alt={inscription.name} 
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]" 
              />
            ) : (
              <span className="text-[10px] font-black text-white drop-shadow-md">{inscription.name.substring(0, 2)}</span>
            )}
            
            {/* 移除按钮层 */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <Trash2 size={14} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        )}
      </div>
    </div>
  );
}

export function InscriptionSimulation({ recommendedInscriptions, onClose:_onClose }: InscriptionSimulationProps) {
  const [slots, setSlots] = useState<Record<string, InscriptionData | null>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<InscriptionData | null>(null);

  // 定义铭文池网格坐标 (基于六边形网格系统)
  // x: 水平轴 (列), y: 垂直轴 (行)
  const POOL_LAYOUT = useMemo(() => {
    const layout: { id: string; type: 'red' | 'blue' | 'green'; x: number; y: number }[] = [];
    
    // 1. 蓝色铭文 (左侧弧形 - 10个)
    const blueCoords = [
      { x: 1.0, y: 0.5 }, { x: 2.0, y: 0.5 },
      { x: 0.5, y: 1.5 }, { x: 1.5, y: 1.5 },
      { x: 0.2, y: 2.5 }, { x: 1.2, y: 2.5 },
      { x: 0.5, y: 3.5 }, { x: 1.5, y: 3.5 },
      { x: 1.0, y: 4.5 }, { x: 2.0, y: 4.5 }
    ];
    blueCoords.forEach((coord, i) => layout.push({ id: `blue-${i}`, type: 'blue', ...coord }));

    // 2. 绿色铭文 (中间区域 - 10个)
    const greenCoords = [
      { x: 3.0, y: 1.0 }, { x: 4.0, y: 1.0 },
      { x: 2.5, y: 2.0 }, { x: 3.5, y: 2.0 }, { x: 4.5, y: 2.0 },
      { x: 2.5, y: 3.0 }, { x: 3.5, y: 3.0 }, { x: 4.5, y: 3.0 },
      { x: 3.0, y: 4.0 }, { x: 4.0, y: 4.0 }
    ];
    greenCoords.forEach((coord, i) => layout.push({ id: `green-${i}`, type: 'green', ...coord }));

    // 3. 红色铭文 (右侧弧形 - 10个)
    const redCoords = [
      { x: 5.0, y: 0.5 }, { x: 6.0, y: 0.5 },
      { x: 5.5, y: 1.5 }, { x: 6.5, y: 1.5 },
      { x: 5.8, y: 2.5 }, { x: 6.8, y: 2.5 },
      { x: 5.5, y: 3.5 }, { x: 6.5, y: 3.5 },
      { x: 5.0, y: 4.5 }, { x: 6.0, y: 4.5 }
    ];
    redCoords.forEach((coord, i) => layout.push({ id: `red-${i}`, type: 'red', ...coord }));

    return layout;
  }, []);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-black text-xl text-text-primary tracking-tight">铭文模拟器</h3>
            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Drag & Match Simulation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleApplyRecommended}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
          >
            <Zap size={14} fill="currentColor" />
            一键套用推荐
          </button>
          <button 
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-bg-card hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded-xl text-xs font-bold transition-all border border-border-light hover:border-red-500/50"
          >
            <RotateCcw size={14} />
            全部重置
          </button>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-6 bg-[#0a192f] p-4 md:p-8 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative min-h-[600px]">
          {/* 背景装饰纹理 */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />

          {/* 左侧：选择铭文池 */}
          <div className="lg:w-1/4 flex flex-col gap-4 relative z-10">
            <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-[32px] border border-white/10 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1">
                <LayoutGrid size={12} />
                Epigraph Warehouse
              </div>
              
              <div className="flex flex-col gap-8 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[600px]">
                {(['red', 'blue', 'green'] as const).map(type => (
                  <div key={type} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between px-1">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${
                        type === 'red' ? 'bg-red-500/20 text-red-400' : type === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {type === 'red' ? '红色 · 攻击/暴击' : type === 'blue' ? '蓝色 · 生命/吸血' : '绿色 · 穿透/缩减'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                      {allInscriptions.filter(ins => ins.type === type).map(ins => (
                        <div key={ins.name} className="flex flex-col items-center gap-1">
                          <DraggableInscription data={ins} />
                          <span className="text-[9px] text-white/40 font-medium truncate w-full text-center">{ins.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 中间：六边形网格铭文池 */}
          <div className="lg:w-2/4 flex items-center justify-center min-h-[500px] relative z-10 py-10">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              {/* 中心装饰 */}
              <div className="absolute w-32 h-32 opacity-10 pointer-events-none">
                <Zap size={128} className="text-primary" fill="currentColor" />
              </div>
              
              <div className="relative w-full h-full">
                {POOL_LAYOUT.map((slot) => {
                  const hexW = 56; // 基础宽度
                  const hexH = 64; // 基础高度
                  const spacingX = hexW * 0.88; // 水平间距
                  const spacingY = hexH * 0.92; // 垂直间距
                  
                  return (
                    <InscriptionSlot 
                      key={slot.id} 
                      id={slot.id} 
                      type={slot.type}
                      inscription={slots[slot.id]}
                      onRemove={handleRemove}
                      style={{
                        left: `calc(50% + ${(slot.x - 3.5) * spacingX}px)`,
                        top: `calc(50% + ${(slot.y - 2.5) * spacingY}px)`,
                        width: `${hexW}px`,
                        height: `${hexH}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右侧：属性面板 */}
          <div className="lg:w-1/4 flex flex-col gap-6 relative z-10">
            {/* 总等级 */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-[32px] border border-white/10 flex flex-col items-center group hover:bg-white/[0.05] transition-colors">
              <div className="relative mb-4">
                <div 
                  className="w-24 h-24 flex flex-col items-center justify-center border-2 border-primary/30 text-primary group-hover:border-primary transition-colors"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                  <span className="text-4xl font-black relative z-10">{Object.values(slots).filter(Boolean).length * 5}</span>
                  <span className="text-[10px] font-black opacity-40 relative z-10 uppercase tracking-tighter">Level</span>
                </div>
                {/* 装饰光圈 */}
                <div className="absolute inset-[-10px] border border-primary/10 rounded-full animate-[spin_10s_linear_infinite]" />
              </div>
              <h4 className="text-sm font-black text-white/80 uppercase tracking-widest">铭文总等级</h4>
              <p className="text-[10px] text-white/30 mt-1">Total Epigraph Level</p>
            </div>

            {/* 属性列表 */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-[32px] border border-white/10 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/10 pb-3">
                <Info size={12} />
                Attribute Bonus
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                {Object.keys(totalStats).length > 0 ? (
                  Object.entries(totalStats).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between group/item">
                      <span className="text-xs text-white/50 group-hover/item:text-white/80 transition-colors">{key}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="h-full bg-primary/50" 
                            style={{ width: `${Math.min(100, (value / (key.includes('攻击') ? 200 : 20)) * 100)}%` }} 
                          />
                        </div>
                        <span className="text-sm text-primary font-black min-w-[50px] text-right">
                          +{value % 1 === 0 ? value : value.toFixed(1)}{key.includes('率') || key.includes('效果') || key.includes('速度') || key.includes('吸血') || key.includes('回血') || key.includes('移速') || key.includes('缩减') ? '%' : ''}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20">
                    <div className="w-12 h-12 border border-white/50 rounded-full flex items-center justify-center mb-4" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                      <RotateCcw size={20} />
                    </div>
                    <p className="text-[10px] font-bold italic tracking-widest uppercase">No Attributes</p>
                  </div>
                )}
              </div>

              {/* 底部提示 */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-2">
                <div className="p-1 rounded-md bg-white/5 text-white/40">
                  <Info size={10} />
                </div>
                <p className="text-[9px] text-white/30 leading-relaxed">
                  铭文属性加成仅供参考，实际数值以游戏内等级为准。
                </p>
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId && activeData ? (
            <div className="scale-125 rotate-12 drop-shadow-2xl">
              <DraggableInscription data={activeData} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
