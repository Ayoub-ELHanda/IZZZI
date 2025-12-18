import React from 'react';
import { Search } from 'lucide-react';

export interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ placeholder = "Rechercher", value, onChange }: SearchInputProps) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '362px',
          height: '45px',
          padding: '12px 40px 12px 16px',
          fontFamily: 'Poppins, sans-serif',
          fontSize: '14px',
          border: '1px solid #E0E0E0',
          borderRadius: '8px',
          outline: 'none',
        }}
      />
      <Search
        size={20}
        color="#6B6B6B"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
}
