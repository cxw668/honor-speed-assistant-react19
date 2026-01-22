import { createTheme, type PaletteMode } from '@mui/material/styles';

/**
 * 获取 MUI 主题配置
 * @param mode 主题模式：'light' | 'dark'
 */
export const getAppTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#FF9F00',
      dark: '#E68A00',
      contrastText: '#fff',
    },
    ...(mode === 'dark' ? {
      text: {
        primary: '#F8FAFC',
        secondary: '#94A3B8',
      },
      background: {
        default: '#0F172A',
        paper: '#1E293B',
      },
      // 针对首页 查看开源 按钮边框
      common: {
        white: '#ffffff',
      },
      divider: 'rgba(255, 255, 255, 0.05)',
    } : {
      text: {
        primary: '#1E293B',
        secondary: '#64748B',
      },
      background: {
        default: '#F8FAFC',
        paper: '#FFFFFF',
      },
      common: {
        white: '#4a4a4a',
      },
      divider: 'rgba(0, 0, 0, 0.08)',
    }),
    success: {
      main: '#2ECC71',
    },
    error: {
      main: '#E74C3C',
    },
    warning: {
      main: '#F39C12',
    },
  },
  typography: {
    fontFamily: '"Microsoft YaHei", "PingFang SC", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)',
          backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 32,
          height: 18,
          padding: 0,
          display: 'flex',
          '&:active': {
            '& .MuiSwitch-thumb': {
              width: 14,
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
              transform: 'translateX(9px)',
            },
          },
          '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
              transform: 'translateX(14px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#2ECC71',
              },
            },
          },
          '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 14,
            height: 14,
            borderRadius: 7,
            transition: 'width 200ms',
          },
          '& .MuiSwitch-track': {
            borderRadius: 9,
            opacity: 1,
            backgroundColor: 'rgba(0,0,0,.25)',
            boxSizing: 'border-box',
          },
        },
      },
    },
  },
});
