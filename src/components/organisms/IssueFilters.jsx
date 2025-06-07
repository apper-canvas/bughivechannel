import React from 'react';
import { motion } from 'framer-motion';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';

const IssueFilters = ({ filters, onFiltersChange, onNewIssueClick }) => {
    const handleFilterChange = (filterName, value) => {
        onFiltersChange(prev => ({ ...prev, [filterName]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card"
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <Select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className=""
                    >
                        <option value="all">All Status</option>
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="testing">Testing</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </Select>

                    <Select
                        value={filters.severity}
                        onChange={(e) => handleFilterChange('severity', e.target.value)}
                        className=""
                    >
                        <option value="all">All Severity</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </Select>
                </div>

                <div className="flex space-x-2">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon name="Search" className="w-4 h-4 text-surface-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search issues..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="pl-10 pr-4"
                        />
                    </div>

                    <Button
                        onClick={onNewIssueClick}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icon name="Plus" className="w-4 h-4" />
                        <span className="hidden sm:inline">New Issue</span>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default IssueFilters;