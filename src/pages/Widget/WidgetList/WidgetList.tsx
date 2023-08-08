import { APIListParams } from '@app/src/apis';
import { deletePresentation } from '@app/src/apis/presentation/presentationApi';
import { useAPIListParam } from '@app/src/apis/useAPIListParam';
import { useWidgetInstants } from '@app/src/apis/widget/useWidgetInstants';
import { getWidgetBase } from '@app/src/apis/widget/widgetApi';
import { WidgetBase, WidgetInstance } from '@app/src/apis/widget/widgetApi.model';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import { GeneralWidgetDialog } from '@app/src/components/GeneralWidgetDialog';
import { Loading } from '@app/src/components/Loading';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import {
  InstantPreview,
  widgetToRawPresentation,
} from '@app/src/components/Preview/InstantPreview';
import { Selection } from '@app/src/components/Selection';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { selectToken, selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { faCheck, faListOl, faPlusCircle } from '@fortawesome/pro-solid-svg-icons';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PerPageSelect from '@app/src/components/PerPageSelect/PerPageSelect';

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 40,
  order: 'DESC',
  sort: '-updatedDate',
  filter: [{ key: 'owner', operator: '=', value: 'mine' }],
  q: '',
};

export function WidgetList() {
  const { t } = useTranslation();
  const modalCtrl = useModal();

  const authToken = useSelector(selectToken());
  const userLang = useSelector(selectUserDataByKey('lang'));
  const [selectedItems, setSelectedItems] = useState<WidgetInstance[]>([]);
  const selectedItemIds = selectedItems.map((item) => item.id);
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);
  const api = useWidgetInstants(params);

  const seelectItem = (item: WidgetInstance) => {
    setSelectedItems((prev) => {
      const index = prev.findIndex((prevWidgets) => prevWidgets.id === item.id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * Widget을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [item];
      /**
       * Widget을 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [...prev, Presentation];
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
          api.refetch();
          if (!hasFailure) return;
          modalCtrl.open(<Alert text='삭제에 실패한 자료가 존재합니다.' />);
        }}
      />
    );
  };

  const openPreview = (item: WidgetInstance) => {
    modalCtrl.open(<InstantPreview rawPresentation={widgetToRawPresentation(item)} />);
  };

  const onPreviewClick = () => {
    if (selectedItems.length === 0) {
      modalCtrl.open(<Alert text='미리보기할 위젯을 선택해주세요.' />);
      return;
    }
    if (selectedItems.length > 1) {
      modalCtrl.open(<Alert text='미리보기할 위젯은 하나만 선택해주세요.' />);
      return;
    }

    openPreview(selectedItems[0]);
  };

  const onCreateClick = () => {
    modalCtrl.open(<Selection availables={['WIDGET_BASE']} onSelect={onWidgetBaseSelect} />);
  };
  const onWidgetBaseSelect = (widgetBase: WidgetBase) => {
    const modalId = modalCtrl.open(<Loading />);
    getWidgetBase(widgetBase.id)
      .then((widget) => modalCtrl.open(<GeneralWidgetDialog mode='ADD' widget={widget} />))
      .catch(() => modalCtrl.open(<Alert text='기본 위젯을 불러오는데 실패하였습니다.' />))
      .finally(() => modalCtrl.close(modalId));
  };
  const onWidgetDoubleClick = (widgetInstance: WidgetInstance) => {
    modalCtrl.open(<GeneralWidgetDialog mode='EDIT' widget={widgetInstance} />);
  };

  return (
    <Page.Container>
      <Page.Title>{t('app-common.widget')}</Page.Title>
      <Page.Actions>
        <Page.ActionButton onClick={onCreateClick}>
          <FontAwesomeIcon icon={faPlusCircle} color='#3e70d6' size='lg' />
          &nbsp; 새로만들기
        </Page.ActionButton>
        <Page.ActionButton onClick={onSelectAllClick}>
          <FontAwesomeIcon icon={faCheck} />
          &nbsp; 전체선택
        </Page.ActionButton>
        <Page.ActionButton onClick={() => openDeleteConfirmDialog(selectedItemIds)}>
          <FontAwesomeIcon icon={faTrash} />
          &nbsp; 선택삭제
        </Page.ActionButton>
        <Page.ActionButton onClick={onPreviewClick}>
          <FontAwesomeIcon icon={faDesktop} />
          &nbsp; 미리보기
        </Page.ActionButton>
        <Page.ActionButton onClick={() => api.refetch()}>
          <FontAwesomeIcon icon={faSyncAlt} />
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
          onChange={debounce(apiActions.onQueryChange, 300)}
        />
      </Page.Actions>
      <Page.ThumbnailGrid>
        {api.data.data.map((item) => (
          <Page.Thumbnail
            key={item.id}
            draggable
            onClick={() => seelectItem(item)}
            selected={selectedItemIds.includes(item.id)}
            onDoubleClick={() => onWidgetDoubleClick(item)}
          >
            <Page.ThumbnailInfo>
              {item.name[userLang]}
              <br />
              {item.owner.displayName}
              <br />
              {dayjs(item.updatedDate).format('YYYY-MM-DD. HH:mm')}
            </Page.ThumbnailInfo>
            <Page.ThumbnailImage
              src={config.EXTERNAL.CUBLICK.WIDGET.THUMBNAIL(item.widget, authToken)}
              alt={item.name[userLang]}
            />
          </Page.Thumbnail>
        ))}
      </Page.ThumbnailGrid>
      <Pagination paginationInfo={api.data.pages} onPageChange={apiActions.changePage} />
    </Page.Container>
  );
}
