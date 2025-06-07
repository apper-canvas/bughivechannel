import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { issueService } from '@/services'; // Adjust path as needed

import IssueStats from '@/components/organisms/IssueStats';
import IssueFilters from '@/components/organisms/IssueFilters';
import IssueTable from '@/components/organisms/IssueTable';
import IssueDetailModal from '@/components/organisms/IssueDetailModal';
import CreateIssueForm from '@/components/organisms/CreateIssueForm';
import Modal from '@/components/molecules/Modal';
import Icon from '@/components/atoms/Icon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const IssueTracker = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        severity: 'all',
        search: ''
    });

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await issueService.getAll();
            setIssues(result);
        } catch (err) {
            setError(err.message || 'Failed to load issues');
            toast.error('Failed to load issues');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (issueId, newStatus) => {
        try {
            const updatedIssue = await issueService.update(issueId, { status: newStatus });
            setIssues(prev => prev.map(issue =>
                issue.id === issueId ? updatedIssue : issue
            ));
            toast.success(`Issue status updated to ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update issue status');
        }
    };

    const getSeverityColor = (severity) => {
        const colors = {
            critical: 'bg-red-100 text-red-800 border-red-200',
            high: 'bg-orange-100 text-orange-800 border-orange-200',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            low: 'bg-green-100 text-green-800 border-green-200'
        };
        return colors[severity] || colors.medium;
    };

    const getStatusColor = (status) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            'in-progress': 'bg-purple-100 text-purple-800',
            testing: 'bg-yellow-100 text-yellow-800',
            resolved: 'bg-green-100 text-green-800',
            closed: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || colors.new;
    };

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = filters.status === 'all' || issue.status === filters.status;
        const matchesSeverity = filters.severity === 'all' || issue.severity === filters.severity;
        const matchesSearch = issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            issue.description.toLowerCase().includes(filters.search.toLowerCase());
        return matchesStatus && matchesSeverity && matchesSearch;
    });

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card"
                        >
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-3/4"></div>
                                <div className="h-8 bg-surface-200 dark:bg-surface-600 rounded w-1/2"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
                    <div className="p-6 space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="animate-pulse"
                            >
                                <div className="flex items-center space-x-4 p-4 border border-surface-200 dark:border-surface-600 rounded-lg">
                                    <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-1/4"></div>
                                    <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-1/3"></div>
                                    <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-1/4"></div>
                                    <div className="h-4 bg-surface-200 dark:bg-surface-600 rounded w-1/6"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl shadow-card"
            >
                <Icon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <Text as="h3" className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                    Error Loading Issues
                </Text>
                <Text as="p" className="text-surface-500 dark:text-surface-400 mb-4">{error}</Text>
                <Button
                    onClick={loadIssues}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Try Again
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            <IssueStats issues={issues} />

            <IssueFilters
                filters={filters}
                onFiltersChange={setFilters}
                onNewIssueClick={() => setShowCreateModal(true)}
            />

            <IssueTable
                issues={filteredIssues}
                onIssueSelect={setSelectedIssue}
                onIssueStatusUpdate={handleStatusUpdate}
                filters={filters} // Pass filters for "No issues found" message logic
                getSeverityColor={getSeverityColor}
                getStatusColor={getStatusColor}
                onNewIssueClick={() => setShowCreateModal(true)} // For "Create Issue" button in empty state
            />

            <IssueDetailModal
                issue={selectedIssue}
                onClose={() => setSelectedIssue(null)}
                getSeverityColor={getSeverityColor}
                getStatusColor={getStatusColor}
            />

            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Issue"
            >
                <CreateIssueForm
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={loadIssues}
                />
            </Modal>
        </div>
    );
};

export default IssueTracker;