import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { routes, Loading } from './routes';

const AppRouter = () => {
  return (
    <Router>
      {/* 顶部导航区 */}
      <header className="w-full h-[80px] flex items-center justify-center border-b border-light">
        <nav className="flex gap-6">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                isActive ? 'nav-tab nav-tab-active' : 'nav-tab'
              }
              end
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* 主体功能区（路由出口） */}
      <main className="w-full flex-1 flex justify-center items-start py-6">
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </main>

      {/* 底部信息区 */}
      <footer className="w-full h-[50px] flex items-center justify-center border-t border-light text-medium text-sm">
        荣耀速通助手 © 2026
      </footer>
    </Router>
  );
};

export default AppRouter;