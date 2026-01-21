import { lazy } from 'react';
import type { RouteItem } from '@/types';
import { 
  Home, 
  Users, 
  Shield, 
  Zap, 
  Sword
} from 'lucide-react';
import { Box, CircularProgress, Typography } from '@mui/material';

const HomePage = lazy(() => import('@/pages/HomePage'));
const HeroQueryPage = lazy(() => import('@/pages/HeroQueryPage'));
const EquipmentRecommendPage = lazy(() => import('@/pages/EquipmentRecommendPage'));
const InscriptionMatchPage = lazy(() => import('@/pages/InscriptionMatchPage'));
const FightAssistPage = lazy(() => import('@/pages/FightAssistPage'));

const Loading = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12, gap: 2 }}>
    <CircularProgress size={32} thickness={5} sx={{ color: 'primary.main' }} />
    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
      加载中...
    </Typography>
  </Box>
);

export const routes: RouteItem[] = [
  {
    path: '/',
    element: <HomePage />,
    label: '首页',
    icon: <Home size={18} />,
  },
  {
    path: '/hero',
    element: <HeroQueryPage />,
    label: '英雄速查',
    icon: <Users size={18} />,
  },
  {
    path: '/equipment',
    element: <EquipmentRecommendPage />,
    label: '智能出装',
    icon: <Shield size={18} />,
  },
  {
    path: '/inscription',
    element: <InscriptionMatchPage />,
    label: '铭文搭配',
    icon: <Zap size={18} />,
  },
  {
    path: '/fight',
    element: <FightAssistPage />,
    label: '对战辅助',
    icon: <Sword size={18} />,
  }
];

export { Loading };