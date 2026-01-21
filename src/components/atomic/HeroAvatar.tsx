import { Box, Typography, alpha } from '@mui/material';

interface HeroAvatarProps {
  src?: string;
  name: string;
  active?: boolean;
  onClick?: () => void;
}

/**
 * 英雄头像组件
 * @param src 头像地址
 * @param name 英雄名称
 * @param active 是否选中
 * @param onClick 点击事件
 */
export const HeroAvatar = ({ src, name, active = false, onClick }: HeroAvatarProps) => {
  // 默认头像占位
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF9F00&color=fff&rounded=true`;

  return (
    <Box 
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        transform: active ? 'scale(1.1)' : 'scale(1)',
        '&:hover': {
          transform: active ? 'scale(1.1)' : 'scale(1.05)',
        }
      }}
    >
      <Box 
        sx={{
          width: 64,
          height: 64,
          borderRadius: 2, 
          overflow: 'hidden',
          border: '2px solid',
          borderColor: active ? 'primary.main' : 'transparent',
          boxShadow: active ? (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}` : 'none',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Box 
          component="img"
          src={src || defaultAvatar} 
          alt={name} 
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e: any) => {
            e.target.src = defaultAvatar;
          }}
        />
      </Box>
      <Typography 
        variant="caption"
        sx={{
          fontSize: '12px',
          textAlign: 'center',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontWeight: active ? 700 : 400,
          color: active ? 'primary.main' : 'text.primary',
          transition: 'color 0.2s',
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};
