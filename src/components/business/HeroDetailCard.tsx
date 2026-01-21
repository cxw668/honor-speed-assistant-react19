import { Box, Stack, Typography, Chip, Rating, alpha } from '@mui/material';

interface HeroDetailCardProps {
  hero?: any;
}

export const HeroDetailCard = ({ hero }: HeroDetailCardProps) => {
  return (
    <Stack className="h-full text-white animate-in fade-in duration-300 pr-2" spacing={2.5}>
      <Box sx={{ bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7) , p: 2.5, borderRadius: '16px', flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: (theme)=>alpha(theme.palette.text.primary, 0.7), mb: 1 }}>
            {hero.heroName}
          </Typography>
          <Rating 
            value={hero.difficulty} 
            readOnly 
            size="small" 
            sx={{ 
              color: 'warning.main',
              '& .MuiRating-iconEmpty': { color: (theme) => alpha(theme.palette.text.disabled, 0.3) }
            }} 
          />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {hero.heroTypes?.map((type: string) => (
            <Chip 
              key={type} 
              label={type} 
              size="small"
              sx={{ 
                bgcolor: (theme)=>alpha(theme.palette.background.paper, 0.7), 
                color: 'primary.main', 
                fontWeight: 'bold',
                border: '1px solid',
                borderColor: 'rgba(255,159,0,0.2)',
                fontSize: '11px'
              }} 
            />
          ))}
          {!hero.heroTypes && hero.heroType && (
            <Chip 
              label={hero.heroType} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(255,159,0,0.1)', 
                color: 'primary.main', 
                fontWeight: 'bold',
                border: '1px solid',
                borderColor: 'rgba(255,159,0,0.2)',
                fontSize: '11px'
              }} 
            />
          )}
          {hero.isNewbieRecommend && (
            <Chip 
              label="新手推荐" 
              size="small"
              sx={{ 
                bgcolor: 'rgba(46,204,113,0.1)', 
                color: 'success.main', 
                fontWeight: 'bold',
                border: '1px solid',
                borderColor: 'rgba(46,204,113,0.2)',
                fontSize: '11px'
              }} 
            />
          )}
        </Stack>  
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-element-large">
        <Box sx={{ bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7), p: 2, borderRadius: '12px', borderLeft: '4px solid', borderColor: 'primary.main' }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main', display: 'block', mb: 0.5 }}>
            核心定位
          </Typography>
          <Typography variant="body2" sx={{ color: (theme)=>alpha(theme.palette.text.secondary, 0.9), lineHeight: 1.6 }}>
            {hero.corePosition}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7), p: 2, borderRadius: '12px', borderLeft: '4px solid', borderColor: 'success.main' }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'success.main', display: 'block', mb: 0.5 }}>
            战斗特点
          </Typography>
          <Typography variant="body2" sx={{ color: (theme)=>alpha(theme.palette.text.secondary, 0.9), lineHeight: 1.6 }}>
            {hero.combatFeature}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ bgcolor: (theme) => alpha(theme.palette.background.paper, 0.7), p: 2.5, borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#FF7676' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#FF7676' }}>
            上手建议
          </Typography>
        </Stack>
        <Typography 
          variant="body2" 
          sx={{ 
            color: (theme)=>alpha(theme.palette.text.secondary, 1), 
            lineHeight: 1.7, 
            fontStyle: 'italic',
            textIndent: '2em'
          }}
        >
          {hero.isNewbieRecommend 
            ? "该英雄操作门槛较低，技能逻辑清晰，非常适合新手玩家快速上手，在对局中能通过简单的连招发挥巨大作用。" 
            : "该英雄对操作节奏或意识有一定要求，建议在训练营熟悉技能机制后再进入实战对局。"}
        </Typography>
      </Box>
    </Stack>
  );
};
