import IMG_WWW from '@app/resources/icons/www.png';
import * as Layout from '@app/src/components/Layout.style';
import { ImageLoader } from '@app/src/utils';
import React, { useState } from 'react';
import { WebPageObject } from '../../../lib/objects/fabric.webpage';
import { PanelProps } from '../PanelTab';
import * as S from '../PanelTab.style';

export function WebPagePanel(props: PanelProps) {
  const { open, closePanel, canvas } = props;

  const [url, setUrl] = useState('');

  const startDrag = async (e: React.DragEvent<HTMLImageElement>) => {
    ImageLoader.setCache(e.currentTarget.src, e.currentTarget);
    const object = new WebPageObject(e.currentTarget).apply('srcLink', url);
    canvas.onDragStart(object);
    closePanel();
  };

  const isAllowedProtocal = url.match(/^(http|https):\/\//) !== null;
  const isDragAllowed = url.length > 0 && isAllowedProtocal;

  return (
    <S.Panel open={open}>
      <S.SubPanel open>
        <S.SearchBox>
          <S.SearchInput
            placeholder='웹페이지 주소(URL)를 입력해주세요.'
            style={{ marginRight: 0 }}
            onChange={(e) => setUrl(e.target.value)}
            value={url}
          />
        </S.SearchBox>
        <Layout.Box flex={1}>
          {/* TODO: redesign */}
          <img
            style={{
              outline: 'none',
              border: 'none',
              marginTop: '10px',
              height: '300px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: 'inset 0px 0px 0px 1px hsl(0, 0%, 75%)',
              borderRadius: 5,
              objectFit: 'contain',
              cursor: isDragAllowed ? 'pointer' : 'default',
              filter: isDragAllowed ? 'none' : 'grayscale(100%)',
              transition: '700ms',
            }}
            crossOrigin='anonymous'
            draggable={isDragAllowed}
            onDragStart={startDrag}
            src={IMG_WWW}
          />
        </Layout.Box>
      </S.SubPanel>
    </S.Panel>
  );
}
