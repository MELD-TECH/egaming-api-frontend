import {useEffect, useMemo, useState} from "react";
import {
    DollarSign,
    Users,
    Activity,
    Building,
    Eye,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    // TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Sidebar } from "../../../components/Sidebar";
import {Header} from "../../../components/Header";
import {OperatorData, OperatorSummary, TransactionData, TrendSeriesData} from "../../../lib/appModels.ts";
import {fetchDashboardMetrics, fetchOperators, fetchTrendSeries, fetchWinningTransactions,} from "../../../lib/api.ts";
import {
    buildQueryString,
    formatCompactNumber,
    formatCurrencyCompact,
    getAvatarBg, getDateParts,
    getInitials, timeAgoFromMs
} from "../../../lib/utils.ts";
import {useDataLoader} from "../../../hooks/useDataLoader.ts";
import {DataLoaderBoundary} from "../../../components/common/DataLoaderBoundary.tsx";
import {ChartCard} from "../../../components/charts/ChartCard.tsx";
import {SimpleLineChart} from "../../../components/charts/SimpleLineChart.tsx";



const dashboardStats = [
  {
    title: "Total Winnings Amount",
    value: "₦0",
    change: "0.1%",
    trend: "up",
    icon: DollarSign,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    title: "Total Winnings",
    value: "0",
    change: "+0.1%",
    trend: "up",
    icon: Building,
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Total Operators",
    value: "3,456",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    title: "Total Stake Transactions",
    value: "0",
    change: "0.1%",
    trend: "up",
    icon: Activity,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return "bg-green-100 text-green-800";
    case "UNVERIFIED":
      return "bg-yellow-100 text-yellow-800";
    case "UNKNOWN":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const useDashboardSummary = (): OperatorSummary | undefined => {
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

function useRecentOperators() : { data: any, loading: boolean, error: any, reload: any } {
    type OperatorsPayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: OperatorData[]
    };

    const params = useMemo(() => ({ page: 0, size: 5, status: '', sort: 'createdOn-desc' }), [0, 5, '', 'createdOn-desc']);

    return useDataLoader<OperatorsPayload, typeof params>(
        async (p, ) => {
            const qs = buildQueryString({ page: p.page, size: p.size, status: p.status === 'all' ? undefined : p.status, sort: p.sort });
            const resp = await fetchOperators(qs);
            const payload = resp?.data?.data as OperatorsPayload | undefined;
            if (!payload) throw new Error('Malformed response from server');
            return payload;
        },
        { params, preservePreviousData: true }
    );
}

function useTransactions(datePart: string) : { data: any, loading: boolean, error: any, reload: any } {
    type OperatorsPayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: TransactionData[]
    };

    const { from, to } = getDateParts(datePart);

    const params = useMemo(() => ({ page: 0, size: 5, status: '', sort: 'createdOn-desc' }), [0, 5, '', 'createdOn-desc']);

    return useDataLoader<OperatorsPayload, typeof params>(
        async (p, ) => {
            const qs = buildQueryString({ page: p.page, size: p.size,
                status: p.status === 'all' ? undefined : p.status, sort: p.sort,
                startDate: from.concat('T00:00:00Z'), endDate: to.concat('T23:59:59Z') });
            const resp = await fetchWinningTransactions(qs);
            const payload = resp?.data?.data as OperatorsPayload | undefined;
            if (!payload) throw new Error('Malformed response from server');
            return payload;
        },
        { params, preservePreviousData: true }
    );
}

function useTrendDataReport(datePart: string, page: number, size: number) : { data: any, loading: boolean, error: any, reload: any } {
    type TrendsPayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: TrendSeriesData[]
    };

    const { from, to } = getDateParts(datePart);

    const params = useMemo(() =>
        ({ page, size, status: '', from, to, limit: size, sort: 'createdOn-desc' }), [page, size, '', from, to, size, 'createdOn-desc']);

    console.log('params ', params);

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

export const Dashboard = (): JSX.Element => {
  const dashboardSummary = useDashboardSummary();
  const [dateRange, setDateRange] = useState("YEAR");

  const { data, loading, error, reload } = useRecentOperators();
  const { data: trxData, loading: trxLoading, error: trxError, reload: trxReload } = useTransactions("MONTH");
  const { data: trendData, } = useTrendDataReport(dateRange, 0, 6);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  dashboardStats[0].value = formatCurrencyCompact(dashboardSummary?.totalWinningAmount || 0, 'NGN', { locale: 'en-NG' });
  dashboardStats[1].value = formatCompactNumber(dashboardSummary?.totalWinnings || 0);
  dashboardStats[2].value = formatCompactNumber(dashboardSummary?.totalOperators || 0);
  dashboardStats[3].value = formatCompactNumber(dashboardSummary?.totalStakes || 0);

    const recentOperators: OperatorData[] = data?.data ?? [];
    const recentTransactions: TransactionData[] = trxData?.data ?? [];
    const trendSeriesData: TrendSeriesData[] = trendData?.data ?? [];

  return (
    <div className="flex min-h-screen bg-gray-5">
      <Sidebar
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
          <Header title={"Admin Dashboard"} />

        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Welcome, Section */}
          <div className="bg-gradient-to-r from-primary-500 to-brand-60 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, Admin!
                </h2>
                <p className="text-white/80 text-lg">
                  Here's what's happening with your gaming platform today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                  <Activity className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-20 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-success-50" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
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
                  <p className="text-xs text-gray-40">Up till now</p>
                </div>
              </div>
            ))}
          </div>

            <DataLoaderBoundary
                loading={loading}
                error={error}
                isEmpty={!loading && !error && recentOperators.length === 0}
                emptyTitle="No operators found"
                emptySubtitle="Try changing filters or check back later."
                onRetry={reload}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Operators */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-20">
                  <div className="p-6 border-b border-gray-20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-80">
                        Recent Operators
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/operators')}
                      >
                        View All
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {recentOperators.map((operator, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-5 rounded-lg hover:bg-gray-20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${getAvatarBg(operator?.name)} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">
                              {getInitials(operator?.name)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-80 text-sm">
                              {operator.name}
                            </h4>
                            <p className="text-xs text-gray-60">
                              ID: {operator.registrationNumber} • Joined {new Date(operator.createdOn * 1000).toDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-gray-80 text-sm">
                              {formatCurrencyCompact(operator.totalStakeAmountByOperator, 'NGN', { locale: 'en-NG' })}
                            </p>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operator.status)}`}
                            >
                              {operator.status}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => navigate(`/operator-details/${operator.registrationNumber}`, { state: { operator } })}
                          >
                            <Eye className="w-4 h-4 text-gray-60" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-20">
                  <div className="p-6 border-b border-gray-20">
                    <h3 className="text-lg font-bold text-gray-80">Quick Actions</h3>
                  </div>

                  <div className="p-6 space-y-3">
                    <Button
                      className="w-full justify-start h-12 bg-primary-500 hover:bg-primary-600 text-white"
                      onClick={() => navigate('/operators')}
                    >
                      <Building className="w-5 h-5 mr-3" />
                      View Operators
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start h-12"
                      onClick={() => navigate('/admin/reports')}
                    >
                      <Activity className="w-5 h-5 mr-3" />
                      Generate Report
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start h-12"
                      onClick={() => navigate('/admin/reports')}
                    >
                      <DollarSign className="w-5 h-5 mr-3" />
                      View Transactions
                    </Button>
                  </div>
                </div>
              </div>
            </DataLoaderBoundary>

          {/* Recent Winnings */}
          <DataLoaderBoundary
                loading={trxLoading}
                error={trxError}
                isEmpty={!trxLoading && !trxError && recentTransactions.length === 0}
                emptyTitle="No tranactions found"
                emptySubtitle="Try changing filters or check back later."
                onRetry={trxReload}
          >
          <div className="bg-white rounded-xl border border-gray-20">
            <div className="p-6 border-b border-gray-20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-80">
                  Recent Winnings
                </h3>
                <Button variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin/reports')}
                >
                  View All
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-5">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Transaction ID
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Operator
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Amount
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Player
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Game Played
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-80">
                        {transaction.transactionReference}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {transaction.stakeRegistration?.operator?.name || "Unknown Operator"}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-80">
                        {formatCurrencyCompact(transaction.amountWon, 'NGN', { locale: 'en-NG' }) }
                      </td>
                      <td className="p-4">
                          {transaction.stakeRegistration?.customer?.name}
                      </td>
                      <td className="p-4">
                          {transaction.stakeRegistration?.customer?.gamePlayed}
                      </td>
                      <td className="p-4 text-sm text-gray-60">
                        {timeAgoFromMs(transaction.createdOn * 1000)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </DataLoaderBoundary>

          {/* Revenue Chart Placeholder */}
          {/*  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center justify-between mb-6">*/}
            <div className="bg-white rounded-xl border border-gray-20 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-80">Revenue Overview</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9"
                                onClick={() => setDateRange("MONTH_TO_DATE")} type="button">
                            <Calendar className="w-4 h-4 mr-2" />
                            Last 30 days
                        </Button>
                    </div>
                </div>
                {/* Revenue Trends */}
                <ChartCard
                    title="Revenue Trends"
                    /* actions={[{ key: "line", label: "Line", active: true, onClick: () => {} }]} */
                >
                    {(() => {
                        const grouped = trendSeriesData;
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
                                width={960}
                            />
                        );
                    })()}
                </ChartCard>
          {/*<div className="bg-white rounded-xl border border-gray-20 p-6">*/}
          {/*  <div className="flex items-center justify-between mb-6">*/}
          {/*    <h3 className="text-lg font-bold text-gray-80">Revenue Overview</h3>*/}
          {/*    <div className="flex items-center gap-2">*/}
          {/*      <Button variant="outline" size="sm" className="h-9">*/}
          {/*        <Calendar className="w-4 h-4 mr-2" />*/}
          {/*        Last 30 days*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  */}
          {/*  <div className="h-80 bg-gray-5 rounded-lg flex items-center justify-center">*/}
          {/*    <div className="text-center">*/}
          {/*      <TrendingUp className="w-16 h-16 text-gray-40 mx-auto mb-4" />*/}
          {/*      <h4 className="text-lg font-semibold text-gray-60 mb-2">Revenue Analytics Chart</h4>*/}
          {/*      <p className="text-sm text-gray-40 max-w-xs">*/}
          {/*        Interactive revenue chart showing trends and performance metrics over time*/}
          {/*      </p>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
     </div>
    </div>
  );
};