import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createAuthConfig, DEFAULT_API_RES } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { useAPIListParam } from '../useAPIListParam';
import { ContentAPIResponse } from './contentApi.model';

export function useContentsQuery(defaultAPIListParams: APIListParams) {
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);

  const api = useQuery({
    queryKey: ['contents', params],
    queryFn: async () => {
      const uri = config.EXTERNAL.CUBLICK.CONTENT.SELF;
      const axiosConfig = createAuthConfig({ params });
      const res = await axios.get<APIList<ContentAPIResponse>>(uri, axiosConfig);
      return res.data;
    },
    keepPreviousData: true,
    initialData: DEFAULT_API_RES as APIList<ContentAPIResponse>,
  });

  return [params, apiActions, api] as const;
}
