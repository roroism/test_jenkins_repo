import { APIListParams } from '@app/src/apis';
import { deletePresentation } from '@app/src/apis/presentation';
import { PresentationAPIResponse } from '@app/src/apis/presentation/presentationApi.model';
import { usePresentations } from '@app/src/apis/presentation/usePresentations';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import { MultiSearch } from '@app/src/components/MultiSearch/MultiSearch';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { PresentationPreview } from '@app/src/components/Preview/PresentationPreview';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { useMuiSafeMenu } from '@app/src/hooks/useMuiSafeMenu';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { store } from '@app/src/store';
import { selectToken, selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import {
  faBars,
  faCheck,
  faDownload,
  faInfoCircle,
  faListOl,
  faLocation,
  faSmile,
  faSortAlphaDown,
  faSortAlphaUp,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PresentationDialog } from '../Presentation/PresentationDialog';
import { ShopCart } from './ShopCart';
import PerPageSelect from '@app/src/components/PerPageSelect/PerPageSelect';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  order: 'DESC',
  sort: '-updateDate',
  filter: [
    { key: 'isSystem', operator: '=', value: 'true' },
    { key: 'isPrivate', operator: '=', value: 'false' },
  ],
  q: '',
  filterMode: 'AND',
};

export function StorePresentationList() {
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const navigate = useNavigate();

  const authToken = useSelector(selectToken());
  const userRight = useSelector(selectUserDataByKey('userRight'));
  const searchTargetMenu = useMuiSafeMenu();
  const sortMenu = useMuiSafeMenu();
  const perPageMenu = useMuiSafeMenu();
  const isSystemMenu = useMuiSafeMenu();
  const [multiPresentationData, setMultiPresentationData] = useState([]);
  const [cart, setCart] = useState([]);

  const [selectedItems, setSelectedItems] = useState<PresentationAPIResponse[]>([]);
  const selectedItemIds = selectedItems.map((item) => item._id);
  const selectedCartIds = cart.map((item) => item._id);
  const [params, apiActions, api] = usePresentations(defaultAPIListParams);

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
      // return [...prev, Presentation];
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
          api.refetch();
          if (!hasFailure) return;
          modalCtrl.open(<Alert text='삭제에 실패한 자료가 존재합니다.' />);
        }}
      />
    );
  };

  const onSelectAllClick = () => {
    setSelectedItems((prev) => {
      if (prev.length === api.data.data.length) return [];
      return api.data.data;
    });
  };

  const gotoCart = () => {
    modalCtrl.open(<ShopCart cartItem={cart} />);
  };

  const addCartItem = () => {
    // console.log('카트에 담긴', cart);
    // console.log('cartttttttttttt', cart[0]?._id);
    // console.log('selectedItemmmmmmmmmm', selectedItems[0]._id);
    if (cart.filter((item) => item._id === selectedItems[0]._id).length !== 0) {
      return;
    } else {
      setCart((prev) => [...prev, selectedItems[0]]);
    }
  };
  const removeCartItem = () => {
    if (cart.filter((item) => item._id === selectedItems[0]._id).length !== 0) {
      setCart(cart.filter((item) => item._id !== selectedItems[0]._id));
    }
  };

  const openPreview = (item: PresentationAPIResponse) => {
    modalCtrl.open(<PresentationPreview presentationId={item.id} />);
  };

  const onPreviewClick = () => {
    if (selectedItems.length === 0) {
      modalCtrl.open(<Alert text='크게 볼 프레젠테이션을 선택해주세요.' />);
      return;
    }
    if (selectedItems.length > 1) {
      modalCtrl.open(<Alert text='크게 볼 프레젠테이션은 하나만 선택해주세요.' />);
      return;
    }

    openPreview(selectedItems[0]);
  };

  const openPresentationDialog = () => {
    if (selectedItems.length === 0) {
      modalCtrl.open(<Alert text='상세히 볼 프레전테이션을 선택해주세요.' />);
      return;
    }
    if (selectedItems.length > 1) {
      modalCtrl.open(<Alert text='상세히 볼 프레젠테이션을 하나만 선택해주세요.' />);
      return;
    }
    modalCtrl.open(<PresentationDialog presentation={selectedItems[0]} />);
  };

  const makeItOwn = () => {
    if (selectedItems.length === 0) {
      modalCtrl.open(<Alert text='내것으로 만들 프레전테이션을 선택해주세요.' />);
      return;
    }
    if (selectedItems.length > 1) {
      modalCtrl.open(<Alert text='내것으로 만들 프레젠테이션을 하나만 선택해주세요.' />);
      return;
    }

    navigate(`/layoutEditor/new/${selectedItems[0]._id}`);
  };

  const isSystemFilterValue = params.filter.find((filter) => filter.key === 'isSystem')?.value;

  //-------------------------다면검색 관련 ---------------------------
  const multiSearchApply = async (
    bigCategory,
    middleCategory,
    minPrice,
    maxPrice,
    mood,
    minLike,
    maxLike,
    style,
    sort,
    page
  ) => {
    // const uri = config.EXTERNAL.CUBLICK.PRESENTATION.STOREPRE;
    // const ngrokRes = await axios.get(uri, {
    //   headers: { 'X-Access-Token': store.getState().appAuth.token },
    // });
    // const res = await axios.post(`${ngrokRes.data.ngrokAddress}/category_search`, {
    const res = await axios.post(`http://192.168.0.28:3000/category_search`, {
      main: bigCategory,
      page: page,
      middle: middleCategory,
      price: [minPrice, maxPrice],
      moods: mood,
      likes: [minLike, maxLike],
      styles: style,
      sort: sort,
      perPage: 20,
      isSystem: isSystemFilterValue,
    });
    console.log(res);

    const prstArray = [];
    for (const data of res.data.data) {
      await prstArray.push(data);
    }
    setMultiPresentationData(prstArray);
  };

  return (
    <Page.Container>
      <Page.Title>{t('app-common.store')}</Page.Title>
      <Page.Actions>
        <Page.ActionButton onClick={onSelectAllClick}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; 전체선택
        </Page.ActionButton>
        {['ADMIN'].includes(userRight) ? (
          <Page.ActionButton onClick={() => openDeleteConfirmDialog(selectedItemIds)}>
            <FontAwesomeIcon icon={faTrash} />
            &nbsp; 선택삭제
          </Page.ActionButton>
        ) : null}
        <Page.ActionButton onClick={onPreviewClick}>
          <FontAwesomeIcon icon={faDesktop} />
          &nbsp; 크게보기
        </Page.ActionButton>
        <Page.ActionButton onClick={openPresentationDialog}>
          <FontAwesomeIcon icon={faInfoCircle} />
          &nbsp; 상세정보
        </Page.ActionButton>
        <Page.ActionButton onClick={makeItOwn}>
          <FontAwesomeIcon icon={faDownload} />
          &nbsp; 소유하기
        </Page.ActionButton>
        <Page.ActionButton onClick={() => api.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} />
          &nbsp; 새로고침
        </Page.ActionButton>
        {/* <Page.ActionButton onClick={addCartItem}>
          <FontAwesomeIcon icon={faSyncAlt} />
          &nbsp; 카트담기
        </Page.ActionButton>
        <Page.ActionButton onClick={removeCartItem}>
          <FontAwesomeIcon icon={faSyncAlt} />
          &nbsp; 아이템빼기
        </Page.ActionButton>

        <Page.ActionButton onClick={gotoCart}>
          <FontAwesomeIcon icon={faSyncAlt} />
          &nbsp; 카트로이동({cart.length})
        </Page.ActionButton> */}
      </Page.Actions>
      <Page.Actions>
        {['ADMIN'].includes(userRight) ? (
          <>
            <Tooltip title={<Typography>승인여부</Typography>} placement='top'>
              <Page.ActionButton {...isSystemMenu.triggerProps}>
                <FontAwesomeIcon icon={faSmile} />
                &nbsp; {isSystemFilterValue === 'false' ? '비승인된' : '승인된'}
              </Page.ActionButton>
            </Tooltip>
            <Menu {...isSystemMenu.popperProps} onChange={console.log}>
              <Page.MenuItem
                onClick={() =>
                  apiActions.setFilter({ key: 'isSystem', operator: '=', value: 'false' })
                }
              >
                {isSystemFilterValue === 'false' ? <FontAwesomeIcon icon={faCheck} /> : null}
                &nbsp; 비승인된
              </Page.MenuItem>
              <Page.MenuItem
                onClick={() =>
                  apiActions.setFilter({ key: 'isSystem', operator: '=', value: 'true' })
                }
              >
                {isSystemFilterValue === 'true' ? <FontAwesomeIcon icon={faCheck} /> : null}
                &nbsp; 승인된
              </Page.MenuItem>
            </Menu>
          </>
        ) : null}

        <Tooltip title={<Typography>검색대상</Typography>} placement='top'>
          <Page.ActionButton {...searchTargetMenu.triggerProps}>
            <FontAwesomeIcon icon={faLocation} />
            &nbsp; 프레젠테이션을
          </Page.ActionButton>
        </Tooltip>
        <Menu {...searchTargetMenu.popperProps}>
          <Page.MenuItem>
            <FontAwesomeIcon icon={faCheck} />
            &nbsp; 프레젠테이션
          </Page.MenuItem>
          <Page.MenuItem onClick={() => navigate('/store/asset')}>&nbsp; 에셋</Page.MenuItem>
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

      <Page.SemiContainer>
        <MultiSearch multiSearchApply={multiSearchApply} />
        <Page.ThumbnailGrid onClick={() => console.log(multiPresentationData)}>
          {multiPresentationData.map((item) => (
            // {api.data.data.map((item) => (
            <Page.Thumbnail
              key={item._id}
              draggable
              onClick={() => seelectItem(item)}
              selected={selectedItemIds.includes(item._id)}
              inACart={selectedCartIds.includes(item._id)}
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
                src={config.EXTERNAL.CUBLICK.PRESENTATION.THUMBNAIL(item._id, authToken)}
                alt={item.name}
              />
            </Page.Thumbnail>
          ))}
        </Page.ThumbnailGrid>
      </Page.SemiContainer>
      <Pagination paginationInfo={api.data.pages} onPageChange={apiActions.changePage} />
    </Page.Container>
  );
}
