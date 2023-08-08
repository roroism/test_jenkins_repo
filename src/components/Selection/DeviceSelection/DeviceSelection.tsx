import { APIList, DEFAULT_API_RES } from '@app/src/apis';
import { DevicesAPIDeviceResult, getAllDevices } from '@app/src/apis/device';
import { apiGroups } from '@app/src/apis/group';
import { Group } from '@app/src/apis/group/groupApi.model';
import * as Modal from '@app/src/components/Modal.style';
import { rootGroup } from '@app/src/pages/Device/DeviceList';
import { ModalProps } from '@app/src/store/model';
import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { faFolder } from '@fortawesome/pro-solid-svg-icons';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useRef, useState } from 'react';
import * as S from './DeviceSelection.style';
import { css } from '@emotion/react';
import type { PresentationAPIResponse } from '@app/src/apis/presentation';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { faMinusCircle } from '@fortawesome/pro-solid-svg-icons/faMinusCircle';

export enum Modetype {
  PRESENTATION = 'PRESENTATION',
}

type DeviceSelectionProps = {
  onSelect?: (devices: DevicesAPIDeviceResult[]) => void;
  mode?: Modetype;
  presentation?: PresentationAPIResponse;
  closeAnimation?: boolean;
} & ModalProps;

export function DeviceSelection(props: DeviceSelectionProps) {
  const { onSelect, closeSelf, mode, presentation, closeAnimation = true } = props;

  const [selectedDevices, setSelectedDevices] = useState<DevicesAPIDeviceResult[]>([]);
  const { t } = useTranslation();
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);

  const groupApi = useQuery({
    queryKey: ['group'],
    queryFn: () =>
      apiGroups({
        sort: '-createDate',
        order: 'DESC',
        filter: [{ key: 'contentType', operator: '=', value: 'DEVICE' }],
      }),
    initialData: DEFAULT_API_RES as APIList<Group>,
  });
  const allDevicesApi = useQuery({
    queryKey: ['device', 'all'],
    queryFn: () => getAllDevices(),
    initialData: DEFAULT_API_RES as APIList<DevicesAPIDeviceResult>,
  });

  const onDeviceCheckedChange = (checked: boolean, device: DevicesAPIDeviceResult) => {
    if (checked) {
      setSelectedDevices([...selectedDevices, device]);
    } else {
      setSelectedDevices(selectedDevices.filter((prevDevice) => prevDevice.id !== device.id));
    }
  };

  const onGroupCheckedChange = (checked: boolean, devices: DevicesAPIDeviceResult[]) => {
    if (checked) {
      setSelectedDevices(Array.from(new Set([...selectedDevices, ...devices])));
    } else {
      setSelectedDevices(selectedDevices.filter((prevDevice) => !devices.includes(prevDevice)));
    }
  };

  const closeWithAnimation = useCallback(() => {
    modalBodyRef.current.classList.add('close');
    modalBackgroundRef.current.classList.add('close');

    setTimeout(() => {
      closeSelf?.();
    }, 400);
  }, []);

  const onSaveClick = () => {
    if (closeAnimation) {
      onSelect?.(selectedDevices);
      closeWithAnimation();
    } else {
      onSelect?.(selectedDevices);
      closeSelf?.();
    }
  };

  const onClose = useCallback(() => {
    if (closeAnimation) {
      closeWithAnimation();
    } else {
      closeSelf?.();
    }
  }, [closeAnimation]);

  console.log('allDevicesApi : ', allDevicesApi);
  return (
    <Modal.Container>
      <Modal.Background ref={modalBackgroundRef} onClick={onClose} />
      <Modal.Body ref={modalBodyRef}>
        <Modal.Title>기기선택</Modal.Title>
        {mode === Modetype.PRESENTATION ? (
          <S.SendImgInfoWrapper>
            <dl>
              <dt>전송하려는 프리젠테이션 형태 : </dt>
              <dd>
                {presentation?.orientation === 'LANDSCAPE' ? (
                  <span>
                    {`${t('app-device.orientation.landscape')} (${presentation?.width} x ${
                      presentation?.height
                    })`}
                  </span>
                ) : (
                  <span>
                    {`${t('app-device.orientation.portrait')} (${presentation?.width} x ${
                      presentation?.height
                    })`}
                  </span>
                )}
              </dd>
            </dl>
          </S.SendImgInfoWrapper>
        ) : null}
        <Modal.Content
          css={css`
            gap: 8px;
            height: 247px;
          `}
        >
          {groupApi.data.data
            .filter((group) => group.id !== rootGroup.id)
            .map((group) => {
              const allDevices = allDevicesApi.data.data;
              const devicesInGroup = allDevices.filter((device) => device.group.id === group.id);
              const availableDevicesInGroup = devicesInGroup.filter(
                (device) => device.liveStatus === 'ONLINE'
              );
              const isFolderChecked = availableDevicesInGroup.every((id) =>
                selectedDevices.includes(id)
              );

              return (
                <S.Unit key={group.id} open>
                  <S.File as='summary'>
                    <Checkbox
                      color='secondary'
                      checked={availableDevicesInGroup.length > 0 ? isFolderChecked : false}
                      onChange={(_, checked) =>
                        onGroupCheckedChange(checked, availableDevicesInGroup)
                      }
                    />
                    <S.FaFolderIcon icon={faFolder} />
                    <S.FileName>{group.name}</S.FileName>
                    <S.FaAngleLeft icon={faAngleLeft} />
                  </S.File>
                  <S.FolderDrawer>
                    {devicesInGroup.map((device) => (
                      <S.File key={device.id} ml='2rem'>
                        <Checkbox
                          color='secondary'
                          checked={selectedDevices.includes(device)}
                          onChange={(_, checked) => onDeviceCheckedChange(checked, device)}
                        />
                        <FontAwesomeIcon
                          icon={faDesktop}
                          size='1x'
                          color={device.liveStatus === 'ONLINE' ? '#3e70d6' : '#b0b0b0'}
                        />
                        <S.FileName>{device.name}</S.FileName>
                        <S.OrientationInfo>
                          <span>
                            {device?.orientation === 'LANDSCAPE'
                              ? t('app-device.orientation.landscape')
                              : t('app-device.orientation.portrait')}
                          </span>
                        </S.OrientationInfo>
                      </S.File>
                    ))}
                  </S.FolderDrawer>
                </S.Unit>
              );
            })}
          {allDevicesApi?.data?.data
            .filter((device) => device?.group?.id === rootGroup?.id)
            .map((device) => (
              <S.File key={device?.id}>
                {mode === undefined ? (
                  <>
                    {device?.liveStatus === 'ONLINE' ? (
                      <Checkbox
                        id={`checkbox-${device?.id}`}
                        color='secondary'
                        checked={selectedDevices.includes(device)}
                        onChange={(_, checked) => onDeviceCheckedChange(checked, device)}
                      />
                    ) : (
                      <div
                        style={{
                          width: '34.5px',
                          height: '33px',
                          padding: '9px',
                          cursor: 'auto',
                        }}
                      ></div>
                    )}
                    <S.DeviceLabel
                      htmlFor={`checkbox-${device?.id}`}
                      active={device?.liveStatus === 'ONLINE'}
                    >
                      <FontAwesomeIcon
                        icon={faDesktop}
                        size='1x'
                        color={device?.liveStatus === 'ONLINE' ? '#3e70d6' : '#b0b0b0'}
                      />
                      {device?.liveStatus === 'ONLINE' ? (
                        <S.FileName>{device?.name}</S.FileName>
                      ) : (
                        <S.FileName className='off'>{device?.name}</S.FileName>
                      )}
                    </S.DeviceLabel>
                  </>
                ) : null}

                {mode === Modetype.PRESENTATION ? (
                  <>
                    {
                      device?.liveStatus === 'ONLINE' ? (
                        <Checkbox
                          id={`checkbox-${device?.id}`}
                          color='secondary'
                          checked={selectedDevices.includes(device)}
                          onChange={(_, checked) => onDeviceCheckedChange(checked, device)}
                        />
                      ) : (
                        <div
                          style={{
                            width: '34.5px',
                            height: '33px',
                            padding: '9px',
                            cursor: 'auto',
                          }}
                        ></div>
                      )
                      // <Checkbox
                      //   id={`checkbox-${device.id}`}
                      //   color='secondary'
                      //   // checked={selectedDevices.includes(device)}
                      //   // onChange={(_, checked) => onDeviceCheckedChange(checked, device)}
                      //   disabled
                      // />
                    }
                    <S.DeviceLabel
                      htmlFor={`checkbox-${device?.id}`}
                      active={device?.liveStatus === 'ONLINE'}
                    >
                      <FontAwesomeIcon
                        icon={faDesktop}
                        size='1x'
                        color={device?.liveStatus === 'ONLINE' ? '#3e70d6' : '#b0b0b0'}
                      />
                      {device?.liveStatus === 'ONLINE' ? (
                        <>
                          <S.FileName>{device?.name}</S.FileName>
                          <S.OrientationInfo>{`${device?.displayWidth} x ${device?.displayHeight}`}</S.OrientationInfo>
                          {/* <S.OrientationInfo><S.FaTdIcon icon={faCheckCircle} style={{ color: '#009667' }} /><span>{device?.orientation === 'LANDSCAPE' ? t('app-device.orientation.landscape') : t('app-device.orientation.portrait')}</span></S.OrientationInfo> */}
                        </>
                      ) : (
                        <>
                          <S.FileName className='off'>{device?.name}</S.FileName>
                          <S.OrientationInfo className='off'>{`${device?.displayWidth} x ${device?.displayHeight}`}</S.OrientationInfo>
                          {/* <S.OrientationInfo><S.FaTdIcon icon={faMinusCircle} style={{ color: 'red' }} /><span className='gray'>{device?.orientation === 'LANDSCAPE' ? t('app-device.orientation.landscape') : t('app-device.orientation.portrait')}</span></S.OrientationInfo> */}
                        </>
                      )}
                    </S.DeviceLabel>
                  </>
                ) : null}
              </S.File>
            ))}
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={onSaveClick}>전송</Modal.SaveButton>
          <Modal.CloseButton onClick={onClose}>취소</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
