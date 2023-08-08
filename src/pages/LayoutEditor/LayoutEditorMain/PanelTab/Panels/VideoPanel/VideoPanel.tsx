import * as Layout from '@app/src/components/Layout.style';
import { useMuiTabs } from '@app/src/hooks/useMuiTabs';
import React from 'react';
import { PanelProps } from '../../PanelTab';
import * as S from '../../PanelTab.style';
import { RemoteVideoSubPanel } from './SubPanel/RemoteVideoSubPanel';
import { SDSSVideoSubPanel } from './SubPanel/SDSSVideoSubPanel';

type TabEnum = 'mine' | 'other';

export function VideoPanel(props: PanelProps) {
  const { open, closePanel, canvas } = props;

  const [tab, tabsProps] = useMuiTabs<TabEnum>('mine');

  return (
    <S.Panel open={open}>
      <S.Tabs {...tabsProps} indicatorColor='secondary' variant='fullWidth'>
        <S.Tab value='mine' label='개인 갤러리' />
        <S.Tab value='other' label='갤러리' />
      </S.Tabs>
      <Layout.Box flex={1} display='flex'>
        <SDSSVideoSubPanel open={tab === 'mine'} closePanel={closePanel} canvas={canvas} />
        <RemoteVideoSubPanel open={tab === 'other'} closePanel={closePanel} canvas={canvas} />
      </Layout.Box>
    </S.Panel>
  );
}
