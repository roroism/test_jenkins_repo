import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createAuthConfig, DEFAULT_API_RES, stringifyParams } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { useAPIListParam } from '../useAPIListParam';
import { SocietyManagementAPIResponse } from './societyManagementApi.model';

export function useSocietyManagementQuery(defaultAPIListParams: APIListParams) {
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);

  const societyApi = useQuery({
    // queryKey: ['societyList', params],
    queryKey: ['societyList'],
    queryFn: async () => {
      const uri = config.EXTERNAL.CUBLICK.SOCIETYMANAGEMENT.SELF;
      // const axiosConfig = createAuthConfig({ params: stringifyParams(params) });
      // const axiosConfig = createAuthConfig({ params });
      const axiosConfig = createAuthConfig();
      // const res = await axios.get<APIList<SocietyManagementAPIResponse>>(uri, axiosConfig);
      const res = await axios.get<SocietyManagementAPIResponse[]>(uri, axiosConfig);
      return res.data;
    },
    keepPreviousData: true,
    // initialData: DEFAULT_API_RES as APIList<SocietyManagementAPIResponse>,
  });

  return [params, apiActions, societyApi] as const;
}
