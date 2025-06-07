import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { issueService } from '@/services'; // Adjust path as needed
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const CreateIssueForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: 'medium',
        category: 'Bug',
        assignee: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        setSubmitting(true);
        try {
            await issueService.create({
                ...formData,
                status: 'new',
                priority: formData.severity, // Original code uses severity for priority
                reporter: 'John Doe' // Hardcoded as per original
            });
            toast.success('Issue created successfully');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error('Failed to create issue');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Title" htmlFor="title" required>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Brief description of the issue"
                />
            </FormField>

            <FormField label="Description" htmlFor="description">
                <TextArea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Detailed description of the issue"
                />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Severity" htmlFor="severity">
                    <Select
                        id="severity"
                        name="severity"
                        value={formData.severity}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </Select>
                </FormField>

                <FormField label="Category" htmlFor="category">
                    <Select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="Bug">Bug</option>
                        <option value="Feature">Feature Request</option>
                        <option value="Enhancement">Enhancement</option>
                        <option value="Documentation">Documentation</option>
                    </Select>
                </FormField>
            </div>

            <FormField label="Assignee" htmlFor="assignee">
                <Input
                    id="assignee"
                    name="assignee"
                    type="text"
                    value={formData.assignee}
                    onChange={handleChange}
                    placeholder="Assign to team member (optional)"
                />
            </FormField>

            <div className="flex space-x-3 pt-4">
                <Button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {submitting ? 'Creating...' : 'Create Issue'}
                </Button>
            </div>
        </form>
    );
};

export default CreateIssueForm;