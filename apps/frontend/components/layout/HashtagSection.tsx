import { cn } from "@/lib/utils/cn";
import React from "react";

const HashTag = ({ 
  text, 
  className, 
  style 
}: { 
  text: string; 
  className?: string; 
  style?: string;
}) => (
  <div 
    className={`inline-flex px-10 py-[15px] justify-center items-center gap-2.5 rounded-full ${style} ${className}`}
  >
    <p className="font-title text-sm leading-[18px] text-content text-center">
      {text}
    </p>
  </div>
);

const HashtagSection = ({ backgroundClassName = "bg-white" }: { backgroundClassName?: string }) => {
  return (
    <div className={cn("w-full py-4 border-0", backgroundClassName)} style={{ borderTop: 'none', borderBottom: 'none', backgroundColor: '#FFFFFF' }}>
      <div className="w-full flex flex-wrap justify-center items-center gap-4 px-4">
        <HashTag 
          text="#Love" 
          style="bg-secondary-dark"
          className="animate-hashtag-float-a [animation-delay:0ms]"
        />
        <HashTag 
          text="IA + education = <3" 
          style="bg-background-muted border border-input-normal"
          className="animate-hashtag-float-b [animation-delay:200ms]"
        />
        <HashTag 
          text="#QualiopiFriendly" 
          style="bg-primary-light"
          className="animate-hashtag-float-c [animation-delay:400ms]"
        />
        <HashTag
          text="#Simple"
          style="bg-secondary-dark"
          className="animate-hashtag-float-d [animation-delay:600ms]"
        />
        <HashTag 
          text="#LiveReview" 
          style="bg-primary-light"
          className="animate-hashtag-float-c [animation-delay:1000ms]"
        />
        <HashTag 
          text="#Sincère" 
          style="bg-secondary-dark"
          className="animate-hashtag-float-b [animation-delay:1200ms]"
        />
        <HashTag 
          text="#DoubleSatisfaction" 
          style="bg-white border border-input-normal"
          className="animate-hashtag-float-a [animation-delay:800ms]"
        />
      </div>
    </div>
  );
};

export default HashtagSection;

