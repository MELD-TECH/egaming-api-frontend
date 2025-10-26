import React from 'react';

export type GroupBarDatum = {
    label: string;
    count: number;   // first metric
    amount: number;  // second metric
    colorCount?: string;  // optional bar color override for count
    colorAmount?: string; // optional bar color override for amount
};

export type GroupedBarChartProps = {
    data: GroupBarDatum[];
    title?: string;

    // Layout
    height?: number;            // default 280
    padding?: { top: number; right: number; bottom: number; left: number }; // default {20,16,32,40}
    groupGap?: number;          // gap between category groups, default 16
    barGap?: number;            // gap between bars within a group, default 6

    // Colors
    colorCount?: string;        // default '#3b82f6'
    colorAmount?: string;       // default '#10b981'
    gridColor?: string;         // default rgba(107,114,128,0.15)
    axisColor?: string;         // default '#6B7280'

    // Animation
    animationDurationMs?: number;  // default 700
    animationEasing?: (t: number) => number; // easing function, default easeOutCubic

    // Formatting
    formatCount?: (v: number) => string;   // default simple number
    formatAmount?: (v: number) => string;  // default to locale currency-ish
    formatYAxis?: (v: number) => string;   // default compact formatter
    maxY?: number;   // optionally force a max y; otherwise computed from data

    // Accessibility
    desc?: string;   // <desc> for screen readers

    // Interactivity
    showTooltips?: boolean; // primitive tooltips using <title>, default true
    showLegend?: boolean;   // default true
    showGrid?: boolean;     // default true
    className?: string;
    style?: React.CSSProperties;
};

const defaultPadding = { top: 20, right: 16, bottom: 32, left: 40 };

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
                                                                    data,
                                                                    title,
                                                                    height = 280,
                                                                    padding = defaultPadding,
                                                                    groupGap = 16,
                                                                    barGap = 6,
                                                                    colorCount = '#3b82f6',
                                                                    colorAmount = '#10b981',
                                                                    gridColor = 'rgba(107,114,128,0.15)',
                                                                    axisColor = '#6B7280',
                                                                    animationDurationMs = 700,
                                                                    animationEasing = easeOutCubic,
                                                                    formatCount = (v) => new Intl.NumberFormat().format(v),
                                                                    formatAmount = (v) => new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(v),
                                                                    formatYAxis = (v) => new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(v),
                                                                    maxY,
                                                                    desc,
                                                                    showTooltips = true,
                                                                    showLegend = true,
                                                                    showGrid = true,
                                                                    className,
                                                                    style,
                                                                }) => {
    // Guard empty
    const safeData = Array.isArray(data) ? data : [];
    const n = safeData.length;

    // Compute drawing box
    const width = Math.max(400, n * 48 + padding.left + padding.right); // responsive base width
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    // Y-scale domain
    const maxValFromData = Math.max(
        1,
        ...safeData.flatMap(d => [d.count || 0, d.amount || 0])
    );
    const yMax = maxY && maxY > 0 ? maxY : niceMax(maxValFromData);

    // X layout per group: [count|amount]
    const groupWidth = n > 0 ? innerW / n : 0;
    const barTotalWidth = Math.max(0, groupWidth - groupGap);
    const singleBarWidth = Math.max(2, (barTotalWidth - barGap) / 2);

    // Axis ticks (4 horizontal grid lines)
    const yTicks = 4;
    const yValues = Array.from({ length: yTicks + 1 }, (_, i) => (yMax * i) / yTicks);

    // Animation progress 0..1
    const [t, setT] = React.useState(0);
    React.useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const dt = Math.min(1, (now - start) / animationDurationMs);
            setT(animationEasing(dt));
            if (dt < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [data, animationDurationMs, animationEasing]);

    // Scales
    const yToPx = (v: number) => padding.top + innerH - (v / yMax) * innerH;

    // Bars
    const bars = safeData.map((d, i) => {
        const gx = padding.left + i * groupWidth + (groupWidth - barTotalWidth) / 2;
        const countVal = Math.max(0, d.count || 0);
        const amountVal = Math.max(0, d.amount || 0);

        const countH = ((countVal / yMax) * innerH * t) < 0 ? 0 : (countVal / yMax) * innerH * t;
        const amountH = ((amountVal / yMax) * innerH * t) < 0 ? 0 : (amountVal / yMax) * innerH * t;

        const countX = gx;
        const amountX = gx + singleBarWidth + barGap;

        const countY = padding.top + innerH - countH;
        const amountY = padding.top + innerH - amountH;

        const barRadius = Math.min(8, singleBarWidth / 2);

        const fillCount = d.colorCount || colorCount;
        const fillAmount = d.colorAmount || colorAmount;

        const labelX = gx + barTotalWidth / 2;
        const labelY = padding.top + innerH + 16;

        return (
            <g key={d.label + i}>
                {/* count bar */}
                <rect
                    x={countX}
                    y={countY}
                    width={singleBarWidth}
                    height={countH}
                    rx={barRadius}
                    ry={barRadius}
                    fill={fillCount}
                >
                    {showTooltips && (
                        <title>
                            {`${d.label} — Count: ${formatCount(countVal)}`}
                        </title>
                    )}
                </rect>

                {/* amount bar */}
                <rect
                    x={amountX}
                    y={amountY}
                    width={singleBarWidth}
                    height={amountH}
                    rx={barRadius}
                    ry={barRadius}
                    fill={fillAmount}
                >
                    {showTooltips && (
                        <title>
                            {`${d.label} — Amount: ${formatAmount(amountVal)}`}
                        </title>
                    )}
                </rect>

                {/* category label */}
                <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fontSize={12}
                    fill={axisColor}
                >
                    {d.label}
                </text>
            </g>
        );
    });

    return (
        <figure className={className} style={{ margin: 0, ...style }}>
            {title && (
                <figcaption style={{ fontSize: 18, color: '#374151', margin: 10, fontWeight: 800 }}>
                    {title}
                </figcaption>
            )}

            <svg
                role="img"
                aria-label={title || 'Grouped bar chart'}
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                height={height}
                style={{ display: 'block' }}
            >
                {desc && <desc>{desc}</desc>}

                {/* Grid and axes */}
                {showGrid && (
                    <g>
                        {yValues.map((yv, i) => {
                            const y = yToPx(yv);
                            return (
                                <line
                                    key={`grid-${i}`}
                                    x1={padding.left}
                                    x2={width - padding.right}
                                    y1={y}
                                    y2={y}
                                    stroke={gridColor}
                                    strokeWidth={1}
                                />
                            );
                        })}
                    </g>
                )}

                {/* Y axis labels */}
                <g>
                    {yValues.map((yv, i) => (
                        <text
                            key={`ytick-${i}`}
                            x={padding.left - 8}
                            y={yToPx(yv)}
                            textAnchor="end"
                            alignmentBaseline="middle"
                            fontSize={11}
                            fill={axisColor}
                        >
                            {formatYAxis(yv)}
                        </text>
                    ))}
                </g>

                {/* Bars + category labels */}
                {bars}

                {/* X axis baseline */}
                <line
                    x1={padding.left}
                    x2={width - padding.right}
                    y1={padding.top + innerH}
                    y2={padding.top + innerH}
                    stroke={gridColor}
                    strokeWidth={1}
                />
            </svg>

            {showLegend && (
                <div style={{ display: 'flex', gap: 16, marginTop: 8, color: '#374151', fontSize: 12 }}>
                    <LegendSwatch color={colorCount} label="Count" />
                    <LegendSwatch color={colorAmount} label="Amount" />
                </div>
            )}
        </figure>
    );
};

const LegendSwatch: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    <span
        aria-hidden
        style={{ width: 10, height: 10, background: color, borderRadius: 2, display: 'inline-block' }}
    />
        {label}
  </span>
);

// Utility: round up to a pleasant y-axis max
function niceMax(x: number) {
    if (x <= 10) return 10;
    const mag = Math.pow(10, Math.floor(Math.log10(x)));
    const norm = x / mag; // [1..10)
    let niceNorm: number;
    if (norm <= 1) niceNorm = 1;
    else if (norm <= 2) niceNorm = 2;
    else if (norm <= 5) niceNorm = 5;
    else niceNorm = 10;
    return niceNorm * mag;
}