import { ReactNode } from 'react';

interface BorderedContainerProps {
  children: ReactNode;
  width?: string;
  height?: string;
}

export function BorderedContainer({ 
  children, 
  width = '1252.29px', 
  height = '88px' 
}: BorderedContainerProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: '8px',
        border: '1px solid #E0E0E0',
        backgroundColor: '#FBFBFB',
        paddingTop: '16px',
        paddingRight: '20px',
        paddingBottom: '16px',
        paddingLeft: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {children}
    </div>
  );
}
