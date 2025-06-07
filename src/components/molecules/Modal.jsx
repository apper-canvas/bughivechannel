import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import Text from '@/components/atoms/Text';

const Modal = ({ isOpen, onClose, children, title, modalClassName, contentClassName, ...rest }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                        {...rest}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalClassName}`}
                        {...rest}
                    >
                        <div className={`bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${contentClassName}`}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    {title && (
                                        <Text as="h2" className="text-xl font-bold text-surface-900 dark:text-white">
                                            {title}
                                        </Text>
                                    )}
                                    <Button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                                    >
                                        <Icon name="X" className="w-5 h-5 text-surface-600 dark:text-surface-300" />
                                    </Button>
                                </div>
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;