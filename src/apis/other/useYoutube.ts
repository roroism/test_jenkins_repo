import { config } from '@app/src/config';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiKey = 'AIzaSyDw2sKXXZO_c1z7kNKE_RcHZDShGrQ4_3A';
const searchURL = 'https://www.googleapis.com/youtube/v3/search';

export function useYoutube(q: string, maxResults: number = 20) {
  return useQuery({
    queryKey: ['youtube', q, maxResults],
    queryFn: async () => {
      const proxyURL = config.EXTERNAL.CUBLICK.SERVICES.PROXY;
      const param = new URLSearchParams();
      param.append('key', apiKey);
      param.append('part', 'snippet');
      param.append('type', 'video');
      param.append('maxResults', maxResults.toString());
      param.append('regionCode', 'KR');
      param.append('gl', 'KR');
      param.append('videoEmbeddable', 'true');
      param.append('videoSyndicated', 'true');
      param.append('q', encodeURI(q));
      const url = `${searchURL}?${param.toString()}`;
      const res = await axios.get(proxyURL, { params: { url } });
      return res.data;
    },
    keepPreviousData: true,
  });
}
