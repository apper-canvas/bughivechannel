import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';
import IssueTracker from '@/components/organisms/IssueTracker';

const HomePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="mb-8">
                <Text as="h1" className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
                    Issue Tracker
                </Text>
                <Text as="p" className="text-surface-600 dark:text-surface-400">
                    Manage and track bugs efficiently across your development projects
                </Text>
            </div>

            <IssueTracker />
        </motion.div>
    );
};

export default HomePage;