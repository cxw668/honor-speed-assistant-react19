import { Suspense, useState, useRef, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { routes, Loading } from './routes';

const NavContent = () => {
  const location = useLocation();
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const equipmentRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (equipmentRef.current && !equipmentRef.current.contains(event.target as Node)) {
        setIsEquipmentOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const equipmentSubMenu = [
    { label: '推荐出装', tab: 'equipment' },
    { label: '召唤师技能', tab: 'skills' },
    { label: '局内道具', tab: 'tools' },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-page">
      {/* 顶部导航区 */}
      <header className="w-full h-[80px] fixed top-0 left-0 z-50 flex items-center bg-bg-card border-b border-border-light shadow-sm px-10">
        <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
          {/* 左侧 Logo 区 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
              </svg>
            </div>
            <span className="text-[24px] font-semibold text-primary">荣耀速通助手</span>
          </div>

          {/* 中间导航 Tab */}
          <nav className="flex gap-8 items-center h-full">
            {routes.map((route) => {
              if (route.path === '/equipment') {
                const isActive = location.pathname === '/equipment';
                return (
                  <div 
                    key={route.path} 
                    className="relative h-full flex items-center" 
                    ref={equipmentRef}
                    onMouseEnter={() => setIsEquipmentOpen(true)}
                    onMouseLeave={() => setIsEquipmentOpen(false)}
                  >
                    <NavLink
                      to={route.path}
                      className={() =>
                        isActive ? 'nav-link nav-link-active flex items-center gap-1' : 'nav-link flex items-center gap-1'
                      }
                    >
                      {route.label}
                      <svg 
                        className={`w-4 h-4 transition-transform duration-200 ${isEquipmentOpen ? 'rotate-180' : ''}`} 
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </NavLink>

                    {/* 下拉菜单 */}
                    {isEquipmentOpen && (
                      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-48 bg-bg-card border border-border-light rounded-xl shadow-2xl py-2 z-100 animate-in fade-in zoom-in-95 duration-200">
                        {equipmentSubMenu.map((item) => (
                          <NavLink
                            key={item.tab}
                            to={`/equipment?tab=${item.tab}`}
                            className={({ isActive:_isActive }) => {
                              const searchParams = new URLSearchParams(location.search);
                              const currentTab = searchParams.get('tab') || 'equipment';
                              const isItemActive = location.pathname === '/equipment' && currentTab === item.tab;
                              return `
                                block px-5 py-3 text-sm font-medium transition-colors
                                ${isItemActive ? 'text-primary bg-primary/5' : 'text-white hover:text-primary hover:bg-bg-page'}
                              `;
                            }}
                            onClick={() => setIsEquipmentOpen(false)}
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    isActive ? 'nav-link nav-link-active' : 'nav-link'
                  }
                  end
                >
                  {route.label}
                </NavLink>
              );
            })}
          </nav>

          {/* 右侧无元素（占位保持对齐） */}
          <div className="w-[180px]"></div>
        </div>
      </header>

      {/* 主体功能区（路由出口） */}
      <main className="w-full flex-1 pt-[80px] overflow-y-auto bg-bg-card">
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
  );
};

const AppRouter = () => {
  return (
    <Router>
      <NavContent />
    </Router>
  );
};

export default AppRouter;
