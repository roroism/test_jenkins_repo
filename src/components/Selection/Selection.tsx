import * as Modal from '@app/src/components/Modal.style';
import { useMuiTabs } from '@app/src/hooks/useMuiTabs';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { ModalProps } from '@app/src/store/model';
import { Tabs } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import { AssetSelection } from './AssetSelection';
import { CategorySelection } from './CategorySelection/CategorySelection';
import { GroupManagementSelection } from './GroupManagementSelection/GroupManagementSelection';
import { ImageSelection } from './ImageSelection';
import * as S from './Selection.style';
import { VideoSelection } from './VideoSelection';
import { WidgetBaseSelection } from './WidgetBaseSelection/WidgetBaseSelection';
import { css } from '@emotion/react';

type ContentSelectionProps = {
  availables: TabEnum[];
  onSelect: (data: any) => void;
  selectMultiple?: boolean;
  closeAnimation?: boolean;
} & ModalProps;

type TabEnum =
  | 'PRESENTATION'
  | 'ASSET'
  | 'PLAYLIST'
  | 'IMAGE'
  | 'VIDEO'
  | 'WIDGET_BASE'
  | 'WIDGET_INSTANCE'
  | 'CATEGORY'
  | 'GROUPMANAGEMENT';

/**
 * @description 플레이리스트의 컨텐츠 선택 컴포넌트, Tab을 누를 시 표출되는 리스트 변경
 */
export function Selection(props: ContentSelectionProps) {
  const { onSelect, closeSelf, availables, selectMultiple = false, closeAnimation = true } = props;

  const { t } = useTranslation();
  const [tab, tabsProps] = useMuiTabs<TabEnum>(availables[0]);
  const [selectedItem, setSelectedItem] = useState(null);
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);

  const closeWithAnimation = useCallback(() => {
    modalBodyRef.current.classList.add('close');
    modalBackgroundRef.current.classList.add('close');

    setTimeout(() => {
      closeSelf();
    }, 400);
  }, []);

  const onSave = useCallback(() => {
    if (closeAnimation) {
      onSelect(selectedItem);
      closeWithAnimation();
    } else {
      onSelect(selectedItem);
      closeSelf();
    }
  }, [closeAnimation, selectedItem]);

  const close = useCallback(() => {
    if (closeAnimation) {
      closeWithAnimation();
    } else {
      closeSelf();
    }
  }, [closeAnimation, selectedItem]);

  return (
    <Modal.Container>
      <Modal.Background ref={modalBackgroundRef} onClick={close} />
      <Modal.Body
        ref={modalBodyRef}
        css={
          tab === 'CATEGORY'
            ? css`
                width: 40vw;
                height: 60vh;
                max-width: 600px;
              `
            : css`
                width: 1000px;
                height: 1300px;
              `
        }
      >
        <Modal.Title>{t('app-common.contentSelection')}</Modal.Title>
        {availables.length !== 1 ? (
          <Tabs {...tabsProps} indicatorColor='secondary' variant='fullWidth'>
            {availables.includes('PRESENTATION') ? (
              <S.Tab value='PRESENTATION' label={t('app-common.pesentation')} />
            ) : null}
            {availables.includes('ASSET') ? (
              <S.Tab value='ASSET' label={t('app-common.asset')} />
            ) : null}
            {availables.includes('IMAGE') ? (
              <S.Tab value='IMAGE' label={t('app-asset.image')} />
            ) : null}
            {availables.includes('VIDEO') ? (
              <S.Tab value='VIDEO' label={t('app-asset.video')} />
            ) : null}
            {availables.includes('WIDGET_BASE') ? (
              <S.Tab value='WIDGET' label={t('app-common.widget')} />
            ) : null}
            {availables.includes('PLAYLIST') ? (
              <S.Tab value='PLAYLIST' label={t('app-common.playlist')} />
            ) : null}
            {availables.includes('CATEGORY') ? (
              <S.Tab value='CATEGORY' label={t('app-common.category')} />
            ) : null}
          </Tabs>
        ) : null}
        <S.Content>
          {tab === 'ASSET' ? <AssetSelection onSelect={setSelectedItem} /> : null}
          {tab === 'IMAGE' ? <ImageSelection onSelect={setSelectedItem} /> : null}
          {tab === 'VIDEO' ? <VideoSelection onSelect={setSelectedItem} /> : null}
          {tab === 'CATEGORY' ? (
            <CategorySelection selectMultiple={selectMultiple} onSelect={setSelectedItem} />
          ) : null}
          {tab === 'GROUPMANAGEMENT' ? (
            <GroupManagementSelection onSelect={setSelectedItem} />
          ) : null}
          {tab === 'WIDGET_BASE' ? <WidgetBaseSelection onSelect={setSelectedItem} /> : null}
        </S.Content>
        <Modal.Actions>
          {/* <Modal.SaveButton onClick={onSave} disabled={!selectedItem}> */}
          <Modal.SaveButton
            onClick={onSave}
            disabled={selectMultiple ? selectedItem?.length < 1 || !selectedItem : !selectedItem}
          >
            {t('app-common.save')}
          </Modal.SaveButton>
          <Modal.CloseButton onClick={close}>{t('app-common.close')}</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
