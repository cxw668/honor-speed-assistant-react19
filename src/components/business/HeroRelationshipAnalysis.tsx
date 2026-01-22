import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Button,
  Grid,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { HeroSelect } from './HeroSelect';
import { Swords, Users, ShieldAlert, Zap, TrendingUp, Info, Trash2, X, ChevronDown } from 'lucide-react';
import heroDetailsData from '../../mock/hero/hero_details.json';
import { useHeroData } from '../../hooks/useHeroData';

interface RelationshipData {
  heroes: { ename: string; cname: string }[];
  descriptions: string[];
}

interface HeroDetail {
  name: string;
  relationships?: {
    "最佳搭档"?: RelationshipData;
    "压制英雄"?: RelationshipData;
    "被压制英雄"?: RelationshipData;
  };
}

/**
 * 英雄槽位组件 - 性能优化版
 * 使用 React.memo 并在外部定义，避免父组件渲染时导致的不必要重绘和闪烁
 */
const TeamSlot = React.memo(({ 
  team, 
  index, 
  isSelected,
  hero,
  onClick 
}: { 
  team: 'my' | 'enemy', 
  index: number, 
  isSelected: boolean,
  hero: any,
  onClick: (team: 'my' | 'enemy', index: number) => void
}) => {
  const theme = useTheme();
  const isError = team === 'enemy';
  const color = isError ? theme.palette.error.main : theme.palette.primary.main;

  return (
    <Box
      onClick={() => onClick(team, index)}
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: 4,
        border: '2px solid',
        bgcolor: alpha(color, 0.05),
        // 移除了 transition，确保选中状态切换是瞬时的，无闪烁
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(isSelected ? {
          borderColor: color,
          boxShadow: `0 0 15px ${alpha(color, 0.3)}`,
          transform: 'scale(1.05)',
          zIndex: 1
        } : {
          '&:hover': {
            borderColor: alpha(color, 0.5),
            transform: 'translateY(-2px)'
          }
        })
      }}
    >
      {hero ? (
        <Box
          component="img"
          src={hero.heroSrc}
          alt={hero.heroName}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <TrendingUp size={24} style={{ color: alpha(color, 0.3) }} />
      )}

      <Box
        className="hover-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: alpha(theme.palette.common.black, 0.2),
          opacity: 0,
          transition: 'opacity 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': { opacity: 1 }
        }}
      >
        <Zap size={16} color="white" />
      </Box>

      {hero && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: alpha(theme.palette.common.black, 0.6),
            backdropFilter: 'blur(4px)',
            py: 0.5,
            px: 1,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'common.white',
              fontWeight: 900,
              fontSize: '10px',
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {hero.heroName}
          </Typography>
        </Box>
      )}
    </Box>
  );
});

export const HeroRelationshipAnalysis: React.FC = () => {
  const { heroList: allHeroes } = useHeroData();
  const [myTeam, setMyTeam] = useState<(number | null)[]>(Array(5).fill(null));
  const [enemyTeam, setEnemyTeam] = useState<(number | null)[]>(Array(5).fill(null));
  const [selectingSlot, setSelectingSlot] = useState<{ team: 'my' | 'enemy', index: number } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const handleSlotClick = React.useCallback((team: 'my' | 'enemy', index: number) => {
    setSelectingSlot({ team, index });
  }, []);

  const handleSelectHero = (heroId: number) => {
    if (!selectingSlot) return;

    const { team, index } = selectingSlot;
    const currentTeam = team === 'my' ? [...myTeam] : [...enemyTeam];

    // 如果当前槽位已有英雄且点击了同一个英雄，不做处理（实际上 HeroSelect 已经处理了禁用）
    if (currentTeam[index] === heroId) return;

    // 更新当前点击的槽位
    currentTeam[index] = heroId;

    if (team === 'my') {
      setMyTeam(currentTeam);
    } else {
      setEnemyTeam(currentTeam);
    }

    // 智能跳转：寻找下一个空槽位
    const nextEmptyIndex = currentTeam.findIndex((id, idx) => id === null && idx > index);
    if (nextEmptyIndex !== -1) {
      setSelectingSlot({ team, index: nextEmptyIndex });
      return;
    }
    
    // 如果没有向后的空位了，检查前面是否有空槽位
    const prevEmptyIndex = currentTeam.findIndex((id, idx) => id === null && idx < index);
    if (prevEmptyIndex !== -1) {
      setSelectingSlot({ team, index: prevEmptyIndex });
      return;
    }

    // 如果该队伍所有槽位都已选满，则自动关闭选择面板
    setSelectingSlot(null);
  };

  const handleRemoveHero = (heroId: number) => {
    if (!selectingSlot) return;
    const { team } = selectingSlot;
    const currentTeam = team === 'my' ? [...myTeam] : [...enemyTeam];

    const indexToRemove = currentTeam.indexOf(heroId);
    if (indexToRemove !== -1) {
      currentTeam[indexToRemove] = null;
      if (team === 'my') {
        setMyTeam(currentTeam);
      } else {
        setEnemyTeam(currentTeam);
      }
      // 移除后，将选择目标设为刚才移除的那个空位
      setSelectingSlot({ team, index: indexToRemove });
    }
  };

  const clearTeams = () => {
    setMyTeam(Array(5).fill(null));
    setEnemyTeam(Array(5).fill(null));
  };

  const analysisResults = useMemo(() => {
    const myHeroes = myTeam.filter((id): id is number => id !== null).map(id => allHeroes.find(h => h.id === id)).filter(Boolean);
    const enemyHeroes = enemyTeam.filter((id): id is number => id !== null).map(id => allHeroes.find(h => h.id === id)).filter(Boolean);

    const partnerships: { hero: string; partner: string; desc: string }[] = [];
    const mySuppression: { hero: string; enemy: string; desc: string }[] = [];
    const enemySuppression: { enemy: string; hero: string; desc: string }[] = [];

    // 辅助函数：获取英雄的所有详情（处理多职业，如元流之子）
    const getHeroDetails = (heroName: string) => {
      // 这里的 heroName 是 useHeroData 处理后的基础名称（如 "元流之子"）
      return (heroDetailsData as HeroDetail[]).filter(d =>
        d.name === heroName
      );
    };

    // 1. 分析最佳搭档 (己方内部)
    myHeroes.forEach(hero => {
      if (!hero) return;
      const details = getHeroDetails(hero.heroName);

      details.forEach(detail => {
        if (detail.relationships?.["最佳搭档"]) {
          detail.relationships["最佳搭档"].heroes.forEach((p, idx) => {
            // 匹配逻辑：p.cname 可能需要模糊匹配
            if (myHeroes.some(h => h?.heroName === p.cname || p.cname.startsWith(`${h?.heroName}(`))) {
              // 避免重复添加 (A-B 和 B-A)
              const alreadyExists = partnerships.some(item =>
                (item.hero === hero.heroName && item.partner === p.cname) ||
                (item.hero === p.cname && item.partner === hero.heroName)
              );

              if (!alreadyExists) {
                partnerships.push({
                  hero: hero.heroName,
                  partner: p.cname,
                  desc: detail.relationships!["最佳搭档"]!.descriptions[idx]
                });
              }
            }
          });
        }
      });
    });

    // 2. 分析压制关系 (己方 vs 敌方)
    myHeroes.forEach(hero => {
      if (!hero) return;
      const details = getHeroDetails(hero.heroName);

      details.forEach(detail => {
        // 己方压制敌方
        if (detail.relationships?.["压制英雄"]) {
          detail.relationships["压制英雄"].heroes.forEach((e, idx) => {
            if (enemyHeroes.some(h => h?.heroName === e.cname || e.cname.startsWith(`${h?.heroName}(`))) {
              mySuppression.push({
                hero: hero.heroName,
                enemy: e.cname,
                desc: detail.relationships!["压制英雄"]!.descriptions[idx]
              });
            }
          });
        }
      });
    });

    // 3. 分析被压制关系 (己方 vs 敌方)
    myHeroes.forEach(hero => {
      if (!hero) return;
      const details = getHeroDetails(hero.heroName);

      details.forEach(detail => {
        // 己方被敌方压制
        if (detail.relationships?.["被压制英雄"]) {
          detail.relationships["被压制英雄"].heroes.forEach((e, idx) => {
            if (enemyHeroes.some(h => h?.heroName === e.cname || e.cname.startsWith(`${h?.heroName}(`))) {
              const alreadyExists = enemySuppression.some(s => s.enemy === e.cname && s.hero === hero.heroName);
              if (!alreadyExists) {
                enemySuppression.push({
                  enemy: e.cname,
                  hero: hero.heroName,
                  desc: detail.relationships!["被压制英雄"]!.descriptions[idx]
                });
              }
            }
          });
        }
      });
    });

    // 4. 双向分析：检查敌方英雄的克制关系
    enemyHeroes.forEach(enemy => {
      if (!enemy) return;
      const details = getHeroDetails(enemy.heroName);

      details.forEach(detail => {
        // 敌方压制己方
        if (detail.relationships?.["压制英雄"]) {
          detail.relationships["压制英雄"].heroes.forEach((p, idx) => {
            if (myHeroes.some(h => h?.heroName === p.cname || p.cname.startsWith(`${h?.heroName}(`))) {
              if (!enemySuppression.some(s => s.enemy === enemy.heroName && s.hero === p.cname)) {
                enemySuppression.push({
                  enemy: enemy.heroName,
                  hero: p.cname,
                  desc: detail.relationships!["压制英雄"]!.descriptions[idx]
                });
              }
            }
          });
        }

        // 敌方被己方压制
        if (detail.relationships?.["被压制英雄"]) {
          detail.relationships["被压制英雄"].heroes.forEach((p, idx) => {
            if (myHeroes.some(h => h?.heroName === p.cname || p.cname.startsWith(`${h?.heroName}(`))) {
              if (!mySuppression.some(s => s.hero === p.cname && s.enemy === enemy.heroName)) {
                mySuppression.push({
                  hero: p.cname,
                  enemy: enemy.heroName,
                  desc: detail.relationships!["被压制英雄"]!.descriptions[idx]
                });
              }
            }
          });
        }
      });
    });

    return { partnerships, mySuppression, enemySuppression };
  }, [myTeam, enemyTeam]);

  // 监听滚动区域高度变化，判断是否需要显示滚动提示
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        // 只有当所有英雄（10个槽位）都选满时，才允许显示滚动提示
        const isAllSelected = [...myTeam, ...enemyTeam].every(id => id !== null);
        
        // 如果内容高度大于容器高度，且还没滚到底部，则显示提示
        const canScroll = scrollHeight > clientHeight + 10;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
        
        setShowScrollHint(isAllSelected && canScroll && !isAtBottom);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener('scroll', checkScroll);
      // 使用 ResizeObserver 监听内容变化（比如英雄增加时）
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [analysisResults, selectingSlot]); // 当分析结果或弹窗状态改变时重新检查

  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 10,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.1),
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(20px)',
        height: 'calc(100vh - 120px)', // 适配视口高度，减去顶部空间
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        position: 'relative',
        overflow: 'hidden',
        '&:hover .decorative-circle': {
          transform: 'scale(1.1)',
          opacity: 0.1
        }
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main'
            }}
          >
            <Swords size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', tracking: '-0.02em' }}>
              阵容克制关系分析
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              基于大数据分析英雄间的羁绊与克制
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="outlined"
          size="small"
          startIcon={<Trash2 size={14} />}
          onClick={clearTeams}
          sx={{
            borderRadius: 3,
            borderColor: alpha(theme.palette.divider, 0.2),
            color: 'text.secondary',
            fontWeight: 800,
            px: 2,
            '&:hover': {
              borderColor: 'error.main',
              color: 'error.main',
              bgcolor: alpha(theme.palette.error.main, 0.05)
            }
          }}
        >
          重置阵容
        </Button>
      </Stack>

      {/* 5V5 阵容选择区 */}
      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        {/* 己方阵容 */}
        <Grid size={{ xs: 6 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
              <Users size={16} color={theme.palette.primary.main} />
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 900,
                  color: 'primary.main',
                  letterSpacing: '0.1em'
                }}
              >
                己方阵容
              </Typography>
            </Stack>
            <Grid container spacing={1.5}>
              {myTeam.map((id, idx) => (
                <Grid size={{ xs: 2.4 }} key={`my-${idx}`}>
                  <TeamSlot 
                    team="my" 
                    index={idx} 
                    isSelected={selectingSlot?.team === 'my' && selectingSlot?.index === idx}
                    hero={id ? allHeroes.find(h => h.id === id) : null}
                    onClick={handleSlotClick}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>

        {/* 敌方阵容 */}
        <Grid size={{ xs: 6 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, justifyContent: 'flex-end' }}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 900,
                  color: 'error.main',
                  letterSpacing: '0.1em'
                }}
              >
                敌方阵容
              </Typography>
              <Zap size={16} color={theme.palette.error.main} />
            </Stack>
            <Grid container spacing={1.5}>
              {enemyTeam.map((id, idx) => (
                <Grid size={{ xs: 2.4 }} key={`enemy-${idx}`}>
                  <TeamSlot 
                    team="enemy" 
                    index={idx} 
                    isSelected={selectingSlot?.team === 'enemy' && selectingSlot?.index === idx}
                    hero={id ? allHeroes.find(h => h.id === id) : null}
                    onClick={handleSlotClick}
                  />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>
      </Grid>

      {/* 英雄选择区域 - 插入在槽位下方，方便用户对比当前阵容 */}
      {selectingSlot && (
        <Box
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            borderRadius: 6,
            border: '2px dashed',
            borderColor: alpha(selectingSlot?.team === 'my' ? theme.palette.primary.main : theme.palette.error.main, 0.2),
            p: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: 'column',
            height: 400, // 略微缩小高度以留给结果区更多空间
            position: 'relative',
            mb: 1,
            zIndex: 10,
            flexShrink: 0
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 6,
                    height: 24,
                    borderRadius: 1,
                    bgcolor: selectingSlot.team === 'my' ? 'primary.main' : 'error.main'
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  选择{selectingSlot.team === 'my' ? '己方' : '敌方'}第 {selectingSlot.index + 1} 位英雄
                </Typography>
              </Stack>
              <IconButton
                onClick={() => setSelectingSlot(null)}
                sx={{
                  bgcolor: alpha(theme.palette.action.hover, 0.05),
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }
                }}
              >
                <X size={20} />
              </IconButton>
            </Stack>
            
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <HeroSelect 
                value={selectingSlot.team === 'my' ? (myTeam[selectingSlot.index] || 0) : (enemyTeam[selectingSlot.index] || 0)} 
                onChange={handleSelectHero} 
                isStatic={true}
                selectedIds={selectingSlot.team === 'my' 
                  ? myTeam.filter((id, idx) => id !== null && idx !== selectingSlot.index) as number[] 
                  : enemyTeam.filter((id, idx) => id !== null && idx !== selectingSlot.index) as number[]
                }
                onRemove={handleRemoveHero}
                maxSelect={5}
              />
            </Box>
            
            <Typography
              variant="caption"
              sx={{
                mt: 1.5,
                textAlign: 'center',
                color: 'text.secondary',
                fontStyle: 'italic',
                fontWeight: 500
              }}
            >
              提示：在上方搜索框输入英雄名或直接从列表中选择英雄
            </Typography>
          </Box>
        </Box>
      )}

      {/* 分析结果区 */}
      <Box sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Box
          ref={scrollContainerRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            pr: 1,
            mr: -1, // 抵消 padding 保证滚动条靠边
            mt: 1,
            position: 'relative',
            zIndex: 1,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha(theme.palette.divider, 0.1),
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.2),
            }
          }}
        >
          {analysisResults.partnerships.length === 0 &&
            analysisResults.mySuppression.length === 0 &&
            analysisResults.enemySuppression.length === 0 && !selectingSlot ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: '100%', py: 8, color: 'text.secondary', opacity: 0.5 }}
            >
              <Info size={48} />
              <Typography variant="body2" sx={{ mt: 2, fontWeight: 800 }}>
                选择英雄开始分析克制关系
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={3}>
              {/* 最佳搭档 */}
              {analysisResults.partnerships.length > 0 && (
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
                    <TrendingUp size={14} color={theme.palette.success.main} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 900,
                        color: 'success.main',
                        letterSpacing: '0.2em'
                      }}
                    >
                      最佳搭档
                    </Typography>
                  </Stack>
                  {analysisResults.partnerships.map((p, i) => (
                    <Paper
                      key={i}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.success.main, 0.1),
                        animation: 'fadeInUp 0.3s ease-out'
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'success.main', mb: 0.5 }}>
                        {p.hero} & {p.partner}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontWeight: 500 }}>
                        {p.desc}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}

              {/* 我方压制 */}
              {analysisResults.mySuppression.length > 0 && (
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
                    <Zap size={14} color={theme.palette.primary.main} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 900,
                        color: 'primary.main',
                        letterSpacing: '0.2em'
                      }}
                    >
                      我方压制
                    </Typography>
                  </Stack>
                  {analysisResults.mySuppression.map((s, i) => (
                    <Paper
                      key={i}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                        animation: 'fadeInUp 0.3s ease-out'
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5 }}>
                        {s.hero} <Box component="span" sx={{ mx: 1, color: 'text.secondary', fontWeight: 500 }}>压制</Box> {s.enemy}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontWeight: 500 }}>
                        {s.desc}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}

              {/* 敌方压制 */}
              {analysisResults.enemySuppression.length > 0 && (
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
                    <ShieldAlert size={14} color={theme.palette.error.main} />
                    <Typography
                      variant="overline"
                      sx={{
                        fontWeight: 900,
                        color: 'error.main',
                        letterSpacing: '0.2em'
                      }}
                    >
                      敌方压制
                    </Typography>
                  </Stack>
                  {analysisResults.enemySuppression.map((s, i) => (
                    <Paper
                      key={i}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.error.main, 0.05),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.error.main, 0.1),
                        animation: 'fadeInUp 0.3s ease-out'
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'error.main', mb: 0.5 }}>
                        {s.enemy} <Box component="span" sx={{ mx: 1, color: 'text.secondary', fontWeight: 500 }}>压制</Box> {s.hero}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, fontWeight: 500 }}>
                        {s.desc}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Stack>
          )}
        </Box>

        {/* 滚动提示遮罩 */}
        <Fade in={showScrollHint}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
              background: `linear-gradient(transparent, ${alpha(theme.palette.background.paper, 0.8)})`,
              pointerEvents: 'none',
              zIndex: 2,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              pb: 1
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main', animation: 'bounce 2s infinite' }}>
              <Typography variant="caption" sx={{ fontWeight: 900, letterSpacing: '0.1em' }}>
                更多分析内容，请滚动查看
              </Typography>
              <ChevronDown size={14} strokeWidth={3} />
            </Stack>
          </Box>
        </Fade>
      </Box>

      {/* 装饰 */}
      <Box
        className="decorative-circle"
        sx={{
          position: 'absolute',
          bottom: -48,
          right: -48,
          width: 192,
          height: 192,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: '50%',
          filter: 'blur(40px)',
          transition: 'all 0.5s ease-out',
          pointerEvents: 'none'
        }}
      />
    </Paper>
  );
};
