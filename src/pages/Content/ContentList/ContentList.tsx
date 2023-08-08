import { APIListParams } from '@app/src/apis';
import { ContentAPIResponse, deleteContent, getContent, putContent } from '@app/src/apis/content';
import { useContentsQuery } from '@app/src/apis/content/useContentsQuery';
import {
  DevicesAPIDeviceResult,
  sendCategoryToDevice,
  sendContentToDevice,
} from '@app/src/apis/device';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { DeviceSelection } from '@app/src/components/Selection/DeviceSelection';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faCheck, faPaperPlane } from '@fortawesome/pro-solid-svg-icons';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { ContentDialog } from '../ContentDialog/ContentDialog';
import * as S from './ContentList.style';
import { debounce } from '@app/src/utils';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  sort: '-updateDate',
  order: 'DESC',
  filter: [],
  q: '',
  // filterMode: 'AND',
};

export function ContentList() {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [params, apiActions, contentApi] = useContentsQuery(defaultAPIListParams);

  const openContentDialogForADD = () => {
    modalCtrl.open(<ContentDialog mode='ADD' />);
  };

  const openContentDialogForEdit = (content: ContentAPIResponse) => {
    getContent(content.id)
      .then((content) => modalCtrl.open(<ContentDialog mode='EDIT' content={content} />))
      .catch(() => modalCtrl.open(<Alert text='컨텐츠를 불러오는데 실패하였습니다.' />));
  };

  const openDeleteConfirmDialog = (contentIds: string[]) => {
    if (contentIds.length === 0) {
      modalCtrl.open(<Alert text='컨텐츠를 선택해주세요.' />);
      return;
    }

    modalCtrl.open(
      <Confirm
        text='삭제 하시겠습니까?'
        onConfirmed={() => {
          deleteContent(JSON.stringify(contentIds))
            .then(() => queryClient.invalidateQueries(['contents']))
            .catch(() => modalCtrl.open(<Alert text='컨텐츠 삭제에 실패하였습니다.' />));
        }}
      />
    );
  };

  const onSelectAllClick = () => {
    setSelectedContentIds((prev) => {
      if (prev.length === contentApi.data.data.length) return [];
      return contentApi.data.data.map((content) => content.id);
    });
  };

  const selectContent = (contentId: string) => {
    if (selectedContentIds.includes(contentId)) {
      setSelectedContentIds((prev) => prev.filter((selectedId) => selectedId !== contentId));
    } else {
      /**
       * Asset을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // setSelectedContent([contentId]);
      /**
       * Asset을 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      setSelectedContentIds((prev) => [...prev, contentId]);
    }
  };

  const onReloadClick = () => {
    contentApi.refetch();
    setSelectedContentIds([]);
  };

  const onSendClick = (targetContent: ContentAPIResponse) => {
    modalCtrl.open(
      <DeviceSelection
        onSelect={async (devices: DevicesAPIDeviceResult[]) => {
          try {
            const content = await getContent(targetContent.id);
            const deviceObjectWithIds = devices.map((device) => ({ deviceId: device.id }));
            const deviceIds = devices.map((device) => device.id);
            await putContent({ ...content, playingDevices: deviceObjectWithIds }, content.id);
            await sendCategoryToDevice([], deviceIds, {
              id: content.categoryId,
              name: content.category,
              groups: [],
              ids: deviceIds.length === 0 ? deviceIds[0] : deviceIds,
              type: 'CATEGORYMANAGEMENT',
              option: 'ADD',
              cmd: 'EXECUTE',
            });
            await sendContentToDevice([], deviceIds, {
              id: content.id,
              name: content.name,
              category: {
                id: content.categoryId,
                name: content.category,
              },
              option: 'ADD',
              type: 'CONTENTMANAGEMENT',
            });
          } catch (error) {
            modalCtrl.open(<Alert text='컨탠츠 전송에 실패하였습니다.' />);
          }
        }}
      />
    );
  };

  return (
    <Page.Container>
      <Page.Title>생활정보 관리</Page.Title>
      <Page.Actions>
        <Page.ActionButton onClick={openContentDialogForADD}>
          <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
          &nbsp; 새로만들기
        </Page.ActionButton>
        {/* <Page.ActionButton onClick={onSelectAllClick}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; 전체선택
        </Page.ActionButton> */}
        <Page.ActionButton onClick={() => openDeleteConfirmDialog(selectedContentIds)}>
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 선택삭제
        </Page.ActionButton>
        <Page.ActionButton onClick={onReloadClick}>
          <FontAwesomeIcon icon={faSyncAlt} />
          &nbsp; 새로고침
        </Page.ActionButton>
        <Page.ActionSelect
          color='secondary'
          value={params.perPage}
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
          // onChange={(e) => setSearchText(e.target.value)}
          onChange={debounce(apiActions.onQueryChange, 300)}
        />
      </Page.Actions>
      <Page.Table>
        <Page.THead>
          <Page.Tr sx={S.CategoryListGrid}>
            <Page.Th>{t('app-Content.name')}</Page.Th>
            <Page.Th>{t('app-Content.owner')}</Page.Th>
            <Page.Th>{t('app-Content.category')}</Page.Th>
            <Page.Th>개시기간</Page.Th>
            <Page.Th>{t('app-Content.updateDate')}</Page.Th>
            <Page.Th>{t('app-Category.action')}</Page.Th>
          </Page.Tr>
        </Page.THead>
        <Page.TBody>
          {contentApi.data.data
            .filter((content) => content.name.includes(searchText))
            .map((content) => {
              const isEndedContent = dayjs(content.endDate).diff(dayjs(), 'minute') <= 0;

              return (
                <Page.TBodyTr
                  sx={S.CategoryListGrid}
                  key={content.id}
                  onClick={() => selectContent(content.id)}
                  selected={selectedContentIds.includes(content.id)}
                  onDoubleClick={() => openContentDialogForEdit(content)}
                >
                  <Page.Td>{content.name}</Page.Td>
                  <Page.Td>{content.owner ? content.owner.displayName : 'None'}</Page.Td>
                  <Page.Td>{content.category}</Page.Td>
                  <Page.Td style={{ color: isEndedContent ? '#ff0000' : null }}>
                    {dayjs(content.startDate).format('YYYY-MM-DD. HH:mm')} ~{' '}
                    {dayjs(content.endDate).format('YYYY-MM-DD. HH:mm')}
                  </Page.Td>
                  <Page.Td>{dayjs(content.updatedDate).format('YYYY-MM-DD. HH:mm')}</Page.Td>

                  <Page.Td>
                    <Page.TdActions>
                      <Page.FunctionButton onClick={() => onSendClick(content)}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </Page.FunctionButton>
                      <Page.FunctionButton onClick={() => openContentDialogForEdit(content)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Page.FunctionButton>
                      <Page.FunctionButton onClick={() => openDeleteConfirmDialog([content.id])}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Page.FunctionButton>
                    </Page.TdActions>
                  </Page.Td>
                </Page.TBodyTr>
              );
            })}
        </Page.TBody>
      </Page.Table>
      <Pagination paginationInfo={contentApi.data.pages} onPageChange={apiActions.changePage} />
    </Page.Container>
  );
}
