import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/atoms/Icon';
import Text from '@/components/atoms/Text';

const StatCard = ({ label, value, iconName, iconColor, index, className, ...rest }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-300 ${className}`}
            {...rest}
        >
            <div className="flex items-center justify-between">
                <div>
                    <Text as="p" className="text-sm font-medium text-surface-500 dark:text-surface-400">{label}</Text>
                    <Text as="p" className="text-2xl font-bold text-surface-900 dark:text-white">{value}</Text>
                </div>
                <Icon name={iconName} className={`w-8 h-8 ${iconColor}`} />
            </div>
        </motion.div>
    );
};

export default StatCard;