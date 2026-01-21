import { LayoutGrid, Shield, Swords, Zap, Wand2, Crosshair, Heart, Sparkles } from 'lucide-react';
import { Box, Stack, Typography, ButtonBase, Switch } from '@mui/material';

interface HeroType {
  id: number;
  name: string;
}

interface HeroTypeFilterProps {
  types: HeroType[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  isNoviceOnly: boolean;
  onNoviceToggle: (val: boolean) => void;
  typeCounts?: Record<string, number>;
}

const typeIconMap: Record<string, any> = {
  '全部': LayoutGrid,
  '坦克': Shield,
  '战士': Swords,
  '刺客': Zap,
  '法师': Wand2,
  '射手': Crosshair,
  '辅助': Heart
};

export const HeroTypeFilter = ({ 
  types, 
  selectedType, 
  onTypeChange, 
  isNoviceOnly, 
  onNoviceToggle,
  typeCounts = {}
}: HeroTypeFilterProps) => {
  return (
    <Stack spacing={4}>
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, px: 0.5 }}>
          <Box sx={{ 
            width: 4, 
            height: 16, 
            bgcolor: 'primary.main', 
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(255,159,0,0.6)'
          }} />
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.secondary', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}
          >
            英雄定位
          </Typography>
        </Stack>

        <Stack spacing={1.25}>
          {types.map(type => {
            const Icon = typeIconMap[type.name] || LayoutGrid;
            const isSelected = selectedType === type.name;
            
            return (
              <ButtonBase
                key={type.id}
                onClick={() => onTypeChange(type.name)}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  ...(isSelected ? {
                    background: 'linear-gradient(to right, #FF9F00, #FF7A00)',
                    color: '#fff',
                    boxShadow: '0 4px 12px rgba(255,159,0,0.25)',
                  } : {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                    }
                  })
                }}
              >
                {isSelected && (
                  <Box 
                    component="span"
                    className="animate-pulse"
                    sx={{ 
                      position: 'absolute', 
                      inset: 0, 
                      bgcolor: 'rgba(255,255,255,0.1)' 
                    }} 
                  />
                )}
                
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    '.group:hover &': {
                      bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,159,0,0.1)',
                      color: isSelected ? '#fff' : 'primary.main',
                    }
                  }}>
                    <Icon size={16} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {type.name}
                  </Typography>
                </Stack>

                <Box sx={{
                  fontSize: '11px',
                  px: 1,
                  py: 0.25,
                  borderRadius: '10px',
                  minWidth: 28,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  position: 'relative',
                  zIndex: 1,
                  ...(isSelected ? {
                    bgcolor: 'rgba(0,0,0,0.2)',
                    color: '#fff',
                  } : {
                    bgcolor: 'rgba(0,0,0,0.2)',
                    color: 'text.secondary',
                  })
                }}>
                  {typeCounts[type.name] || 0}
                </Box>
              </ButtonBase>
            );
          })}
        </Stack>
      </Box>

      <Box sx={{ pt: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, px: 0.5 }}>
          <Box sx={{ 
            width: 4, 
            height: 16, 
            bgcolor: 'success.main', 
            borderRadius: '2px',
            boxShadow: '0 0 8px rgba(46,204,113,0.6)'
          }} />
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.secondary', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}
          >
            新手筛选
          </Typography>
        </Stack>
        
        <ButtonBase
          onClick={() => onNoviceToggle(!isNoviceOnly)}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            p: 2,
            borderRadius: '16px',
            transition: 'all 0.3s ease',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid',
            ...(isNoviceOnly ? {
              background: 'linear-gradient(to bottom right, rgba(46,204,113,0.2), rgba(39,174,96,0.05))',
              borderColor: 'rgba(46,204,113,0.3)',
              boxShadow: '0 8px 20px rgba(46,204,113,0.1)',
            } : {
              bgcolor: 'rgba(255,255,255,0.05)',
              borderColor: 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              }
            })
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                ...(isNoviceOnly ? {
                  bgcolor: 'success.main',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(46,204,113,0.3)',
                } : {
                  bgcolor: 'rgba(0,0,0,0.2)',
                  color: 'text.secondary',
                })
              }}>
                <Sparkles size={18} />
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: isNoviceOnly ? 'success.main' : 'text.primary'
                }}
              >
                新手推荐
              </Typography>
            </Stack>
            
            <Switch 
              checked={isNoviceOnly} 
              size="small"
              color="success"
              sx={{
                '& .MuiSwitch-track': {
                  bgcolor: isNoviceOnly ? 'success.main' : 'rgba(0,0,0,0.2)',
                  opacity: 1,
                }
              }}
            />
          </Stack>
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: isNoviceOnly ? 'rgba(46,204,113,0.8)' : 'text.secondary',
              lineHeight: 1.5
            }}
          >
            筛选上手难度 ⭐-⭐⭐ 的英雄，助你快速上分
          </Typography>
        </ButtonBase>
      </Box>
    </Stack>
  );
};
