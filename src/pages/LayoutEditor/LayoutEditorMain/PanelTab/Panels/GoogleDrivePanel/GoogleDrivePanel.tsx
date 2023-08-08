import * as Layout from '@app/src/components/Layout.style';
import { useMuiTabs } from '@app/src/hooks/useMuiTabs';
import React from 'react';
import { PanelProps } from '../../PanelTab';
import * as S from '../../PanelTab.style';
import { GoogleDriveImageSubPanel } from './SubPanel/GoogleDriveImageSubPanel';
import { GoogleDriveLinkSubPanel } from './SubPanel/GoogleDriveLinkSubPanel';
import { GoogleDriveVideoSubPanel } from './SubPanel/GoogleDriveVideoSubPanel';

type TabEnum = 'image' | 'video' | 'link';

export function GoogleDrivePanel(props: PanelProps) {
  const { open, closePanel, canvas } = props;

  const [tab, tabsProps] = useMuiTabs<TabEnum>('image');

  return (
    <S.Panel open={open}>
      <S.Tabs {...tabsProps} indicatorColor='secondary' variant='fullWidth'>
        <S.Tab value='image' label='이미지' />
        <S.Tab value='video' label='비디오' />
        <S.Tab value='link' label='링크' />
      </S.Tabs>
      <Layout.Box flex={1} display='flex'>
        <GoogleDriveImageSubPanel open={tab === 'image'} closePanel={closePanel} canvas={canvas} />
        <GoogleDriveVideoSubPanel open={tab === 'video'} closePanel={closePanel} canvas={canvas} />
        <GoogleDriveLinkSubPanel open={tab === 'link'} closePanel={closePanel} canvas={canvas} />
      </Layout.Box>
    </S.Panel>
  );
}
