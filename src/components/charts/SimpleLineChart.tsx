import React from "react";

export type LineSeries = {
    name: string;
    color: string;
    data: number[]; // must match labels length
};

type Props = {
    labels: string[];
    series: LineSeries[];
    height?: number; // px
    showDots?: boolean;
    yFormatter?: (v: number) => string;
    width?: number;
};

export const SimpleLineChart: React.FC<Props> = ({
                                                     labels,
                                                     series,
                                                     height = 220,
                                                     showDots = true,
                                                     yFormatter = (v) => v.toLocaleString(),
                                                     width = 640,
                                                 }) => {
    const w = width; // fixed for simplicity; wrapper will scroll as needed
    const h = height;
    const padding = { top: 10, right: 16, bottom: 26, left: 42 };
    const innerW = w - padding.left - padding.right;
    const innerH = h - padding.top - padding.bottom;

    const max = Math.max(
        1,
        ...series.flatMap(s => s.data)
    );

    const xStep = innerW / Math.max(1, labels.length - 1);
    const yScale = (v: number) => innerH - (v / max) * innerH;

    const pathFor = (data: number[]) =>
        data
            .map((v, i) => `${i === 0 ? "M" : "L"}${padding.left + i * xStep},${padding.top + yScale(v)}`)
            .join(" ");

    const gridY = 4; // simple grid lines

    return (
        <div className="relative w-full overflow-x-auto">
            <svg width={w} height={h} className="block">
                {/* Y grid */}
                {[...Array(gridY + 1)].map((_, i) => {
                    const y = padding.top + (innerH / gridY) * i;
                    return <line key={i} x1={padding.left} y1={y} x2={w - padding.right} y2={y} stroke="#e5e7eb" />;
                })}
                {/* Y axis labels */}
                {[...Array(gridY + 1)].map((_, i) => {
                    const v = max - (max / gridY) * i;
                    const y = padding.top + (innerH / gridY) * i + 4;
                    return (
                        <text key={i} x={8} y={y} fontSize={10} fill="#6b7280">
                            {yFormatter(Math.max(0, v))}
                        </text>
                    );
                })}
                {/* X labels */}
                {labels.map((lbl, i) => (
                    <text key={i} x={padding.left + i * xStep} y={h - 6} fontSize={10} fill="#6b7280" textAnchor="middle">
                        {lbl}
                    </text>
                ))}
                {/* Lines */}
                {series.map((s, idx) => (
                    <g key={idx}>
                        <path d={pathFor(s.data)} fill="none" stroke={s.color} strokeWidth={2.5} />
                        {showDots && s.data.map((v, i) => (
                            <circle
                                key={i}
                                cx={padding.left + i * xStep}
                                cy={padding.top + yScale(v)}
                                r={3}
                                fill="#fff"
                                stroke={s.color}
                                strokeWidth={2}
                            />
                        ))}
                    </g>
                ))}
            </svg>
            {/* Legend */}
            <div className="flex gap-4 mt-2">
                {series.map(s => (
                    <div key={s.name} className="flex items-center gap-2 text-sm text-gray-70">
                        <span className="inline-block w-4 h-2 rounded-sm" style={{ background: s.color }} />
                        {s.name}
                    </div>
                ))}
            </div>
        </div>
    );
};