import { Users } from 'lucide-react';
import { useMemo, useReducer } from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Stack, 
  Container, 
  useTheme, 
  alpha,
  Paper,
  Drawer,
  useMediaQuery,
  Fab
} from '@mui/material';
import { Filter } from 'lucide-react';
import { HeroTypeFilter } from '../components/business/HeroTypeFilter';
import { HeroList } from '../components/business/HeroList';
import { HeroDetailCard } from '../components/business/HeroDetailCard';
import { HeroSearch } from '../components/atomic/HeroSearch';
import { Dialog } from '../components/atomic/Dialog';
import { useHeroData } from '../hooks/useHeroData';

const HERO_TYPES = [
  { id: 0, name: '全部' },
  { id: 3, name: '坦克' },
  { id: 1, name: '战士' },
  { id: 4, name: '刺客' },
  { id: 2, name: '法师' },
  { id: 5, name: '射手' },
  { id: 6, name: '辅助' }
];

interface HeroQueryState {
  selectedType: string;
  isNoviceOnly: boolean;
  searchQuery: string;
  selectedHeroId?: number;
  isDialogOpen: boolean;
}

type HeroQueryAction =
  | { type: 'SET_TYPE'; payload: string }
  | { type: 'TOGGLE_NOVICE'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SELECT_HERO'; payload: number }
  | { type: 'CLOSE_DIALOG' };

const initialState: HeroQueryState = {
  selectedType: '全部',
  isNoviceOnly: false,
  searchQuery: '',
  selectedHeroId: undefined,
  isDialogOpen: false,
};

function heroQueryReducer(state: HeroQueryState, action: HeroQueryAction): HeroQueryState {
  switch (action.type) {
    case 'SET_TYPE':
      return { ...state, selectedType: action.payload };
    case 'TOGGLE_NOVICE':
      return { ...state, isNoviceOnly: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SELECT_HERO':
      return { ...state, selectedHeroId: action.payload, isDialogOpen: true };
    case 'CLOSE_DIALOG':
      return { ...state, isDialogOpen: false };
    default:
      return state;
  }
}

const FilterSidebar = ({ state, dispatch, total, typeCounts, theme, onClose:_onClose }: any) => {
  const { selectedType, isNoviceOnly, searchQuery } = state;
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        height: '100%', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: { xs: 0, md: 8 }, 
        border: { xs: 'none', md: '1px solid' },
        borderColor: alpha(theme.palette.divider, 0.1),
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(20px)',
        boxShadow: { xs: 'none', md: `0 24px 48px -12px ${alpha(theme.palette.common.black, 0.2)}` }
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 2, flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
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
                color: 'primary.main', 
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.2)
              }}
            >
              <Users size={22} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ fontSize: '20px', fontWeight: 900, color: 'text.primary', tracking: '-0.02em', lineHeight: 1 }}
              >
                英雄速查
              </Typography>
              <Typography 
                variant="caption" 
                component="p" 
                sx={{ fontSize: '11px', color: 'text.secondary', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.6, mt: 0.5 }}
              >
                Hero Database
              </Typography>
            </Box>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography 
              component="span" 
              sx={{ fontSize: '18px', fontWeight: 900, color: 'primary.main', lineHeight: 1 }}
            >
              {total}
            </Typography>
            <Typography 
              variant="caption" 
              component="span" 
              sx={{ fontSize: '10px', color: 'text.secondary', fontWeight: 900, textTransform: 'uppercase', mt: 0.5 }}
            >
              Total
            </Typography>
          </Stack>
        </Stack>

        <Box component="section" sx={{ flexShrink: 0 }}>
          <HeroSearch value={searchQuery} onChange={(val) => dispatch({ type: 'SET_SEARCH', payload: val })} />
        </Box>
      </Box>

      {/* Scrollable Content */}
      <Box 
        sx={{ 
          flex: 1, 
          px: 3, 
          pb: 4, 
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.primary.main, 0.2), borderRadius: 2 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }
        }}
      >
        <HeroTypeFilter
          types={HERO_TYPES}
          selectedType={selectedType}
          onTypeChange={(type) => dispatch({ type: 'SET_TYPE', payload: type })}
          isNoviceOnly={isNoviceOnly}
          onNoviceToggle={(val) => dispatch({ type: 'TOGGLE_NOVICE', payload: val })}
          typeCounts={typeCounts}
        />
        
        {/* 底部装饰 */}
        <Box sx={{ mt: 4, pt: 4, textAlign: 'center' }}>
          <Divider sx={{ mb: 4, borderColor: alpha(theme.palette.divider, 0.1) }} />
          <Typography 
            variant="caption" 
            component="p" 
            sx={{ fontSize: '11px', color: alpha(theme.palette.text.secondary, 0.4), fontWeight: 500, fontStyle: 'italic' }}
          >
            数据更新至 Season 2026
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export const HeroQueryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isFilterOpen, setIsFilterOpen] = useReducer((s) => !s, false);
  const { heroList: allHeroes } = useHeroData();
  const [state, dispatch] = useReducer(heroQueryReducer, initialState);
  const { selectedType, isNoviceOnly, searchQuery, selectedHeroId, isDialogOpen } = state;

  // 使用 useMemo 缓存筛选后的英雄列表
  const filteredHeroes = useMemo(() => {
    return allHeroes.filter(hero => {
      const typeMatch = selectedType === '全部' || hero.heroTypes.includes(selectedType);
      const noviceMatch = !isNoviceOnly || hero.isNewbieRecommend;
      const searchMatch = !searchQuery || hero.heroName.toLowerCase().includes(searchQuery.toLowerCase());
      return typeMatch && noviceMatch && searchMatch;
    });
  }, [allHeroes, selectedType, isNoviceOnly, searchQuery]);

  // 获取当前选中的英雄详情
  const selectedHero = useMemo(() => {
    return allHeroes.find(h => h.id === selectedHeroId);
  }, [allHeroes, selectedHeroId]);

  // 计算英雄数量
  const total = filteredHeroes.length;

  // 计算各类型的英雄数量统计
  const typeCounts = useMemo(() => {
    const baseHeroes = allHeroes.filter(h => {
      const noviceMatch = !isNoviceOnly || h.isNewbieRecommend;
      const searchMatch = !searchQuery || h.heroName.toLowerCase().includes(searchQuery.toLowerCase());
      return noviceMatch && searchMatch;
    });

    const counts: Record<string, number> = {
      '全部': baseHeroes.length,
      '坦克': baseHeroes.filter(h => h.heroTypes.includes('坦克')).length,
      '战士': baseHeroes.filter(h => h.heroTypes.includes('战士')).length,
      '刺客': baseHeroes.filter(h => h.heroTypes.includes('刺客')).length,
      '辅助': baseHeroes.filter(h => h.heroTypes.includes('辅助')).length,
      '射手': baseHeroes.filter(h => h.heroTypes.includes('射手')).length,
      '法师': baseHeroes.filter(h => h.heroTypes.includes('法师')).length,
    };

    return counts;
  }, [allHeroes, isNoviceOnly, searchQuery]);

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        bgcolor: 'background.default', 
        overflow: 'hidden', 
        position: 'relative' 
      }}
    >
      {/* 背景装饰 */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: 500, 
          height: 500, 
          bgcolor: alpha(theme.palette.primary.main, 0.05), 
          borderRadius: '50%', 
          filter: 'blur(120px)', 
          transform: 'translate(-50%, -50%)', 
          pointerEvents: 'none' 
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 0, 
          left: '25%', 
          width: 300, 
          height: 300, 
          bgcolor: alpha(theme.palette.success.main, 0.05), 
          borderRadius: '50%', 
          filter: 'blur(100px)', 
          transform: 'translateY(50%)', 
          pointerEvents: 'none' 
        }} 
      />

      <Container 
        maxWidth={false} 
        sx={{ 
          maxWidth: '1440px', 
          height: '100%', 
          display: 'flex', 
          gap: { xs: 0, md: 3 }, 
          p: { xs: 0, md: 3 }, 
          overflow: 'hidden', 
          position: 'relative', 
          zIndex: 10 
        }}
      >
        {/* 左侧筛选区: 桌面端显示，移动端放入 Drawer */}
        {!isMobile ? (
          <Stack sx={{ width: 320, height: '100%', flexShrink: 0, overflow: 'hidden' }} spacing={2}>
            <FilterSidebar state={state} dispatch={dispatch} total={total} typeCounts={typeCounts} theme={theme} />
          </Stack>
        ) : (
          <Drawer
            anchor="left"
            open={isFilterOpen}
            onClose={() => setIsFilterOpen()}
            PaperProps={{
              sx: { width: 300, bgcolor: 'background.default', backgroundImage: 'none' }
            }}
          >
            <FilterSidebar state={state} dispatch={dispatch} total={total} typeCounts={typeCounts} theme={theme} onClose={() => setIsFilterOpen()} />
          </Drawer>
        )}

        {/* 右侧内容区 */}
        <Box 
          sx={{ 
            flex: 1, 
            minWidth: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3, 
            overflow: 'hidden',
            p: { xs: 2, md: 0 }
          }}
        >
          <HeroList
            heroes={filteredHeroes}
            selectedHeroId={selectedHeroId}
            onHeroSelect={(id) => dispatch({ type: 'SELECT_HERO', payload: id })}
          />
        </Box>
      </Container>

      {/* 移动端筛选悬浮按钮 */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="filter"
          onClick={() => setIsFilterOpen()}
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`
          }}
        >
          <Filter size={24} />
        </Fab>
      )}

      {/* 英雄详情对话框 */}
      <Dialog
        sx={{
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7),
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: (theme) => alpha(theme.palette.divider, 0.1),
        }}
        isOpen={isDialogOpen}
        onClose={() => dispatch({ type: 'CLOSE_DIALOG' })}
        title="英雄详情"
      >
        <HeroDetailCard hero={selectedHero} />
      </Dialog>
    </Box>
  );
};

export default HeroQueryPage;
