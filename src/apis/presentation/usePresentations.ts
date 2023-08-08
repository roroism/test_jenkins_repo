import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createAuthConfig, DEFAULT_API_RES, stringifyParams } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { useAPIListParam } from '../useAPIListParam';
import { PresentationAPIResponse } from './presentationApi.model';

export function usePresentations(defaultAPIListParams: APIListParams) {
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);

  const assetApi = useQuery({
    queryKey: ['presentations', params],
    queryFn: async () => {
      const url = `${config.EXTERNAL.CUBLICK.PRESENTATION.PRE}`;
      const axiosConfig = createAuthConfig({ params: stringifyParams(params) });
      const res = await axios.get<APIList<PresentationAPIResponse>>(url, axiosConfig);
      return res.data;
    },
    keepPreviousData: true,
    initialData: DEFAULT_API_RES as APIList<PresentationAPIResponse>,
  });

  return [params, apiActions, assetApi] as const;
}
