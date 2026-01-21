import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
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
import { Box, Typography, Stack, alpha, useTheme, Tooltip } from '@mui/material';
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
  recommendDesc?: string;
  copyText?: string;
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
    <Box
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
        <Box
          component="img"
          src={EPIGRAPH_ICONS[data.name]}
          alt={data.name}
          className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
        />
      ) : (
        <Box className={`
          w-10 h-10 flex items-center justify-center text-[10px] md:text-xs leading-none rounded-full border border-white/20 bg-white/5
        `}>
          {data.name.substring(0, 2)}
        </Box>
      )}
    </Box>
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
    <Box
      ref={setNodeRef}
      style={style}
      className={`
        absolute w-14 h-16 transition-all duration-300 group
        ${isOver ? 'scale-110' : ''}
      `}
    >
      {/* 外层发光效果 */}
      {isOver && (
        <Box
          className="absolute inset-[-4px] opacity-40 blur-md animate-pulse"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'currentColor'
          }}
        />
      )}

      {/* 六边形底座 */}
      <Box
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
        <Box
          className="absolute inset-0 border border-current opacity-30"
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        />

        {inscription ? (
          <Box
            onClick={() => onRemove(id)}
            className="w-full h-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform relative z-10"
          >
            {EPIGRAPH_ICONS[inscription.name] ? (
              <Box
                component="img"
                src={EPIGRAPH_ICONS[inscription.name]}
                alt={inscription.name}
                className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <Box component="span" className="text-[10px] font-black text-white drop-shadow-md">{inscription.name.substring(0, 2)}</Box>
            )}

            {/* 移除按钮层 */}
            <Box className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
              <Trash2 size={14} className="text-white" />
            </Box>
          </Box>
        ) : (
          <Box className="w-1.5 h-1.5 rounded-full bg-white/20" />
        )}
      </Box>
    </Box>
  );
}

// 描述弹窗
function descDialog(text: string, type: 'red' | 'blue' | 'green', theme: any) {
  const color = type === 'red' ? theme.palette.error.main : type === 'blue' ?  '#00b0ff' : theme.palette.success.main;
  return (
    <Box sx={{ p: 0.5 }}>
      <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mb: 0.8 }}>
        <Box 
          sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            bgcolor: color,
            boxShadow: `0 0 8px ${color}`
          }} 
        />
        <Typography 
          sx={{ 
            fontSize: '12px', 
            fontWeight: 800, 
            color,
            letterSpacing: '0.05em'
          }}
        >
          {type === 'red' ? '红色铭文' : type === 'blue' ? '蓝色铭文' : '绿色铭文'}
        </Typography>
      </Stack>
      <Typography 
        sx={{ 
          fontSize: '11px', 
          lineHeight: 1.6,
          color: (theme: any) => alpha(theme.palette.text.primary, 0.9),
          fontWeight: 500,
          fontFamily: theme.typography.fontFamily
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
export interface InscriptionSimulationHandle {
  applyRecommended: () => void;
  clear: () => void;
}

export const InscriptionSimulation = forwardRef<InscriptionSimulationHandle, InscriptionSimulationProps>(({
  recommendedInscriptions,
  recommendDesc: _recommendDesc,
  copyText: _copyText,
  onClose: _onClose
}, ref) => {
  const theme = useTheme();
  const [slots, setSlots] = useState<Record<string, InscriptionData | null>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<InscriptionData | null>(null);

  useImperativeHandle(ref, () => ({
    applyRecommended: handleApplyRecommended,
    clear: handleClear
  }));

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
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        animation: 'fade-in 0.3s ease-out, zoom-in 0.3s ease-out'
      }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 3,
            bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
            p: { xs: 2, md: 4 },
            borderRadius: '40px',
            border: '1px solid',
            borderColor: (theme) => alpha(theme.palette.divider, 1),
            boxShadow: 10,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* 背景装饰纹理 */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              opacity: 0.03,
              pointerEvents: 'none',
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%, ${alpha(theme.palette.info.main || '#00b0ff', 0.05)} 100%)`,
              pointerEvents: 'none'
            }}
          />

          {/* 左侧：选择铭文池 */}
          <Box sx={{ width: { lg: '25%' }, display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', zIndex: 10 }}>
            <Box
              sx={{
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.3),
                backdropFilter: 'blur(20px)',
                p: 2.5,
                borderRadius: '32px',
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.divider, 1),
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3, px: 0.5 }}>
                <LayoutGrid size={12} style={{ opacity: 0.4 }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 900,
                    color: (theme) => alpha(theme.palette.text.primary, 0.4),
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                  }}
                >
                  Epigraph Warehouse
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  overflowY: 'auto',
                  pr: 1,
                  flex: 1,
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.1), borderRadius: '10px' }
                }}
              >
                {(['red', 'blue', 'green'] as const).map(type => (
                  <Stack key={type} spacing={2}>
                    <Box sx={{ px: 0.5 }}>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: '10px',
                          fontWeight: 900,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '8px',
                          bgcolor: type === 'red' ? alpha(theme.palette.error.main, 0.1) : type === 'blue' ? alpha(theme.palette.info.main || '#00b0ff', 0.1) : alpha(theme.palette.success.main, 0.1),
                          color: type === 'red' ? theme.palette.error.main : type === 'blue' ? (theme.palette.info.main || '#00b0ff') : theme.palette.success.main
                        }}
                      >
                        {type === 'red' ? '红色 · 攻击/暴击' : type === 'blue' ? '蓝色 · 生命/吸血' : '绿色 · 穿透/缩减'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 2,
                        rowGap: 2
                      }}
                    >
                      {allInscriptions.filter(ins => ins.type === type).map(ins => (
                        <Tooltip 
                          key={ins.name}
                          placement='top-start' 
                          title={descDialog(ins.attr_desc, ins.type, theme)} 
                          arrow
                          slotProps={{
                            tooltip: {
                              sx: {
                                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
                                backdropFilter: 'blur(8px)',
                                border: '1px solid',
                                borderColor: (theme) => alpha(theme.palette.divider, 0.1),
                                borderRadius: '12px',
                                boxShadow: (theme) => theme.shadows[4],
                                p: 1,
                                maxWidth: 200
                              }
                            },
                            arrow: {
                              sx: {
                                color: (theme) => alpha(theme.palette.background.paper, 0.95),
                              }
                            }
                          }}
                        >
                          <Stack alignItems="center" spacing={0.5}>
                            <DraggableInscription data={ins} />
                            <Typography
                              noWrap
                              sx={{
                                fontSize: '9px',
                                color: (theme) => alpha(theme.palette.text.primary, 0.4),
                                fontWeight: 500,
                                width: '100%',
                                textAlign: 'center'
                              }}
                            >
                              {ins.name}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      ))}
                    </Box>
                  </Stack>
                ))}
              </Box>
            </Box>
          </Box>

          {/* 中间：六边形网格铭文池 */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyCenter: 'center', minHeight: 0, position: 'relative', zIndex: 9, py: 5 }}>
            <Box sx={{ position: 'relative', width: '100%', maxWidth: '500px', aspectRadio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: { xs: 'scale(0.8)', lg: 'scale(1)' } }}>
              {/* 中心装饰 */}
              <Box sx={{ position: 'absolute', width: 128, height: 128, opacity: 0.1, pointerEvents: 'none' }}>
                <Zap size={128} color={theme.palette.primary.main} fill={theme.palette.primary.main} />
              </Box>

              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
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
              </Box>
            </Box>
          </Box>

          {/* 右侧：属性面板 */}
          <Box sx={{ width: { lg: '25%' }, display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', zIndex: 10 }}>
            {/* 总等级 */}
            <Box
              sx={{
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.3),
                backdropFilter: 'blur(20px)',
                p: 4,
                borderRadius: '32px',
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.divider, 1),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '&:hover': { bgcolor: (theme) => alpha(theme.palette.background.paper, 0.4) },
                transition: 'background-color 0.3s'
              }}
            >
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Box
                  sx={{
                    w: 96, h: 96,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid',
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                    color: 'primary.main',
                    position: 'relative',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    width: 96, height: 96,
                    '&:hover': { borderColor: 'primary.main', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) },
                    transition: 'all 0.3s'
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 900, position: 'relative', zIndex: 10 }}>
                    {Object.values(slots).filter(Boolean).length * 5}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.4, position: 'relative', zIndex: 10, textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
                    Level
                  </Typography>
                </Box>
                {/* 装饰光圈 */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '-10px',
                    border: '1px solid',
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    borderRadius: '50%',
                    animation: 'spin 10s linear infinite',
                    '@keyframes spin': {
                      from: { transform: 'rotate(0deg)' },
                      to: { transform: 'rotate(360deg)' }
                    }
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '14px', fontWeight: 900, color: (theme) => alpha(theme.palette.text.primary, 0.8), textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                铭文总等级
              </Typography>
              <Typography sx={{ fontSize: '10px', color: (theme) => alpha(theme.palette.text.primary, 0.3), mt: 0.5 }}>
                Total Epigraph Level
              </Typography>
            </Box>

            {/* 属性列表 */}
            <Box
              sx={{
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.3),
                backdropFilter: 'blur(20px)',
                p: 3,
                borderRadius: '32px',
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.divider, 1),
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >

              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.1), borderRadius: '10px' }
                }}
              >
                {Object.keys(totalStats).length > 0 ? (
                  Object.entries(totalStats).map(([key, value]) => (
                    <Stack key={key} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.5, '&:hover': { '& .stat-label': { color: 'text.primary' } } }}>
                      <Typography className="stat-label" sx={{ fontSize: '12px', color: (theme) => alpha(theme.palette.text.primary, 0.5), transition: 'color 0.2s' }}>
                        {key}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ height: 4, width: 48, bgcolor: (theme) => alpha(theme.palette.text.primary, 0.05), borderRadius: '2px', overflow: 'hidden', display: { xs: 'none', sm: 'block' } }}>
                          <Box
                            sx={{
                              height: '100%',
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
                              width: `${Math.min(100, (value / (key.includes('攻击') ? 200 : 20)) * 100)}%`
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: '14px', color: 'primary.main', fontWeight: 900, minWidth: '50px', textAlign: 'right' }}>
                          +{value % 1 === 0 ? value : value.toFixed(1)}{key.includes('率') || key.includes('效果') || key.includes('速度') || key.includes('吸血') || key.includes('回血') || key.includes('移速') || key.includes('缩减') ? '%' : ''}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))
                ) : (
                  <Stack flex={1} alignItems="center" justifyContent="center" sx={{ opacity: 0.2, p: 3 }} spacing={1}>
                    <Box
                      sx={{
                        width: 48, height: 48,
                        border: '1px solid',
                        borderColor: 'currentColor',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                      }}
                    >
                      <RotateCcw size={20} />
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      No Attributes
                    </Typography>
                  </Stack>
                )}
              </Box>

              {/* 底部提示 */}
              <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: (theme) => alpha(theme.palette.divider, 1), display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box sx={{ p: 0.5, borderRadius: '4px', bgcolor: (theme) => alpha(theme.palette.text.primary, 0.05), color: (theme) => alpha(theme.palette.text.primary, 0.4) }}>
                  <Info size={10} />
                </Box>
                <Typography sx={{ fontSize: '9px', color: (theme) => alpha(theme.palette.text.primary, 0.3), lineHeight: 1.6 }}>
                  铭文属性加成仅供参考，实际数值以游戏内等级为准。
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <DragOverlay>
          {activeId && activeData ? (
            <Box sx={{ transform: 'scale(1.25) rotate(12deg)', filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))' }}>
              <DraggableInscription data={activeData} isOverlay />
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Box>
  );
});