import { Suspense, useState, useRef } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  IconButton, 
  Menu, 
  MenuItem, 
  Stack,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Github, 
  ChevronDown 
} from 'lucide-react';
import { routes, Loading } from './routes';
import { useAppTheme } from '@/context/ThemeContext';

const NavContent = () => {
  const location = useLocation();
  const theme = useTheme();
  const { mode, setMode } = useAppTheme();
  
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const equipmentRef = useRef<HTMLDivElement>(null);

  const handleThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeClose = (newMode?: 'light' | 'dark' | 'system') => {
    if (newMode) setMode(newMode);
    setThemeAnchorEl(null);
  };

  const equipmentSubMenu = [
    { label: '推荐出装', tab: 'equipment' },
    { label: '召唤师技能', tab: 'skills' },
    { label: '局内道具', tab: 'tools' },
  ];

  const ThemeIcon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        overflow: 'hidden', 
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      {/* 顶部导航区 */}
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0} 
        sx={{ 
          zIndex: 1100,
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: 'border-color 0.3s ease, background-color 0.3s ease'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 72, justifyContent: 'space-between' }}>
            {/* 左侧 Logo 区 */}
            <Stack 
              direction="row" 
              spacing={1.5} 
              alignItems="center" 
              sx={{ cursor: 'pointer', '&:hover .logo-text': { color: 'primary.main' } }}
              onClick={() => window.location.hash = '/'}
            >
              <Box
                component="img"
                src="assets/logo2.png"
                alt="Logo"
                sx={{ width: 40, height: 40, borderRadius: '12px', objectFit: 'contain' }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="subtitle1" 
                  className="logo-text"
                  sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary', transition: 'color 0.2s' }}
                >
                  荣耀速通助手
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ fontSize: '10px', color: 'text.secondary', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  Honor Speed Assistant
                </Typography>
              </Box>
            </Stack>

            {/* 中间导航 Tab */}
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              sx={{ 
                bgcolor: alpha(theme.palette.divider, 0.05), 
                p: 0.5, 
                borderRadius: '50px',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1)
              }}
            >
              {routes.map((route) => {
                if (route.path === '/equipment') {
                  const isActive = location.pathname === '/equipment';
                  return (
                    <Box
                      key={route.path}
                      ref={equipmentRef}
                      onMouseEnter={() => setIsEquipmentOpen(true)}
                      onMouseLeave={() => setIsEquipmentOpen(false)}
                      sx={{ position: 'relative' }}
                    >
                      <Button
                        component={NavLink}
                        to={route.path}
                        startIcon={route.icon}
                        endIcon={<ChevronDown size={14} style={{ transition: 'transform 0.3s', transform: isEquipmentOpen ? 'rotate(180deg)' : 'none' }} />}
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: '50px',
                          color: isActive ? 'primary.main' : 'text.secondary',
                          bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                          fontWeight: isActive ? 700 : 500,
                          '&:hover': {
                            color: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          }
                        }}
                      >
                        {route.label}
                      </Button>

                      {/* 下拉菜单 */}
                      {isEquipmentOpen && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 'calc(100% + 8px)', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            width: 180,
                            bgcolor: 'background.paper',
                            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid',
                            borderColor: alpha(theme.palette.divider, 0.1),
                            borderRadius: '16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                            py: 1,
                            zIndex: 1200,
                            animation: 'fadeInScaleCenter 0.2s ease-out',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: -8,
                              left: 0,
                              right: 0,
                              height: 8,
                            }
                          }}
                        >
                          {equipmentSubMenu.map((item) => {
                            const searchParams = new URLSearchParams(location.search);
                            const currentTab = searchParams.get('tab') || 'equipment';
                            const isItemActive = location.pathname === '/equipment' && currentTab === item.tab;
                            
                            return (
                              <MenuItem
                                key={item.tab}
                                component={NavLink}
                                to={`/equipment?tab=${item.tab}`}
                                onClick={() => setIsEquipmentOpen(false)}
                                sx={{
                                  mx: 1,
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: isItemActive ? 'primary.main' : 'text.secondary',
                                  bgcolor: isItemActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    color: 'primary.main',
                                  }
                                }}
                              >
                                {item.label}
                              </MenuItem>
                            );
                          })}
                        </Box>
                      )}
                    </Box>
                  );
                }

                const isActive = location.pathname === route.path;
                return (
                  <Button
                    key={route.path}
                    component={NavLink}
                    to={route.path}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '50px',
                      color: isActive ? 'primary.main' : 'text.secondary',
                      bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                      fontWeight: isActive ? 700 : 500,
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                      }
                    }}
                  >
                    {route.label}
                  </Button>
                );
              })}
            </Stack>

            {/* 右侧功能区 */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* 主题切换按钮 */}
              <Tooltip title="切换主题">
                <IconButton 
                  onClick={handleThemeClick}
                  sx={{ 
                    bgcolor: alpha(theme.palette.divider, 0.05),
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }
                  }}
                >
                  <ThemeIcon size={20} />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={themeAnchorEl}
                open={Boolean(themeAnchorEl)}
                onClose={() => handleThemeClose()}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    bgcolor: 'background.paper',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    borderRadius: '12px',
                    minWidth: 120,
                  }
                }}
              >
                <MenuItem onClick={() => handleThemeClose('light')} sx={{ gap: 1.5, color: mode === 'light' ? 'primary.main' : 'text.primary' }}>
                  <Sun size={16} /> <Typography variant="body2">浅色模式</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleThemeClose('dark')} sx={{ gap: 1.5, color: mode === 'dark' ? 'primary.main' : 'text.primary' }}>
                  <Moon size={16} /> <Typography variant="body2">深色模式</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleThemeClose('system')} sx={{ gap: 1.5, color: mode === 'system' ? 'primary.main' : 'text.primary' }}>
                  <Monitor size={16} /> <Typography variant="body2">跟随系统</Typography>
                </MenuItem>
              </Menu>

              <IconButton
                component="a"
                href="https://github.com/cxw668/honor-speed-assistant-react19"
                target="_blank"
                rel="noreferrer"
                sx={{ 
                  bgcolor: alpha(theme.palette.divider, 0.05),
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary', bgcolor: alpha(theme.palette.divider, 0.1) }
                }}
              >
                <Github size={20} />
              </IconButton>
              
              <Button 
                variant="contained" 
                disableElevation
                onClick={() => { window.location.hash = '/hero' }}
                sx={{ 
                  borderRadius: '12px', 
                  px: 2.5, 
                  py: 1,
                  fontWeight: 700,
                  fontSize: '13px',
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: `0 10px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
                  }
                }}
              >
                立即体验
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 主体功能区（路由出口） */}
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          transition: 'background-color 0.3s ease'
        }}
      >
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
      </Box>
    </Box>
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
