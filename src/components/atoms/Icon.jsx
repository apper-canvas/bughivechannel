import React from 'react';
import ApperIcon from '@/components/ApperIcon'; // Path to existing ApperIcon.jsx

const Icon = ({ name, className, ...rest }) => {
    return (
        <ApperIcon name={name} className={className} {...rest} />
    );
};

export default Icon;