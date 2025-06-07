import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const IssueStats = ({ issues }) => {
    const stats = [
        { label: 'Total Issues', value: issues.length, icon: 'Bug', color: 'text-blue-600' },
        { label: 'Open Issues', value: issues.filter(i => !['resolved', 'closed'].includes(i.status)).length, icon: 'AlertCircle', color: 'text-red-600' },
        { label: 'In Progress', value: issues.filter(i => i.status === 'in-progress').length, icon: 'Clock', color: 'text-yellow-600' },
        { label: 'Resolved', value: issues.filter(i => i.status === 'resolved').length, icon: 'CheckCircle', color: 'text-green-600' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    iconName={stat.icon}
                    iconColor={stat.color}
                    index={index}
                />
            ))}
        </div>
    );
};

export default IssueStats;