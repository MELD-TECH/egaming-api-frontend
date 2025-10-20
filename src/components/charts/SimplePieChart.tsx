import React, { useMemo, useState } from "react";

type Slice = { label: string; value: number; color: string };

type Props = {
    data: Slice[];
    size?: number;
    showLegend?: boolean;
    hoverScale?: number; // how much to scale the hovered slice's value
    innerRadius?: number; // to make a donut
    showPercentInCenter?: boolean; // show hovered percent in center
};

export const SimplePieChart: React.FC<Props> = ({
                                                    data,
                                                    size = 240,
                                                    showLegend = true,
                                                    hoverScale = 1.25,
                                                    innerRadius = 0, // 0 -> full pie; >0 -> donut
                                                    showPercentInCenter = true,
                                                }) => {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    // Compute adjusted values so the hovered slice grows and others shrink proportionally
    const adjusted = useMemo(() => {
        if (hoverIndex == null) return data.map(d => d.value);
        return data.map((d, i) => (i === hoverIndex ? d.value * hoverScale: d.value));
    }, [data, hoverIndex, hoverScale]);

    const total = Math.max(1, adjusted.reduce((s, v) => s + v, 0));
    const radius = size / 2;
    const cx = radius;
    const cy = radius;

    // Build paths from adjusted values
    let acc = 0;
    const slices = data.map((d, i) => {
        const start = (acc / total) * Math.PI * 2;
        acc += adjusted[i];
        const end = (acc / total) * Math.PI * 2;

        const largeArc = end - start > Math.PI ? 1 : 0;

        const x1 = cx + radius * Math.cos(start);
        const y1 = cy + radius * Math.sin(start);
        const x2 = cx + radius * Math.cos(end);
        const y2 = cy + radius * Math.sin(end);

        // Outer arc path (sector)
        const outerPath = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        // Donut support: subtract inner circle for a ring shape
        let path = outerPath;
        if (innerRadius > 0) {
            const ix1 = cx + innerRadius * Math.cos(end);
            const iy1 = cy + innerRadius * Math.sin(end);
            const ix2 = cx + innerRadius * Math.cos(start);
            const iy2 = cy + innerRadius * Math.sin(start);
            const innerLargeArc = largeArc; // same threshold
            path = `M ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
              L ${ix1} ${iy1}
              A ${innerRadius} ${innerRadius} 0 ${innerLargeArc} 0 ${ix2} ${iy2}
              Z`;
        }

        const percent = (adjusted[i] / total) * 100;

        return { ...d, path, start, end, percent };
    });

    const centerText = useMemo(() => {
        if (hoverIndex == null) return null;
        const p = slices[hoverIndex]?.percent ?? 0;
        return `${p.toFixed(1)}%`;
    }, [hoverIndex, slices]);

    return (
        <div className="flex items-center gap-6 flex-wrap">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Optional donut hole background if innerRadius > 0 */}
                {innerRadius > 0 && (
                    <circle cx={cx} cy={cy} r={innerRadius} fill="#fff" />
                )}
                {slices.map((s, i) => (
                    <path
                        key={s.label}
                        d={s.path}
                        fill={s.color}
                        style={{ transition: "d 180ms ease, opacity 120ms ease" }}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                    />
                ))}

                {/* Center label showing hovered percent */}
                {innerRadius > 0 && showPercentInCenter && hoverIndex != null && (
                    <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.max(12, innerRadius * 0.45)}
                        fontWeight={700}
                        fill="#111827"
                    >
                        {centerText}
                    </text>
                )}
            </svg>

            {showLegend && (
                <div className="grid grid-cols-1 gap-2">
                    {slices.map((s, i) => (
                        <div
                            key={s.label}
                            className="flex items-center gap-2 text-sm text-gray-70 cursor-default"
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                            style={{ opacity: hoverIndex == null || hoverIndex === i ? 1 : 0.6 }}
                        >
              <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: s.color }}
              />
                            <span className="font-medium text-gray-80">{s.label}</span>
                            <span className="text-gray-50">{s.percent.toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// import React from "react";
//
// type Slice = { label: string; value: number; color: string };
//
// type Props = { data: Slice[]; size?: number; showLegend?: boolean };
//
// export const SimplePieChart: React.FC<Props> = ({ data, size = 240, showLegend = true }) => {
//     const total = Math.max(1, data.reduce((s, d) => s + d.value, 0));
//     const radius = size / 2;
//     const cx = radius;
//     const cy = radius;
//
//     let acc = 0;
//     const slices = data.map((d,) => {
//         const start = (acc / total) * Math.PI * 2;
//         acc += d.value;
//         const end = (acc / total) * Math.PI * 2;
//
//         const largeArc = end - start > Math.PI ? 1 : 0;
//
//         const x1 = cx + radius * Math.cos(start);
//         const y1 = cy + radius * Math.sin(start);
//         const x2 = cx + radius * Math.cos(end);
//         const y2 = cy + radius * Math.sin(end);
//
//         const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
//
//         return { ...d, path };
//     });
//
//     return (
//         <div className="flex items-center gap-6 flex-wrap">
//             <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//                 {slices.map((s, i) => (
//                     <path key={i} d={s.path} fill={s.color} />
//                 ))}
//             </svg>
//             {showLegend && (
//                 <div className="grid grid-cols-1 gap-2">
//                     {data.map((d) => (
//                         <div key={d.label} className="flex items-center gap-2 text-sm text-gray-70">
//                             <span className="inline-block w-3 h-3 rounded-full" style={{ background: d.color }} />
//                             {d.label}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };