import React from 'react';

const Avatar = ({ 
  src, 
  alt, 
  size = 'medium', 
  fallback, 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-xl'
  };

  const baseClasses = 'rounded-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-500 text-white font-semibold';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} ${baseClasses} object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${baseClasses} ${className}`}>
      {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
};

export default Avatar;