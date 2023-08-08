import { useYoutube } from '@app/src/apis/other/useYoutube';
import * as Layout from '@app/src/components/Layout.style';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { debounce, ImageLoader } from '@app/src/utils';
import styled from '@emotion/styled';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ImageList, ImageListItem } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { YoutubeVideoObject } from '../../../lib/objects/fabric.video';
import { PanelProps } from '../PanelTab';
import * as S from '../PanelTab.style';

const YoutubeInput = styled.input`
  border: none;
  outline: none;

  width: 100%;
  padding: 10px;
  margin: 0px 5px;
  border-radius: 100px;
  background: transparent;
  font-size: 1.4rem;
  color: #707070;
  text-align: center;

  box-shadow: inset 0 0 0 3px #da4d4d;

  &::placeholder {
    color: #c0c0c0;
    text-align: center;
    font-size: 14px;
  }
`;

export function YoutubePanel(props: PanelProps) {
  const { open, closePanel, canvas } = props;
  const [searchText, setSearchText] = useState<string>('');
  const api = useYoutube(searchText);

  const onSearchTextChange = debounce((e) => {
    setSearchText(e.target.value);
  }, 500);

  const items = api.data?.items || [];

  const startDrag = async (e: React.DragEvent<HTMLLIElement>, item: any) => {
    const proxyURL = config.EXTERNAL.CUBLICK.SERVICES.PROXY;
    const url = item.snippet.thumbnails.medium.url;
    const res = await axios.get<Blob>(`${proxyURL}?url=${url}`, { responseType: 'blob' });
    const imgElement = await ImageLoader.load(URL.createObjectURL(res.data));
    ImageLoader.setCache(url, imgElement);
    const object = new YoutubeVideoObject(imgElement)
      .apply('id', item.id.videoId)
      .apply('srcLink', item.snippet.thumbnails.medium.url);

    canvas.onDragStart(object);
    closePanel();
  };

  return (
    <S.Panel open={open}>
      <S.SubPanel open>
        <S.SearchBox>
          <FontAwesomeIcon
            icon={faYoutube}
            color='#da4d4d'
            size='2x'
            onClick={() => api.refetch()}
          />
          <YoutubeInput
            defaultValue={searchText}
            onChange={onSearchTextChange}
            placeholder='검색어를 입력해보세요.'
          />
        </S.SearchBox>

        <Layout.Box flex={1}>
          <ImageList cols={2} rowHeight={120}>
            {items.map((item: any, index) => (
              <ImageListItem
                key={item.id.videoId}
                sx={{ cursor: 'pointer' }}
                draggable
                onDragStart={(e) => startDrag(e, item)}
              >
                <Page.ThumbnailInfo
                  style={{ borderRadius: 10 }}
                  dangerouslySetInnerHTML={{ __html: item.snippet.title }}
                />
                <Page.ThumbnailImage
                  // crossOrigin='anonymous'
                  src={item.snippet.thumbnails.medium.url}
                  alt={item.snippet.title}
                />
              </ImageListItem>
            ))}
            <></>
          </ImageList>
        </Layout.Box>
        {/* <Pagination
          paginationInfo={assetApi.data.pages}
          onPageChange={apiActions.onPageChange}
          maxVisiblePages={3}
        /> */}
      </S.SubPanel>
    </S.Panel>
  );
}
