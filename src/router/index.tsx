import { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { routes, Loading } from './routes';

const AppRouter = () => {
  return (
    <Router>
      <div className="h-screen flex flex-col overflow-hidden bg-bg-page">
        {/* 顶部导航区 */}
        <header className="w-full h-[80px] flex items-center justify-center shrink-0">
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
        <main className="w-full flex-1 overflow-hidden">
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
      </div>
    </Router>
  );
};

export default AppRouter;