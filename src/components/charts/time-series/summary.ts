import { ApiKeySeries, KeySummaryRow, UsageTimeSeries } from './types';

export function summarizeSeries(series: ApiKeySeries[]): KeySummaryRow[] {
    return series.map(s => {
        const total = s.points.reduce((a, p) => a + p.value, 0);
        const peakPerInterval = s.points.reduce((m, p) => Math.max(m, p.value), 0);
        const avgPerInterval = s.points.length ? total / s.points.length : 0;
        return { keyId: s.keyId, owner: s.owner, total, avgPerInterval, peakPerInterval };
    });
}

export function toCSVFromUsage(data: UsageTimeSeries): string {
    const timestamps = data.series[0]?.points.map(p => p.ts) ?? [];
    const headers = ['timestamp', ...data.series.map(s => s.keyId), 'total'];
    const rows = timestamps.map((ts, i) => {
        const vals = data.series.map(s => (s.points[i]?.value ?? 0));
        const total = vals.reduce((a,b)=>a+b,0);
        return [ts, ...vals, total].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
}