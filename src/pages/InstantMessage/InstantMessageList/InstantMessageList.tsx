import { APIList, APIListParams, DEFAULT_API_RES } from '@app/src/apis';
import {
  apiInstantMessage,
  deleteInstantMessage,
  InstantMessageAPIResponse,
  InstantmessageRequestBody,
} from '@app/src/apis/instantMessage';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import * as Page2 from '@app/src/components/Page2.style';
import { Pagination } from '@app/src/components/Pagination';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
import { faCheck, faListOl } from '@fortawesome/pro-solid-svg-icons';
// import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { faTrash } from '@fortawesome/pro-regular-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import * as S from './InstantMessage.style';
import { InstantMessageDialog } from '@app/src/pages/InstantMessage/InstantMessageDialog';
import { CategoryAPIResponse } from '@app/src/apis/category';
import { DeviceSelection } from '@app/src/components/Selection/DeviceSelection';
import { faPaperPlane } from '@fortawesome/pro-regular-svg-icons';
import { DevicesAPIDeviceResult, sendInstantMessageToDevice } from '@app/src/apis/device';
import * as DataTable from '@app/src/components/DataTable.style';
import { css } from '@emotion/react';
import { useAPIListParam } from '@app/src/apis/useAPIListParam';
import PerPageSelect from '@app/src/components/PerPageSelect/PerPageSelect';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  order: 'DESC',
  sort: '-updatedDate',
};

export function InstantMessageList() {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedIsm, setSelectedIsm] = useState<InstantMessageAPIResponse[]>([]);
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);

  const instantMessageApi = useQuery({
    queryKey: ['instantMessage', params],
    queryFn: () => apiInstantMessage(params),
    initialData: DEFAULT_API_RES as APIList<InstantMessageAPIResponse>,
  });

  const onSearchTextChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, 300);

  const onPageChange = (page: number) => {
    apiActions.changePerPage(page);
  };

  const onPerPageChange = (e: SelectChangeEvent) => {
    apiActions.onPerPageChange(e);
  };

  const selectIsm = (ism: InstantMessageAPIResponse) => {
    setSelectedIsm((prev) => {
      const index = prev.findIndex((prevIsm) => prevIsm.id === ism.id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * Category를 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [category];
      /**
       * Category를 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [...prev, ism];
    });
  };

  const openIsmAddDialog = () => {
    modalCtrl.open(<InstantMessageDialog mode='ADD' />);
  };

  const openIsmEditDialog = (instantMessageId: string) => {
    const instantMessageData = instantMessageApi.data.data.find(
      (message) => message.id === instantMessageId
    );

    modalCtrl.open(
      <InstantMessageDialog
        messageData={instantMessageData}
        instantMessageId={instantMessageId}
        mode='EDIT'
      />
    );
  };

  const onSelectAllClick = () => {
    setSelectedIsm((prev) => {
      if (prev.length === instantMessageApi.data.data.length) return [];
      return instantMessageApi.data.data;
    });
  };
  const openSendDialog = (ism) => {
    console.log('보낸다', ism);
    modalCtrl.open(
      <DeviceSelection
        onSelect={async (devices: DevicesAPIDeviceResult[]) => {
          try {
            const deviceIds = devices.map((device) => device.id);
            await sendInstantMessageToDevice([], deviceIds, {
              name: ism.name,
              playTime: ism.playTime,
              duration: ism.duration,
              type: 'INSTANT_MESSAGE',
              option: 'ADD',
              groups: [],
              ids: deviceIds.length === 0 ? deviceIds[0] : deviceIds,
              cmd: 'EXECUTE',
              data: ism,
            }).then(() => {
              modalCtrl.open(<Confirm text='메세지를 전송했습니다.' />);
            });
          } catch (error) {
            console.log('error', error);
            modalCtrl.open(<Alert text='메세지 전송에 실패하였습니다.' />);
          }
        }}
      />
    );
  };

  const openIsmDeleteCofirm = (ismIds: string[]) => {
    modalCtrl.open(
      <Confirm
        text='삭제 하시겠습니까?'
        onConfirmed={async () => {
          let hasFailure = false;
          for (const ismId of ismIds) {
            try {
              await deleteInstantMessage(ismId);
            } catch (error) {
              hasFailure = true;
            }
          }
          instantMessageApi.refetch();
          if (!hasFailure) return;
          modalCtrl.open(<Alert text='삭제에 실패한 카테고리가 있습니다.' />);
        }}
      />
    );
  };

  const selectedIsmIds = selectedIsm.map((ism) => ism.id);
  return (
    <Page2.Container>
      <Page.Title>인스턴트 메세지</Page.Title>
      <Page.Actions
        css={css`
          margin-top: 32px;
        `}
      >
        <Page.ActionButton onClick={openIsmAddDialog}>
          <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
          &nbsp; 새로만들기
        </Page.ActionButton>

        <Page.ActionButton onClick={onSelectAllClick}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; 전체선택
        </Page.ActionButton>
        <Page.ActionButton onClick={() => openIsmDeleteCofirm(selectedIsmIds)}>
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 선택삭제
        </Page.ActionButton>
        <Page.ActionButton onClick={() => instantMessageApi.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} color='hsl(0, 0%, 30%)' />
          &nbsp; 새로고침
        </Page.ActionButton>
        <PerPageSelect
          selectedN={params.perPage}
          fromToArray={[10, 20, 30, 40]}
          onClick={apiActions.changePerPage}
        />
        <Page.SearchInput
          type='textbox'
          placeholder={t('app-common.search')}
          onChange={onSearchTextChange}
        />
      </Page.Actions>
      <Page2.ContentWrapper>
        <DataTable.Table>
          <DataTable.THead>
            <DataTable.THeadTr sx={S.IsmListGrid}>
              <DataTable.Th>{t('app-instantMessage.title')}</DataTable.Th>
              <DataTable.Th>{t('app-instantMessage.contents')}</DataTable.Th>
              <DataTable.Th>{t('app-instantMessage.owner')}</DataTable.Th>
              <DataTable.Th>{t('app-instantMessage.updateDate')}</DataTable.Th>
              <DataTable.Th>{t('app-Category.action')}</DataTable.Th>
            </DataTable.THeadTr>
          </DataTable.THead>
          <DataTable.TBody>
            {instantMessageApi.data.data
              .filter((ism) => ism.name.includes(searchText))
              .map((ism) => (
                <DataTable.TBodyTr
                  key={ism.id}
                  sx={S.IsmListGrid}
                  onClick={() => selectIsm(ism)}
                  onDoubleClick={() => openIsmEditDialog(ism.id)}
                  selected={selectedIsmIds.includes(ism.id)}
                >
                  <DataTable.Td>{ism.name}</DataTable.Td>
                  <DataTable.Td>{JSON.parse(ism.data).message}</DataTable.Td>
                  <DataTable.Td>{ism.owner.displayName}</DataTable.Td>
                  <DataTable.Td>{dayjs(ism.updatedDate).format('YYYY-MM-DD. HH:mm')}</DataTable.Td>
                  <DataTable.Td>
                    <Page.TdActions>
                      <Page.FunctionButton onClick={() => openSendDialog(ism)}>
                        <S.FontAwesomeIcon icon={faPaperPlane} />
                      </Page.FunctionButton>
                      <Page.FunctionButton onClick={() => openIsmEditDialog(ism.id)}>
                        <FontAwesomeIcon icon={faEdit} color='#3e70d6' />
                      </Page.FunctionButton>
                      <Page.FunctionButton onClick={() => openIsmDeleteCofirm([ism.id])}>
                        <FontAwesomeIcon icon={faTrash} color='#e85050' />
                      </Page.FunctionButton>
                    </Page.TdActions>
                  </DataTable.Td>
                </DataTable.TBodyTr>
              ))}
          </DataTable.TBody>
        </DataTable.Table>
        <Pagination paginationInfo={instantMessageApi.data.pages} onPageChange={onPageChange} />
      </Page2.ContentWrapper>
    </Page2.Container>
  );
}
