import React from 'react';

const Select = ({ value, onChange, children, className, ...rest }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all ${className}`}
            {...rest}
        >
            {children}
        </select>
    );
};

export default Select;