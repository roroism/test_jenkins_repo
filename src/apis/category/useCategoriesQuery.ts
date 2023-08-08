import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createAuthConfig, DEFAULT_API_RES, stringifyParams } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { useAPIListParam } from '../useAPIListParam';
import { CategoryAPIResponse } from './categoryApi.model';

export function useCategoriesQuery(defaultAPIListParams: APIListParams) {
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);

  const categoryApi = useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const uri = config.EXTERNAL.CUBLICK.CATEGORYMANAGEMENT.SELF;
      const axiosConfig = createAuthConfig({ params });
      // const axiosConfig = createAuthConfig({ params: stringifyParams(params) });
      const res = await axios.get<APIList<CategoryAPIResponse>>(uri, axiosConfig);
      return res.data;
    },
    keepPreviousData: true,
    initialData: DEFAULT_API_RES as APIList<CategoryAPIResponse>,
  });

  return [params, apiActions, categoryApi] as const;
}
