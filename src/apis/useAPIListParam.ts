import { SelectChangeEvent } from '@mui/material';
import { APIList, APIListParams } from '.';
import { useTypeSafeReducer } from '../hooks/useTypeSafeReducer';
import { ArrayElement } from '../utils';

export function useAPIListParam(defaultAPIListParams: APIListParams) {
  const [apiListParams, apiActions] = useTypeSafeReducer(defaultAPIListParams, {
    changePage: (state, page: number) => {
      state.page = page;
    },

    onPerPageChange: (state, e: SelectChangeEvent) => {
      state.perPage = Number(e.target.value);
    },
    changePerPage: (state, perPage: number) => {
      state.perPage = perPage;
    },

    toggleOrder: (state) => {
      state.sort = state.sort[0] === '-' ? state.sort.slice(1) : `-${state.sort}`;
      state.order = state.order === 'DESC' ? 'ASC' : 'DESC';
    },

    onSortChange: (state, e: SelectChangeEvent) => {
      const sort = e.target.value;
      state.sort = state.sort[0] === '-' ? `-${sort}` : sort;
    },
    changeSort: (state, sort: string) => {
      state.sort = state.sort[0] === '-' ? `-${sort}` : sort;
    },

    onQueryChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.q = e.target.value;
    },
    changeQuery: (state, q: string) => {
      state.q = q;
    },

    setFilter: (state, filter: ArrayElement<APIListParams['filter']>) => {
      state.filter = state.filter.filter((f) => f.key !== filter.key).concat([filter]);
    },
    removeFilter: (state, key: string) => {
      state.filter = state.filter.filter((f) => f.key !== key);
    },

    setOwner: (state, owner: string) => {
      const ownerFilter = state.filter.find((f) => f.key === 'owner');
      if (ownerFilter) {
        ownerFilter.value = owner;
      } else {
        state.filter.push({ key: 'owner', operator: '=', value: owner });
      }
    },

    setMimeType: (state, mimeType: string) => {
      if (mimeType === 'ALL') {
        state.filter = state.filter.filter((f) => f.key !== 'mimeType');
        return;
      }
      const mimeTypeFilter = state.filter.find((f) => f.key === 'mimeType');
      if (mimeTypeFilter) {
        mimeTypeFilter.value = mimeType;
      } else {
        state.filter.push({ key: 'mimeType', operator: '=', value: mimeType });
      }
    },
  });

  return [apiListParams, apiActions] as const;
}
