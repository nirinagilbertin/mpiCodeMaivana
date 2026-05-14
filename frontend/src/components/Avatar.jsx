import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={`rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <User className="text-gray-500" size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />
      )}
    </div>
  );
};

export default Avatar;