import { APIList, APIListParams, DEFAULT_API_RES } from '@app/src/apis';
import { apiSystemLogs } from '@app/src/apis/log';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { SelectChangeEvent } from '@mui/material';
import * as S from '../LogList/LogList.style';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from '@app/src/components/Pagination';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  order: 'DESC',
  sort: `-updateDate`,
  filter: [],
  q: '',
};

export function TransmissionLogList() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>('');
  const [apiListParams, apiActions] = useTypeSafeReducer(defaultAPIListParams, {
    onPageChange: (state, page: number) => {
      state.page = page;
    },
    onPerPageChange: (state, e: SelectChangeEvent) => {
      state.perPage = Number(e.target.value);
    },
  });

  const logApi = useQuery({
    queryKey: ['systemLogs'],
    queryFn: () => apiSystemLogs(apiListParams),
    initialData: DEFAULT_API_RES as APIList<any>,
  });

  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <Page.Container>
      <Page.Title>전송 로그</Page.Title>
      <Page.Actions>
        <Page.ActionButton onClick={() => logApi.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} color='hsl(0, 0%, 30%)' />
          &nbsp; 새로고침
        </Page.ActionButton>
        <Page.ActionSelect
          color='secondary'
          value={apiListParams.perPage}
          onChange={apiActions.onPerPageChange}
        >
          <Form.Option value={10}>10</Form.Option>
          <Form.Option value={20}>20</Form.Option>
          <Form.Option value={30}>30</Form.Option>
          <Form.Option value={40}>40</Form.Option>
          <Form.Option value={50}>50</Form.Option>
        </Page.ActionSelect>
        <Page.SearchInput
          type='textbox'
          placeholder={t('app-common.search')}
          value={searchText}
          onChange={onSearchTextChange}
        />
      </Page.Actions>
      <Page.Table>
        <Page.THead>
          <Page.Tr sx={S.LogListGrid}>
            <Page.Th>{t('app-logs.userId')}</Page.Th>
            <Page.Th>{t('app-logs.userName')}</Page.Th>
            <Page.Th>{t('app-logs.ip')}</Page.Th>
            <Page.Th>{t('app-logs.comment')}</Page.Th>
            <Page.Th>{t('app-logs.timeStamp')}</Page.Th>
          </Page.Tr>
        </Page.THead>
        <Page.TBody>
          {logApi.data.data
            .filter((log) => log.logInfo.comment.includes(searchText))
            .map((log) => (
              <Page.Tr key={log._id} sx={S.LogListGrid}>
                <Page.Td>{log.logInfo.userId || ''}</Page.Td>
                <Page.Td>{log.logInfo.userName || ''}</Page.Td>
                <Page.Td>{log.logInfo.ip}</Page.Td>
                <Page.Td>{log.logInfo.comment}</Page.Td>
                <Page.Td>{dayjs(log.updateDate).format('YYYY-MM-DD. hh:mm')}</Page.Td>
              </Page.Tr>
            ))}
        </Page.TBody>
      </Page.Table>
      <Pagination paginationInfo={logApi.data.pages} onPageChange={apiActions.onPageChange} />
    </Page.Container>
  );
}
