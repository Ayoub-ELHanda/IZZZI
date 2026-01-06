import React from 'react';
import { Search } from 'lucide-react';

export interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ placeholder = "Rechercher", value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full md:w-[362px]">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-[45px] px-4 pr-10 text-sm md:text-sm"
        style={{
          fontFamily: 'Poppins, sans-serif',
          border: '1px solid #E5E5E5',
          borderRadius: '8px',
          outline: 'none',
          color: '#2F2E2C',
          backgroundColor: '#FFF',
          boxShadow: 'none',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#2F2E2C';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E5E5E5';
        }}
      />
      <Search
        size={18}
        color="#6B6B6B"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
