import {GenericResponse} from './models';
import type { PaginationMeta } from '../components/common/Pagination';

export function toPaginationMeta(resp: GenericResponse<any>["data"]): PaginationMeta {
    return {
        page: resp.page ?? 0,
        size: resp.size ?? 10,
        totalPages: resp.totalPages,
        total: resp.total  ?? resp?.data?.length ?? 0,
        previous: resp.previous,
        next: resp.next,
    };
}