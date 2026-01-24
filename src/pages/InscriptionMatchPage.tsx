import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Avatar,
  Button,
  Stack,
  useTheme,
  alpha,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { HeroSelect } from '../components/business/HeroSelect';
import { Toast } from '../components/atomic/Toast';
import { InscriptionSimulation, type InscriptionSimulationHandle } from '../components/business/InscriptionSimulation';
import { CopyBtn } from '../components/atomic/CopyBtn';
import { Zap, RotateCcw } from 'lucide-react';
import { useHeroData } from '../hooks/useHeroData';
import heroDetailsData from '../mock/hero/hero_details.json';

interface Inscription {
  name: string;
  count: number;
  type: 'red' | 'blue' | 'green';
}

export default function InscriptionMatchPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { heroList: allHeroes } = useHeroData();
  const simulationRef = useRef<InscriptionSimulationHandle>(null);

  // 计算默认选中的英雄 ID
  const defaultHeroId = useMemo(() => {
    const firstHeroName = (heroDetailsData as any[])[0]?.name;
    if (!firstHeroName) return 1;
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

  const [currentInscriptions, setCurrentInscriptions] = useState<Inscription[]>([]);
  const [recommendDesc, setRecommendDesc] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg] = useState('');

  // 铭文类型映射
  const inscriptionTypeMap: Record<string, 'red' | 'blue' | 'green'> = {
    // 红色
    '宿命': 'red', '无双': 'red', '圣人': 'red', '梦魇': 'red', '异变': 'red',
    '纷争': 'red', '凶兆': 'red', '祸源': 'red', '红月': 'red', '传承': 'red',
    // 蓝色
    '调和': 'blue', '夺萃': 'blue', '轮回': 'blue', '狩猎': 'blue', '贪婪': 'blue',
    '隐匿': 'blue', '冥想': 'blue', '繁荣': 'blue', '兽痕': 'blue', '长生': 'blue',
    // 绿色
    '虚空': 'green', '鹰眼': 'green', '献祭': 'green', '心眼': 'green', '怜悯': 'green',
    '敬畏': 'green', '回声': 'green', '霸者': 'green', '均衡': 'green', '灵山': 'green'
  };

  // 获取英雄名称的辅助函数
  const getHeroNameById = (id: number) => {
    const hero = allHeroes.find(h => h.id === id);
    return hero?.heroName || '';
  };

  // 监听英雄或场景变化
  useEffect(() => {
    const heroName = getHeroNameById(selectedHeroId);
    if (!heroName) return;

    // 优先从 hero_details.json 获取数据
    const heroDetail = (heroDetailsData as any[]).find(h =>
      h.name === heroName || h.name.startsWith(`${heroName}(`)
    );

    if (heroDetail && heroDetail.inscriptions) {
      const insList = heroDetail.inscriptions.list.map((ins: any) => ({
        name: ins.name,
        count: 10, // 默认10个
        type: inscriptionTypeMap[ins.name] || 'red'
      }));
      setCurrentInscriptions(insList);
      setRecommendDesc(heroDetail.inscriptions.tips || '');
    }
  }, [selectedHeroId, allHeroes]);

  const copyText = useMemo(() => {
    if (currentInscriptions.length === 0) return '';
    const combo = currentInscriptions.map(ins => `${ins.name}×${ins.count}`).join(' + ');
    return `${combo} → ${recommendDesc}`;
  }, [currentInscriptions, recommendDesc]);

  const selectedHero = useMemo(() => allHeroes.find(h => h.id === selectedHeroId), [allHeroes, selectedHeroId]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflow: isMobile ? 'auto' : 'hidden' }}>
      {/* 主体展示区 */}
      <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: { xs: 2, md: 3 }, overflow: isMobile ? 'visible' : 'hidden', gap: { xs: 2, md: 3 } }}>

        {/* 英雄选择与头部信息 */}
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
            animation: 'fadeInDown 0.7s ease-out',
            zIndex: 10
          }}
        >
          <Box sx={{ position: 'relative', shrink: 0, alignSelf: { xs: 'center', sm: 'auto' } }}>
            <Avatar
              src={selectedHero?.heroSrc || selectedHero?.avatar}
              variant="rounded"
              sx={{
                width: { xs: 64, md: 96 },
                height: { xs: 64, md: 96 },
                borderRadius: { xs: 2.5, md: 5 },
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
                py: 0.2,
                textAlign: 'center',
                borderBottomLeftRadius: { xs: 10, md: 20 },
                borderBottomRightRadius: { xs: 10, md: 20 }
              }}
            >
              <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 900, fontSize: { xs: '10px', md: '0.75rem' } }}>
                {getHeroNameById(selectedHeroId)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: { xs: 'stretch', lg: 'center' }, justifyContent: 'space-between', gap: { xs: 1.5, md: 3 } }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                <Box sx={{ width: 4, height: 16, bgcolor: 'primary.main', borderRadius: 1, boxShadow: `0 0 8px ${theme.palette.primary.main}` }} />
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', tracking: '-0.02em', fontSize: { xs: '16px', md: '1.25rem' } }}>
                  铭文搭配实验室
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                模拟真实铭文搭配，实时查看属性加成
              </Typography>
            </Box>

            <Box sx={{ flex: 1, maxWidth: { xs: '100%', lg: 600 } }}>
              <Typography variant="overline" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 900, letterSpacing: '0.1em', fontSize: { xs: '10px', md: '0.75rem' } }}>
                更换目标英雄
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ flex: 1, bgcolor: alpha(theme.palette.action.hover, 0.05), borderRadius: 3, p: 0.5, border: '1px solid', borderColor: alpha(theme.palette.divider, 0.1) }}>
                  <HeroSelect value={selectedHeroId} onChange={setSelectedHeroId} />
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'block' }, overflow: 'hidden' }}>
                  <Stack direction="row" spacing={1}>
                    {selectedHero?.heroTypes.map(type => (
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

            <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
              {isMobile ? (
                <>
                  <IconButton 
                    onClick={() => simulationRef.current?.applyRecommended()}
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      borderRadius: 2,
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                    }}
                  >
                    <Zap size={18} />
                  </IconButton>
                  <IconButton 
                    onClick={() => simulationRef.current?.clear()}
                    sx={{ 
                      bgcolor: alpha(theme.palette.divider, 0.05),
                      color: 'text.secondary',
                      borderRadius: 2,
                      '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main' }
                    }}
                  >
                    <RotateCcw size={18} />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Zap size={14} fill="currentColor" />}
                    onClick={() => simulationRef.current?.applyRecommended()}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      fontWeight: 800,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText'
                      }
                    }}
                  >
                    一键套用
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RotateCcw size={14} />}
                    onClick={() => simulationRef.current?.clear()}
                    sx={{
                      borderColor: alpha(theme.palette.divider, 0.2),
                      color: 'text.secondary',
                      fontWeight: 800,
                      borderRadius: 3,
                      '&:hover': {
                        borderColor: 'error.main',
                        color: 'error.main',
                        bgcolor: alpha(theme.palette.error.main, 0.05)
                      }
                    }}
                  >
                    重置
                  </Button>
                </>
              )}
              <Box sx={{ width: { xs: 'auto', sm: 160 }, flex: { xs: 1, sm: 'none' } }}>
                <CopyBtn
                  text={copyText}
                  title={recommendDesc?.replace('Tips：', '')}
                />
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Box sx={{ flex: 1, minHeight: { xs: '800px', md: 0 }, animation: 'fadeInUp 0.5s ease-out' }}>
          <InscriptionSimulation
            ref={simulationRef}
            recommendedInscriptions={currentInscriptions}
            recommendDesc={recommendDesc}
            copyText={copyText}
          />
        </Box>
      </Container>

      {showToast && (
        <Toast
          message={toastMsg}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </Box>
  );
}
