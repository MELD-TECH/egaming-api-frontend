import { useMemo, useState } from 'react';
import {
    CheckCircle, Clock, Eye, Filter, XCircle,
} from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { Sidebar } from "../../../components/Sidebar";
import {Header} from "../../../components/Header";
import {OperatorData,} from "../../../lib/appModels.ts";
import {fetchOperators} from "../../../lib/api.ts";
import {
    buildQueryString,
    formatCompactNumber,
    formatCurrencyCompact, getAvatarBg,
    getInitials
} from "../../../lib/utils.ts";

import { useDataLoader } from '../../../hooks/useDataLoader';
import { DataLoaderBoundary } from '../../../components/common/DataLoaderBoundary';
import { Pagination } from '../../../components/common/Pagination';
import { toPaginationMeta } from '../../../lib/pagination';
import {useNavigate} from "react-router-dom";


const getStatusIcon = (status: string) => {
  switch (status) {
    case "VERIFIED":
      return <CheckCircle className="w-4 h-4 text-success-50" />;
    case "UNVERIFIED":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "UNKNOWN":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-40" />;
  }
};

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

export const Operator = (): JSX.Element => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdOn");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const navigate = useNavigate();

    // Server-side pagination state
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    type OperatorsPayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: OperatorData[]
    };

    const params = useMemo(() => ({ page, size, status: statusFilter, sort: sortBy }), [page, size, statusFilter, sortBy]);

    const { data, loading, error, reload } = useDataLoader<OperatorsPayload, typeof params>(
        async (p, ) => {
            const qs = buildQueryString({ page: p.page, size: p.size, status: p.status === 'all' ? undefined : p.status, sort: p.sort });
            const resp = await fetchOperators(qs);
            const payload = resp?.data?.data as OperatorsPayload | undefined;
            if (!payload) throw new Error('Malformed response from server');
            return payload;
        },
        { params, preservePreviousData: true }
    );

    const operators: OperatorData[] = data?.data ?? [];
    const meta = data ? toPaginationMeta(data as any) : { page, size, totalPages: 0, total: 0 };


    // @ts-ignore
    return (
        <div className="flex min-h-screen bg-gray-5">
            <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

            <div className="flex-1 flex flex-col">
                <Header title={'Operators'} />

                <div className="flex-1 p-4 md:p-6 space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-80 mb-2">Operator Management</h2>
                            <p className="text-gray-60">Manage and monitor all registered gaming operators</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl border border-gray-20 p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-gray-60" />
                                    <span className="text-sm font-semibold text-gray-80">Filter by:</span>
                                </div>

                                <Select value={statusFilter} onValueChange={(v) => { setPage(0); setStatusFilter(v); }}>
                                    <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="VERIFIED">Verified</SelectItem>
                                        <SelectItem value="UNVERIFIED">Unverified</SelectItem>
                                        <SelectItem value="UNKNOWN">Unknown</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={(v) => { setPage(0); setSortBy(v); }}>
                                    <SelectTrigger className="w-48 h-10 bg-gray-5 border-gray-30 rounded-lg">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="createdOn">Newest First</SelectItem>
                                        <SelectItem value="registrationNumber">Business Number</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="text-sm text-gray-60">
                                {loading ? 'Loading…' : `Showing ${operators.length} of ${data?.total ?? 0} operators`}
                            </div>
                        </div>
                    </div>

                    {/* Data loader boundary around the table */}
                    <DataLoaderBoundary
                        loading={loading}
                        error={error}
                        isEmpty={!loading && !error && operators.length === 0}
                        emptyTitle="No operators found"
                        emptySubtitle="Try changing filters or check back later."
                        onRetry={reload}
                    >
                        <div className="bg-white rounded-xl border border-gray-20">
                            <div className="p-6 border-b border-gray-20">
                                <h3 className="text-lg font-bold text-gray-80">All Operators</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-5">
                                        <tr>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Company
                                            </th>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Contact Person
                                            </th>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Email
                                            </th>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Phone
                                            </th>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Status
                                            </th>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Winnings
                                            </th>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Games
                                            </th>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Registered
                                            </th>
                                            <th className="text-left p-4 text-sm font-semibold text-gray-60">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {operators.map((operator, index) => (
                                        <tr key={operator.id ?? index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 ${getAvatarBg(operator?.name)} rounded-full flex items-center justify-center`}>
                                                        <span className="text-white font-bold text-sm">
                                                            {getInitials(operator?.name)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-80 text-sm">
                                                            {operator?.name}
                                                        </p>
                                                        <p className="text-xs text-gray-60">
                                                            {operator?.registrationNumber}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-80">
                                                {operator?.contactPerson}
                                            </td>
                                            <td className="p-4 text-sm text-gray-60">
                                                {operator?.email}
                                            </td>
                                            <td className="p-4 text-sm text-gray-60">
                                                {operator?.phone}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(operator?.status)}
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(operator.status)}`}>
                                                        {operator?.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm font-semibold text-gray-80">
                                                {formatCurrencyCompact(operator?.totalStakeWinningAmountByOperator, "NGN", { locale: "en-NG" })}
                                            </td>
                                            <td className="p-4 text-sm text-gray-60">
                                                {formatCompactNumber(operator?.totalUniqueGamesPlayedByOperator)}
                                            </td>
                                            <td className="p-4 text-sm text-gray-60">
                                                {new Date(operator?.createdOn * 1000).toDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => navigate(`/operator-details/view`, { state: { operator } })}
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-60" />
                                                    </Button>
                                                </div>
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
                </div>
            </div>
        </div>
    );
};