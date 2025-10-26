export type Interval = '1m' | '5m' | '15m' | '1h' | '6h' | '1d';

export type TooltipPoint = {
    keyId: string;
    ts: string;
    value: number;
};

export type LegendPlacement = 'top' | 'right' | 'bottom';

export interface TimePoint {
    ts: string;      // ISO-8601 UTC recommended
    value: number;   // count per bucket
}

export interface ApiKeySeries {
    keyId: string;   // masked key or identifier
    owner?: string;
    color?: string;
    points: TimePoint[];
}

export interface UsageTimeSeries {
    start: string;     // inclusive ISO
    end: string;       // exclusive ISO
    interval: Interval;
    timezone: string;  // IANA tz
    series: ApiKeySeries[];
}

export interface KeySummaryRow {
    keyId: string;
    owner?: string;
    total: number;
    avgPerInterval?: number;
    peakPerInterval?: number;
}

export interface UsageSummaryTable {
    start: string;
    end: string;
    interval: Interval;
    rows: KeySummaryRow[];
}