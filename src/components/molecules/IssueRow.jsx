import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';
import Badge from '@/components/molecules/Badge';
import Select from '@/components/atoms/Select';

const IssueRow = ({ issue, index, onSelect, onStatusChange, getSeverityColor, getStatusColor }) => {
    return (
        <motion.tr
            key={issue.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors group cursor-pointer"
            onClick={() => onSelect(issue)}
        >
            <td className="px-6 py-4">
                <div>
                    <Text as="div" className="text-sm font-medium text-surface-900 dark:text-white group-hover:text-primary transition-colors">
                        {issue.title}
                    </Text>
                    <Text as="div" className="text-sm text-surface-500 dark:text-surface-400 truncate max-w-xs">
                        {issue.description}
                    </Text>
                </div>
            </td>
            <td className="px-6 py-4">
                <Badge className={getStatusColor(issue.status)}>
                    {issue.status.replace('-', ' ')}
                </Badge>
            </td>
            <td className="px-6 py-4">
                <Badge className={`border ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                </Badge>
            </td>
            <td className="px-6 py-4">
                <Text as="div" className="text-sm text-surface-900 dark:text-white">
                    {issue.assignee || 'Unassigned'}
                </Text>
            </td>
            <td className="px-6 py-4">
                <div className="flex space-x-2">
                    <Select
                        value={issue.status}
                        onChange={(e) => {
                            e.stopPropagation();
                            onStatusChange(issue.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs w-full"
                    >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="testing">Testing</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </Select>
                </div>
            </td>
        </motion.tr>
    );
};

export default IssueRow;