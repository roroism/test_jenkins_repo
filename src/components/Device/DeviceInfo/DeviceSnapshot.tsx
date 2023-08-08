import { getDeviceSnapshot, sendSnapShotToDevice } from '@app/src/apis/device';
import React, { useEffect, useState } from 'react';
import loadingImg from '@app/public/media/Ripple-Loading.svg';
import {
  ErrorBox,
  LoadingImg,
  LoadingImgBox,
  PreviewBox,
  PreviewImg,
} from './DeviceSnapshot.style';

interface DeviceSnapshot {
  deviceId: string;
}

export default function DeviceSnapshot({ deviceId }: DeviceSnapshot) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (deviceId) {
      sendSnapShotToDevice([deviceId])
        .then(() => {
          return getDeviceSnapshot(deviceId);
        })
        .then((result) => {
          const imageSrc = URL.createObjectURL(result);
          setTimeout(() => {
            if (result.type === 'application/json') {
              setIsError(true);
              throw new Error('재생영상 snapshot이 오지 않음');
            }
            setImageSrc(imageSrc);
          }, 2000);
          // 이미지 소스를 사용하여 원하는 방식으로 DOM에 추가 또는 업데이트
        })
        .catch((error) => {
          console.error('재생영상', error);
          setIsError(true);
        });
    }
  }, []);

  return (
    <PreviewBox>
      {imageSrc === '' && !isError ? (
        <LoadingImgBox>
          <LoadingImg src={loadingImg} />
        </LoadingImgBox>
      ) : isError ? (
        <ErrorBox>
          <p>영상을 가져오는데 실패했습니다</p>
        </ErrorBox>
      ) : (
        <PreviewImg src={imageSrc} alt='재생중인영상 snapshot' />
      )}
    </PreviewBox>
  );
}
