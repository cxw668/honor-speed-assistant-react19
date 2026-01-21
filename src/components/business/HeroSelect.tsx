import { useState, useMemo, useRef, useEffect } from 'react';
import { useHeroData } from '../../hooks/useHeroData';
import { X, ChevronDown, Search, Check } from 'lucide-react';
import {
  useTheme,
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  InputBase,
  alpha,
  Avatar
} from '@mui/material';

interface HeroSelectProps {
  value: number | string;
  onChange: (heroId: number) => void;
  isStatic?: boolean;
  selectedIds?: number[];
  onRemove?: (heroId: number) => void;
  maxSelect?: number;
}

export const HeroSelect = ({
  value,
  onChange,
  isStatic = false,
  selectedIds = [],
  onRemove,
  maxSelect = 5
}: HeroSelectProps) => {
  const { heroList: allHeroes } = useHeroData();
  const [isOpen, setIsOpen] = useState(isStatic);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const theme = useTheme();
  // 获取已选择的英雄对象列表
  const selectedHeroes = useMemo(() => {
    return selectedIds.map(id => allHeroes.find(h => h.id === id)).filter(Boolean);
  }, [allHeroes, selectedIds]);

  useEffect(() => {
    if (isOpen && !isStatic && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isStatic]);

  // 当前选中的英雄
  const selectedHero = useMemo(() => {
    return allHeroes.find(h => h.id === Number(value));
  }, [allHeroes, value]);

  // 模糊搜索过滤
  const filteredHeroes = useMemo(() => {
    if (!searchTerm) return allHeroes;
    const lowerSearch = searchTerm.toLowerCase();
    return allHeroes.filter(hero =>
      hero.heroName.toLowerCase().includes(lowerSearch) ||
      hero.heroTypes.some(type => type.toLowerCase().includes(lowerSearch))
    );
  }, [allHeroes, searchTerm]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (heroId: number) => {
    // 如果已经选择了该英雄且不是单选模式，或者已达到最大选择数且不是单选，则不操作
    if (selectedIds.includes(heroId) && isStatic) return;
    if (selectedIds.length >= maxSelect && isStatic && !selectedIds.includes(heroId)) return;

    onChange(heroId);
    if (!isStatic) {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isStatic) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <Box
      ref={dropdownRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: isStatic ? '100%' : 'auto',
        display: isStatic ? 'flex' : 'block',
        flexDirection: 'column'
      }}
    >
      {/* 触发按钮/输入框 - Static 模式下隐藏 */}
      {!isStatic && (
        <Paper
          elevation={0}
          onClick={handleToggle}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: 'background.paper',
            border: '2px solid',
            borderColor: isOpen ? 'primary.main' : 'divider',
            borderRadius: 4,
            px: 2,
            py: 1.5,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isOpen ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
            '&:hover': {
              borderColor: isOpen ? 'primary.main' : alpha(theme.palette.primary.main, 0.5),
            }
          }}
        >
          {selectedHero ? (
            <>
              <Avatar
                src={selectedHero.heroSrc}
                alt={selectedHero.heroName}
                variant="rounded"
                sx={{ width: 32, height: 32, boxShadow: theme.shadows[1] }}
              />
              <Typography sx={{ fontWeight: 900, fontSize: '1.125rem', color: 'text.primary', flex: 1 }}>
                {selectedHero.heroName}
              </Typography>
            </>
          ) : (
            <Typography sx={{ fontWeight: 900, fontSize: '1.125rem', color: 'text.secondary', flex: 1 }}>
              请选择英雄
            </Typography>
          )}
          <ChevronDown
            size={20}
            strokeWidth={3}
            style={{
              color: theme.palette.text.secondary,
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease-in-out'
            }}
          />
        </Paper>
      )}

      {/* 下拉面板 */}
      <Paper
        elevation={isStatic ? 0 : 12}
        sx={{
          position: isStatic ? 'relative' : 'absolute',
          top: isStatic ? 0 : 'calc(100% + 8px)',
          left: 0,
          right: 0,
          mt: isStatic ? 0 : 1,
          bgcolor: 'background.paper',
          borderRadius: isStatic ? 0 : 4,
          border: isStatic ? 'none' : '1px solid',
          borderColor: 'divider',
          overflowY: 'hidden',
          zIndex: 100,
          display: (isStatic || isOpen) ? 'flex' : 'none',
          flexDirection: 'column',
          flex: isStatic ? 1 : 'none',
          minHeight: isStatic ? 0 : 'auto',
          animation: (!isStatic && isOpen) ? 'fadeInScale 0.2s ease-out' : 'none',
        }}
      >
          {/* 已选择英雄展示区 - 仅在 Static 模式（对战辅助）下显示 */}
          {isStatic && selectedHeroes.length > 0 && (
            <Box sx={{
              px: 2,
              py: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              alignItems: 'center'
            }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 900,
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  width: '100%',
                  fontSize: 10
                }}
              >
                已选择 ({selectedHeroes.length}/{maxSelect})
              </Typography>
              {selectedHeroes.map((hero: any) => (
                <Box key={hero.id} sx={{ position: 'relative', '&:hover button': { transform: 'scale(1.1)' } }}>
                  <Avatar
                    src={hero.heroSrc}
                    alt={hero.heroName}
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      border: '2px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.3)
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove?.(hero.id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      bgcolor: 'error.main',
                      color: 'white',
                      p: 0.25,
                      boxShadow: 2,
                      '&:hover': { bgcolor: 'error.dark' },
                      transition: 'transform 0.2s'
                    }}
                  >
                    <X size={10} strokeWidth={4} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* 搜索框 */}
          <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: alpha(theme.palette.text.primary, 0.02) }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ position: 'absolute', left: 12, display: 'flex', color: 'text.secondary' }}>
                <Search size={16} strokeWidth={2.5} />
              </Box>
              <InputBase
                inputRef={inputRef}
                autoFocus
                placeholder="搜索英雄名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  width: '100%',
                  bgcolor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                  pl: 5,
                  pr: searchTerm ? 5 : 1.5,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'border-color 0.2s',
                  '&.Mui-focused': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  }
                }}
              />
              {searchTerm && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm('');
                    inputRef.current?.focus();
                  }}
                  sx={{ position: 'absolute', right: 8, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                >
                  <X size={14} strokeWidth={3} />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* 列表区 */}
          <Box sx={{
            flex: isStatic ? 1 : 'none',
            maxHeight: isStatic ? 'none' : 320,
            overflowY: 'auto',
          }}>
            {filteredHeroes.length > 0 ? (
              filteredHeroes.map((hero) => {
                const isSelected = Number(value) === hero.id || (isStatic && selectedIds.includes(hero.id));
                const isDisabled = isStatic && selectedIds.includes(hero.id);

                return (
                  <Box
                    key={hero.id}
                    onClick={() => handleSelect(hero.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 2,
                      py: 1.5,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                      color: isSelected ? 'primary.main' : 'text.primary',
                      opacity: isDisabled ? 0.5 : 1,
                      '&:hover': {
                        bgcolor: isDisabled ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.text.primary, 0.04),
                      }
                    }}
                  >
                    <Avatar
                      src={hero.heroSrc}
                      alt={hero.heroName}
                      variant="rounded"
                      sx={{ width: 40, height: 40, borderRadius: 2.5, boxShadow: theme.shadows[1] }}
                    />
                    <Stack spacing={0.25}>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.925rem' }}>{hero.heroName}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 500 }}>
                        {hero.heroTypes.join(' / ')}
                      </Typography>
                    </Stack>
                    {isSelected && (
                      <Box sx={{ ml: 'auto', display: 'flex', color: 'primary.main' }}>
                        <Check size={18} strokeWidth={3} />
                      </Box>
                    )}
                  </Box>
                );
              })
            ) : (
              <Box sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>未找到相关英雄</Typography>
              </Box>
            )}
          </Box>
      </Paper>
    </Box>
  );
};

