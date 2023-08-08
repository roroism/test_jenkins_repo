import { APIListParams } from '@app/src/apis';
import { useAPIListParam } from '@app/src/apis/useAPIListParam';
import { useWidgetBases } from '@app/src/apis/widget/useWidgetBases';
import { getWidgetBase } from '@app/src/apis/widget/widgetApi';
import { WidgetBase } from '@app/src/apis/widget/widgetApi.model';
import { Alert } from '@app/src/components/Alert';
import { GeneralWidgetDialog } from '@app/src/components/GeneralWidgetDialog';
import * as Layout from '@app/src/components/Layout.style';
import { Loading } from '@app/src/components/Loading';
import { Pagination } from '@app/src/components/Pagination';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { useMuiSafeMenu } from '@app/src/hooks/useMuiSafeMenu';
import { selectToken } from '@app/src/store/slices/authSlice';
import { debounce } from '@app/src/utils';
import {
  faBars,
  faCheck,
  faListOl,
  faSortAlphaDown,
  faSortAlphaUp,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ImageList, ImageListItem, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { PanelProps } from '../../../PanelTab';
import * as S from '../../../PanelTab.style';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 20,
  order: 'DESC',
  sort: '-updatedDate',
  filter: [],
  q: '',
};

export function WidgetBaseSubPanel(props: PanelProps) {
  const { open } = props;

  const authToken = useSelector(selectToken());
  const modalCtrl = useModal();
  const sortMenu = useMuiSafeMenu();
  const perPageMenu = useMuiSafeMenu();
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);
  const api = useWidgetBases(defaultAPIListParams);

  const onWidgetBaseSelect = (widgetBase: WidgetBase) => {
    const modalId = modalCtrl.open(<Loading />);
    getWidgetBase(widgetBase.id)
      .then((widget) => modalCtrl.open(<GeneralWidgetDialog mode='ADD' widget={widget} />))
      .catch(() => modalCtrl.open(<Alert text='기본 위젯을 불러오는데 실패하였습니다.' />))
      .finally(() => modalCtrl.close(modalId));
  };

  return (
    <S.SubPanel open={open}>
      <S.SearchBox>
        <S.SearchInput
          defaultValue={params.q}
          onChange={debounce(apiActions.onQueryChange, 300)}
          placeholder='Asset의 이름을 입력해주세요.'
        />
        <S.SearchOptionButton {...perPageMenu.triggerProps}>
          <FontAwesomeIcon icon={faListOl} />
        </S.SearchOptionButton>
        <Menu {...perPageMenu.popperProps}>
          <MenuItem onClick={() => apiActions.changePerPage(10)} sx={{ fontSize: 12 }}>
            {params.perPage === 10 ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;10
          </MenuItem>
          <MenuItem onClick={() => apiActions.changePerPage(20)} sx={{ fontSize: 12 }}>
            {params.perPage === 20 ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;20
          </MenuItem>
          <MenuItem onClick={() => apiActions.changePerPage(30)} sx={{ fontSize: 12 }}>
            {params.perPage === 30 ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;30
          </MenuItem>
          <MenuItem onClick={() => apiActions.changePerPage(40)} sx={{ fontSize: 12 }}>
            {params.perPage === 40 ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;40
          </MenuItem>
        </Menu>
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
        <ImageList cols={3} variant='masonry'>
          {api.data.data.map((widgetBase) => (
            <ImageListItem
              key={widgetBase._id}
              sx={{ cursor: 'pointer' }}
              onDoubleClick={() => onWidgetBaseSelect(widgetBase)}
            >
              <img
                crossOrigin='anonymous'
                style={{ borderRadius: 5 }}
                src={config.EXTERNAL.CUBLICK.WIDGET.THUMBNAIL(widgetBase.id, authToken)}
                alt={widgetBase.name.ko}
                draggable={false}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Layout.Box>
      <Pagination paginationInfo={api.data.pages} onPageChange={apiActions.changePage} />
    </S.SubPanel>
  );
}
