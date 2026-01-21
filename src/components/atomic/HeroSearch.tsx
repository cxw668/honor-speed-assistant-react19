import { Search, X } from 'lucide-react';
import { Box, InputBase, IconButton } from '@mui/material';

interface HeroSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const HeroSearch = ({ value, onChange, placeholder = "搜索英雄名称..." }: HeroSearchProps) => {
  return (
    <Box sx={{ position: 'relative', width: '100%', '&:hover .MuiInputBase-root': { borderColor: 'primary.main' } }}>
      <Box sx={{ 
        position: 'absolute', 
        left: 14, 
        top: '50%', 
        transform: 'translateY(-50%)', 
        color: 'text.secondary',
        zIndex: 1,
        transition: 'color 0.2s',
        '.MuiInputBase-root.Mui-focused ~ &': { color: 'primary.main' }
      }}>
        <Search size={18} />
      </Box>
      <InputBase
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        sx={{
          height: 44,
          pl: '44px',
          pr: value ? '40px' : '14px',
          bgcolor: 'rgba(0,0,0,0.2)',
          border: '1px solid',
          borderColor: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          fontSize: '15px',
          color: 'text.primary',
          transition: 'all 0.3s',
          '&.Mui-focused': {
            borderColor: 'primary.main',
            boxShadow: '0 0 0 2px rgba(255,159,0,0.1)',
            bgcolor: 'rgba(0,0,0,0.3)',
          },
          '& input::placeholder': {
            color: 'text.secondary',
            opacity: 0.5,
          }
        }}
      />
      {value && (
        <IconButton
          onClick={() => onChange('')}
          size="small"
          sx={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'text.secondary',
            '&:hover': {
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.1)',
            }
          }}
        >
          <X size={16} />
        </IconButton>
      )}
    </Box>
  );
};
