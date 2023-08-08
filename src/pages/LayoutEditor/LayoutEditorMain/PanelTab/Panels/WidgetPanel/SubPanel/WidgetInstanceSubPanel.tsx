import { APIListParams } from '@app/src/apis';
import { useAPIListParam } from '@app/src/apis/useAPIListParam';
import { useWidgetInstants } from '@app/src/apis/widget/useWidgetInstants';
import { WidgetInstance } from '@app/src/apis/widget/widgetApi.model';
import * as Layout from '@app/src/components/Layout.style';
import { Pagination } from '@app/src/components/Pagination';
import {
  PresentationPreview,
  widgetToRawPresentation,
} from '@app/src/components/Preview/PresentationPreview';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { useMuiSafeMenu } from '@app/src/hooks/useMuiSafeMenu';
import { WidgetObject } from '@app/src/pages/LayoutEditor/lib/objects/fabric.widget';
import { selectToken, selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { debounce, ImageLoader } from '@app/src/utils';
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
import * as Page from '@app/src/components/Page.style';
import dayjs from 'dayjs';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 10,
  order: 'DESC',
  sort: '-updatedDate',
  filter: [{ key: 'owner', operator: '=', value: 'mine' }],
  q: '',
};

export function WidgetInstanceSubPanel(props: PanelProps) {
  const { open, closePanel, canvas } = props;

  const authToken = useSelector(selectToken());
  const userLang = useSelector(selectUserDataByKey('lang'));
  const modalCtrl = useModal();
  const sortMenu = useMuiSafeMenu();
  const perPageMenu = useMuiSafeMenu();
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);
  const api = useWidgetInstants(params);

  const openPreview = (item: WidgetInstance) => {
    modalCtrl.open(<PresentationPreview rawPresentation={widgetToRawPresentation(item)} />);
  };

  const startDrag = async (e: React.DragEvent<HTMLLIElement>, widget: WidgetInstance) => {
    const imgElement = e.currentTarget.childNodes[1] as HTMLImageElement;
    ImageLoader.setCache(imgElement.src, imgElement);
    const object = new WidgetObject(imgElement)
      .apply('id', widget.id)
      .apply('name', widget.name[userLang])
      .apply('data', JSON.stringify(widget));

    canvas.onDragStart(object);
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
        <ImageList cols={2} rowHeight={120}>
          {api.data.data.map((widgetInstance) => (
            <ImageListItem
              key={widgetInstance.id}
              sx={{ cursor: 'pointer' }}
              onDoubleClick={() => openPreview(widgetInstance)}
              draggable
              onDragStart={(e) => startDrag(e, widgetInstance)}
            >
              <Page.ThumbnailInfo style={{ borderRadius: 10 }}>
                {widgetInstance.name[userLang]}
                <br />
                {widgetInstance.owner.displayName}
                <br />
                {dayjs(widgetInstance.updatedDate).format('YYYY-MM-DD. HH:mm')}
              </Page.ThumbnailInfo>
              <Page.ThumbnailImage
                /** crossOrigin 설정을 안하면 캔버스에서 썸네일을 빼올 수 없음 */
                crossOrigin='anonymous'
                src={config.EXTERNAL.CUBLICK.WIDGET.THUMBNAIL(widgetInstance.widget, authToken)}
                alt={widgetInstance.name[userLang]}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Layout.Box>
      <Pagination paginationInfo={api.data.pages} onPageChange={apiActions.changePage} />
    </S.SubPanel>
  );
}
