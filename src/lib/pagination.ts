import { OperatorsResponse } from './models';
import type { PaginationMeta } from '../components/common/Pagination';

export function toPaginationMeta(resp: OperatorsResponse["data"]): PaginationMeta {
    return {
        page: resp.page,
        size: resp.size,
        totalPages: resp.totalPages,
        total: resp.total,
        previous: resp.previous,
        next: resp.next,
    };
}