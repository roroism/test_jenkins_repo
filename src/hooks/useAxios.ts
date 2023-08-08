import { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';

type AxiosFetcher<T = any> = (...args: any) => Promise<AxiosResponse<T, any>>;
type AxiosData<T extends AxiosFetcher> = Awaited<ReturnType<T>>['data'];
type AxiosSuccessCallback<T extends AxiosFetcher> = (data: AxiosData<T>) => void;
type AxiosErrorCallback = (error: AxiosError<any>) => void;

/**
 * fetcher의 형태
 * @param args fetcher의 인자
 * @returns fetcher의 결과
 * @example
 * async function signInFetcher(credential: AuthAPISignInParams) {
 *   const url = config.EXTERNAL.CUBLICK.AUTH.SIGN_IN;
 *   const body = credential;
 *   return axios.post<AuthAPISignInResponse>(url, body);
 * }
 * @warning fetcher의 결과는 Promise<AxiosResponse<T, any>> 형태여야 한다.
 */

/**
 * axios를 사용해서 api를 호출할 때 사용하는 hook.
 * 단순히 state의 관리를 편리하게 하기 위해서만 사용되어진다. 그러므로 api 호출에 대한 로직은 따로 작성해야 한다.
 * @author OH_jimin 20220918
 * @param fetcher 실제로 api를 호출하는 함수
 * @param initialData 초기 data 값
 * @return api통신과 관련된 state와 함수들을 반환
 * @deprecated useQuery를 사용하자.
 */
export function useAxios<T extends AxiosFetcher>(fetcher: T, initialData?: AxiosData<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<'LOADING' | 'ERROR' | 'SUCCESS' | 'IDLE'>('IDLE');
  const [data, setData] = useState<AxiosData<T>>(initialData);
  const [error, setError] = useState<AxiosError<any>>(null);
  const onSuccessCallback = useRef<AxiosSuccessCallback<T>>(null);
  const onErrorCallback = useRef<AxiosErrorCallback>(null);
  const isMounted = useRef(false);

  const call = async (...args: Parameters<T>) => {
    setIsLoading(true);
    setState('LOADING');

    fetcher(...args)
      .then((res) => {
        setData(res.data);
        setState('SUCCESS');
      })
      .catch((err) => {
        setError(err as AxiosError<any>);
        setState('ERROR');
      })
      .finally(() => {
        setIsLoading(false);
        setState('IDLE');
      });
  };

  const onSuccess = (callback: AxiosSuccessCallback<T>) => {
    onSuccessCallback.current = callback;
  };

  const onError = (callback: AxiosErrorCallback) => {
    onErrorCallback.current = callback;
  };

  useEffect(() => {
    if (!isMounted.current) return;
    onSuccessCallback.current?.(data);
  }, [data]);

  useEffect(() => {
    if (!isMounted.current) return;
    onErrorCallback.current?.(error);
  }, [error]);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  return { data, isLoading, error, state, call, onSuccess, onError, setData };
}
