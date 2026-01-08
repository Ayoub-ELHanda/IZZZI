'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue' | 'value' | 'min' | 'max' | 'step'> {
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  defaultValue = [0],
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue[0]);
  
  const currentValue = value?.[0] ?? internalValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInternalValue(newValue);
    onValueChange?.([newValue]);
  };
  
  const percentage = ((currentValue - min) / (max - min)) * 100;
  
  return (
    <div className={cn('relative w-full', className)} style={{ paddingTop: '40px' }}>
      {/* Badge affichant le nombre au-dessus du thumb */}
      <div
        className="absolute transition-all"
        style={{
          left: `${percentage}%`,
          transform: 'translateX(-50%)',
          top: '-8px',
          zIndex: 10
        }}
      >
        <div
          style={{
            backgroundColor: '#F26103',
            color: 'white',
            width: '93px',
            height: '22px',
            borderRadius: '40px',
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {currentValue} {currentValue === 1 ? 'classe' : 'classes'}
        </div>
      </div>
      
      <div className="relative h-2 w-full rounded-full" style={{ backgroundColor: 'white' }}>
        {/* Points fixes aux positions 1, 5, 10, 15, 20 */}
        {[1, 5, 10, 15, 20].map((dotValue) => {
          const dotPercentage = ((dotValue - min) / (max - min)) * 100;
          return (
            <div
              key={dotValue}
              className="absolute top-1/2 rounded-full"
              style={{
                left: `${dotPercentage}%`,
                transform: 'translate(-50%, -50%)',
                width: '6px',
                height: '6px',
                backgroundColor: '#FFF9D8',
                zIndex: 5
              }}
            />
          );
        })}
        
        <div
          className="absolute h-full rounded-full transition-all"
          style={{ width: `${percentage}%`, backgroundColor: '#F26103', zIndex: 2 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full transition-all"
          style={{ 
            left: `${percentage}%`, 
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#F26103',
            border: '3px solid white',
            zIndex: 6
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        {...props}
      />
    </div>
  );
}
