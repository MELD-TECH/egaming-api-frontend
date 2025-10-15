import React, { useMemo } from 'react';

export interface PaginationMeta {
    page: number;        // current page (0-based in your API)
    size: number;        // page size
    totalPages: number;
    total: number;       // total items
    previous?: number;   // backend may provide
    next?: number;       // backend may provide
}

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (nextPage: number) => void; // expects 0-based
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          meta,
                                                          onPageChange,
                                                          onPageSizeChange,
                                                          pageSizeOptions = [10, 20, 50],
                                                          disabled = false,
                                                      }) => {
    const { page, size, totalPages, total } = meta;

    const canPrev = page > 0;
    const canNext = page + 1 < totalPages;

    const from = total === 0 ? 0 : page * size + 1;
    const to = Math.min(total, (page + 1) * size);

    // Render up to 5 pages around current (1-based UI, 0-based wire)
    const pages = useMemo(() => {
        const maxButtons = 5;
        const start = Math.max(0, Math.min(page - 2, Math.max(0, totalPages - maxButtons)));
        const end = Math.min(totalPages, start + maxButtons);
        return Array.from({ length: end - start }, (_, i) => start + i);
    }, [page, totalPages]);

    const goTo = (p: number) => !disabled && p >= 0 && p < totalPages && onPageChange(p);

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4">
            <div className="text-sm text-gray-60">Showing {from}-{to} of {total}</div>

            <div className="flex items-center gap-2">
                {onPageSizeChange && (
                    <select
                        aria-label="Rows per page"
                        className="h-9 border border-gray-30 rounded-md text-sm px-2 bg-white"
                        value={size}
                        onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                        disabled={disabled}
                    >
                        {pageSizeOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt} / page</option>
                        ))}
                    </select>
                )}

                <div className="flex items-center gap-1">
                    <button
                        className="px-2 h-9 border border-gray-30 rounded-md disabled:opacity-50"
                        aria-label="First page"
                        onClick={() => goTo(0)}
                        disabled={!canPrev || disabled}
                    >«</button>
                    <button
                        className="px-2 h-9 border border-gray-30 rounded-md disabled:opacity-50"
                        aria-label="Previous page"
                        onClick={() => goTo(page - 1)}
                        disabled={!canPrev || disabled}
                    >‹</button>

                    {pages.map((p) => (
                        <button
                            key={p}
                            className={`px-3 h-9 border rounded-md text-sm ${p === page ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-30'} disabled:opacity-50`}
                            aria-current={p === page ? 'page' : undefined}
                            onClick={() => goTo(p)}
                            disabled={disabled}
                        >
                            {p + 1}
                        </button>
                    ))}

                    <button
                        className="px-2 h-9 border border-gray-30 rounded-md disabled:opacity-50"
                        aria-label="Next page"
                        onClick={() => goTo(page + 1)}
                        disabled={!canNext || disabled}
                    >›</button>
                    <button
                        className="px-2 h-9 border border-gray-30 rounded-md disabled:opacity-50"
                        aria-label="Last page"
                        onClick={() => goTo(totalPages - 1)}
                        disabled={!canNext || disabled}
                    >»</button>
                </div>
            </div>
        </div>
    );
};