import { APIListParams } from '@app/src/apis';
import { Asset, deleteAsset, putAsset } from '@app/src/apis/assets';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import { Info } from '@app/src/components/Info';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { AssetPreview } from '@app/src/components/Preview/AssetPreview';
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
  faFile,
  faImage,
  faInfoCircle,
  faMusic,
  faPaperPlane,
  faSortAlphaDown,
  faSortAlphaUp,
  faVideo,
} from '@fortawesome/pro-solid-svg-icons';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Tooltip, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AssetDialog } from './AssetDialog';
import { AssetUploadDialog } from './AssetUploadDialog';
import { AssetSendDialog } from './AssetSendDialog';
import { handleImages } from '@app/src/imageHandler';
import { getData, initDB, tableInit } from '@app/src/components/Image/IndexedDb';
import { Image2 } from '@app/src/components/Image/Image2';
import PerPageSelect from '@app/src/components/PerPageSelect/PerPageSelect';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 40,
  order: 'DESC',
  sort: '-updateDate',
  filter: [
    { key: 'isSystem', operator: '=', value: 'true' },
    { key: 'isPrivate', operator: '=', value: 'false' },
    { key: 'owner', operator: '=', value: 'mine' },
  ],
  q: '',
  filterMode: 'AND',
};

export function AssetList() {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const authToken = useSelector(selectToken());
  const userRight = useSelector(selectUserDataByKey('userRight'));
  const queryClient = useQueryClient();
  const sortMenu = useMuiSafeMenu();
  const mimeTypeMenu = useMuiSafeMenu();
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [params, apiActions, api] = useAssets(defaultAPIListParams);
  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [images, setImages] = useState([]);

  // declare this async method
  const columnsInititialization: tableInit = {
    keypath: 'url',
    columns: [{ name: 'images', path: 'images', options: { unique: false } }],
  };

  useEffect(() => {
    const init = async () => {
      await initDB('cublick', 'assets', columnsInititialization).then((res) => {
        setDbReady(res);
        console.log(res);
        return res;
      });
    };
    console.log(init());
  }, []);

  const getImages = async (urls) => {
    urls.map((i) => {});
  };

  const selectAsset = (asset: Asset) => {
    setSelectedAssets((prev) => {
      const index = prev.findIndex((prevAsset) => prevAsset._id === asset._id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * Asset을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [asset];
      /**
       * Asset을 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [...prev, asset];
    });
  };
  // useEffect(() => {
  //   queryClient.invalidateQueries(['assets']);
  // }, [selectedAssets[0]?.moods[0]?.moodName, selectedAssets[0]?.styles[0]?.styleName]);

  const deselectAsset = () => {
    setSelectedAssets([]);
  };

  const onSelectAllClick = () => {
    setSelectedAssets((prev) => {
      if (prev.length === api.data.data.length) return [];
      return api.data.data;
    });
  };

  const openAssetUploadDialog = () => {
    modalCtrl.open(<AssetUploadDialog />);
  };

  const openAssetDeleteConfirmDialog = (assetIds: string[]) => {
    if (assetIds.length === 0) {
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
            assetIds.map((id) => deleteAsset(id).catch(() => (hasFailure = true)))
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
           */
          if (api.data.data?.length === 1 && params?.page !== 1) {
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

  const openAssetPreviewDialog = (asset: Asset) => {
    modalCtrl.open(<AssetPreview asset={asset} />);
  };

  const onPreviewClick = () => {
    if (selectedAssets.length === 0) {
      modalCtrl.open(<Alert text='크게 볼 자료를 선택해주세요.' />);
      return;
    }
    if (selectedAssets.length > 1) {
      modalCtrl.open(<Alert text='크게 볼 자료는 하나만 선택해주세요.' />);
      return;
    }

    openAssetPreviewDialog(selectedAssets[0]);
  };

  const requestSignIt = async () => {
    if (selectedAssets.length === 0) {
      modalCtrl.open(<Alert text='업로드 할 자료를 선택해주세요.' />);
      return;
    }
    if (selectedAssets.length > 1) {
      modalCtrl.open(<Alert text='업로드 할 자료는 하나만 선택해주세요.' />);
      return;
    }

    modalCtrl.open(
      <Confirm
        text='해당 자료를 에셋스토어에 업로드하시겠습니까?'
        onConfirmed={() => {
          putAsset(selectedAssets[0].id, { isSystem: false }) //두번째 파라미터: 변경돼야 할 부분
            .then(() => {
              modalCtrl.open(<Info text='승인요청을 보냈습니다.' />);
              queryClient.invalidateQueries(['assets']);
              console.log('aaaaa', selectedAssets[0].isSystem);
            })
            .catch(() => {
              modalCtrl.open(<Info text='승인요청에 실패했습니다.' />);
            });
        }}
      />
    );
    console.log('dqwdqsedwaeasqq', selectedAssets[0].moods[0].moodName);
    console.log('dqwdqsedwaeasqq', selectedAssets[0].styles[0].styleName);
  };

  const sendToDevice = () => {
    if (selectedAssets.length === 0) {
      modalCtrl.open(<Alert text='전송할 자료를 선택해주세요.' />);
      return;
    }
    if (selectedAssets.length > 1) {
      modalCtrl.open(<Alert text='전송할 자료는 하나만 선택해주세요.' />);
      return;
    }

    modalCtrl.open(<AssetSendDialog asset={selectedAssets[0]} />);
  };

  const selectedAssetsIds = selectedAssets.map((asset) => asset._id);
  const mimeTypeFilterValue = params.filter.find((filter) => filter.key === 'mimeType')?.value;

  return (
    <Page.Container>
      <Page.Title>{t('app-common.asset')}</Page.Title>
      <Page.Actions>
        <Page.ActionButton onClick={openAssetUploadDialog}>
          <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
          &nbsp; 자료추가
        </Page.ActionButton>
        {/* <Page.ActionButton onClick={onSelectAllClick}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; 전체선택
        </Page.ActionButton> */}
        <Page.ActionButton onClick={() => openAssetDeleteConfirmDialog(selectedAssetsIds)}>
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 선택삭제
        </Page.ActionButton>
        <Page.ActionButton onClick={onPreviewClick}>
          <FontAwesomeIcon icon={faDesktop} />
          &nbsp; 크게보기
        </Page.ActionButton>
        <Page.ActionButton onClick={sendToDevice}>
          <FontAwesomeIcon icon={faPaperPlane} />
          &nbsp; 전송하기
        </Page.ActionButton>
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
        <Tooltip title={<Typography>자료유형</Typography>} placement='top'>
          <Page.ActionButton {...mimeTypeMenu.triggerProps}>
            {mimeTypeFilterValue === 'IMAGE' ? (
              <>
                <FontAwesomeIcon icon={faImage} />
                &nbsp;이미지를
              </>
            ) : null}
            {mimeTypeFilterValue === 'VIDEO' ? (
              <>
                <FontAwesomeIcon icon={faVideo} />
                &nbsp;동영상을
              </>
            ) : null}
            {mimeTypeFilterValue === 'AUDIO' ? (
              <>
                <FontAwesomeIcon icon={faMusic} />
                &nbsp;오디오를
              </>
            ) : null}
            {!mimeTypeFilterValue ? (
              <>
                <FontAwesomeIcon icon={faFile} />
                &nbsp;모든 자료를
              </>
            ) : null}
          </Page.ActionButton>
        </Tooltip>
        <Menu {...mimeTypeMenu.popperProps}>
          <Page.MenuItem onClick={() => apiActions.setMimeType('ALL')}>
            {!mimeTypeFilterValue ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp; 전체
          </Page.MenuItem>
          <Page.MenuItem onClick={() => apiActions.setMimeType('IMAGE')}>
            {mimeTypeFilterValue === 'IMAGE' ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp; 이미지
          </Page.MenuItem>
          <Page.MenuItem onClick={() => apiActions.setMimeType('VIDEO')}>
            {mimeTypeFilterValue === 'VIDEO' ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp; 비디오
          </Page.MenuItem>
          <Page.MenuItem onClick={() => apiActions.setMimeType('AUDIO')}>
            {mimeTypeFilterValue === 'AUDIO' ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp; 오디오
          </Page.MenuItem>
        </Menu>

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
        {api.data.data.map((asset) => (
          <Page.Thumbnail
            key={asset._id}
            draggable
            onClick={() => selectAsset(asset)}
            selected={selectedAssetsIds.includes(asset._id)}
            onDoubleClick={() => openAssetPreviewDialog(asset)}
          >
            <Page.ThumbnailInfo>
              {asset.name}
              <br />
              {`${asset.width}x${asset.height}`}
              <br />
              {asset.mimeType}
            </Page.ThumbnailInfo>
            <Page.ThumbnailImage
              src={config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(asset.id, authToken)}
            ></Page.ThumbnailImage>
          </Page.Thumbnail>
        ))}
      </Page.ThumbnailGrid>
      <Pagination paginationInfo={api.data.pages} onPageChange={apiActions.changePage} />
    </Page.Container>
  );
}
