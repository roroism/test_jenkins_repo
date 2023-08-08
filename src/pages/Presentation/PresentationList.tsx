import { APIListParams } from '@app/src/apis';
import { deletePresentation, putPresentation } from '@app/src/apis/presentation/presentationApi';
import { PresentationAPIResponse } from '@app/src/apis/presentation/presentationApi.model';
import { usePresentations } from '@app/src/apis/presentation/usePresentations';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import { Info } from '@app/src/components/Info';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { PresentationPreview } from '@app/src/components/Preview/PresentationPreview';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { useMuiSafeMenu } from '@app/src/hooks/useMuiSafeMenu';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { selectToken, selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import {
  faBars,
  faCheck,
  faCloudUpload,
  faDownload,
  faInfoCircle,
  faListOl,
  faPaperPlane,
  faPencilPaintbrush,
  faPlusCircle,
  faSortAlphaDown,
  faSortAlphaUp,
} from '@fortawesome/pro-solid-svg-icons';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Tooltip, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PresentationDialog } from './PresentationDialog';
import { PresentationSendDialog } from './PresentationSendDialog';
import PerPageSelect from '@app/src/components/PerPageSelect/PerPageSelect';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 40,
  order: 'DESC',
  sort: '-updateDate',
  filter: [
    { key: 'isSystem', operator: '=', value: 'false' },
    { key: 'isPrivate', operator: '=', value: 'true' },
  ],
  q: '',
  filterMode: 'AND',
};

export function PresentationList() {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const navigate = useNavigate();

  const authToken = useSelector(selectToken());
  const userRight = useSelector(selectUserDataByKey('userRight'));
  const queryClient = useQueryClient();
  const sortMenu = useMuiSafeMenu();

  const [selectedItems, setSelectedItems] = useState<PresentationAPIResponse[]>([]);
  const selectedItemIds = selectedItems.map((item) => item._id);
  const [params, apiActions, api] = usePresentations(defaultAPIListParams);

  const nothingIsSelected = useMemo(() => {
    return selectedItems.length === 0;
  }, [selectedItems]);
  const multipleSelected = useMemo(() => {
    return selectedItems.length > 1;
  }, [selectedItems]);

  const seelectItem = (presentation: PresentationAPIResponse) => {
    console.log(presentation);
    setSelectedItems((prev) => {
      const index = prev.findIndex(
        (prevPresentations) => prevPresentations._id === presentation._id
      );
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * Presentation을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [presentation];
      /**
       * Presentation을 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [...prev, presentation];
    });
  };

  const onSelectAllClick = () => {
    setSelectedItems((prev) => {
      if (prev.length === api.data.data.length) return [];
      return api.data.data;
    });
  };

  const openDeleteConfirmDialog = (ids: string[]) => {
    if (ids.length === 0) {
      modalCtrl.open(<Alert text='삭제할 자료를 선택해주세요.' />);
      return;
    }
    modalCtrl.open(
      <Confirm
        text='자료를 삭제하시겠습니까?'
        onConfirmed={async () => {
          let hasFailure = false;
          /**
           * 병렬적으로 삭제를 진행하고 싶다면 아래와 같이 사용하면 된다.
           */
          await Promise.allSettled(
            ids.map((id) => deletePresentation(id).catch(() => (hasFailure = true)))
          );
          /**
           * 순차적으로 삭제를 진행하고 싶다면 아래와 같이 사용하면 된다.
           */
          // for (const id of assetIds) {
          //   try {
          //     await deleteAsset(id);
          //   } catch (error) {
          //     hasFailure = true;
          //   }
          // }

          /**
           * 한 페이지안에서 마지막 아이템 삭제하면 이전 페이지로 돌아가기.
           * deleted 요청을 2번 해야 삭제되는 버그가 고쳐지면 위쪽 if 문으로 교체
           */
          // if (api.data.data.length === 1) {
          if (
            api.data.data?.length === 1 &&
            api.data.data[0]?.status === 'DELETED' &&
            params?.page !== 1
          ) {
            // 마지막 아이템 삭제.
            apiActions.changePage(api.data.pages.current - 1);
          } else {
            // 마지막 아이템 삭제가 아님.
            api.refetch();
          }
          // api.refetch();
          if (!hasFailure) return;
          modalCtrl.open(<Alert text='삭제에 실패한 자료가 존재합니다.' />);
        }}
      />
    );
  };

  const openPreview = (item: PresentationAPIResponse) => {
    modalCtrl.open(<PresentationPreview presentation={item} />);
  };

  const onPreviewClick = () => {
    if (nothingIsSelected) {
      modalCtrl.open(<Alert text='크게 볼 프레젠테이션을 선택해주세요.' />);
      return;
    }
    if (multipleSelected) {
      modalCtrl.open(<Alert text='크게 볼 프레젠테이션은 하나만 선택해주세요.' />);
      return;
    }

    openPreview(selectedItems[0]);
  };
  const deselectAsset = () => {
    setSelectedItems([]);
  };
  const onDoDesignClick = () => {
    if (nothingIsSelected) {
      modalCtrl.open(<Alert text='디자인할 프레젠테이션을 선택해주세요.' />);
      return;
    }
    if (multipleSelected) {
      modalCtrl.open(<Alert text='디자인할 프레젠테이션은 하나만 선택해주세요.' />);
      return;
    }

    navigate(`/layoutEditor/${selectedItemIds[0]}`);
  };

  const selectMoreInformation = () => {
    if (nothingIsSelected) {
      modalCtrl.open(<Alert text='전송할 프레젠테이션을 선택해주세요.' />);
      return;
    }
    if (multipleSelected) {
      modalCtrl.open(<Alert text='전송할 프레젠테이션은 하나만 선택해주세요.' />);
      return;
    }
    modalCtrl.open(<PresentationSendDialog presentation={selectedItems[0]} />);
  };

  const gotoEditor = () => {
    navigate('/layoutEditor');
  };

  const openPresentationDialog = async () => {
    if (nothingIsSelected) {
      modalCtrl.open(<Alert text='상세히 볼 프레전테이션을 선택해주세요.' />);
      return;
    }
    if (multipleSelected) {
      modalCtrl.open(<Alert text='상세히 볼 프레젠테이션을 하나만 선택해주세요.' />);
      return;
    }
    modalCtrl.open(<PresentationDialog presentation={selectedItems[0]} />);
    await queryClient.invalidateQueries(['assets']);

    deselectAsset();
  };

  const requestSignIt = async () => {
    if (nothingIsSelected) {
      modalCtrl.open(<Alert text='업로드 할 자료를 선택해주세요.' />);
      return;
    }
    if (multipleSelected) {
      modalCtrl.open(<Alert text='업로드 할 자료는 하나만 선택해주세요.' />);
      return;
    }
    //isSystem: false,
    modalCtrl.open(
      <Confirm
        text='해당 프레젠테이션을 스토어에 업로드하시겠습니까?'
        onConfirmed={() => {
          putPresentation(selectedItems[0].id, { isSystem: false })
            .then(() => {
              modalCtrl.open(<Info text='승인요청을 보냈습니다.' />);
              queryClient.invalidateQueries(['presentations']);
            })
            .catch(() => {
              modalCtrl.open(<Info text='승인요청에 실패했습니다.' />);
            });
        }}
      />
    );
    console.log('dqwdqsedwaeasqq', selectedItems[0].moods[0].moodName);
    console.log('dqwdqsedwaeasqq', selectedItems[0].styles[0].styleName);
  };

  return (
    <Page.Container>
      <Page.Title>{t('app-common.pesentation')}</Page.Title>
      <Page.Actions>
        <Page.ActionButton onClick={gotoEditor}>
          <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
          &nbsp; 새로만들기
        </Page.ActionButton>
        {/* <Page.ActionButton onClick={onSelectAllClick}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; 전체선택
        </Page.ActionButton> */}
        <Page.ActionButton onClick={() => openDeleteConfirmDialog(selectedItemIds)}>
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 선택삭제
        </Page.ActionButton>
        <Page.ActionButton onClick={onPreviewClick}>
          <FontAwesomeIcon icon={faDesktop} />
          &nbsp; 크게보기
        </Page.ActionButton>
        <Page.ActionButton onClick={onDoDesignClick}>
          <FontAwesomeIcon icon={faPencilPaintbrush} />
          &nbsp; 디자인 수정하기
        </Page.ActionButton>
        <Page.ActionButton onClick={selectMoreInformation}>
          <FontAwesomeIcon icon={faPaperPlane} />
          &nbsp; 전송하기
        </Page.ActionButton>
        {/* <Page.ActionButton onClick={openPresentationDialog}>
          <FontAwesomeIcon icon={faInfoCircle} />
          &nbsp; 상세정보
        </Page.ActionButton> */}
        {['MANAGER', 'ADMIN'].includes(userRight) ? (
          <Page.ActionButton onClick={requestSignIt}>
            <FontAwesomeIcon icon={faCloudUpload} />
            &nbsp; 업로드하기
          </Page.ActionButton>
        ) : null}
        <Page.ActionButton onClick={() => api.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} />
          &nbsp; 새로고침
        </Page.ActionButton>
      </Page.Actions>
      <Page.Actions>
        <Tooltip title={<Typography>정렬규칙</Typography>} placement='top'>
          <Page.ActionButton {...sortMenu.triggerProps}>
            <FontAwesomeIcon icon={faBars} />
            &nbsp; {params.sort.includes('name') ? '이름의' : '업데이트 날짜의'}
          </Page.ActionButton>
        </Tooltip>
        <Menu {...sortMenu.popperProps}>
          <Page.MenuItem onClick={() => apiActions.changeSort('name')}>
            {params.sort.includes('name') ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;이름
          </Page.MenuItem>
          <Page.MenuItem onClick={() => apiActions.changeSort('updatedDate')}>
            {params.sort.includes('updatedDate') ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;업데이트 날짜
          </Page.MenuItem>
        </Menu>

        <Tooltip title={<Typography>정렬순서</Typography>} placement='top'>
          <Page.ActionButton onClick={apiActions.toggleOrder}>
            {params.order === 'DESC' ? (
              <>
                <FontAwesomeIcon icon={faSortAlphaUp} />
                &nbsp; 내림차순으로
              </>
            ) : null}
            {params.order === 'ASC' ? (
              <>
                <FontAwesomeIcon icon={faSortAlphaDown} />
                &nbsp; 오름차순으로
              </>
            ) : null}
          </Page.ActionButton>
        </Tooltip>

        <PerPageSelect
          selectedN={params.perPage}
          fromToArray={[10, 20, 30, 40]}
          onClick={apiActions.changePerPage}
        />

        <Page.SearchInput
          type='textbox'
          placeholder={t('app-common.search')}
          onChange={debounce(apiActions.onQueryChange, 300)}
        />
      </Page.Actions>
      <Page.ThumbnailGrid>
        {api.data.data.map((item) => (
          <Page.Thumbnail
            key={item._id}
            draggable
            onClick={() => seelectItem(item)}
            selected={selectedItemIds.includes(item._id)}
            onDoubleClick={() => openPreview(item)}
          >
            <Page.ThumbnailInfo>
              {item.name}
              <br />
              {`${item.width}x${item.height}`}
              <br />
              {item.ratio}
            </Page.ThumbnailInfo>
            <Page.ThumbnailImage
              src={config.EXTERNAL.CUBLICK.PRESENTATION.THUMBNAIL(item.id, authToken)}
              alt={item.name}
            />
          </Page.Thumbnail>
        ))}
      </Page.ThumbnailGrid>
      <Pagination paginationInfo={api.data.pages} onPageChange={apiActions.changePage} />
    </Page.Container>
  );
}
