import React from 'react';
import Modal from '@/components/molecules/Modal';
import Badge from '@/components/molecules/Badge';
import Text from '@/components/atoms/Text';

const IssueDetailModal = ({ issue, onClose, getSeverityColor, getStatusColor }) => {
    if (!issue) return null;

    return (
        <Modal
            isOpen={!!issue}
            onClose={onClose}
            title={issue.title}
            contentClassName="max-w-2xl" // Override default max-width for this specific modal
        >
            <Text as="p" className="text-sm text-surface-500 dark:text-surface-400 mt-1 mb-6">
                Issue #{issue.id} • Created {new Date(issue.createdAt).toLocaleDateString()}
            </Text>

            <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(issue.status)}>
                        {issue.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={`border ${getSeverityColor(issue.severity)}`}>
                        {issue.severity} severity
                    </Badge>
                </div>

                <div>
                    <Text as="h3" className="text-sm font-medium text-surface-900 dark:text-white mb-2">Description</Text>
                    <Text as="p" className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed">
                        {issue.description}
                    </Text>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Text as="h3" className="text-sm font-medium text-surface-900 dark:text-white mb-1">Reporter</Text>
                        <Text as="p" className="text-surface-600 dark:text-surface-300 text-sm">
                            {issue.reporter}
                        </Text>
                    </div>
                    <div>
                        <Text as="h3" className="text-sm font-medium text-surface-900 dark:text-white mb-1">Assignee</Text>
                        <Text as="p" className="text-surface-600 dark:text-surface-300 text-sm">
                            {issue.assignee || 'Unassigned'}
                        </Text>
                    </div>
                </div>

                <div>
                    <Text as="h3" className="text-sm font-medium text-surface-900 dark:text-white mb-1">Category</Text>
                    <Text as="p" className="text-surface-600 dark:text-surface-300 text-sm">
                        {issue.category}
                    </Text>
                </div>
            </div>
        </Modal>
    );
};

export default IssueDetailModal;