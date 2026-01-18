import React, { lazy } from 'react';
import type { RouteItem } from '@/types';

const HomePage = lazy(() => import('@/pages/HomePage'));
const HeroQueryPage = lazy(() => import('@/pages/HeroQueryPage'));
const EquipmentRecommendPage = lazy(() => import('@/pages/EquipmentRecommendPage'));
const InscriptionMatchPage = lazy(() => import('@/pages/InscriptionMatchPage'));
const FightAssistPage = lazy(() => import('@/pages/FightAssistPage'));
const UserRecordPage = lazy(() => import('@/pages/UserRecordPage'));

const Loading = () => (
  <div className="text-center py-12 text-medium">加载中...</div>
);

export const routes: RouteItem[] = [
  {
    path: '/',
    element: <HomePage />,
    label: '首页',
  },
  {
    path: '/hero',
    element: <HeroQueryPage />,
    label: '英雄速查',
  },
  {
    path: '/equipment',
    element: <EquipmentRecommendPage />,
    label: '智能出装',
  },
  {
    path: '/inscription',
    element: <InscriptionMatchPage />,
    label: '铭文搭配',
  },
  {
    path: '/fight',
    element: <FightAssistPage />,
    label: '对战辅助',
  },
  {
    path: '/record',
    element: <UserRecordPage />,
    label: '我的记录',
  },
];

export { Loading };