import React from 'react';

const TextArea = ({ value, onChange, rows = 3, placeholder, className, ...rest }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all ${className}`}
            {...rest}
        />
    );
};

export default TextArea;