import { ArrayElement } from '../utils';
import { APIListParams } from './helper.model';

type FilterElement = ArrayElement<APIListParams['filter']>;

export class APIListParamBuilder {
  private _page: number = 1;
  private _perPage: number = 10;
  private _order: 'ASC' | 'DESC' = 'DESC';
  private _sort: string = '-updatedDate';
  private _filterMap: Map<string, Omit<FilterElement, 'key'>> = new Map();
  private _q: string = '';

  public setPage(page: number): APIListParamBuilder {
    this._perPage = page;
    return this;
  }

  public setPerPage(perPage: number): APIListParamBuilder {
    this._perPage = perPage;
    return this;
  }

  public setSort(sort: string): APIListParamBuilder {
    this._sort = sort;
    return this;
  }

  public setOrder(order: 'ASC' | 'DESC'): APIListParamBuilder {
    this._order = order;
    return this;
  }

  public setFilter(key: string, operator: string, value: string): APIListParamBuilder {
    this._filterMap.set(key, { operator, value });
    return this;
  }

  public q(q: string): APIListParamBuilder {
    this._q = q;
    return this;
  }

  private filterMapToFilter(filterMap: typeof this._filterMap): APIListParams['filter'] {
    return Array.from(filterMap.entries()).map(([key, value]) => ({ key, ...value }));
  }

  public build(): APIListParams {
    return {
      order: this._order,
      page: this._page,
      perPage: this._perPage,
      sort: this._sort,
      filter: this.filterMapToFilter(this._filterMap),
      q: this._q,
    };
  }
}
