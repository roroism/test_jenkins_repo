import { APIListParams } from '@app/src/apis';
import { APIListParamBuilder } from '@app/src/apis/APIListParamBuilder';
import { Asset, deleteAsset } from '@app/src/apis/assets';
import { useAssets } from '@app/src/apis/assets/useAssets';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { AssetPreview } from '@app/src/components/Preview/AssetPreview';
import { selectToken } from '@app/src/store/slices/authSlice';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/pro-solid-svg-icons/faPlusCircle';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AssetUploadDialog } from '../../../pages/Asset/AssetUploadDialog';

type Props = {
  onSelect: (asset: Asset) => void;
};

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 20,
  order: 'DESC',
  sort: '-updatedDate',
  filter: [
    { key: 'fileType', operator: '!=', value: '.svg' },
    { key: 'owner', operator: '=', value: 'mine' },
  ],
  q: '',
};

export function AssetSelection(props: Props) {
  const { onSelect } = props;

  const { t } = useTranslation();
  const modalCtrl = useModal();
  const authToken = useSelector(selectToken());
  const [searchText, setSearchText] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);

  const [params, apiActions, assetApi] = useAssets(defaultAPIListParams);

  const onSearchTextChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, 300);

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

  const onSelectAllClick = () => {
    setSelectedAssets((prev) => {
      if (prev.length === assetApi.data.data.length) return [];
      return assetApi.data.data;
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
        onConfirmed={() => {
          Promise.all(assetIds.map((assetId) => deleteAsset(assetId))).catch(() => {
            modalCtrl.open(<Alert text='자료 삭제에 실패했습니다.' />);
          });
        }}
      />
    );
  };

  const openAssetPreviewDialog = (asset: Asset) => {
    modalCtrl.open(<AssetPreview asset={asset} />);
  };

  useEffect(() => {
    if (selectedAssets.length === 1) {
      onSelect(selectedAssets[0]);
      return;
    }
    onSelect(null);
  }, [selectedAssets.length]);

  const selectedAssetsIds = selectedAssets.map((asset) => asset._id);
  return (
    <>
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
        <Page.ActionButton onClick={() => assetApi.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} color='hsl(0, 0%, 30%)' />
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
          onChange={onSearchTextChange}
        />
      </Page.Actions>
      <Page.ThumbnailGrid>
        {assetApi.data.data
          .filter((asset) => asset.name.includes(searchText))
          .map((asset) => (
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
                alt={asset.name}
              />
            </Page.Thumbnail>
          ))}
      </Page.ThumbnailGrid>
      <Pagination paginationInfo={assetApi.data.pages} onPageChange={apiActions.changePage} />
    </>
  );
}
