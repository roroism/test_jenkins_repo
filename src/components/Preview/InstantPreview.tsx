import { getPresentation } from '@app/src/apis/presentation/presentationApi';
import { Alert } from '@app/src/components/Alert';
import { spin } from '@app/src/components/Global.style';
import * as Modal from '@app/src/components/Modal.style';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { ModalProps } from '@app/src/store/model';
import { selectToken } from '@app/src/store/slices/authSlice';
import { CublickParser } from '@cublick/parser';
import { CublickRenderer } from '@cublick/renderer';
import styled from '@emotion/styled';
import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { RawPresentation } from '@cublick/parser/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createHexID } from '@app/src/utils';
import { WidgetInstance } from '@app/src/apis/widget/widgetApi.model';

export const Body = styled(Modal.Body)`
  width: 100%;
  height: 100%;
  max-width: 95vw;
  max-height: 95vh;

  font-size: 100px;
  background: transparent;

  & > *:first-of-type > *:first-of-type {
    border-radius: 8px;
    overflow: hidden;
  }
`;

export const FaLoading = styled(FontAwesomeIcon)`
  animation: ${spin} 1s linear infinite;
`;

type Props = ModalProps & { rawPresentation?: RawPresentation };

export function InstantPreview(props: Props) {
  console.log(props);
  const { closeSelf, rawPresentation } = props;
  const authToken = useSelector(selectToken());
  const displayerMain = useRef<HTMLDivElement>(null);
  const modalCtrl = useModal();

  /**
   * 프레젠테이션을 랜더링하는 함수, Ref를 통해 랜더링할 div를 찾아 랜더링한다.
   *
   * @author 오지민 2023.03.05
   * @param rawPresentation 랜더링할 프레젠테이션의 정보
   */
  const renderPresentation = (rawPresentation: RawPresentation) => {
    const mainRender = new CublickRenderer(displayerMain.current);
    const parser = new CublickParser({
      apis: {
        asset: `${config.EXTERNAL.CUBLICK.ASSET.AST}/{id}/data`,
        assetThumbnail: `${config.EXTERNAL.CUBLICK.ASSET.AST}/{id}/thumbnail`,
      },
      apiToken: authToken,
    });
    mainRender.renderPresentation(parser.parse(rawPresentation), {
      contentDataInputType: 'PARSED',
    });
  };

  /**
   * props에 presentationId가 존재하지 않으면, props의 rawPresentation을 불러와 프리뷰에 랜더링한다.
   * @author 오지민 2023.03.05
   */
  useEffect(() => {
    renderPresentation(rawPresentation);
  }, []);

  return (
    <Modal.Container onClick={closeSelf}>
      <Modal.Background />
      <Body ref={displayerMain}>
        <FaLoading icon={faSpinnerThird} color='#3e70d6' />
      </Body>
    </Modal.Container>
  );
}

export const widgetToRawPresentation = (widgetInstance: WidgetInstance): RawPresentation => ({
  id: createHexID(24),
  name: '',
  code: '',
  desc: '',
  regions: [
    {
      id: createHexID(24),
      zOrder: 1,
      // targetID: '',
      slideEffect: 0,
      slideTime: 0,
      x: 0,
      y: 0,
      width: 2400,
      height: 1800,
      rotate: 0,
      lock: false,
      bg: {
        type: 'COLOR',
        id: '',
      },
      events: [],
      type: 'WIDGET',
      properties: {
        id: widgetInstance.id,
        name: 'widget_preview',
        data: JSON.stringify(widgetInstance),
        caption: '',
        alpha: 255,
      },
    },
  ],
  bg: {
    type: 'COLOR',
    id: '#ffffff',
  },
  bgEnable: true,
  bgAudio: {
    isRepeat: false,
    audios: [],
  },
  bgAudioEnable: false,
  width: 2400,
  height: 1800,
  ratio: '4:3',
  orientation: 'LANDSCAPE',
  accessRight: 0,
  lock: false,
  assetList: [],
  rules: [],
  sensors: {
    barcode: { enable: false },
    irRemote: { enable: false },
    nfc: { enable: false },
    photoelectric: { enable: false },
  },
  updatedDate: new Date().toString(),
  createdDate: new Date().toString(),
  isGridTpl: false,
  payLevelAccess: 'FREE',
  isSystem: true,
  isPrivate: false,
  viewCounts: 0,
  tags: [],
  status: 'DEACTIVATED',
  multiVision: {
    multiVision: false,
  },
});
