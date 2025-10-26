import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    period: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
                                                        title,
                                                        value,
                                                        change,
                                                        changeType,
                                                        period
                                                    }) => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
                {change && (
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        changeType === 'positive'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
            <span className="flex items-center gap-1">
              {changeType === 'positive' ? '↑' : '↓'}
                {change}
            </span>
                    </div>
                )}
            </div>
            <div className="mb-2">
                <span className="text-3xl font-bold text-gray-900">{value}</span>
            </div>
            {period && <div className="text-gray-500 text-sm">{period}</div>}
        </div>
    );
};