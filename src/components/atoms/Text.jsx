import React from 'react';

const Text = ({ children, className, as: Component = 'p', ...rest }) => {
    return (
        <Component className={className} {...rest}>
            {children}
        </Component>
    );
};

export default Text;