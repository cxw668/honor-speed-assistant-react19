import { HeroRelationshipAnalysis } from '../components/business/HeroRelationshipAnalysis';
import {
  Box,
  Container,
  alpha,
  useTheme,
} from '@mui/material';
export default function FightAssistPage() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 动态背景装饰 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '25%',
          width: 500,
          height: 500,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: '50%',
          filter: 'blur(120px)',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: '25%',
          width: 500,
          height: 500,
          bgcolor: alpha(theme.palette.success.main, 0.05),
          borderRadius: '50%',
          filter: 'blur(120px)',
          transform: 'translateY(50%)',
          pointerEvents: 'none'
        }}
      />
      {/* 主体内容区 */}
      <Container maxWidth="lg" sx={{ flex: 1, py: { md: 4, sm: 2 }, position: 'relative', zIndex: 10 }}>
        <Box className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <HeroRelationshipAnalysis />
        </Box>
      </Container>
    </Box>
  );
}
