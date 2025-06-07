import React from 'react';

const Button = ({ onClick, children, className, type = 'button', disabled, ...rest }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;