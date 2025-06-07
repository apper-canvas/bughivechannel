import React from 'react';

// Extract Framer Motion props that shouldn't be passed to DOM elements
const MOTION_PROPS = [
    'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
    'initial', 'animate', 'exit', 'transition', 'variants',
    'drag', 'dragConstraints', 'dragElastic', 'dragMomentum',
    'layoutId', 'layout', 'layoutDependency'
];

const Button = ({ 
    onClick, 
    children, 
    className, 
    type = 'button', 
    disabled, 
    ...rest 
}) => {
    // Filter out Framer Motion props to prevent DOM warnings
    const domProps = Object.keys(rest).reduce((acc, key) => {
        if (!MOTION_PROPS.includes(key)) {
            acc[key] = rest[key];
        }
        return acc;
    }, {});

    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            {...domProps}
        >
            {children}
        </button>
    );
};

export default Button;