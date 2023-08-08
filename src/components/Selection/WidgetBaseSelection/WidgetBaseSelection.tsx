import { APIListParams } from '@app/src/apis';
import { useAPIListParam } from '@app/src/apis/useAPIListParam';
import { useWidgetBases } from '@app/src/apis/widget/useWidgetBases';
import { WidgetBase } from '@app/src/apis/widget/widgetApi.model';
import * as Form from '@app/src/components/Form.style';
import * as Page from '@app/src/components/Page.style';
import { Pagination } from '@app/src/components/Pagination';
import { config } from '@app/src/config';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { selectToken, selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { debounce } from '@app/src/utils';
import { faSyncAlt } from '@fortawesome/pro-regular-svg-icons/faSyncAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type Props = {
  onSelect: (asset: WidgetBase) => void;
};

const defaultAPIListParams: APIListParams = {
  page: 1,
  perPage: 20,
  order: 'DESC',
  sort: '-updatedDate',
  filter: [
    { key: 'mimeType', operator: '=', value: 'IMAGE' },
    { key: 'fileType', operator: '!=', value: '.svg' },
    { key: 'owner', operator: '=', value: 'mine' },
  ],
  q: '',
};

export function WidgetBaseSelection(props: Props) {
  const { onSelect } = props;

  const { t } = useTranslation();
  const authToken = useSelector(selectToken());
  const userLang = useSelector(selectUserDataByKey('lang'));
  const [searchText, setSearchText] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<WidgetBase[]>([]);
  const [params, apiActions] = useAPIListParam(defaultAPIListParams);
  const api = useWidgetBases(defaultAPIListParams);

  const onSearchTextChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, 300);

  const selectItem = (item: WidgetBase) => {
    setSelectedAssets((prev) => {
      const index = prev.findIndex((prevAsset) => prevAsset._id === item._id);
      if (index !== -1) return [...prev.slice(0, index), ...prev.slice(index + 1)];
      /**
       * Asset을 하나만 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      return [item];
      /**
       * Asset을 여러개 선택이 가능하도록 하기 위해서는 아래의 코드를 사용한다.
       */
      // return [...prev, asset];
    });
  };

  useEffect(() => {
    if (selectedAssets.length === 1) {
      onSelect(selectedAssets[0]);
      return;
    }
    onSelect(null);
  }, [selectedAssets]);

  console.log(api.data.data);

  const selectedItemIds = selectedAssets.map((asset) => asset._id);
  return (
    <>
      <Page.Actions>
        <Page.ActionButton onClick={() => api.refetch()}>
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
        {api.data.data
          .filter((item) => item.name[userLang].includes(searchText))
          .map((item) => (
            <Page.Thumbnail
              key={item.id}
              draggable
              onClick={() => selectItem(item)}
              selected={selectedItemIds.includes(item.id)}
            >
              <Page.ThumbnailInfo>
                {item.name[userLang]}
                <br />
                {item.owner.displayName}
                <br />
                {item.updatedDate}
              </Page.ThumbnailInfo>
              <Page.ThumbnailImage
                src={config.EXTERNAL.CUBLICK.WIDGET.THUMBNAIL(item.id, authToken)}
                alt={item.name[userLang]}
              />
            </Page.Thumbnail>
          ))}
      </Page.ThumbnailGrid>
      <Pagination paginationInfo={api.data.pages} onPageChange={apiActions.changePage} />
    </>
  );
}
