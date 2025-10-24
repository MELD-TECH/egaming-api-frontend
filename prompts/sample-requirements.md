### Goal
Design a production-grade, reusable time-series chart component and requirements for visualizing API key usage over time, plus a summary view across keys. Replace ad-hoc code with a component that is framework-friendly, testable, accessible, and configurable.

### Audience
- Frontend engineers integrating the component in admin dashboards
- Backend engineers exposing usage endpoints
- QA writing tests against deterministic behavior

### Definitions
- "API key usage": Count of requests made with an API key within time buckets
- "Time series": A sequence of data points keyed by timestamp
- "Interval": The aggregation bucket (e.g., 1m, 5m, 1h, 1d)

### High-Level Features
- Interactive time-series line chart
- Supports multiple API keys simultaneously (multi-series, toggleable, stacked or overlapped)
- Time range, interval, and timezone selection
- Tooltips, legends, zoom/pan, brushing
- Summary KPIs (totals, peak rate, average rate per key)
- Export (CSV, PNG)
- Empty, loading, and error states
- Theming (light/dark) and responsive layout
- Keyboard accessibility and screen reader support
- i18n-ready labels and date formatting

### Data Model
#### Series shape (preferred)
```
interface TimePoint {
  ts: string;         // ISO-8601, UTC recommended (e.g. "2025-10-21T08:00:00Z")
  value: number;      // count for this key and bucket
}

interface ApiKeySeries {
  keyId: string;      // public-safe identifier or masked key
  owner?: string;     // optional metadata for legend/tooltips
  color?: string;     // optional preferred color
  points: TimePoint[];
}

interface UsageTimeSeries {
  start: string;      // inclusive ISO start
  end: string;        // exclusive ISO end
  interval: string;   // e.g. "1m" | "5m" | "1h" | "1d"
  timezone: string;   // IANA e.g. "UTC", "America/New_York"
  series: ApiKeySeries[];
}
```

#### Summary shape (by key)
```
interface KeySummaryRow {
  keyId: string;      // identifier or masked
  owner?: string;
  total: number;      // sum over time range
  avgPerInterval?: number;
  peakPerInterval?: number;
}

interface UsageSummaryTable {
  start: string;
  end: string;
  interval: string;
  rows: KeySummaryRow[];
}
```

### Backend Contracts (reference)
- GET `/api/v1/admin/usage` — multi-key time series
    - Query: `keys=keyA,keyB` (optional), `start`, `end`, `interval=1m|5m|1h|1d`, `timezone=UTC`, `limit=10000`
    - Auth: `X-API-KEY: <adminKey>`
    - Response: `UsageTimeSeries`

- GET `/api/v1/admin/usage-summary`
    - Query: `start`, `end`, `interval`, `keys?`
    - Auth: `X-API-KEY: <adminKey>`
    - Response: `UsageSummaryTable`

Notes:
- Prefer server-side aggregation into fixed buckets between `start` and `end` inclusive/exclusive semantics.
- Ensure missing buckets are returned with `value: 0` to avoid client side backfilling.

### Component API (React example)
```
export type Interval = '1m' | '5m' | '15m' | '1h' | '6h' | '1d';

export interface ApiKeyUsageChartProps {
  data?: UsageTimeSeries;                       // controlled data
  fetcher?: (params: FetchParams) => Promise<UsageTimeSeries>; // optional data loader
  defaultKeys?: string[];                       // keys to load initially
  defaultStart?: string;                        // ISO
  defaultEnd?: string;                          // ISO
  defaultInterval?: Interval;
  timezone?: string;                            // IANA tz (default: browser or UTC)

  // Presentation
  height?: number | string;                     // e.g. 320, '40vh'
  stacked?: boolean;                            // stack series by bucket
  smooth?: boolean;                             // curve smoothing
  showPoints?: boolean;                         // show point markers
  colorPalette?: string[];                      // fallback colors
  yAxisLabel?: string;                          // e.g. 'Requests'
  yAxisScale?: 'linear' | 'log';
  grid?: boolean;                               // toggle grid lines

  // UX
  enableZoom?: boolean;                         // wheel/drag zoom
  enableBrush?: boolean;                        // bottom mini-chart brush
  tooltipFormatter?: (p: TooltipPoint) => string | ReactNode;
  legendPlacement?: 'top' | 'right' | 'bottom';

  // Callbacks
  onRangeChange?: (start: string, end: string, interval: Interval) => void;
  onSeriesToggle?: (keyId: string, visible: boolean) => void;
  onPointClick?: (args: { keyId: string; ts: string; value: number }) => void;

  // States
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;

  // Export
  onExportCSV?: (csv: string) => void;          // if not provided, component offers default download
  onExportPNG?: (blob: Blob) => void;

  // Accessibility/i18n
  ariaTitle?: string;                           // screen reader title
  i18n?: Partial<Dictionary>;                   // labels and date/number formats
}
```

### Reusable Container (optional)
Provide a companion `ApiKeyUsagePanel` that wires filters, fetcher, summary table, and the `ApiKeyUsageChart` together.

```
interface ApiKeyUsagePanelProps {
  adminKeyProvider: () => Promise<string> | string;  // how to obtain admin key
  initialKeys?: string[];
  initialRange?: { start: string; end: string; interval: Interval; };
  timezone?: string;
}
```

### UX Requirements
- Filters
    - Date range picker with presets: Last 15m, 1h, 24h, 7d, 30d, Custom
    - Interval selector with autosuggest based on range (e.g., 1m for < 6h; 5m for < 24h; 1h for < 7d; 1d beyond)
    - Timezone selector defaulting to browser tz; backend may aggregate in UTC with client-side formatting
    - Key selector with search and multi-select; chips to toggle visibility per series
- Chart Interactions
    - Hover tooltip shows: formatted timestamp, per-key values, and total
    - Click a legend item to toggle series visibility
    - Optional stacked mode to visualize share of traffic per key
    - Zoom via mouse wheel + modifier or drag-to-zoom region; reset zoom button
    - Keyboard nav: Tab to focus chart, arrow keys to move between buckets; Enter to select bucket
- Responsive
    - Scales to parent width/height; min 280px height; preserves label readability with smart tick reduction
- Export
    - CSV export: columns `timestamp`, each key as a column, and `total`
    - PNG export: snapshot of chart area with current state
- Empty/Loading/Error
    - Skeleton loaders for chart and table
    - Friendly empty-state message with guidance
    - Retry action for errors; show HTTP status and concise message

### Accessibility
- Provide `aria-label`/`aria-describedby` for chart container
- Ensure tab order and focus ring for interactive elements
- High-contrast color palette option and WCAG AA contrast for lines and text
- Use pattern fills or point shapes when colors alone are insufficient

### Performance
- Virtualize or decimate points when > 10k buckets
- Use requestAnimationFrame for hover/throttle resize observers
- Memoize series transforms; avoid re-renders on range change unless necessary
- Web worker optional for heavy transforms
- Network: abort in-flight requests on parameter change; debounce filter changes (300ms)

### Security/Privacy
- Never log raw keys; display masked forms (e.g., `abcd…wxyz`)
- All requests authenticated via admin header `X-API-KEY`
- Prevent CSV injection by escaping leading `=`, `+`, `-`, `@`
- Honor CORS and rate-limit on backend

### Error Handling
- Distinguish client errors (4xx) vs server errors (5xx)
- Show inline error summary and a retry button
- Gracefully handle missing buckets; display zeros or gaps consistently

### Theming
- Accept CSS variables for colors/spacing/typography, or a theme prop
- Sync with system dark mode (`prefers-color-scheme`)

### Testing
- Unit tests
    - Data shaping (bucket alignment, missing bucket fills)
    - CSV generation escape rules
    - Tooltip formatting
- Integration tests
    - Filter changes trigger fetch with correct params
    - Zoom/brush updates range and callbacks
    - Legend toggles hide/show series and recompute totals
- Visual regression snapshots for chart states

### Example Usage (React)
```
import { ApiKeyUsageChart } from './components/ApiKeyUsageChart';

function Dashboard() {
  const [params, setParams] = useState({
    start: new Date(Date.now() - 3600_000).toISOString(),
    end: new Date().toISOString(),
    interval: '1m' as Interval,
    keys: ['key-1', 'key-2']
  });

  const fetcher = async ({ start, end, interval, keys, timezone }: FetchParams) => {
    const res = await fetch(`/api/v1/admin/usage?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&interval=${interval}&timezone=${timezone}&keys=${keys.join(',')}`, {
      headers: { 'X-API-KEY': await getAdminKey() }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  return (
    <ApiKeyUsageChart
      fetcher={fetcher}
      defaultKeys={params.keys}
      defaultStart={params.start}
      defaultEnd={params.end}
      defaultInterval={params.interval}
      timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      stacked={false}
      smooth
      yAxisLabel="Requests per interval"
      onRangeChange={(start, end, interval) => setParams(p => ({ ...p, start, end, interval }))}
    />
  );
}
```

### CSV Export Format
```
// Header
timestamp,key-1,key-2,total
// Rows (ISO timestamps)
2025-10-21T08:00:00Z,12,9,21
2025-10-21T08:01:00Z,10,7,17
```
- Escape cells starting with `=+-@` with a leading `'` to prevent Excel formula injection

### Acceptance Criteria
- Given a selected time range and interval, the chart displays one line per selected API key
- Tooltips and legends show masked key identifiers and per-key counts
- Performance remains smooth with up to 10k points total (decimation or sampling acceptable)
- Users can toggle keys, zoom, and export CSV/PNG
- Summary table lists total, average, and peak per key for the same time range
- All labels and dates respect selected locale and timezone
- Component ships with TypeScript types, unit tests, and storybook stories demonstrating states

### Implementation Notes
- Charting library: Either ECharts, Recharts, or Chart.js v4 with decimation plugin. Provide an adapter layer so data model stays library-agnostic.
- Time handling: Use `luxon` or `date-fns-tz` for timezone-safe formatting
- HTTP: support AbortController; debounce filter inputs
- Packaging: Export as a standalone module (e.g., `@org/api-usage-charts`) with peer deps for the chart library

### Migration from Current Prototype
- Replace ad-hoc component with `ApiKeyUsageChart` + optional `ApiKeyUsagePanel`
- Move API URLs and headers into a `fetcher` prop to decouple networking
- Support multi-key series instead of single key; expose summary table props
- Add error/empty/loading states, theming, accessibility, and tests

### Non-goals
- Real-time streaming; polling may be added later
- Per-endpoint breakdowns (this spec focuses on per-key totals)
