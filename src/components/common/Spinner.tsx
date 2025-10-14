import React from 'react';

export const Spinner: React.FC<{ size?: number; className?: string; label?: string }> = ({ size = 20, className = '', label }) => (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-live="polite" aria-busy="true">
        <svg
            width={size}
            height={size}
            viewBox="0 0 50 50"
            className="animate-spin text-primary-500"
        >
            <circle className="opacity-25" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M25 5a20 20 0 0 1 20 20h-5A15 15 0 0 0 25 10V5z" />
        </svg>
        {label && <span className="text-gray-70 text-sm">{label}</span>}
    </div>
);