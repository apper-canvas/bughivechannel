import React from 'react';

const Input = ({ value, onChange, type = 'text', placeholder, className, ...rest }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all ${className}`}
            {...rest}
        />
    );
};

export default Input;