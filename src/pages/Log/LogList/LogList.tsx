import { APIList, APIListParams, DEFAULT_API_RES } from '@app/src/apis';
import { apiSystemLogs, apiTransmissionLogs, deleteLog } from '@app/src/apis/log';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import * as Page2 from '@app/src/components/Page2.style';
import * as DataTable from '@app/src/components/DataTable.style';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { SelectChangeEvent } from '@mui/material';
import * as S from './LogList.style';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from '@app/src/components/Pagination';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { Alert } from '@app/src/components/Alert';
import { useModal } from '@app/src/hooks/useModal';
import { Confirm } from '@app/src/components/Confirm';
import { faTrash } from '@fortawesome/pro-regular-svg-icons/faTrash';
import { css } from '@emotion/react';
import type { LogAPILogResponse } from '@app/src/apis/log/logApi.model';
import successImg from '@app/resources/icons/online.svg';
import failImg from '@app/resources/icons/offline.svg';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  order: 'DESC',
  sort: `-updateDate`,
  filter: [],
  q: '',
};

export function LogList() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState<string>('');
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [apiListParams, apiActions] = useTypeSafeReducer(defaultAPIListParams, {
    onPageChange: (state, page: number) => {
      state.page = page;
    },
    onPerPageChange: (state, e: SelectChangeEvent) => {
      state.perPage = Number(e.target.value);
    },
  });

  const logApi = useQuery({
    queryKey: ['transmissionLogs'],
    queryFn: () => apiTransmissionLogs(apiListParams),
    initialData: DEFAULT_API_RES as APIList<LogAPILogResponse>,
  });

  const openDeleteConfirmDialog = (logId: string) => {
    if (logId.length === 0) {
      modalCtrl.open(<Alert text='삭제할 로그를 선택해주세요.' />);
      return;
    }

    modalCtrl.open(
      <Confirm
        text='삭제 하시겠습니까?'
        onConfirmed={() => {
          deleteLog(logId)
            .then(() => logApi.refetch())
            // .then(() => queryClient.invalidateQueries(['transmissionLogs']))
            .catch(() => modalCtrl.open(<Alert text='컨텐츠 삭제에 실패하였습니다.' />));
        }}
      />
    );
  };

  const onSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  console.log('logApi: ', logApi.data.data);
  return (
    <Page2.Container>
      <Page.Title>시스템 로그</Page.Title>
      <Page.Actions
        css={css`
          margin-top: 32px;
        `}
      >
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
      <Page2.ContentWrapper>
        <DataTable.Table>
          <DataTable.THead>
            <DataTable.THeadTr sx={S.LogListGrid}>
              <DataTable.Th>{t('app-logs.contentName')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.contentType')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.categoryName')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.deviceName')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.requestUser')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.startDate')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.endDate')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.createDate')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.cmd')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.success')}</DataTable.Th>
              <DataTable.Th>{t('app-logs.action')}</DataTable.Th>
            </DataTable.THeadTr>
          </DataTable.THead>
          <DataTable.TBody>
            {logApi.data.data
              .filter((log) => log.contentName?.includes(searchText))
              .map((log) => (
                <DataTable.TBodyTr
                  key={log._id}
                  sx={S.LogListGrid}
                  css={css`
                    border-bottom: none;
                    cursor: auto;
                  `}
                >
                  <DataTable.Td>{log?.contentName}</DataTable.Td>
                  <DataTable.Td>{log?.type}</DataTable.Td>
                  <DataTable.Td>{log?.categoryName}</DataTable.Td>
                  <DataTable.Td>{log?.deviceName}</DataTable.Td>
                  <DataTable.Td>{log?.requestUser}</DataTable.Td>
                  <DataTable.Td>{dayjs(log?.startDate).format('YYYY-MM-DD hh:mm')}</DataTable.Td>
                  <DataTable.Td>{dayjs(log?.endDate).format('YYYY-MM-DD hh:mm')}</DataTable.Td>
                  <DataTable.Td>{dayjs(log?.createDate).format('YYYY-MM-DD hh:mm')}</DataTable.Td>
                  <DataTable.Td>{log?.cmd}</DataTable.Td>
                  <DataTable.Td>
                    <S.Status src={log?.isSuccess === 'true' ? successImg : failImg} />
                  </DataTable.Td>
                  <DataTable.Td>
                    <Page.FunctionButton onClick={() => openDeleteConfirmDialog(log.id)}>
                      <FontAwesomeIcon icon={faTrash} color='#e85050' />
                    </Page.FunctionButton>
                  </DataTable.Td>
                </DataTable.TBodyTr>
              ))}
          </DataTable.TBody>
        </DataTable.Table>
        <Pagination paginationInfo={logApi.data.pages} onPageChange={apiActions.onPageChange} />
      </Page2.ContentWrapper>
    </Page2.Container>
  );
}
