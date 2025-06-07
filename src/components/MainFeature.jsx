import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { issueService } from '../services';

const MainFeature = () => {
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
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
          Error Loading Issues
        </h3>
        <p className="text-surface-500 dark:text-surface-400 mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadIssues}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Issues', value: issues.length, icon: 'Bug', color: 'text-blue-600' },
          { label: 'Open Issues', value: issues.filter(i => !['resolved', 'closed'].includes(i.status)).length, icon: 'AlertCircle', color: 'text-red-600' },
          { label: 'In Progress', value: issues.filter(i => i.status === 'in-progress').length, icon: 'Clock', color: 'text-yellow-600' },
          { label: 'Resolved', value: issues.filter(i => i.status === 'resolved').length, icon: 'CheckCircle', color: 'text-green-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card hover:shadow-soft transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
              </div>
              <ApperIcon name={stat.icon} className={`w-8 h-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ApperIcon name="Search" className="w-4 h-4 text-surface-400" />
              </div>
              <input
                type="text"
                placeholder="Search issues..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">New Issue</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white dark:bg-surface-800 rounded-xl shadow-card"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Search" className="w-16 h-16 text-surface-300 dark:text-surface-600 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">No issues found</h3>
          <p className="mt-2 text-surface-500 dark:text-surface-400">
            {filters.search || filters.status !== 'all' || filters.severity !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Get started by creating your first issue'
            }
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Issue
          </motion.button>
        </motion.div>
      ) : (
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
                {filteredIssues.map((issue, index) => (
                  <motion.tr
                    key={issue.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors group cursor-pointer"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-surface-900 dark:text-white group-hover:text-primary transition-colors">
                          {issue.title}
                        </div>
                        <div className="text-sm text-surface-500 dark:text-surface-400 truncate max-w-xs">
                          {issue.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-900 dark:text-white">
                      {issue.assignee || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <select
                          value={issue.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusUpdate(issue.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-2 py-1 border border-surface-300 dark:border-surface-600 rounded bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="new">New</option>
                          <option value="in-progress">In Progress</option>
                          <option value="testing">Testing</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Issue Detail Modal */}
      <AnimatePresence>
        {selectedIssue && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSelectedIssue(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                        {selectedIssue.title}
                      </h2>
                      <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                        Issue #{selectedIssue.id} • Created {new Date(selectedIssue.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedIssue(null)}
                      className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                    </motion.button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedIssue.status)}`}>
                        {selectedIssue.status.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(selectedIssue.severity)}`}>
                        {selectedIssue.severity} severity
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-surface-900 dark:text-white mb-2">Description</h3>
                      <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed">
                        {selectedIssue.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-surface-900 dark:text-white mb-1">Reporter</h3>
                        <p className="text-surface-600 dark:text-surface-300 text-sm">
                          {selectedIssue.reporter}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-surface-900 dark:text-white mb-1">Assignee</h3>
                        <p className="text-surface-600 dark:text-surface-300 text-sm">
                          {selectedIssue.assignee || 'Unassigned'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-surface-900 dark:text-white mb-1">Category</h3>
                      <p className="text-surface-600 dark:text-surface-300 text-sm">
                        {selectedIssue.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Issue Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateIssueModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={loadIssues}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CreateIssueModal = ({ onClose, onSuccess }) => {
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
        priority: formData.severity,
        reporter: 'John Doe'
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-lg w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                Create New Issue
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Brief description of the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Detailed description of the issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                    Severity
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  >
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature Request</option>
                    <option value="Enhancement">Enhancement</option>
                    <option value="Documentation">Documentation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-900 dark:text-white mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                  className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Assign to team member (optional)"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Issue'}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MainFeature;