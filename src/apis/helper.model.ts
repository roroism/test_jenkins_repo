export type APIList<T = any> = {
  data: T[];
  pages?: {
    current: number;
    prev: number;
    hasPrev: boolean;
    next: number;
    hasNext: boolean;
    total: number;
  };
  items: {
    begin: number;
    end: number;
    total: number;
  };
};

export type APIListParams = {
  order?: 'ASC' | 'DESC';
  page?: number;
  perPage?: number;
  sort?: string;
  filter?: {
    key: string;
    operator: string;
    value: string;
  }[];
  q?: string;
  filterMode?: 'AND' | 'OR';
};
