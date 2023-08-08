import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createAuthConfig, DEFAULT_API_RES, stringifyParams } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { useAPIListParam } from '../useAPIListParam';
import { Asset } from './assetApi.model';

export function useAssets(defaultAPIListParams: APIListParams) {
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);

  const assetApi = useQuery({
    queryKey: ['assets', params],
    queryFn: async () => {
      const uri = config.EXTERNAL.CUBLICK.ASSET.AST;
      const axiosConfig = createAuthConfig({ params: stringifyParams(params) });
      const res = await axios.get<APIList<Asset>>(uri, axiosConfig);
      return res.data;
    },
    keepPreviousData: true,
    initialData: DEFAULT_API_RES as APIList<Asset>,
  });

  return [params, apiActions, assetApi] as const;
}
