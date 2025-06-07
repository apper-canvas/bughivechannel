import React from 'react';

const Badge = ({ children, className, ...rest }) => {
    return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${className}`} {...rest}>
            {children}
        </span>
    );
};

export default Badge;