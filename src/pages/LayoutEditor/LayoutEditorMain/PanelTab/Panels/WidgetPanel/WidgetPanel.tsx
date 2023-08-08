import * as Layout from '@app/src/components/Layout.style';
import { useMuiTabs } from '@app/src/hooks/useMuiTabs';
import React from 'react';
import { PanelProps } from '../../PanelTab';
import * as S from '../../PanelTab.style';
import { WidgetBaseSubPanel } from './SubPanel/WidgetBaseSubPanel';
import { WidgetInstanceSubPanel } from './SubPanel/WidgetInstanceSubPanel';

type TabEnum = 'base' | 'instance';

export function WidgetPanel(props: PanelProps) {
  const { open, closePanel, canvas } = props;

  const [tab, tabsProps] = useMuiTabs<TabEnum>('base');

  return (
    <S.Panel open={open}>
      <S.Tabs {...tabsProps} indicatorColor='secondary' variant='fullWidth'>
        <S.Tab value='base' label='위젯' />
        <S.Tab value='instance' label='위젯 인스턴스' />
      </S.Tabs>
      <Layout.Box flex={1} display='flex'>
        <WidgetBaseSubPanel open={tab === 'base'} closePanel={closePanel} canvas={canvas} />
        <WidgetInstanceSubPanel open={tab === 'instance'} closePanel={closePanel} canvas={canvas} />
      </Layout.Box>
    </S.Panel>
  );
}
