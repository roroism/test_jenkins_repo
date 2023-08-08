import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createAuthConfig, DEFAULT_API_RES, stringifyParams } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { useAPIListParam } from '../useAPIListParam';
import { usersAPIResponse } from './usersAPI.models';

export function useUsersQuery(defaultAPIListParams: APIListParams) {
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);

  const usersApi = useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const uri = config.EXTERNAL.CUBLICK.USER.UDT;
      console.log(uri);
      const axiosConfig = createAuthConfig({ params });
      // const axiosConfig = createAuthConfig({ params: stringifyParams(params) });
      const res = await axios.get<APIList<usersAPIResponse>>(uri, axiosConfig);
      return res.data;
    },
    keepPreviousData: false,
    initialData: DEFAULT_API_RES as APIList<usersAPIResponse>,
  });

  return [params, apiActions, usersApi] as const;
}
