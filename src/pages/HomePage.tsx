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
      icon: <HeroIcon sx={{ fontSize: 48, color: '#FF9F00' }} />,
      path: '/hero',
      isPrimary: true
    },
    {
      title: '智能出装推荐',
      desc: '核心出装 + 技能解读，助你快速上手',
      icon: <EquipmentIcon sx={{ fontSize: 48, color: '#FF9F00' }} />,
      path: '/equipment',
      isPrimary: true
    },
    {
      title: '铭文搭配方案',
      desc: '职业选手铭文方案，伤害提升立竿见影',
      icon: <InscriptionIcon sx={{ fontSize: 48, color: '#FF9F00' }} />,
      path: '/inscription',
      isPrimary: true
    },
    {
      title: '对战辅助工具',
      desc: '野怪计时 + 技能CD，全局掌控节奏',
      icon: <FightIcon sx={{ fontSize: 48, color: '#FF9F00' }} />,
      path: '/fight',
      isPrimary: false
    },
    {
      title: '我的成长记录',
      desc: '本地保存学习历程，见证上分时刻',
      icon: <RecordIcon sx={{ fontSize: 48, color: '#FF9F00' }} />,
      path: '/record',
      isPrimary: false
    }
  ];

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Banner 区 */}
      <Box 
        sx={{ 
          height: 'calc(100vh - 180px)', 
          position: 'relative', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        {/* 背景层：粒子动画 */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {[...Array(20)].map((_, i) => (
            <Box
              key={i}
              className="animate-float"
              sx={{
                position: 'absolute',
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                borderRadius: '50%',
                backgroundColor: '#FF9F00',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(2px)'
              }}
            />
          ))}
          {/* 英雄剪影背景 (CSS模拟) */}
          <Box 
            sx={{ 
              position: 'absolute', 
              right: '10%', 
              bottom: 0, 
              width: '400px', 
              height: '80%', 
              opacity: 0.1,
              background: 'linear-gradient(to top, #333, transparent)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }} 
          />
        </Box>

        {/* 内容层 */}
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', px: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: '28px', 
              fontWeight: 600, 
              color: '#333333', 
              mb: 2 
            }}
          >
            王者荣耀新手必备！英雄、出装、铭文一键查
          </Typography>
          <Typography 
            variant="h2" 
            sx={{ 
              fontSize: '16px', 
              fontWeight: 400, 
              color: '#666666', 
              mb: 4,
              letterSpacing: '1px'
            }}
          >
            纯本地运行 · 数据不丢失 · 零操作门槛
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/hero')}
            sx={{
              width: '200px',
              height: '50px',
              borderRadius: '8px',
              backgroundColor: '#FF9F00',
              fontSize: '18px',
              fontWeight: 500,
              color: '#fff',
              boxShadow: '0 0 15px rgba(255,95,0,0.3)',
              '&:hover': {
                backgroundColor: '#E68A00',
                transform: 'scale(1.05)',
                transition: 'all 0.3s'
              }
            }}
          >
            立即开始使用
          </Button>
        </Box>
      </Box>

      {/* 核心功能区 */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid 
              key={index} 
              size={{ xs: 12, md: feature.isPrimary ? 12 : 6 }}
            >
              <Card
                sx={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: '8px',
                  boxShadow: feature.isPrimary ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.3s',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: '16px !important', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ flexShrink: 0 }}>
                    {feature.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ fontSize: '18px', fontWeight: 600, color: '#333333', mb: 1 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ fontSize: '14px', color: '#666666' }}
                    >
                      {feature.desc}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(feature.path)}
                    sx={{
                      width: '100px',
                      height: '36px',
                      borderRadius: '4px',
                      borderColor: '#FF9F00',
                      color: '#FF9F00',
                      backgroundColor: '#fff',
                      '&:hover': {
                        backgroundColor: '#FF9F00',
                        color: '#fff',
                        borderColor: '#FF9F00'
                      }
                    }}
                  >
                    立即前往
                  </Button>
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
          height: '50px', 
          backgroundColor: '#fff', 
          borderTop: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'auto'
        }}
      >
        <Typography sx={{ fontSize: '14px', color: '#666666' }}>
          © 2026 荣耀速通助手 · 纯本地数据安全保障
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
