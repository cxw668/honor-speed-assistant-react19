import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container 
} from '@mui/material';
import HeroIcon from '@mui/icons-material/PersonSearch';
import EquipmentIcon from '@mui/icons-material/Shield';
import InscriptionIcon from '@mui/icons-material/AutoFixHigh';
import FightIcon from '@mui/icons-material/FlashOn';
import RecordIcon from '@mui/icons-material/History';

export const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: '英雄信息速查',
      desc: '筛选定位 + 新手推荐，英雄详情一键看',
      icon: <HeroIcon sx={{ fontSize: 32 }} />,
      path: '/hero',
      isPrimary: true
    },
    {
      title: '智能出装推荐',
      desc: '核心出装 + 技能解读，助你快速上手',
      icon: <EquipmentIcon sx={{ fontSize: 32 }} />,
      path: '/equipment',
      isPrimary: true
    },
    {
      title: '铭文搭配方案',
      desc: '职业选手铭文方案，伤害提升立竿见影',
      icon: <InscriptionIcon sx={{ fontSize: 32 }} />,
      path: '/inscription',
      isPrimary: true
    },
    {
      title: '对战辅助工具',
      desc: '野怪计时 + 技能CD，全局掌控节奏',
      icon: <FightIcon sx={{ fontSize: 32 }} />,
      path: '/fight',
      isPrimary: false
    },
    {
      title: '我的成长记录',
      desc: '本地保存学习历程，见证上分时刻',
      icon: <RecordIcon sx={{ fontSize: 32 }} />,
      path: '/record',
      isPrimary: false
    }
  ];

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'var(--color-bg-page)' }}>
      {/* Banner 区 */}
      <Box 
        sx={{ 
          height: 'calc(100vh - 72px)',
          position: 'relative', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)',
        }}
      >
        {/* 背景装饰层 */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          {/* 底部渐变遮罩，使衔接更自然 */}
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              height: '20vh', 
              background: 'linear-gradient(to bottom, transparent, var(--color-bg-page))',
              zIndex: 2
            }} 
          />
          
          {/* 动态光晕 */}
          <Box 
            sx={{ 
              position: 'absolute', 
              top: '10%', 
              right: '5%', 
              width: '500px', 
              height: '500px', 
              background: 'radial-gradient(circle, rgba(255,159,0,0.15) 0%, transparent 70%)',
              filter: 'blur(80px)',
              animation: 'float 15s infinite ease-in-out'
            }} 
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: '20%', 
              left: '5%', 
              width: '400px', 
              height: '400px', 
              background: 'radial-gradient(circle, rgba(255,159,0,0.08) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'float 20s infinite ease-in-out reverse'
            }} 
          />

          {/* 粒子动画 */}
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              className="animate-float"
              sx={{
                position: 'absolute',
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                opacity: 0.3,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(1px)'
              }}
            />
          ))}

          {/* 网格背景 */}
          <Box 
            sx={{ 
              position: 'absolute', 
              inset: 0, 
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              opacity: 0.5
            }} 
          />
        </Box>

        {/* 内容层 */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, mt: '-20px' }}>
          <Box sx={{ maxWidth: '850px', mx: 'auto', textAlign: 'center' }}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1.5, 
                px: 2.5, 
                py: 0.8, 
                mb: 4, 
                bgcolor: 'rgba(255,159,0,0.08)', 
                border: '1px solid rgba(255,159,0,0.2)',
                backdropFilter: 'blur(12px)',
                borderRadius: 'full',
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                boxShadow: '0 0 20px rgba(255,159,0,0.1)'
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: 'full', bgcolor: 'currentColor', animation: 'pulse 2s infinite' }} />
              Ready for Season 2026
            </Box>

            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '40px', sm: '56px', md: '72px' }, 
                fontWeight: 900, 
                lineHeight: 1.1,
                mb: 3,
                background: 'linear-gradient(to bottom, #ffffff 40%, #64748b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-2px'
              }}
            >
              掌握节奏，成就王者<br />
              <Box component="span" sx={{ color: 'var(--color-primary)', WebkitTextFillColor: 'initial', position: 'relative' }}>
                全方位
                <Box sx={{ position: 'absolute', bottom: '15%', left: 0, width: '100%', height: '8px', bgcolor: 'var(--color-primary)', opacity: 0.2, zIndex: -1 }} />
              </Box> 游戏辅助专家
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: { xs: '16px', md: '20px' }, 
                color: 'var(--color-text-secondary)', 
                mb: 6,
                lineHeight: 1.6,
                maxWidth: '650px',
                mx: 'auto',
                fontWeight: 400
              }}
            >
              集成英雄实时数据、智能出装模型及职业铭文方案，<br />
              为您提供最精准的对局洞察，让每一场胜利都尽在掌握。
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/hero')}
                sx={{
                  px: 6,
                  py: 2,
                  borderRadius: '16px',
                  backgroundColor: 'var(--color-primary)',
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#000',
                  boxShadow: '0 10px 30px rgba(255,159,0,0.4)',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 15px 40px rgba(255,159,0,0.5)',
                  },
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                立即开启荣耀之旅
              </Button>
              <Button
                variant="outlined"
                href="https://github.com"
                target="_blank"
                sx={{
                  px: 5,
                  py: 2,
                  borderRadius: '16px',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '17px',
                  fontWeight: 600,
                  textTransform: 'none',
                  bgcolor: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.4)',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s'
                }}
              >
                查看 GitHub 开源
              </Button>
            </Box>
          </Box>
        </Container>

        {/* 滚动引导标识 */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: '40px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            opacity: 0.6,
            animation: 'float 3s infinite ease-in-out'
          }}
        >
          <Typography sx={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Explore Features
          </Typography>
          <Box sx={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--color-primary), transparent)' }} />
        </Box>
      </Box>

      {/* 核心功能区 */}
      <Container maxWidth="lg" sx={{ py: 15, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 10, position: 'relative' }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              fontSize: '120px', 
              fontWeight: 900, 
              color: 'white', 
              opacity: 0.02, 
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: -1
            }}
          >
            CORE FEATURES
          </Box>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: { xs: '32px', md: '48px' }, 
              fontWeight: 800, 
              mb: 2, 
              color: '#fff',
              letterSpacing: '-1px'
            }}
          >
            全方位核心功能
          </Typography>
          <Box 
            sx={{ 
              width: 60, 
              height: 4, 
              bgcolor: 'var(--color-primary)', 
              mx: 'auto', 
              borderRadius: 'full',
              boxShadow: '0 0 10px var(--color-primary)'
            }} 
          />
          <Typography 
            sx={{ 
              mt: 3, 
              color: 'var(--color-text-secondary)', 
              fontSize: '16px', 
              maxWidth: '500px', 
              mx: 'auto' 
            }}
          >
            我们打通了从备战到实战的全链路辅助，助您在每一局对局中都能发挥出最佳水平
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid 
              key={index} 
              size={{ xs: 12, md: feature.isPrimary ? 4 : 6 }}
            >
              <Card
                className="glass-card"
                sx={{
                  height: '100%',
                  borderRadius: '24px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: 'rgba(255,159,0,0.3)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255,159,0,0.1)',
                    '& .icon-box': {
                      transform: 'scale(1.1) rotate(5deg)',
                      bgcolor: 'var(--color-primary)',
                      color: '#fff',
                      boxShadow: '0 0 20px rgba(255,159,0,0.4)'
                    },
                    '& .go-btn': {
                      bgcolor: 'var(--color-primary)',
                      color: '#fff',
                      px: 3,
                      boxShadow: '0 0 15px rgba(255,159,0,0.3)'
                    }
                  }
                }}
                onClick={() => navigate(feature.path)}
              >
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box 
                    className="icon-box"
                    sx={{ 
                      w: 56, 
                      h: 56, 
                      borderRadius: '16px', 
                      bgcolor: 'rgba(255,159,0,0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 3,
                      color: 'var(--color-primary)',
                      transition: 'all 0.3s'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography 
                    variant="h3" 
                    sx={{ fontSize: '20px', fontWeight: 700, color: '#fff', mb: 1.5 }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ fontSize: '15px', color: 'var(--color-text-secondary)', mb: 4, flexGrow: 1, lineHeight: 1.6 }}
                  >
                    {feature.desc}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box 
                      className="go-btn"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        py: 1, 
                        px: 2, 
                        borderRadius: 'full', 
                        border: '1px solid var(--color-primary)',
                        color: 'var(--color-primary)',
                        fontSize: '14px',
                        fontWeight: 600,
                        transition: 'all 0.3s'
                      }}
                    >
                      立即前往
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer 区 */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4,
          backgroundColor: 'transparent', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'auto',
          gap: 2
        }}
      >
        <Typography sx={{ fontSize: '14px', color: 'var(--color-text-secondary)', opacity: 0.8 }}>
          © 2026 荣耀速通助手 · 纯本地数据安全保障
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box component="a" href="#" sx={{ color: 'var(--color-text-secondary)', fontSize: '12px', '&:hover': { color: '#fff' } }}>使用条款</Box>
          <Box component="a" href="#" sx={{ color: 'var(--color-text-secondary)', fontSize: '12px', '&:hover': { color: '#fff' } }}>隐私政策</Box>
          <Box component="a" href="#" sx={{ color: 'var(--color-text-secondary)', fontSize: '12px', '&:hover': { color: '#fff' } }}>反馈建议</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
