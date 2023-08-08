import { Asset } from '@app/src/apis/assets';
import { CategoryAPIResponse } from '@app/src/apis/category';
import {
  DevicesAPIDeviceResult,
  sendAssetToDevice,
  sendCategoryToDevice,
} from '@app/src/apis/device';
import { Alert } from '@app/src/components/Alert';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { Selection } from '@app/src/components/Selection';
import { DeviceSelection } from '@app/src/components/Selection/DeviceSelection';
import { useModal } from '@app/src/hooks/useModal';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { ModalProps } from '@app/src/store/model';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import React, { useCallback, useRef, useState } from 'react';
import { Alarm } from '@app/src/components/AlarmModal';
import * as S from './AssetSendDialog.style';

type SettingProps = ModalProps & {
  asset: Asset;
  closeAnimation?: boolean;
};

export function AssetSendDialog(props: SettingProps) {
  const { closeSelf, asset, closeAnimation = true } = props;

  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);
  const modalCtrl = useModal();
  const [selectedCategory, setSelectedCategory] = useState<CategoryAPIResponse>(null);
  const [content, contentActions] = useTypeSafeReducer(
    { startDate: '', endDate: '', isWidget: '', isCategory: '' },
    {
      onStartDateChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        state.startDate = e.target.value;
      },
      onEndDateChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
        state.endDate = e.target.value;
      },
      // isWidgetEnabled: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      //   state.isWidget = e.target.value;
      // },
      // isCategoryEnabled: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      //   state.isCategory = e.target.value;
      // },
    }
  );

  const openCategorySelection = () => {
    modalCtrl.open(<Selection availables={['CATEGORY']} onSelect={setSelectedCategory} />);
  };

  const onSendToDeviceClick = () => {
    modalCtrl.open(
      <DeviceSelection
        onSelect={async (devices: DevicesAPIDeviceResult[]) => {
          try {
            const deviceIds = devices.map((device) => device.id);
            await sendCategoryToDevice([], deviceIds, {
              id: selectedCategory.id,
              name: selectedCategory.name,
              groups: [],
              ids: deviceIds.length === 0 ? deviceIds[0] : deviceIds,
              type: 'CATEGORYMANAGEMENT',
              option: 'ADD',
              cmd: 'EXECUTE',
            });
            await sendAssetToDevice(
              deviceIds,
              asset,
              content.startDate,
              content.endDate,
              selectedCategory,
              // content.isWidget,
              // content.isCategory
            ).then(() => {
              modalCtrl.open(<Alarm text='콘텐츠가 기기에 전송되었습니다.' onClose={closeSelf} />);
            });
          } catch (error) {
            modalCtrl.open(<Alert text='컨탠츠 전송에 실패하였습니다.' />);
          }
        }}
      />
    );
  };

  const closeWithAnimation = useCallback(() => {
    modalBodyRef.current.classList.add('close');
    modalBackgroundRef.current.classList.add('close');

    setTimeout(() => {
      closeSelf();
    }, 400);
  }, []);

  const onClose = () => {
    if (closeAnimation) {
      closeWithAnimation();
    } else {
      closeSelf();
    }
  };

  const isStartDateBeforeEndDate = dayjs(content.startDate).diff(content.endDate) < 0;
  const isEndDateFuture = dayjs(content.endDate).diff(Date.now()) > 0;
  const isCategoryValid = selectedCategory !== null;

  return (
    <Modal.Container>
      <Modal.Background ref={modalBackgroundRef} />
      <Modal.Body ref={modalBodyRef}>
        <Modal.Title>전송 설정</Modal.Title>
        <Modal.Content>
          <Layout.Box>
            <Form.Label htmlFor='start-date'>개시 시작</Form.Label>
            <S.TextField
              id='start-date'
              color='secondary'
              type='datetime-local'
              defaultValue={dayjs(content.startDate).format('YYYY-MM-DDTHH:mm')}
              onChange={contentActions.onStartDateChange}
              fullWidth
              inputProps={{ style: { fontSize: '1.4rem', padding: 10 } }}
              sx={{ fontSize: '1.4rem' }}
            // max='9999-12-31T23:59:59'
            />
          </Layout.Box>

          <Layout.Box>
            <Form.Label htmlFor='end-date'>개시 종료</Form.Label>
            {!isStartDateBeforeEndDate ? (
              <Form.ErrMsg>개시 종료 시각은 개시 시작 시각보다 빠를 수 없습니다.</Form.ErrMsg>
            ) : null}
            {!isEndDateFuture ? (
              <Form.ErrMsg>개시기간을 과거로 설정할 수 없습니다.</Form.ErrMsg>
            ) : null}
            <S.TextField
              id='end-date'
              color='secondary'
              type='datetime-local'
              defaultValue={dayjs(content.endDate).format('YYYY-MM-DDTHH:mm')}
              onChange={contentActions.onEndDateChange}
              fullWidth
              inputProps={{ style: { fontSize: '1.4rem', padding: 10 } }}
              sx={{ fontSize: '1.4rem' }}
            // max='9999-12-31T23:59:59'
            />
          </Layout.Box>

          <Layout.Box>
            <Form.Label htmlFor='category'>카테고리</Form.Label>
            {!isCategoryValid ? <Form.ErrMsg>카테고리를 선택해주세요.</Form.ErrMsg> : null}
            <Form.Input
              id='category'
              placeholder='눌러서 카테고리를 선택해주세요.'
              readOnly
              value={selectedCategory?.name || ''}
              onClick={openCategorySelection}
            />
          </Layout.Box>
          {/* <Layout.Box>
            <Form.Label htmlFor='weather-Bar'>날씨</Form.Label>
            <Form.Select
              value={content.isWidget}
              onChange={contentActions.isWidgetEnabled}
              defaultValue={true}
            >
              <Form.Option value='true'>on</Form.Option>
              <Form.Option value='false'>off</Form.Option>
            </Form.Select>
          </Layout.Box>
          <Layout.Box>
            <Form.Label htmlFor='category-Bar'>카테고리 목록</Form.Label>
            <Form.Select
              value={content.isCategory}
              onChange={contentActions.isCategoryEnabled}
              defaultValue={true}
            >
              <Form.Option value='true'>on</Form.Option>
              <Form.Option value='false'>off</Form.Option>
            </Form.Select>
          </Layout.Box> */}
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={onSendToDeviceClick}>확인</Modal.SaveButton>
          <Modal.CloseButton onClick={onClose}>취소</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
