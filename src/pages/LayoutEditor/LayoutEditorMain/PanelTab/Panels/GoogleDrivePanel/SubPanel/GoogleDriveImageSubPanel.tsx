import { APIListParams } from '@app/src/apis';
import { Asset } from '@app/src/apis/assets';
import { useAssets } from '@app/src/apis/assets/useAssets';
import * as Layout from '@app/src/components/Layout.style';
import { Pagination } from '@app/src/components/Pagination';
import { useModal } from '@app/src/hooks/useModal';
import { useMuiSafeMenu } from '@app/src/hooks/useMuiSafeMenu';
import { AssetPreview } from '@app/src/components/Preview/AssetPreview';
import { selectToken } from '@app/src/store/slices/authSlice';
import { debounce } from '@app/src/utils';
import { faBars, faCheck, faSortAlphaDown, faSortAlphaUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { PanelProps } from '../../../PanelTab';
import * as S from '../../../PanelTab.style';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 20,
  order: 'DESC',
  sort: '-updatedDate',
  filter: [
    { key: 'mimeType', operator: '=', value: 'IMAGE' },
    { key: 'owner', operator: '=', value: 'mine' },
  ],
  q: '',
};

export function GoogleDriveImageSubPanel(props: PanelProps) {
  const { open, closePanel, canvas } = props;

  const authToken = useSelector(selectToken());
  const modalCtrl = useModal();
  const sortMenu = useMuiSafeMenu();
  const [params, apiActions, assetApi] = useAssets(defaultAPIListParams);

  const openAssetPreviewDialog = (asset: Asset) => {
    modalCtrl.open(<AssetPreview asset={asset} />);
  };

  const startDrag = (e: React.DragEvent<HTMLImageElement>, asset: Asset) => {
    // canvas.onDragStart(
    //   new GoogleDriveImageObject({
    //     element: e.currentTarget,
    //     name: asset.name,
    //     id: asset.id,
    //     fileType: asset.fileType,
    //     md5: asset.md5,
    //     mimeType: asset.mimeType,
    //     alpha: 255,
    //     caption: '',
    //     wrapContent: true,
    //   })
    // );
    closePanel();
  };

  return (
    <S.SubPanel open={open}>
      <S.SearchBox>
        <S.SearchInput
          defaultValue={params.q}
          onChange={debounce(apiActions.onQueryChange, 300)}
          placeholder='Asset의 이름을 입력해주세요.'
        />
        <S.SearchOptionButton {...sortMenu.triggerProps}>
          <FontAwesomeIcon icon={faBars} />
        </S.SearchOptionButton>
        <Menu {...sortMenu.popperProps}>
          <MenuItem onClick={() => apiActions.changeSort('name')} sx={{ fontSize: 12 }}>
            {params.sort.includes('name') ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;이름
          </MenuItem>
          <MenuItem onClick={() => apiActions.changeSort('owner')} sx={{ fontSize: 12 }}>
            {params.sort.includes('owner') ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;소유자
          </MenuItem>
          <MenuItem onClick={() => apiActions.changeSort('updatedDate')} sx={{ fontSize: 12 }}>
            {params.sort.includes('updatedDate') ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;업데이트 날짜
          </MenuItem>
        </Menu>
        <S.SearchOptionButton onClick={apiActions.toggleOrder}>
          {params.order === 'DESC' ? <FontAwesomeIcon icon={faSortAlphaUp} /> : null}
          {params.order === 'ASC' ? <FontAwesomeIcon icon={faSortAlphaDown} /> : null}
        </S.SearchOptionButton>
      </S.SearchBox>
      <Layout.Box flex={1}>
        준비중입니다.
        {/* {!assetApi.isLoading ? (
          <ImageList cols={3} variant='masonry'>
            {assetApi.data.data.map((asset) => (
              <ImageListItem
                key={asset._id}
                sx={{ cursor: 'pointer' }}
                onDoubleClick={() => openAssetPreviewDialog(asset)}
              >
                <img
                  crossOrigin='anonymous'
                  onDragStart={(e) => startDrag(e, asset)}
                  style={{ borderRadius: 5 }}
                  src={config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(asset.id, authToken)}
                  alt={asset.name}
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <S.FaLoading icon={faSpinnerThird} color='#3e70d6' />
        )} */}
      </Layout.Box>
      {/* <Pagination paginationInfo={assetApi.data.pages} onPageChange={apiActions.changePage} /> */}
    </S.SubPanel>
  );
}
