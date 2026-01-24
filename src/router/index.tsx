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
  ChevronDown,
  Menu as MenuIcon,
  X as CloseIcon
} from 'lucide-react';
import { routes, Loading } from './routes';
import { useAppTheme } from '@/context/ThemeContext';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';

const NavContent = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, setMode } = useAppTheme();
  
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const equipmentRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = (open: boolean) => () => {
    setMobileMenuOpen(open);
  };

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
          <Toolbar disableGutters sx={{ height: { xs: 64, md: 72 }, justifyContent: 'space-between' }}>
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
                sx={{ width: { xs: 32, md: 40 }, height: { xs: 32, md: 40 }, borderRadius: '10px', objectFit: 'contain' }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="subtitle1" 
                  className="logo-text"
                  sx={{ 
                    fontWeight: 700, 
                    lineHeight: 1.2, 
                    color: 'text.primary', 
                    transition: 'color 0.2s',
                    fontSize: { xs: '14px', md: '16px' }
                  }}
                >
                  荣耀速通助手
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '10px', 
                    color: 'text.secondary', 
                    fontWeight: 500, 
                    letterSpacing: '0.1em', 
                    textTransform: 'uppercase',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Honor Speed Assistant
                </Typography>
              </Box>
            </Stack>

            {/* 中间导航 Tab (仅桌面端) */}
            {!isMobile && (
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
            )}

            {/* 右侧功能区 */}
            <Stack direction="row" spacing={0.5} alignItems="center">
              {/* 主题切换按钮 */}
              <Tooltip title="切换主题">
                <IconButton 
                  onClick={handleThemeClick}
                  size={isMobile ? "small" : "medium"}
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

              {/* GitHub 链接 */}
              <Tooltip title="GitHub 仓库">
                <IconButton 
                  component="a"
                  href="https://github.com/tonylua/honor-speed-assistant-react19"
                  target="_blank"
                  rel="noreferrer"
                  size={isMobile ? "small" : "medium"}
                  sx={{ 
                    bgcolor: alpha(theme.palette.divider, 0.05),
                    color: 'text.secondary',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }
                  }}
                >
                  <Github size={isMobile ? 18 : 20} />
                </IconButton>
              </Tooltip>

              {/* 移动端菜单按钮 */}
              {isMobile && (
                <IconButton
                  onClick={toggleMobileMenu(true)}
                  size="small"
                  sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    ml: 0.5
                  }}
                >
                  <MenuIcon size={20} />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 移动端抽屉菜单 */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              component="img"
              src="assets/logo2.png"
              sx={{ width: 32, height: 32, borderRadius: '8px' }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>导航菜单</Typography>
          </Stack>
          <IconButton onClick={toggleMobileMenu(false)} size="small">
            <CloseIcon size={20} />
          </IconButton>
        </Box>

        <List sx={{ flex: 1, py: 2 }}>
          {routes.map((route) => {
            const isActive = location.pathname === route.path;
            
            if (route.path === '/equipment') {
              return (
                <Box key={route.path}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={NavLink}
                      to={route.path}
                      onClick={toggleMobileMenu(false)}
                      sx={{
                        py: 1.5,
                        px: 3,
                        color: isActive ? 'primary.main' : 'text.primary',
                        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      }}
                    >
                      <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                        {route.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={route.label} 
                        primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                      />
                    </ListItemButton>
                  </ListItem>
                  
                  {/* 子菜单 */}
                  <List sx={{ pl: 4, py: 0 }}>
                    {equipmentSubMenu.map((item) => {
                      const searchParams = new URLSearchParams(location.search);
                      const currentTab = searchParams.get('tab') || 'equipment';
                      const isItemActive = location.pathname === '/equipment' && currentTab === item.tab;
                      
                      return (
                        <ListItem key={item.tab} disablePadding>
                          <ListItemButton
                            component={NavLink}
                            to={`/equipment?tab=${item.tab}`}
                            onClick={toggleMobileMenu(false)}
                            sx={{
                              py: 1,
                              color: isItemActive ? 'primary.main' : 'text.secondary',
                            }}
                          >
                            <ListItemText 
                              primary={item.label} 
                              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isItemActive ? 700 : 400 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              );
            }

            return (
              <ListItem key={route.path} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={route.path}
                  onClick={toggleMobileMenu(false)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    color: isActive ? 'primary.main' : 'text.primary',
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                    {route.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={route.label} 
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

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
