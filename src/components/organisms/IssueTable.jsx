import React from 'react';
import { motion } from 'framer-motion';
import IssueRow from '@/components/molecules/IssueRow';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import Text from '@/components/atoms/Text';

const IssueTable = ({ issues, onIssueSelect, onIssueStatusUpdate, filters, getSeverityColor, getStatusColor, onNewIssueClick }) => {
    if (issues.length === 0) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl shadow-card"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    <Icon name="Search" className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto" />
                </motion.div>
                <Text as="h3" className="mt-4 text-lg font-medium text-surface-900 dark:text-white">No issues found</Text>
                <Text as="p" className="mt-2 text-surface-500 dark:text-surface-400">
                    {filters.search || filters.status !== 'all' || filters.severity !== 'all'
                        ? 'Try adjusting your filters or search terms'
                        : 'Get started by creating your first issue'
                    }
                </Text>
                <Button
                    onClick={onNewIssueClick}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Create Issue
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-surface-50 dark:bg-surface-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Issue</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Severity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Assignee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-200 dark:divide-surface-600">
                        {issues.map((issue, index) => (
                            <IssueRow
                                key={issue.id}
                                issue={issue}
                                index={index}
                                onSelect={onIssueSelect}
                                onStatusChange={onIssueStatusUpdate}
                                getSeverityColor={getSeverityColor}
                                getStatusColor={getStatusColor}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default IssueTable;