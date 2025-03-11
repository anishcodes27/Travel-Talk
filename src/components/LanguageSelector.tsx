import React, { useState } from 'react';
import { 
  TextField, InputAdornment, 
  useTheme, alpha, Autocomplete, Typography,
  Paper, MenuItem
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { Language } from '../types/language';
import { motion } from 'framer-motion';

interface LanguageSelectorProps {
  label: string;
  value: Language;
  onChange: (language: Language) => void;
}

export default function LanguageSelector({ label, value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => newValue && onChange(newValue)}
      options={SUPPORTED_LANGUAGES}
      getOptionLabel={(option) => option.name}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      disableClearable
      groupBy={(option) => {
        const baseCode = option.code.split('-')[0];
        if (['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur', 'as', 'or'].includes(baseCode)) {
          return 'Indian Languages';
        }
        if (['en', 'es', 'fr', 'de', 'zh-Hans', 'ar', 'ru', 'pt', 'ja', 'ko'].includes(option.code)) {
          return 'Global Languages';
        }
        return 'Other Languages';
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <motion.div
                  animate={{ 
                    rotate: isOpen ? 360 : 0 
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut" 
                  }}
                >
                  <LanguageIcon 
                    sx={{ 
                      color: isOpen 
                        ? theme.palette.primary.main 
                        : theme.palette.text.secondary 
                    }}
                  />
                </motion.div>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
              },
              '&.Mui-focused': {
                boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`
              }
            }
          }}
        />
      )}
      PaperComponent={(props) => {
        // Wrap Paper in a motion div instead of trying to use Paper as motion component
        return (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Paper 
              {...props}
              elevation={6}
              sx={{
                borderRadius: 2,
                mt: 0.5,
                overflow: 'hidden',
                '& .MuiAutocomplete-listbox': {
                  scrollBehavior: 'smooth',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    borderRadius: '4px',
                  },
                },
                '& .MuiListSubheader-root': {
                  lineHeight: '30px',
                  backgroundColor: theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.dark, 0.3)
                    : alpha(theme.palette.primary.light, 0.1),
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }
              }}
            />
          </motion.div>
        );
      }}
      renderOption={(props, option, { selected }) => {
        // Create a properly styled MenuItem wrapped with motion effects
        return (
          <MenuItem
            {...props}
            key={option.code}
            sx={{
              py: 1.5,
              px: 2,
              transition: 'all 0.2s',
              borderLeft: selected ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: 'translateX(3px)'
              },
              '&.Mui-selected': {
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.25)
                }
              }
            }}
          >
            <Typography variant="body2" noWrap fontWeight={selected ? 500 : 400}>
              {option.name}
            </Typography>
          </MenuItem>
        );
      }}
      ListboxProps={{
        style: { maxHeight: '350px' },
      }}
    />
  );
}
