import React from 'react';
import Text from '@/components/atoms/Text'; // Use Text atom for label

const FormField = ({ label, htmlFor, children, className, required = false, ...rest }) => {
    return (
        <div className={className} {...rest}>
            <Text as="label" htmlFor={htmlFor} className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </Text>
            {children}
        </div>
    );
};

export default FormField;