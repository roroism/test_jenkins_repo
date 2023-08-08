/**
 * @author 2022-11-22 Jongho <devfrank9@gmail.com>
 * @description ShopList Hook
 * Shop에서 사용하는 list data의 로직을 관리합니다.
 * 파라미터로 받은 searchValue를 기준으로 api 파라미터를 다르게 설정합니다.
 * 데이터리스트, 페이지네이션, 검색, 필터, 정렬, 로딩, 에러를 관리합니다.
 * @param {string} searchString
 * @returns {ShopListHook}
 */

import { IResponse } from '@app/src/apis/shop/module';
import { useEffect, useState } from 'react';
import { apiPresentationFetcher, multiSearchApiPresentationFetcher } from '../apis/presentation';

export const useShopList = (queryString?: string) => {
  const [presentaion, setPresentation] = useState<IResponse>({} as IResponse); // 데이터 리스트
  const [status, setStatus] = useState('IDLE'); // 로딩 상태
  const [pageNubmer, setPageNumber] = useState(1); // 페이지네이션 번호
  const [perPage, setPerPage] = useState(18); // 페이지네이션 갯수

  useEffect(() => {
    refetch();
  }, []);

  // 페이지네이션 갯수 변경시 실행
  useEffect(() => {
    refetch();
  }, [perPage]);

  // 페이지네이션 번호 변경시 실행
  useEffect(() => {
    refetch();
  }, [pageNubmer]);

  const refetch = () => {
    // 검색어 없는 경우
    if (queryString === undefined || queryString === '') {
      setStatus('LOADING');
      //multiSearchApiPresentationFetcher('', 1, '', 0, 10000, 20, 20) 이건 서버에서 밑에는 몽고디비에서 가져올때
      apiPresentationFetcher({
        order: 'DESC',
        page: pageNubmer,
        perPage: perPage,
        filter: [{ key: 'isSystem', operator: '=', value: 'true' }],
        sort: '-updateDate',
      })
        .then((res) => setPresentation(res.data))
        .then(() => setStatus('IDLE'));

      // 검색어 있는 경우
    } else {
      setStatus('LOADING');
      apiPresentationFetcher({
        order: 'DESC',
        page: pageNubmer,
        perPage: perPage,
        filter: [{ key: 'isSystem', operator: '=', value: 'true' }],
        sort: '-updateDate',
        q: queryString,
      })
        .then((res) => setPresentation(res.data))
        .then(() => setStatus('IDLE'));
    }
  };

  return {
    data: presentaion,
    status,
    setPerPage,
    setPageNumber,
    perPage,
    refetch,
  };
};
