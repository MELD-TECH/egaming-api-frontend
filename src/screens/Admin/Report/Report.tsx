import {useEffect, useMemo, useState} from "react";
import {
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  GamepadIcon,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Sidebar } from "../../../components/Sidebar";
import {Header} from "../../../components/Header";
import {
    OperatorSummary,
    PerformanceDistributionData,
    TransactionData,
    TrendSeriesData
} from "../../../lib/appModels.ts";
import {
    fetchDashboardMetrics,
    fetchPerformanceDistribution,
    fetchTrendSeries,
    fetchWinningTransactions
} from "../../../lib/api.ts";
import {
    buildQueryString,
    formatCompactNumber,
    formatCurrencyCompact,
    getDateParts
} from "../../../lib/utils.ts";
import {useDataLoader} from "../../../hooks/useDataLoader.ts";
import {DataLoaderBoundary} from "../../../components/common/DataLoaderBoundary.tsx";
import {toPaginationMeta} from "../../../lib/pagination.ts";
import {Pagination} from "../../../components/common/Pagination.tsx";
import {convertToCSV, convertToPDF} from "../../../components/reports/StakeReports.tsx";
import {downloadFile, downloadPDF} from "../../../components/download/Download.ts";
import {SimplePieChart} from "../../../components/charts/SimplePieChart.tsx";
import {ChartCard} from "../../../components/charts/ChartCard.tsx";
import {SimpleLineChart} from "../../../components/charts/SimpleLineChart.tsx";

const reportStats = [
  {
    title: "Total Winnings Amount",
    value: "₦125,430.89",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Total Bets",
    value: "45,231",
    change: "+8.2%",
    trend: "up",
    icon: Activity,
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Total Operators",
    value: "3,456",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    title: "Total Winnings",
    value: "23,567",
    change: "-2.1%",
    trend: "up",
    icon: GamepadIcon,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
];

const useReportStats = (): OperatorSummary | undefined => {
    const [summary, setSummary] = useState<OperatorSummary>();

    useEffect(() => {
        const getSummary = async () => {
            try {
                const response = await fetchDashboardMetrics();
                const data = await response?.data;
                if(data) setSummary(data?.data);
            } catch (error) {
                console.error('Error fetching dashboard summary:', error);
            }
        };
        getSummary();
    }, []);

    return summary;
}

function useTransactionForReport(datePart: string, page: number, size: number) : { data: any, loading: boolean, error: any, reload: any } {
    type OperatorsPayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: TransactionData[]
    };

    const { from, to } = getDateParts(datePart);

    const params = useMemo(() =>
        ({ page, size, status: '', from, to, sort: 'createdOn-desc' }), [page, size, '', from, to, 'createdOn-desc']);

    return useDataLoader<OperatorsPayload, typeof params>(
        async (p, ) => {
            const qs = buildQueryString({ page: p.page, size: p.size,
                status: p.status === 'all' ? undefined : p.status, sort: p.sort,
                startDate: p.from.concat('T00:00:00Z'), endDate: p.to.concat('T23:59:59Z') });
            const resp = await fetchWinningTransactions(qs);
            const payload = resp?.data?.data as OperatorsPayload | undefined;
            if (!payload) throw new Error('Malformed response from server');
            return payload;
        },
        { params, preservePreviousData: true }
    );
}

function useTrendSeriesReport(datePart: string, page: number, size: number) : { data: any, loading: boolean, error: any, reload: any } {
    type TrendsPayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: TrendSeriesData[]
    };

    const { from, to } = getDateParts(datePart);

    const params = useMemo(() =>
        ({ page, size, status: '', from, to, limit: size, sort: 'createdOn-desc' }), [page, size, '', from, to, size, 'createdOn-desc']);

    return useDataLoader<TrendsPayload, typeof params>(
        async (p, ) => {
            const qs = buildQueryString({ page: p.page, size: p.size, limit: p.size, sort: p.sort,
                from: p.from.concat('T00:00:00Z'), to: p.to.concat('T23:59:59Z') });
            const resp = await fetchTrendSeries(qs);
            const payload = resp?.data as TrendsPayload | undefined;
            if (!payload) throw new Error('Malformed response from server');
            return payload;
        },
        { params, preservePreviousData: true }
    );
}

function useDistributionReport(datePart: string, page: number, size: number) : { data: any, loading: boolean, error: any, reload: any } {
    type PerformanceDistributionPayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: PerformanceDistributionData[]
    };

    const { from, to } = getDateParts(datePart);

    const params = useMemo(() =>
        ({ page, size, status: '', from, to, limit: size, sort: 'createdOn-desc' }), [page, size, '', from, to, size, 'createdOn-desc']);

    return useDataLoader<PerformanceDistributionPayload, typeof params>(
        async (p, ) => {
            const qs = buildQueryString({ page: p.page, size: p.size, limit: p.size, sort: p.sort,
                from: p.from.concat('T00:00:00Z'), to: p.to.concat('T23:59:59Z') });
            const resp = await fetchPerformanceDistribution(qs);
            const payload = resp?.data as PerformanceDistributionPayload | undefined;
            if (!payload) throw new Error('Malformed response from server');
            return payload;
        },
        { params, preservePreviousData: true }
    );
}

export const Report = (): JSX.Element => {
  const reportSummary = useReportStats();
  const [dateRange, setDateRange] = useState("THIS_WEEK");

  // Server-side pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { data, loading, error, reload } = useTransactionForReport(dateRange, page, size);
  const { data: trendSeries, } = useTrendSeriesReport("MONTH_TO_DATE", page, 6);
  const { data: performance, } = useDistributionReport("MONTH_TO_DATE", page, 6);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    reportStats[0].value = formatCurrencyCompact(reportSummary?.totalWinningAmount || 0, 'NGN', { locale: 'en-NG' });
    reportStats[1].value = formatCompactNumber(reportSummary?.totalStakes || 0);
    reportStats[2].value = formatCompactNumber(reportSummary?.totalOperators || 0);
    reportStats[3].value = formatCompactNumber(reportSummary?.totalWinnings || 0);

  const transactions: TransactionData[] = data?.data ?? [];
  const meta = data ? toPaginationMeta(data as any) : { page, size, totalPages: 0, total: 0 };
  const trendData: TrendSeriesData[] = trendSeries?.data ?? [];
  const distributionData: PerformanceDistributionData[] = performance?.data ?? [];

    const handleExportCSV = () => {
        const csvContent = convertToCSV(transactions);
        const filename = `stakes-report-${new Date().toISOString().split('T')[0]}.csv`;
        downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
    };

    const handleExportPDF = () => {
        const pdfContent = convertToPDF(transactions);
        const filename = `stakes-report-${new Date().toISOString().split('T')[0]}.pdf`;
        downloadPDF(pdfContent, filename);
    };

  return (
    <div className="flex min-h-screen bg-gray-5">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
          <Header title={"Reports & Analytics"} />

        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-80 mb-2">
                Reports & Analytics
              </h2>
              <p className="text-gray-60">
                Generate and manage comprehensive reports for all gaming operations
              </p>
            </div>

          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {reportStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-20 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-success-50" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        stat.trend === "up" ? "text-success-50" : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-60">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-80">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl border border-gray-20 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-60" />
                  <span className="text-sm font-semibold text-gray-80">Filter by:</span>
                </div>
                
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THIS_WEEK">This Week</SelectItem>
                    <SelectItem value="LAST_WEEK">Last Weeks</SelectItem>
                    <SelectItem value="ONE_WEEK">Last 7 days</SelectItem>
                    <SelectItem value="THIS_MONTH">This Month</SelectItem>
                    <SelectItem value="LAST_MONTH">Last Month</SelectItem>
                    <SelectItem value="MONTH_TO_DATE">Last 30 days</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                  <Button className="bg-primary-500 hover:bg-primary-600 text-white h-12 px-6 rounded-full"
                          onClick={handleExportCSV}
                          type="button">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                  </Button>
                  <Button variant="outline" className="h-10"
                          onClick={handleExportPDF}
                          type="button">
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                  </Button>
              </div>
            </div>
          </div>

          {/* Reports Table */}
          <DataLoaderBoundary
                loading={loading}
                error={error}
                isEmpty={!loading && !error && transactions.length === 0}
                emptyTitle="No operators found"
                emptySubtitle="Try changing filters or check back later."
                onRetry={reload}
          >
              <div className="bg-white rounded-xl border border-gray-20">
                <div className="p-6 border-b border-gray-20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-80">Reports</h3>
                    <div className="text-sm text-gray-60">
                      {loading ? 'Loading…' : `Showing ${transactions.length} of ${data?.total ?? 0} reports`}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-5">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Stake #
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Operator
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Customer
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Game Played
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Stake/Bet
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Won
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          LGA
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-gray-60">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((report, index) => (
                        <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                          <td className="p-4 text-sm text-gray-80">
                              {report.referenceNumber}
                          </td>
                          <td className="p-4 text-sm text-gray-80">
                            {report.stakeRegistration?.operator?.name}
                          </td>
                          <td className="p-4 text-sm text-gray-60">
                            {report.stakeRegistration?.customer?.name}
                          </td>
                          <td className="p-4 text-sm font-semibold text-gray-80">
                            {report.stakeRegistration?.customer?.gamePlayed}
                          </td>
                          <td className="p-4 text-sm text-gray-60">
                            {report.stakeRegistration?.customer?.amount}
                          </td>
                          <td className="p-4 text-sm text-gray-60">
                            {report.amountWon}
                          </td>
                          <td className="p-4 text-sm text-gray-60">
                              {report.stakeRegistration?.location?.lgaCode}
                          </td>
                          <td className="p-4 text-sm text-gray-60">
                            {new Date(report.createdOn * 1000).toLocaleDateString()}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trends */}
                <ChartCard
                    title="Revenue Trends"
                    actions={[{ key: "line", label: "Line", active: true, onClick: () => {} }]}
                >
                    {(() => {
                        const grouped = trendData;
                        const labels = grouped.map(g => g.gameName);
                        const revenue = grouped.map(g => g.amountWon);
                        const totalBets = grouped.map(g => g.gamesPlayed);
                        return (
                            <SimpleLineChart
                                labels={labels}
                                series={[
                                    { name: "Revenue (₦)", color: "#14532D", data: revenue },
                                    { name: "Total Bets", color: "#7C3AED", data: totalBets },
                                ]}
                                yFormatter={(v) => v.toLocaleString("en-NG")}
                            />
                        );
                    })()}
                </ChartCard>

                {/* Performance Distribution */}
                <ChartCard title="Performance Distribution">
                    {(() => {
                        const colors = ["#166534", "#7C3AED", "#DC2626", "#F59E0B", "#2563EB", "#78350F"];
                        const grouped = distributionData
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 6);
                        return (
                            <SimplePieChart
                                data={grouped.map((g, i) => ({ label: g.gameName, value: g.percent, color: colors[i % colors.length] }))}
                                size={260}
                                hoverScale={1.25}
                                innerRadius={80}
                                showPercentInCenter
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