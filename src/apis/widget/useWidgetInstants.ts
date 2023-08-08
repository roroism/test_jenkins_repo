import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createAuthConfig, DEFAULT_API_RES, stringifyParams } from '../helper';
import { APIList, APIListParams } from '../helper.model';
import { WidgetInstance } from './widgetApi.model';

export function useWidgetInstants(params: APIListParams) {
  return useQuery({
    queryKey: ['widget_instants', params],
    queryFn: async () => {
      const url = config.EXTERNAL.CUBLICK.WIDGET.WID;
      const axiosConfig = createAuthConfig({ params: stringifyParams(params) });
      const res = await axios.get<APIList<WidgetInstance>>(url, axiosConfig);
      return res.data;
    },
    keepPreviousData: true,
    initialData: DEFAULT_API_RES as APIList<WidgetInstance>,
  });
}
