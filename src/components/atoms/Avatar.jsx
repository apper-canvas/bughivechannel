import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  status, 
  className = '',
  onClick,
  ...props 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-surface-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarContent = src ? (
    <img
      src={src}
      alt={alt || name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <Text 
        as="span" 
        className="font-medium text-white"
        style={{ fontSize: 'inherit' }}
      >
        {getInitials(name)}
      </Text>
    </div>
  );

  return (
    <motion.div
      className={`
        relative inline-flex items-center justify-center
        rounded-full overflow-hidden border-2 border-white dark:border-surface-700
        shadow-sm
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      {...props}
    >
      {avatarContent}
      
      {status && (
        <div 
          className={`
            absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-surface-800
            ${statusClasses[status]}
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </motion.div>
  );
};

export default Avatar;