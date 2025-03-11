import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { Language } from '../types/language';

interface LanguageSelectorProps {
  label: string;
  value: Language;
  onChange: (language: Language) => void;
}

export default function LanguageSelector({ label, value, onChange, ...props }: LanguageSelectorProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const langCode = event.target.value;
    const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
    if (selectedLang) {
      onChange(selectedLang);
    }
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id={`${label}-language-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-language-label`}
        id={`${label}-language-select`}
        value={value.code}
        label={label}
        onChange={handleChange}
        {...props}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            {language.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
