import React, { useMemo, useRef, useState } from 'react';
import {
    ApiKeySeries,
    UsageTimeSeries,
    Interval,
    TooltipPoint,
    LegendPlacement,
} from './types';

export interface ApiKeyUsageChartProps {
    data?: UsageTimeSeries;
    // Presentation
    height?: number | string;        // default 320
    stacked?: boolean;               // simple stacked mode per bucket
    smooth?: boolean;                // not used in basic SVG path (placeholder)
    showPoints?: boolean;            // draw circles on points
    colorPalette?: string[];         // fallback colors
    yAxisLabel?: string;
    yAxisScale?: 'linear' | 'log';   // log handled by transform
    grid?: boolean;
    legendPlacement?: LegendPlacement;

    // UX
    enableZoom?: boolean;            // wheel to zoom x-range (simple impl)
    enableBrush?: boolean;           // not implemented in basic version (extensible)
    tooltipFormatter?: (p: TooltipPoint) => React.ReactNode;

    // Callbacks
    onRangeChange?: (start: string, end: string, interval: Interval) => void;
    onSeriesToggle?: (keyId: string, visible: boolean) => void;
    onPointClick?: (args: { keyId: string; ts: string; value: number }) => void;

    // States
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;

    // Export
    onExportCSV?: (csv: string) => void;
    onExportPNG?: (blob: Blob) => void;

    // Accessibility/i18n
    ariaTitle?: string;
    i18n?: {
        totalLabel?: string;
        exportCSV?: string;
        exportPNG?: string;
    };
}

const defaultPalette = ['#166534','#7C3AED','#DC2626','#2563EB','#F59E0B','#0E7490','#78350F'];

function toCSV(data: UsageTimeSeries): string {
    const timestamps = data.series[0]?.points.map(p => p.ts) ?? [];
    const headers = ['timestamp', ...data.series.map(s => s.keyId), 'total'];
    const rows = timestamps.map((ts, i) => {
        const vals = data.series.map(s => (s.points[i]?.value ?? 0));
        const sanitized = vals.map(v => {
            const str = String(v);
            return /^[=+\-@]/.test(str) ? `'${str}` : str;
        });
        const total = vals.reduce((a,b)=>a+b,0);
        return [ts, ...sanitized, String(total)].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
}

export const ApiKeyUsageChart: React.FC<ApiKeyUsageChartProps> = ({
                                                                      data,
                                                                      height = 600,
                                                                      stacked = false,
                                                                      showPoints = false,
                                                                      colorPalette = defaultPalette,
                                                                      yAxisLabel = 'Requests',
                                                                      yAxisScale = 'linear',
                                                                      grid = true,
                                                                      legendPlacement = 'top',
                                                                      tooltipFormatter,
                                                                      loading,
                                                                      error,
                                                                      emptyMessage = 'No data to display',
                                                                      onExportCSV,
                                                                      onExportPNG,
                                                                      onSeriesToggle,
                                                                      ariaTitle = 'API key usage time-series',
                                                                  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hidden, setHidden] = useState<Record<string, boolean>>({});
    const [hover, setHover] = useState<{ x: number; idx: number } | null>(null);

    const paletteByKey = useMemo(() => {
        const map: Record<string,string> = {};
        data?.series.forEach((s, i) => { map[s.keyId] = s.color || colorPalette[i % colorPalette.length]; });
        return map;
    }, [data, colorPalette]);

    const visibleSeries: ApiKeySeries[] = useMemo(() => {
        return (data?.series ?? []).filter(s => !hidden[s.keyId]);
    }, [data, hidden]);

    const computed = useMemo(() => {
        if (!data || visibleSeries.length === 0) return null;
        const labels = visibleSeries[0].points.map(p => p.ts);
        const valuesMatrix = visibleSeries.map(s => s.points.map(p => p.value));

        const maxValLinear = Math.max(1, ...valuesMatrix.flat());
        const maxPerBucketStacked = labels.map((_, i) => valuesMatrix.reduce((acc, row) => acc + (row[i] ?? 0), 0));
        const yMax = stacked ? Math.max(1, ...maxPerBucketStacked) : maxValLinear;

        const width = Math.max(980, (labels.length - 1) * 28 + 120); // adaptive width
        const w = width; const h = typeof height === 'number' ? height : 320;
        const pad = { top: 12, right: 18, bottom: 28, left: 48 };
        const innerW = w - pad.left - pad.right;
        const innerH = h - pad.top - pad.bottom;

        const xStep = innerW / Math.max(1, labels.length - 1);
        const yScale = (v: number) => {
            if (yAxisScale === 'log') {
                const minPos = 1;
                const log = (x: number) => Math.log10(Math.max(minPos, x));
                const maxLog = log(yMax);
                return innerH - (log(v) / (maxLog || 1)) * innerH;
            }
            return innerH - (v / yMax) * innerH;
        };

        const stackAcc = stacked ? labels.map(() => 0) : undefined;

        const paths = visibleSeries.map((s, ) => {
            const ys = s.points.map((p, i) => {
                const base = stacked ? (stackAcc![i] += p.value) : p.value;
                return pad.top + yScale(base);
            });
            const d = s.points.map((_p, i) => `${i === 0 ? 'M' : 'L'}${pad.left + i * xStep},${ys[i]}`).join(' ');
            return { keyId: s.keyId, d, color: paletteByKey[s.keyId] };
        });

        const gridLines = grid ? 4 : 0;

        return { labels, xStep, yMax, w, h, pad, innerW, innerH, paths, gridLines };
    }, [data, visibleSeries, stacked, grid, height, yAxisScale, paletteByKey]);

    const exportPNG = async () => {
        if (!containerRef.current) return;
        const svg = containerRef.current.querySelector('svg');
        if (!svg) return;
        const xml = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([`<?xml version="1.0"?>\n` + xml], { type: 'image/svg+xml;charset=utf-8' });
        // Consumers can convert SVG -> PNG if desired; we expose the SVG blob here
        if (onExportPNG) onExportPNG(blob);
        else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'api-usage-chart.svg'; a.click();
            URL.revokeObjectURL(url);
        }
    };

    if (loading) {
        return (
            <div className="w-full" style={{ height }} aria-busy aria-label={ariaTitle}>
                <div className="animate-pulse h-full bg-gray-100 rounded" />
            </div>
        );
    }
    if (error) {
        return <div className="p-4 text-red-600 border border-red-200 rounded" role="alert">{error}</div>;
    }
    if (!data || (data.series.length === 0) || (data.series.every(s => s.points.length === 0))) {
        return <div className="p-4 text-gray-500">{emptyMessage}</div>;
    }

    return (
        <div ref={containerRef} className="relative w-full overflow-x-auto" aria-label={ariaTitle}>
            {/* Legend */}
            <div className={`flex gap-4 mb-2 ${legendPlacement === 'right' ? 'absolute right-2 top-2' : ''}`}>
                {data.series.map(s => (
                    <button
                        key={s.keyId}
                        onClick={() => {
                            setHidden(h => ({ ...h, [s.keyId]: !h[s.keyId] }));
                            onSeriesToggle?.(s.keyId, hidden[s.keyId]);
                        }}
                        className={`flex items-center gap-2 text-sm ${hidden[s.keyId] ? 'opacity-60' : ''}`}
                    >
                        <span className="inline-block w-4 h-2 rounded-sm" style={{ background: paletteByKey[s.keyId] }} />
                        <span className="font-mono">{s.keyId}</span>
                    </button>
                ))}
                <div className="ml-auto flex gap-2">
                    <button
                        className="text-xs px-2 py-1 border rounded"
                        onClick={() => {
                            if (!data) return;
                            const csv = toCSV(data);
                            if (onExportCSV) onExportCSV(csv);
                            else {
                                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url; a.download = 'api-usage.csv'; a.click();
                                URL.revokeObjectURL(url);
                            }
                        }}
                    >{(typeof ({} as any).i18n?.exportCSV !== 'undefined' ? ({} as any).i18n?.exportCSV : 'Export CSV')}</button>
                    <button className="text-xs px-2 py-1 border rounded" onClick={exportPNG}>
                        PNG
                    </button>
                </div>
            </div>

            {/* Chart */}
            <svg
                width={computed?.w}
                height={height}
                className="block"
                onMouseLeave={() => setHover(null)}
                onMouseMove={(e) => {
                    if (!computed) return;
                    const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect();
                    const rx = e.clientX - rect.left;
                    const x = Math.max(computed.pad.left, Math.min(rx, computed.w - computed.pad.right));
                    const idx = Math.round((x - computed.pad.left) / computed.xStep);
                    setHover({ x, idx });
                }}
            >
                {/* Grid */}
                {computed && [...Array(computed.gridLines + 1)].map((_, i) => (
                    <line
                        key={i}
                        x1={computed.pad.left}
                        x2={computed.w - computed.pad.right}
                        y1={computed.pad.top + (computed.innerH / (computed.gridLines || 1)) * i}
                        y2={computed.pad.top + (computed.innerH / (computed.gridLines || 1)) * i}
                        stroke="#e5e7eb"
                    />
                ))}

                {/* Y axis label */}
                <text x={12} y={14} fontSize={10} fill="#6b7280">{yAxisLabel}</text>

                {/* X labels */}
                {computed && computed.labels.map((lbl, i) => (
                    <text key={i} x={computed.pad.left + i * computed.xStep} y={(typeof height === 'number' ? height : 320) - 6} fontSize={10} fill="#6b7280" textAnchor="middle">
                        {new Date(lbl).toLocaleString()}
                    </text>
                ))}

                {/* Paths */}
                {computed && computed.paths.map(p => (
                    <path key={p.keyId} d={p.d} fill="none" stroke={p.color} strokeWidth={2.5} />
                ))}

                {/* Points */}
                {computed && showPoints && visibleSeries.map((s) => (
                    <g key={s.keyId}>
                        {s.points.map((pt, i) => {
                            const x = computed.pad.left + i * computed.xStep;
                            // find series path Y by recomputing single-point position (not stacked here for simplicity)
                            return (
                                <circle key={i} cx={x} cy={computed.pad.top + ((computed.innerH) - (pt.value / computed.yMax) * computed.innerH)} r={3} fill="#fff" stroke={paletteByKey[s.keyId]} strokeWidth={2} />
                            );
                        })}
                    </g>
                ))}

                {/* Hover vertical rule */}
                {hover && computed && (
                    <line x1={hover.x} x2={hover.x} y1={computed.pad.top} y2={(typeof height === 'number' ? height : 320) - computed.pad.bottom} stroke="#94a3b8" strokeDasharray="3 3" />
                )}
            </svg>

            {/* Tooltip */}
            {hover && computed && (
                <div
                    className="absolute bg-white border border-gray-200 shadow rounded p-2 text-xs"
                    style={{ left: hover.x + 10, top: 24, minWidth: 180 }}
                >
                    <div className="font-semibold mb-1">{new Date(computed.labels[hover.idx]).toLocaleString()}</div>
                    {(data?.series ?? []).filter(s => !hidden[s.keyId]).map(s => {
                        const value = s.points[hover.idx]?.value ?? 0;
                        const content = tooltipFormatter?.({ keyId: s.keyId, ts: computed.labels[hover.idx], value });
                        return (
                            <div key={s.keyId} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-3 h-2 rounded-sm" style={{ background: paletteByKey[s.keyId] }} />
                                    <span className="font-mono">{s.keyId}</span>
                                </div>
                                <div>{content ?? value.toLocaleString()}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};