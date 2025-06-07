import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { issueService } from '../services';

const CreateIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    category: 'Bug',
    assignee: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      
      // Reset form after success animation
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          severity: 'medium',
          category: 'Bug',
          assignee: ''
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to create issue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">
          Create New Issue
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Report a bug or request a new feature for your project
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden"
      >
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-surface-900 dark:text-white">
                Issue Title *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white transition-all duration-200 ${
                    formData.title.trim() 
                      ? 'border-green-300 dark:border-green-600 focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                      : 'border-surface-300 dark:border-surface-600 focus:ring-2 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="Brief description of the issue"
                />
                {formData.title.trim() && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-surface-900 dark:text-white">
                Description
              </label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white transition-all duration-200 resize-none ${
                    formData.description.trim() 
                      ? 'border-green-300 dark:border-green-600' 
                      : 'border-surface-300 dark:border-surface-600'
                  } focus:ring-2 focus:ring-primary focus:border-primary`}
                  placeholder="Provide detailed information about the issue, including steps to reproduce, expected behavior, and actual behavior"
                />
                <div className="absolute bottom-3 right-3 text-xs text-surface-400">
                  {formData.description.length} characters
                </div>
              </div>
            </div>

            {/* Severity and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-surface-900 dark:text-white">
                  Severity Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'low', label: 'Low', color: 'green', icon: 'ArrowDown' },
                    { value: 'medium', label: 'Medium', color: 'yellow', icon: 'Minus' },
                    { value: 'high', label: 'High', color: 'orange', icon: 'ArrowUp' },
                    { value: 'critical', label: 'Critical', color: 'red', icon: 'AlertTriangle' }
                  ].map((severity) => (
                    <motion.button
                      key={severity.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInputChange('severity', severity.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.severity === severity.value
                          ? `border-${severity.color}-400 bg-${severity.color}-50 dark:bg-${severity.color}-900/20`
                          : 'border-surface-200 dark:border-surface-600 hover:border-surface-300 dark:hover:border-surface-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <ApperIcon 
                          name={severity.icon} 
                          className={`w-4 h-4 ${
                            formData.severity === severity.value 
                              ? `text-${severity.color}-600` 
                              : 'text-surface-400'
                          }`}
                        />
                        <span className={`text-sm font-medium ${
                          formData.severity === severity.value 
                            ? `text-${severity.color}-700 dark:text-${severity.color}-300` 
                            : 'text-surface-600 dark:text-surface-300'
                        }`}>
                          {severity.label}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-surface-900 dark:text-white">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="Bug">🐛 Bug</option>
                  <option value="Feature">✨ Feature Request</option>
                  <option value="Enhancement">🚀 Enhancement</option>
                  <option value="Documentation">📚 Documentation</option>
                  <option value="Performance">⚡ Performance</option>
                  <option value="Security">🔒 Security</option>
                </select>
              </div>
            </div>

            {/* Assignee Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-surface-900 dark:text-white">
                Assign to Team Member
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ApperIcon name="User" className="w-5 h-5 text-surface-400" />
                </div>
                <input
                  type="text"
                  value={formData.assignee}
                  onChange={(e) => handleInputChange('assignee', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter team member name (optional)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                disabled={submitting || !formData.title.trim()}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  success
                    ? 'bg-green-500 text-white'
                    : submitting || !formData.title.trim()
                    ? 'bg-surface-300 dark:bg-surface-600 text-surface-500 dark:text-surface-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {success ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ApperIcon name="CheckCircle" className="w-5 h-5" />
                      </motion.div>
                      <span>Issue Created Successfully!</span>
                    </>
                  ) : submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <ApperIcon name="Loader2" className="w-5 h-5" />
                      </motion.div>
                      <span>Creating Issue...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" className="w-5 h-5" />
                      <span>Create Issue</span>
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <ApperIcon name="Lightbulb" className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Tips for Writing Effective Bug Reports
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Be specific about what you expected vs. what actually happened</li>
              <li>• Include steps to reproduce the issue</li>
              <li>• Mention your browser/device if it's a UI issue</li>
              <li>• Add screenshots or error messages when possible</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateIssue;