import Link from 'next/link';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

export interface TrialBannerProps {
  message1: string;
  message2: string;
  linkText: string;
  linkHref: string;
  position?: 'left' | 'right';
}

export function TrialBanner({ message1, message2, linkText, linkHref, position = 'right' }: TrialBannerProps) {
  return (
    <div
      className="w-full md:w-auto md:max-w-[680px] min-h-[58px] p-4 mb-2 flex flex-col md:flex-row md:items-center gap-3 md:gap-14"
      style={{
        backgroundColor: '#FFF4E0',
        border: '1px solid #FFE552',
        borderRadius: '8px',
        marginLeft: position === 'right' ? 'auto' : '0',
        marginRight: position === 'left' ? 'auto' : '0',
      }}
    >
      <div className="flex items-center gap-3 flex-shrink-0">
        <AlertCircle size={20} color="#FF9500" className="flex-shrink-0" />
        <div className="flex flex-col">
          <p className="text-xs md:text-xs font-poppins font-semibold text-[#FF9500]">
            {message1}
          </p>
          <p className="text-xs md:text-xs font-poppins font-semibold text-[#FF9500]">
            {message2}
          </p>
        </div>
      </div>
      
      <Link href={linkHref} prefetch={true} className="text-decoration-none flex-shrink-0">
        <span
          className="text-sm md:text-sm font-poppins text-[#FF9500] underline cursor-pointer inline-flex items-center gap-1"
        >
          {linkText.replace('→', '').trim()}
          <ArrowUpRight size={16} color="#FF9500" />
        </span>
      </Link>
    </div>
  );
}
