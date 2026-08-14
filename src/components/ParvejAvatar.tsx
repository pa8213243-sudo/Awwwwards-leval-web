import React from 'react';
import parvejProfileImg from './parvej_profile.png';

interface ParvejAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlinePing?: boolean;
  altText?: string;
}

export const ParvejAvatar: React.FC<ParvejAvatarProps> = ({
  size = 'md',
  className = '',
  showOnlinePing = false,
  altText = 'Parvej Alam — CMA USA Part 1 Cleared',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-emerald-400/80 bg-[#121217] shadow-md transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:shadow-emerald-500/20`}
      >
        <img
          src={parvejProfileImg || '/parvej_profile.png'}
          alt={altText}
          className="w-full h-full object-cover object-center"
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/parvej_profile.png') {
              target.src = '/parvej_profile.png';
            }
          }}
        />
      </div>

      {showOnlinePing && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0A0A0E]"></span>
        </span>
      )}
    </div>
  );
};

