import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createAuthConfig, DEFAULT_API_RES, stringifyParams } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { WidgetBase } from './widgetApi.model';

export function useWidgetBases(params: APIListParams) {
  return useQuery({
    queryKey: ['widgets', params],
    queryFn: async () => {
      const url = config.EXTERNAL.CUBLICK.WIDGET.BASE;
      const axiosConfig = createAuthConfig({ params: stringifyParams(params) });
      const res = await axios.get<APIList<WidgetBase>>(url, axiosConfig);
      return res.data;
    },
    keepPreviousData: true,
    initialData: DEFAULT_API_RES as APIList<WidgetBase>,
  });
}
