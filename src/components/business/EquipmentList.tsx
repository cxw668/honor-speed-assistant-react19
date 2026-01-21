import { Box, Typography, Grid, Tooltip, Avatar, useTheme, alpha, Paper, Stack } from '@mui/material';

interface Equipment {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

interface EquipmentListProps {
  list: Equipment[];
  onUpdateList: (newList: Equipment[]) => void;
  tooltipSide?: 'left' | 'right';
}

/**
 * 装备列表组件
 * 展示英雄的推荐出装，支持悬浮查看详情
 */
export const EquipmentList = ({ list, tooltipSide = 'right' }: EquipmentListProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Grid container spacing={1.5} sx={{ width: '100%', m: 0 }}>
        {list.map((item, idx) => (
          <Grid size={{ xs: 6 }} key={`${item.id}-${idx}`}>
            <Tooltip
              title={
                <Box sx={{ p: 1 }}>
                  <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                    <Avatar
                      src={item.icon}
                      variant="rounded"
                      sx={{ width: 40, height: 40, borderRadius: 2, border: '1px solid', borderColor: alpha('#fff', 0.1) }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'white' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        局内道具详情
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ p: 1.5, bgcolor: alpha('#fff', 0.05), borderRadius: 3, border: '1px solid', borderColor: alpha('#fff', 0.05), mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.primary', lineHeight: 1.6, fontStyle: 'italic', fontWeight: 500 }}>
                      “{item.desc}”
                    </Typography>
                  </Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase' }}>
                      核心属性
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 900 }}>
                      已生效
                    </Typography>
                  </Stack>
                </Box>
              }
              arrow
              placement={tooltipSide}
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: alpha(theme.palette.background.paper, 0.95),
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.divider, 0.1),
                    borderRadius: 4,
                    boxShadow: `0 20px 50px ${alpha(theme.palette.common.black, 0.5)}`,
                    maxWidth: 280,
                    p: 1
                  }
                },
                arrow: {
                  sx: {
                    color: alpha(theme.palette.background.paper, 0.95),
                    '&::before': {
                      border: '1px solid',
                      borderColor: alpha(theme.palette.divider, 0.1),
                    }
                  }
                }
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: alpha(theme.palette.common.white, 0.05),
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.common.white, 0.05),
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'scale(1.02)',
                    zIndex: 10,
                    '& .index-tag': {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      bgcolor: alpha(theme.palette.background.paper, 1),
                    }
                  },
                  '&:active': {
                    transform: 'scale(0.98)'
                  }
                }}
              >
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar
                    src={item.icon}
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.common.white, 0.1)
                    }}
                  />
                  <Box
                    className="index-tag"
                    sx={{
                      position: 'absolute',
                      top: -6,
                      left: -6,
                      width: 20,
                      height: 20,
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(8px)',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 900,
                      color: 'primary.main',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.2),
                      boxShadow: theme.shadows[2],
                      transition: 'all 0.3s'
                    }}
                  >
                    {idx + 1}
                  </Box>
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: '13px',
                      fontWeight: 900,
                      color: 'text.primary',
                      transition: 'color 0.3s',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '10px',
                      color: 'text.secondary',
                      fontWeight: 500,
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      opacity: 0.6,
                      mt: 0.5
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    </Box>)
}
