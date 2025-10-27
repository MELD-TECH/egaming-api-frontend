import { useMemo, useState} from "react";
import { Sidebar } from "../../components/Sidebar";
import {Lga} from "../../lib/appModels.ts";
import {fetchLGAs,STATE_CODE} from "../../lib/api.ts";
import {buildQueryString} from "../../lib/utils.ts";
import {useDataLoader} from "../../hooks/useDataLoader.ts";
import {toPaginationMeta} from "../../lib/pagination.ts";
import {DataLoaderBoundary} from "../../components/common/DataLoaderBoundary.tsx";
import {Pagination} from "../../components/common/Pagination.tsx";
import {Header} from "../../components/Header";

function useLgaList(page: number, size: number) : { data: any, loading: boolean, error: any, reload: any } {
    type LgaListPayload = {
        page: number; size: number; totalPages: number; total: number; previous: number; next: number; data: Lga[]
    };

    const stateCode: string = STATE_CODE;

    const params = useMemo(() =>
        ({ page, size, name: '', stateCode, sort: 'createdOn-desc' }), [page, size, '', stateCode, 'createdOn-desc']);

    return useDataLoader<LgaListPayload, typeof params>(
        async (p, ) => {
            const qs = buildQueryString({ page: p.page, size: p.size, stateCode: p.stateCode});
            const resp = await fetchLGAs(qs);
            const payload = resp?.data?.data as LgaListPayload | undefined;
            if (!payload) throw new Error('Malformed response from server');
            return payload;
        },
        { params, preservePreviousData: true }
    );
}

export const LGA = (): JSX.Element => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const {data, loading, error, reload } = useLgaList(page, size);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const lgas: Lga[] = data?.data ?? [];
  const meta = data ? toPaginationMeta(data as any) : { page, size, totalPages: 0, total: 0 };

  return (
    <div className="flex min-h-screen bg-gray-5">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col">
          <Header title={"LGA List"} />

        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-80 mb-2">
                Local Government Areas
              </h2>
              <p className="text-gray-60">
                View all available Local Government Areas
              </p>
            </div>
          </div>

          {/* LGA Table */}
          <div className="bg-white rounded-xl border border-gray-20">
            <div className="p-6 border-b border-gray-20">
              <h3 className="text-lg font-bold text-gray-80">All LGAs</h3>
            </div>

              <DataLoaderBoundary
                  loading={loading}
                  error={error}
                  isEmpty={!loading && !error && lgas.length === 0}
                  emptyTitle="No operators found"
                  emptySubtitle="Try changing filters or check back later."
                  onRetry={reload}
              >
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-5">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      LGA Name
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      LGA Code
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      State
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-60">
                      State Code
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lgas.map((lga, index) => (
                    <tr key={index} className="border-b border-gray-20 hover:bg-gray-5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-semibold text-gray-80 text-sm">
                              {lga.name}
                            </p>
                            <p className="text-xs text-gray-60">
                              {lga.stateCode} • {lga.slugCode}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-80">
                        {lga.slugCode}
                      </td>
                      <td className="p-4 text-sm text-gray-80">
                        {'Enugu'}
                      </td>
                      <td className="p-4 text-sm font-semibold text-gray-80">
                        {lga.stateCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

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
    </div>
  );
};