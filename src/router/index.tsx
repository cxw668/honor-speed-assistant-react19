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
      <header className="w-full h-[72px] flex items-center bg-bg-page/80 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_0_0_rgba(255,255,255,0.05)] px-10 shrink-0 z-100">
        <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
          {/* 左侧 Logo 区 */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.hash = '/'}>
            <img
              src="assets/logo2.png"
              alt="荣耀速通助手 Logo"
              className="w-10 h-10 rounded-xl object-contain drop-shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-[18px] font-bold tracking-tight text-white group-hover:text-primary transition-colors">荣耀速通助手</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Honor Speed Assistant</span>
            </div>
          </div>

          {/* 中间导航 Tab */}
          <nav className="flex gap-2 items-center bg-white/5 p-1 rounded-full border border-white/5">
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
                      className={({ isActive: _navActive }) =>
                        `nav-link flex items-center gap-1.5 ${_navActive || isActive ? 'nav-link-active' : ''}`
                      }
                    >
                      {route.label}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${isEquipmentOpen ? 'rotate-180 text-primary' : 'text-slate-500'}`}
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </NavLink>

                    {/* 下拉菜单 */}
                    {/* 
                      ￥￥ 这里使用了CSS高级特性 - 隐形桥接层 使用 before:content-[''] 在下拉菜单上方创建了一个透明的连接层，填补了那 8px 的空白死区。
                      1. 因为我这里设置了导航标签和下拉菜单一个8px的间距
                      2. 当鼠标离开导航标签向下移动时，会经过这个 8px 的空白区域。
                      3. 由于这个区域不属于标签也不属于下拉菜单，浏览器会认为鼠标已经“离开”了目标区域，从而触发了 onMouseLeave 事件导致菜单关闭。
                     */}
                    {isEquipmentOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-44 bg-bg-card/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl py-1.5 z-100 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300
                        before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2">
                        {equipmentSubMenu.map((item) => (
                          <NavLink
                            key={item.tab}
                            to={`/equipment?tab=${item.tab}`}
                            className={({ isActive: _isActive }) => {
                              const searchParams = new URLSearchParams(location.search);
                              const currentTab = searchParams.get('tab') || 'equipment';
                              const isItemActive = location.pathname === '/equipment' && currentTab === item.tab;
                              return `
                                block px-4 py-2.5 text-[13px] font-medium transition-all mx-1.5 rounded-lg
                                ${isItemActive ? 'text-primary bg-primary/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}
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
                >
                  {route.label}
                </NavLink>
              );
            })}
          </nav>

          {/* 右侧功能区 */}
          <div className="flex items-center gap-4 w-[180px] justify-end">
            <a
              href="https://github.com/cxw668/honor-speed-assistant-react19"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <button onClick={() => { window.location.hash = '/hero' }} className="px-4 py-2 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">
              立即体验
            </button>
          </div>
        </div>
      </header>

      {/* 主体功能区（路由出口） */}
      <main className="w-full flex-1 overflow-hidden bg-bg-card">
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
