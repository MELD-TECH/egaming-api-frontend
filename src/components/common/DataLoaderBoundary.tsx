import React from 'react';
import { Spinner } from './Spinner';

interface DataLoaderBoundaryProps {
    loading: boolean;
    error: Error | null;
    isEmpty: boolean;
    emptyTitle?: string;
    emptySubtitle?: string;
    onRetry?: () => void;
    children: React.ReactNode;
}

export const DataLoaderBoundary: React.FC<DataLoaderBoundaryProps> = ({
                                                                          loading,
                                                                          error,
                                                                          isEmpty,
                                                                          emptyTitle = 'No data',
                                                                          emptySubtitle = 'There is nothing to display yet.',
                                                                          onRetry,
                                                                          children,
                                                                      }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-10">
                <Spinner label="Loading..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-700 font-semibold mb-2">Failed to load data</div>
                <div className="text-red-600 text-sm mb-4">{error.message}</div>
                {onRetry && (
                    <button onClick={onRetry} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Retry
                    </button>
                )}
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="p-10 text-center text-gray-60">
                <div className="text-lg font-semibold text-gray-80 mb-1">{emptyTitle}</div>
                <div className="text-sm">{emptySubtitle}</div>
            </div>
        );
    }

    return <>{children}</>;
};