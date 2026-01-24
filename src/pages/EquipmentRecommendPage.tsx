import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button as MuiButton,
  Stack,
  Paper,
  Grid,
  Avatar,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import {
  Search,
  Shield,
  Zap,
  Hammer,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { HeroSelect } from '../components/business/HeroSelect';
import { EquipmentList } from '../components/business/EquipmentList';
import { CopyBtn } from '../components/atomic/CopyBtn';
import { Dialog } from '../components/atomic/Dialog';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
  const [selectedToolForDetail, setSelectedToolForDetail] = useState<any>(null);

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
    <Box sx={{ height: '100%', bgcolor: 'background.default', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden' }}>
        {/* 左侧二级导航菜单 (移动端改为顶部横向菜单) */}
        <Box
          component="aside"
          sx={{
            width: { xs: '100%', md: 280 },
            shrink: 0,
            borderRight: { xs: 'none', md: '1px solid' },
            borderBottom: { xs: '1px solid', md: 'none' },
            borderColor: alpha(theme.palette.divider, 0.1),
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            py: { xs: 1, md: 4 },
            px: { xs: 1, md: 2 },
            gap: 1,
            zIndex: 200,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          <Box sx={{ px: 2, mb: 4, display: { xs: 'none', md: 'block' } }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 900,
                color: 'text.secondary',
                letterSpacing: '0.2em',
                opacity: 0.6
              }}
            >
              实验室模块
            </Typography>
          </Box>

          {[
            { id: 'equipment', label: '出装推荐', icon: <Shield size={20} /> },
            { id: 'skills', label: '召唤师技能', icon: <Zap size={20} /> },
            { id: 'tools', label: '局内道具', icon: <Hammer size={20} /> }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <MuiButton
                key={tab.id}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('tab', tab.id);
                  window.location.hash = `#/equipment?${params.toString()}`;
                }}
                startIcon={<Box sx={{ display: { xs: 'none', md: 'flex' } }}>{tab.icon}</Box>}
                sx={{
                  flexShrink: 0,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  px: { xs: 2, md: 3 },
                  py: { xs: 1, md: 2 },
                  borderRadius: { xs: 2, md: 4 },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  fontWeight: 800,
                  fontSize: { xs: '13px', md: '15px' },
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.action.hover, 0.05),
                    color: isActive ? 'primary.main' : 'text.primary',
                    transform: { xs: 'none', md: 'translateX(4px)' }
                  },
                  '& .MuiButton-startIcon': {
                    mr: { xs: 0, md: 2 },
                    color: isActive ? 'primary.main' : 'inherit',
                    transition: 'transform 0.3s',
                    transform: isActive ? 'scale(1.1)' : 'none'
                  }
                }}
              >
                <Box component="span" sx={{ display: { xs: 'block', md: 'block' }, tracking: '0.02em' }}>
                  {tab.label}
                </Box>
                {isActive && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      ml: 'auto',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      boxShadow: `0 0 10px ${theme.palette.primary.main}`
                    }}
                  />
                )}
                <Box sx={{ display: { xs: 'none', md: 'none' } }}>{tab.icon}</Box>
              </MuiButton>
            );
          })}

          {/* 底部装饰 */}
          <Box sx={{ mt: 'auto', p: 2, display: { xs: 'none', md: 'block' } }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.action.hover, 0.05),
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.05)
              }}
            >
              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>
                当前版本: v1.0.4
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  数据实时同步
                </Typography>
              </Stack>
            </Paper>
          </Box>
        </Box>

        {/* 主内容区 */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ maxWidth: '1600px', mx: 'auto', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: { md: 4, xs: 2 }, overflow: 'hidden' }}>
            {activeTab === 'equipment' ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
                {/* 英雄选择面板 */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: { xs: 4, md: 6 },
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, md: 4 },
                    zIndex: 150,
                    animation: 'fadeInDown 0.7s ease-out'
                  }}
                >
                  <Box sx={{ position: 'relative', flexShrink: 0, alignSelf: { xs: 'center', sm: 'auto' } }}>
                    <Avatar
                      src={allHeroes.find(h => h.id === selectedHeroId)?.heroSrc || allHeroes.find(h => h.id === selectedHeroId)?.avatar}
                      variant="rounded"
                      sx={{
                        width: { xs: 72, md: 96 },
                        height: { xs: 72, md: 96 },
                        borderRadius: { xs: 3, md: 5 },
                        border: '2px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.2),
                        boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: alpha(theme.palette.common.black, 0.6),
                        backdropFilter: 'blur(4px)',
                        py: 0.5,
                        textAlign: 'center',
                        borderBottomLeftRadius: { xs: 12, md: 20 },
                        borderBottomRightRadius: { xs: 12, md: 20 }
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 900 }}>
                        {getHeroNameById(selectedHeroId)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: { xs: 'stretch', lg: 'center' }, justifyContent: 'space-between', gap: { xs: 2, md: 3 } }}>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Box sx={{ width: 4, height: 16, bgcolor: 'primary.main', borderRadius: 1, boxShadow: `0 0 8px ${theme.palette.primary.main}` }} />
                        <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', tracking: '-0.02em', fontSize: { xs: '16px', md: '1.25rem' } }}>
                          智能出装实验室
                        </Typography>
                      </Stack>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        官网实时同步最优方案
                      </Typography>
                    </Box>

                    <Stack flexDirection='row' sx={{ alignItems: 'center' }}>
                      <Box sx={{ flex: 1, maxWidth: { xs: '100%', lg: 600 } }}>
                        <Typography variant="overline" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 900, letterSpacing: '0.1em' }}>
                          更换目标英雄
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box sx={{ flex: 1, bgcolor: alpha(theme.palette.action.hover, 0.05), borderRadius: 3, p: 0.5, border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
                            <HeroSelect value={selectedHeroId} onChange={setSelectedHeroId} />
                          </Box>
                          <Box sx={{ display: { xs: 'none', md: 'block' }, overflow: 'hidden' }}>
                            <Stack direction="row" spacing={1}>
                              {allHeroes.find(h => h.id === selectedHeroId)?.heroTypes.map(type => (
                                <Box
                                  key={type}
                                  sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    color: 'primary.main',
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: alpha(theme.palette.primary.main, 0.2),
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {type}
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>

                      <Box sx={{ mt: 4, ml: 1, width: { xs: 140, sm: 160 } }}>
                        <CopyBtn text={copyText} />
                      </Box>
                    </Stack>

                  </Box>
                </Paper>

                {equipmentSets.length > 0 ? (
                  <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3} sx={{ flexShrink: 0 }}>
                      {equipmentSets.slice(0, 2).map((set, setIdx) => (
                        <Grid size={{ xs: 12, lg: 6 }} key={setIdx}>
                          <Paper
                            elevation={0}
                            sx={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              borderRadius: { xs: 4, md: 6 },
                              border: '1px solid',
                              borderColor: alpha(theme.palette.divider, 0.1),
                              bgcolor: alpha(theme.palette.background.paper, 0.6),
                              backdropFilter: 'blur(20px)',
                              overflow: 'hidden',
                              transition: 'all 0.3s',
                              animation: `fadeInUp 0.5s ease-out ${setIdx * 0.1}s both`,
                              '&:hover': {
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}`
                              }
                            }}
                          >
                            {/* 方案头部 */}
                            <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid', borderColor: alpha(theme.palette.divider, 0.05), display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Stack direction="row" spacing={{ xs: 1.5, md: 2 }} alignItems="center">
                                <Box sx={{
                                  width: { xs: 32, md: 40 },
                                  height: { xs: 32, md: 40 },
                                  borderRadius: { xs: 2, md: 3 },
                                  bgcolor: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 900,
                                  fontSize: { xs: '14px', md: '18px' },
                                  boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                                }}>
                                  {setIdx + 1}
                                </Box>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.2, fontSize: { xs: '13px', md: '0.875rem' } }}>
                                    官方推荐方案
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: { xs: '10px', md: '0.75rem' } }}>
                                    Official Pro Set
                                  </Typography>
                                </Box>
                              </Stack>
                              <Box sx={{ px: { xs: 1, md: 1.5 }, py: 0.5, bgcolor: alpha(theme.palette.success.main, 0.1), borderRadius: 2, border: '1px solid', borderColor: alpha(theme.palette.success.main, 0.2), display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
                                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 900, fontSize: { xs: '10px', md: '0.75rem' } }}>同步中</Typography>
                              </Box>
                            </Box>

                            {/* 装备列表区 */}
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 4 }, overflow: 'hidden' }}>
                              <Box sx={{ bgcolor: alpha(theme.palette.action.hover, 0.03), borderRadius: { xs: 3, md: 4 }, border: '1px solid', borderColor: alpha(theme.palette.divider, 0.05) }}>
                                <EquipmentList
                                  onUpdateList={() => { }}
                                  list={set.items}
                                  tooltipSide={setIdx === 0 ? 'right' : 'left'}
                                />
                              </Box>

                              {set.tips && (
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                                  <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1, mb: 0.5 }}>
                                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
                                    <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 900, letterSpacing: '0.1em', fontSize: { xs: '10px', md: '0.75rem' } }}>
                                      思路分析
                                    </Typography>
                                  </Stack>
                                  <Box
                                    sx={{
                                      flex: 1,
                                      p: { xs: 2, md: 3 },
                                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                                      borderRadius: { xs: 3, md: 4 },
                                      border: '1px solid',
                                      borderColor: alpha(theme.palette.primary.main, 0.1),
                                      overflowY: 'auto',
                                      '&::-webkit-scrollbar': { width: '4px' },
                                      '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.primary.main, 0.2), borderRadius: '4px' }
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.8, fontStyle: 'italic', fontWeight: 500, fontSize: { xs: '12px', md: '0.875rem' } }}>
                                      “{set.tips.replace('Tips：', '')}”
                                    </Typography>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.action.hover, 0.05),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.1),
                      animation: 'pulse 3s infinite'
                    }}>
                      <AlertCircle size={40} color={theme.palette.text.secondary} />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', mb: 1 }}>
                        暂无出装数据
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        该英雄暂无官方推荐方案，请尝试选择其他英雄
                      </Typography>
                    </Box>
                    <MuiButton
                      variant="contained"
                      startIcon={<RotateCcw size={18} />}
                      onClick={() => setSelectedHeroId(1)}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 800,
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`
                      }}
                    >
                      重置为默认英雄
                    </MuiButton>
                  </Box>
                )}
              </Box>
            ) : activeTab === 'skills' ? (
              <Box sx={{ flex: 1, overflowY: 'auto', px: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
                <Grid container spacing={3} sx={{ maxWidth: 1000, mx: 'auto' }}>
                  {summonerSkills.map((skill, index) => (
                    <Grid size={{ xs: 12, md: 6 }} key={skill.name}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: { xs: 1.5, md: 2 },
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 2, md: 3 },
                          borderRadius: { xs: 4, md: 6 },
                          border: '1px solid',
                          borderColor: alpha(theme.palette.divider, 0.1),
                          bgcolor: alpha(theme.palette.background.paper, 0.6),
                          backdropFilter: 'blur(20px)',
                          transition: 'all 0.3s',
                          animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                          '&:hover': {
                            borderColor: alpha(theme.palette.primary.main, 0.3),
                            transform: 'translateY(-4px)',
                            boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.2)}`
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative', shrink: 0 }}>
                          <Avatar
                            src={skill.icon}
                            variant="rounded"
                            sx={{
                              width: { xs: 40, md: 48 },
                              height: { xs: 40, md: 48 },
                              borderRadius: { xs: 2, md: 4 },
                              boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.3)}`
                            }}
                          />
                          <Box sx={{ position: 'absolute', inset: 0, bgcolor: alpha(theme.palette.primary.main, 0.2), filter: 'blur(20px)', borderRadius: '50%', zIndex: -1 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5, tracking: '-0.01em', fontSize: { xs: '14px', md: '1.125rem' } }}>
                            {skill.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: { xs: '11px', md: '0.875rem' } }}>
                            {skill.description}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* 搜索与分类区 */}
                <Box sx={{ mb: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 2, md: 3 }, shrink: 0 }}>
                  <TextField  
                    fullWidth
                    placeholder="搜索局内道具..."
                    value={toolSearch}
                    onChange={(e) => setToolSearch(e.target.value)}
                    sx={{
                      maxWidth: 600,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: { xs: 3, md: 4 },
                        bgcolor: alpha(theme.palette.background.paper, 0.6),
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.3s',
                        '&:hover': { bgcolor: alpha(theme.palette.background.paper, 0.8) },
                        '&.Mui-focused': { bgcolor: alpha(theme.palette.background.paper, 1) }
                      }
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={20} color={theme.palette.primary.main} />
                          </InputAdornment>
                        ),
                        endAdornment: toolSearch && (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setToolSearch('')}>
                              <RotateCcw size={16} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />

                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap', overflowX: 'auto', width: '100%', justifyContent: { xs: 'flex-start', md: 'center' }, gap: 1, pb: { xs: 1, md: 0 }, '&::-webkit-scrollbar': { display: 'none' } }}>
                    {CATEGORIES.map(cat => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <MuiButton
                          key={cat.id}
                          variant={isActive ? 'contained' : 'text'}
                          onClick={() => setActiveCategory(cat.id)}
                          sx={{
                            borderRadius: { xs: 2, md: 3 },
                            px: { xs: 2, md: 3 },
                            py: { xs: 0.5, md: 1 },
                            minWidth: 'fit-content',
                            fontWeight: 800,
                            fontSize: { xs: '12px', md: '0.875rem' },
                            color: isActive ? 'white' : 'text.secondary',
                            bgcolor: isActive ? 'primary.main' : alpha(theme.palette.action.hover, 0.05),
                            border: '1px solid',
                            borderColor: isActive ? 'primary.main' : 'transparent',
                            '&:hover': {
                              bgcolor: isActive ? 'primary.dark' : alpha(theme.palette.action.hover, 0.1),
                              borderColor: isActive ? 'primary.dark' : alpha(theme.palette.divider, 0.1)
                            }
                          }}
                        >
                          {cat.name}
                        </MuiButton>
                      );
                    })}
                  </Stack>
                </Box>

                {/* 道具列表区 */}
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                  <Grid container spacing={2}>
                    {filteredTools.map((tool, index) => {
                      const detail = getToolDetail(tool.tool);
                      return (
                        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4, xl: 2 }} key={tool.tool}>
                          <Tooltip
                            disableHoverListener={isMobile}
                            disableTouchListener={isMobile}
                            title={
                              <Box
                                sx={{
                                  p: 1.5,
                                  maxWidth: { md: 280, xs: 240 },
                                  bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
                                  backdropFilter: 'blur(12px)',
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: (theme) => alpha(theme.palette.divider, 0.1),
                                  boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
                                }}
                              >
                                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', mb: 1.5, borderBottom: '1px solid', borderColor: (theme) => alpha(theme.palette.primary.main, 0.2), pb: 0.5 }}>
                                  {tool.tool}
                                </Typography>
                                {detail?.found && (
                                  <Stack spacing={1.5}>
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', fontWeight: 900 }}>
                                      价格: {detail.price}
                                    </Typography>
                                    <Box>
                                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>属性</Typography>
                                      <Typography variant="caption" sx={{ color: 'text.primary', lineHeight: 1.6, display: 'block' }}>{detail.stats.replace(/<[^>]+>/g, '')}</Typography>
                                    </Box>
                                    {detail.passive && (
                                      <Box>
                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900, display: 'block', mb: 0.5, textTransform: 'uppercase' }}>被动/主动</Typography>
                                        <Typography variant="caption" sx={{ color: 'text.primary', lineHeight: 1.6, display: 'block' }}>{detail.passive.replace(/<[^>]+>/g, '')}</Typography>
                                      </Box>
                                    )}
                                  </Stack>
                                )}
                              </Box>
                            }
                            arrow
                            placement="top"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  bgcolor: 'transparent',
                                  p: 0,
                                  '& .MuiTooltip-arrow': {
                                    color: (theme) => alpha(theme.palette.background.paper, 0.8),
                                  }
                                }
                              }
                            }}
                          >
                            <Paper
                              elevation={0}
                              onClick={() => isMobile && setSelectedToolForDetail({ ...tool, ...detail })}
                              sx={{
                                p: { xs: 1.5, md: 2 },
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: { xs: 1, md: 2 },
                                borderRadius: { xs: 3, md: 5 },
                                border: '1px solid',
                                borderColor: alpha(theme.palette.divider, 0.1),
                                bgcolor: alpha(theme.palette.background.paper, 0.4),
                                backdropFilter: 'blur(20px)',
                                cursor: isMobile ? 'pointer' : 'help',
                                transition: 'all 0.3s',
                                animation: `fadeInUp 0.4s ease-out ${index * 0.01}s both`,
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                                  transform: isMobile ? 'none' : 'scale(1.05)',
                                  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.2)}`
                                }
                              }}
                            >
                              <Avatar
                                src={tool.tool_src}
                                variant="rounded"
                                sx={{
                                  width: { xs: 44, md: 56 },
                                  height: { xs: 44, md: 56 },
                                  borderRadius: { xs: 2, md: 3 },
                                  border: '1px solid',
                                  borderColor: alpha(theme.palette.divider, 0.1)
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', textAlign: 'center', fontSize: { xs: '11px', md: '0.875rem' } }}>
                                {tool.tool}
                              </Typography>
                            </Paper>
                          </Tooltip>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* 道具详情弹窗 (移动端) */}
      <Dialog
        isOpen={!!selectedToolForDetail}
        onClose={() => setSelectedToolForDetail(null)}
        title="道具详情"
        sx={{
          maxWidth: '400px',
          '& .MuiDialogContent-root': { p: 0 }
        }}
      >
        {selectedToolForDetail && (
          <Box sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                src={selectedToolForDetail.tool_src}
                variant="rounded"
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.1),
                  boxShadow: `0 8px 16px ${alpha(theme.palette.common.black, 0.2)}`
                }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', mb: 0.5 }}>
                  {selectedToolForDetail.tool}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 900 }}>
                  价格: {selectedToolForDetail.price}
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={3}>
              <Box>
                <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 900, display: 'block', mb: 1, letterSpacing: '0.1em' }}>
                  基础属性
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.1)
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, fontWeight: 500 }}>
                    {selectedToolForDetail.stats?.replace(/<[^>]+>/g, '') || '暂无属性数据'}
                  </Typography>
                </Paper>
              </Box>

              {selectedToolForDetail.passive && (
                <Box>
                  <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 900, display: 'block', mb: 1, letterSpacing: '0.1em' }}>
                    被动/主动技能
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.05),
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.success.main, 0.1)
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, fontWeight: 500 }}>
                      {selectedToolForDetail.passive?.replace(/<[^>]+>/g, '')}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Stack>

            <MuiButton
              fullWidth
              variant="contained"
              onClick={() => setSelectedToolForDetail(null)}
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 800,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              关闭详情
            </MuiButton>
          </Box>
        )}
      </Dialog>
    </Box>
  );
}
