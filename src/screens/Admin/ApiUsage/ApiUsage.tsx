import {useEffect, useMemo, useState} from "react";
import {
    Eye,
    Filter,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Sidebar } from "../../../components/Sidebar";
import {Header} from "../../../components/Header";
import {
    ApiKeyUsageData,
    ApiKeyUsageSummary,
} from "../../../lib/appModels.ts";
import {
    fetchApiKeyUsage,
    fetchApiKeyUsageSummary,
} from "../../../lib/api.ts";
import {useDataLoader} from "../../../hooks/useDataLoader.ts";
import {DataLoaderBoundary} from "../../../components/common/DataLoaderBoundary.tsx";
import {toPaginationMeta} from "../../../lib/pagination.ts";
import {Pagination} from "../../../components/common/Pagination.tsx";
import {ChartCard} from "../../../components/charts/ChartCard.tsx";
import { ApiKeyUsageChart } from '../../../components/charts/time-series/ApiKeyUsageChart';
import type { UsageTimeSeries, ApiKeySeries } from '../../../components/charts/time-series/types';

function useApiKeyUsageSummary(page: number, size: number) : { data: any, loading: boolean, error: any, reload: any } {
    type ApiKeyUsagePayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: ApiKeyUsageSummary[];
    };

    const params = useMemo(() =>
        ({ page, size, status: '', sort: 'createdOn-desc' }), [page, size, '', 'createdOn-desc']);

    return useDataLoader<ApiKeyUsagePayload, typeof params>(
        async () => {
            const resp = await fetchApiKeyUsageSummary();
            const payload = resp?.data as ApiKeyUsagePayload | undefined;
            if (!payload) throw new Error('Malformed response from server');
            return payload;
        },
        { params, preservePreviousData: true }
    );
}

function useApiKeyUsage(publicId: string | null, minutes: number):
    {data: ApiKeyUsageData[], loading: boolean, error: Error | null} {
    const [data, setData] = useState<ApiKeyUsageData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Don't attempt to fetch if publicId is not provided
        if (!publicId) {
            setData([]);
            setLoading(false);
            setError(null);
            return;
        }

        let isMounted = true;
        setLoading(true);

        const getApiKeyUsage = async () => {
            const resp = await fetchApiKeyUsage(publicId, minutes);
            const apiData = resp?.data?.data as ApiKeyUsageData[] | [];
            if (!data) {
                setData([]);
                setError(new Error('Malformed response from server'));
            }
            setData(apiData);
            setError(null);
        }

        getApiKeyUsage().finally(() => {
            if (isMounted) {
                setLoading(false);
            }
        });

        // Cleanup function to prevent state updates if the component unmounts
        return () => {
            isMounted = false;
        };
    }, [publicId, minutes]);

    return { data, loading, error };
}

// Helper: bucket by minute (UTC)
function startOfMinuteIso(ts: number) {
    const d = new Date(ts);
    d.setUTCSeconds(0, 0); // zero our seconds and milliseconds
    return d.toISOString();
}

function buildUsage(apiUsage: ApiKeyUsageData[], timezone: string): UsageTimeSeries | undefined {
    // console.log("apiUsage 2 ",apiUsage);
    if (!apiUsage?.length) return undefined;

    // Gather buckets and series keyed by clientId (proxy for API key)
    const allTs = new Set<string>();
    const map: Record<string, Record<string, number>> = {};

    let min = Number.POSITIVE_INFINITY;
    let max = 0;

    for (const t of apiUsage) {
        const ms = (t.timestamp ?? 0) * 1000;

        if (!ms) continue;
        const bucket = startOfMinuteIso(ms);
        allTs.add(bucket);
        min = Math.min(min, ms);
        max = Math.max(max, ms);

        const key = t.timestamp || 'unknown'; // NOTE: if you actually have a key/client id, use that field instead
        map[key] ||= {};
        map[key][bucket] = Number(t.count)
            // (map[key][bucket] ?? 0) + inc; // count per minute
    }

    const timestamps = Array.from(allTs).reverse();
    const series: ApiKeySeries[] = Object.entries(map).map(([keyId, perTs],) => ({
        keyId,
        color: undefined,
        points: timestamps.map(ts => ({ ts, value: perTs[ts] ?? 0 })),
    }));

    return {
        start: timestamps[0],
        end: timestamps[timestamps.length - 1],
        interval: '1m', // minute granularity
        timezone,
        series,
    };
}

export const ApiUsage = (): JSX.Element => {
  // Server-side pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [publicId, setPublicId] = useState(null);
  const [interval, setInterval] = useState('5');
  const { data, loading, error, reload } = useApiKeyUsageSummary(page, size);
  const { data: apiKeyUsage, } = useApiKeyUsage(publicId, parseInt(interval));

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const apiUsage: ApiKeyUsageSummary[] = data?.data ?? [];
  const meta = data ? toPaginationMeta(data as any) : { page, size, totalPages: 0, total: 0 };

    return (
    <div className="flex min-h-screen bg-gray-5">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
          <Header title={"Api Keys Usage"} />

        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-80 mb-2">
                Api Key Usage Summary
              </h2>
              <p className="text-gray-60">
                Monitor Key Usage for all gaming operators
              </p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl border border-gray-20 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-60" />
                  <span className="text-sm font-semibold text-gray-80">Interval In:</span>
                </div>
                
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5m</SelectItem>
                    <SelectItem value="15">15m</SelectItem>
                    <SelectItem value="30">30m</SelectItem>
                    <SelectItem value="60">1h</SelectItem>
                    <SelectItem value="360">6h</SelectItem>
                    <SelectItem value="1440">1d</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <DataLoaderBoundary
                loading={loading}
                error={error}
                isEmpty={!loading && !error && apiUsage.length === 0}
                emptyTitle="No operators Activity within the hour"
                emptySubtitle="Try changing filters or check back later."
                onRetry={reload}
          >
              <div className="bg-white rounded-xl border border-gray-20">
                <div className="p-6 border-b border-gray-20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-80">Reports</h3>
                    <div className="text-sm text-gray-60">
                      {loading ? 'Loading…' : ``}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-5">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Operator #
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Operator
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Total Api Calls
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiUsage.map((report, index) => (
                        <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                          <td className="p-4 text-sm text-gray-80">
                              {report.clientId}
                          </td>
                          <td className="p-4 text-sm text-gray-80">
                            {report.owner}
                          </td>
                          <td className="p-4 text-sm text-gray-60">
                            {report.total}
                          </td>
                          <td className="p-4 text-sm font-semibold text-gray-80">
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  // @ts-ignore
                                  onClick={() => setPublicId(report?.clientId)}
                              >
                                  <Eye className="w-4 h-4 text-gray-60" />
                              </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                  {/* Pagination */}
                  <Pagination
                      meta={{
                          page: meta.page,
                          size: meta.size,
                          totalPages: meta.totalPages,
                          total: meta.total,
                      }}
                      onPageChange={(p) => setPage(p)}
                      onPageSizeChange={(s) => { setPage(0); setSize(s); }}
                  />

              </div>
          </DataLoaderBoundary>
          {/* Charts Section */}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* Revenue Trends */}
                {/* Revenue Trends (now: API Key Usage over time) */}
                <ChartCard title="API Key Usage (Requests over time-[per minute])">
                    {(() => {
                        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
                        const usage = buildUsage(apiKeyUsage, tz);
                        return (
                            <ApiKeyUsageChart
                                data={usage}
                                height={600}
                                stacked={false}
                                showPoints={false}
                                yAxisLabel="Requests"
                                tooltipFormatter={({ value }) => value.toLocaleString('en-NG')}
                            />
                        );
                    })()}
                </ChartCard>
            </div>
        </div>
      </div>
    </div>
  );
};