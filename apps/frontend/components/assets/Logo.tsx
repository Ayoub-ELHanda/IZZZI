import Image from 'next/image';

// Logo component
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Image 
      src="/logo-izzzi.svg"
      alt="izzzi logo"
      width={86}
      height={41}
      style={{
        height: 'auto',
        width: 'auto',
        maxHeight: '41px',
      }}
      className={className || "h-[41px] w-auto"}
    />
  );
}

