import {
  deletePlayingAsset,
  deletePlayingContent,
  deletePlayingPresentation,
  DeviceAPISingleDevice,
  editDevice2,
  getDevice,
  getDeviceSnapshot,
  sendSnapShotToDevice,
  updateDevice,
  updateSoftware,
} from '@app/src/apis/device';
import { Alert } from '@app/src/components/Alert';
import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Page from '@app/src/components/Page.style';
import { config } from '@app/src/config';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { selectToken } from '@app/src/store/slices/authSlice';
import { formatBytes } from '@app/src/utils';
import { faAngleLeft } from '@fortawesome/pro-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { faDesktop } from '@fortawesome/pro-solid-svg-icons/faDesktop';
import { faUpload } from '@fortawesome/pro-solid-svg-icons/faUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { FormattedRelativeTime } from 'react-intl';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DeviceSleepModeDialog } from '../DeviceSleepModeDialog';
import * as S from './DeviceInfo.style';
import TabNav from '@app/src/components/Tab/TabNav';
import addressList from '@app/src/addressList';
import DeviceSnapshot from '@app/src/components/Device/DeviceInfo/DeviceSnapshot';
import imageNotSupported from '@app/public/media/image-not-supported.svg';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Alarm } from '@app/src/components/AlarmModal';

export function DeviceInfo() {
  const { t } = useTranslation();
  // const [imageSrc, setImageSrc] = useState('');
  const modalCtrl = useModal();
  const params = useParams<{ deviceId: string }>();
  const device = useQuery({
    queryKey: ['device', params.deviceId],
    queryFn: () => getDevice(params.deviceId),
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: editDevice2,
    // onMutate: () => queryClient.invalidateQueries(['device', params.deviceId]),
    // onSuccess: () => closeSelf(),
    onSuccess: () => {
      queryClient.invalidateQueries(['device', params.deviceId]);
      modalCtrl.open(<Alarm text='수정되었습니다.' />);
    },
    // onError: () => modalCtrl.open(<Alert text='위젯 수정에 실패하였습니다.' />),
  });
  const authToken = useSelector(selectToken());
  const [selectedTab, setSelectedTab] = useState<number>(0);

  // useEffect(() => {
  //   if (device.data && device.data._id) {
  //     sendSnapShotToDevice([device.data._id])
  //       .then(() => {
  //         return getDeviceSnapshot(device.data._id);
  //       })
  //       .then((result) => {
  //         const imageSrc = URL.createObjectURL(result);
  //         setImageSrc(imageSrc);
  //         // 이미지 소스를 사용하여 원하는 방식으로 DOM에 추가 또는 업데이트
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }, []);

  const [storageCapacityText, setStorageCapacityText] = useState<string>('');

  const [deviceName, setDeviceName] = useState<string>('');
  const [devicedesc, setDevicedesc] = useState<string>('');
  const [orientation, setOrientation] = useState<string>('');
  const [isCategoryVisible, setIsCategoryVisible] = useState<string>('');
  const [isWidgetVisible, setIsWidgetVisible] = useState<string>('');
  const [deviceCountry, setDeviceCountry] = useState<string>('');
  const [deviceCity, setDeviceCity] = useState<string>('');
  const [deviceRegion, setDeviceRegion] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [autoScale, setAutoScale] = useState<string>('');

  useLayoutEffect(() => {
    setDeviceName(device.data?.name || '-');
    // setDeviceAddress(device.data?.address || '-');
    setDevicedesc(device.data?.desc || '-');
    // console.log(device.data?.isCategoryVisible.toString(), device.data?.isWidgetVisible.toString());
    setIsCategoryVisible(device.data?.isCategoryVisible.toString() || '');
    setIsWidgetVisible(device.data?.isWidgetVisible.toString() || '');
    // setBuiltinWidgetAddress(device.data?.builtinWidgetAddress || '-');
    setOrientation(device.data?.orientation || '');
    setAutoScale(device.data?.autoScale || '');

    if (device.data?.address) {
      const deviceAddress = device.data?.address.split(', ');

      let deviceCountryObject;
      let deviceCityObject;
      let deviceRegionObject;

      for (const [key, value] of Object.entries(addressList)) {
        // console.log('value : ', value);
        if (value.find((item) => item.value === deviceAddress[0])) {
          deviceCountryObject = value.find((item) => item.value === deviceAddress[0]);
          break;
        }
      }
      deviceCityObject = addressList[deviceCountryObject.id].find(
        (item) => item.value === deviceAddress[1]
      );
      deviceRegionObject = addressList[deviceCityObject.id].find(
        (item) => item.value === deviceAddress[2]
      );

      setDeviceCountry(deviceCountryObject.id);
      setDeviceCity(deviceCityObject.id);
      setDeviceRegion(deviceRegionObject.id);
    }

    // console.log('device.data?.builtinWidgetAddress :: ', device.data?.builtinWidgetAddress);
    if (device.data?.builtinWidgetAddress && device.data?.builtinWidgetAddress?.trim() !== ', ,') {
      const builtInAddress = device.data?.builtinWidgetAddress.split(', ');

      let countryObject;
      let cityObject;
      let regionObject;

      for (const [key, value] of Object.entries(addressList)) {
        if (value.find((item) => item.value === builtInAddress[0])) {
          countryObject = value.find((item) => item.value === builtInAddress[0]);
          break;
        }
      }
      cityObject = addressList[countryObject?.id]?.find((item) => item.value === builtInAddress[1]);
      regionObject = addressList[cityObject?.id]?.find((item) => item.value === builtInAddress[2]);

      setCountry(countryObject?.id || '');
      setCity(cityObject?.id || '');
      setRegion(regionObject?.id || '');
    }

    const storageCapacityCalculation =
      formatBytes(device.data?.totalStorage - device.data?.freeStorage) +
      ' / ' +
      formatBytes(device.data?.totalStorage) +
      ' ( ' +
      (100 - (device.data?.freeStorage / device.data?.totalStorage) * 100).toFixed(1) +
      '% ' +
      t('app-device.storage-using') +
      ' )';

    setStorageCapacityText(storageCapacityCalculation);
  }, [device.data]);

  const isButtonDiabled =
    deviceName.length < 1 ||
    devicedesc.length < 1 ||
    deviceCountry.length < 1 ||
    deviceCity.length < 1 ||
    deviceRegion.length < 1;
  // ||
  // ((!(country.length < 1 && city.length < 1 && region.length < 1)) ||
  //   (!(country.length >= 1 && city.length >= 1 && region.length >= 1)));

  // if (device.isLoading) {
  //   return <div></div>;
  // }

  // const storageCapacityText =
  //   formatBytes(device.data.totalStorage - device.data.freeStorage) +
  //   ' / ' +
  //   formatBytes(device.data.totalStorage) +
  //   ' ( ' +
  //   (100 - (device.data.freeStorage / device.data.totalStorage) * 100).toFixed(1) +
  //   '% ' +
  //   t('app-device.storage-using') +
  //   ' )';

  // const openDeviceResetConfirm = (device: DeviceAPISingleDevice) => {
  //   const { ipAddress, pinCode } = device;
  //   modalCtrl.open(
  //     <Confirm
  //       id='app-showmessagebox.reset'
  //       onConfirmed={() => resetDevice(ipAddress, pinCode).then(console.log)}
  //     />
  //   );
  // };

  // const openDeviceRestartConfirm = (device: DeviceAPISingleDevice) => {
  //   const { ipAddress, pinCode } = device;
  //   modalCtrl.open(
  //     <Confirm
  //       id='app-showmessagebox.restart'
  //       onConfirmed={() => restartDevice(ipAddress, pinCode).then(console.log)}
  //     />
  //   );
  // };

  // console.log('qqqqqqq', getDeviceSnapshot, device.data);

  const openVersionUpgradeConfirm = (device: DeviceAPISingleDevice) => {
    const { pinCode } = device;
    modalCtrl.open(
      <Confirm
        id='app-showmessagebox.upgrade'
        onConfirmed={() => {
          updateSoftware([pinCode]).catch(() => {
            modalCtrl.open(<Alert text='버전 업그레이드 요청을 실패하였습니다.' />);
          });
        }}
      />
    );
  };

  const openDeviceSleepModeDialog = () => {
    modalCtrl.open(
      <DeviceSleepModeDialog
        defaultOffTime={device.data.autoActions?.[0]?.startTime}
        defaultOnTime={device.data.autoActions?.[0]?.endTime}
        onChange={(offTime: string, onTime: string) => {
          updateDevice(device.data.id, {
            autoActions: JSON.stringify([
              {
                code: 'action_sleep',
                // value: brightnessValue,
                startTime: offTime,
                endTime: onTime,
                // repeat: 'daily'
              },
            ]),
          });
        }}
      />
    );
  };

  const onErrorImg = (e) => {
    e.target.src = imageNotSupported;
  };
  // console.log('날씨 주소 : ', `${addressList.country?.find(({ id }) => id === country)?.value}, ${addressList?.[country]?.find(({ id }) => id === city)?.value}, ${addressList?.[city]?.find(({ id }) => id === region)?.value}`);
  return (
    <div>
      {device.isLoading ? (
        <div></div>
      ) : (
        <Page.Container>
          <Page.Title>
            <S.Link to='/device'>
              <FontAwesomeIcon icon={faAngleLeft} />
            </S.Link>
            디바이스 정보
          </Page.Title>

          <S.Head>
            {/* Device Header Icon */}
            <FontAwesomeIcon
              color={device.data.liveStatus === 'ONLINE' ? '#3e70d6' : '#b2b2b2'}
              icon={faDesktop}
              size='6x'
            />
            {/* Device Header Info - Name */}
            <Layout.Box>
              <S.DeviceName>{device.data.name}</S.DeviceName>
              {/* Device Header Info - Update Date */}
              <S.DeviceLastUpdate>
                Update Date
                <FormattedRelativeTime
                  numeric='auto'
                  unit='second'
                  style='narrow'
                  value={0}
                  updateIntervalInSeconds={10}
                />
              </S.DeviceLastUpdate>
            </Layout.Box>

            <Layout.Box>
              {/* <IconButton size='large' onClick={() => openDeviceResetConfirm(device)}>
            <FontAwesomeIcon icon={faRecycle} />
          </IconButton> */}
              {/* <IconButton size='large' onClick={() => openDeviceRestartConfirm(device)}>
            <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          </IconButton> */}
              <IconButton size='large' onClick={() => openVersionUpgradeConfirm(device.data)}>
                <FontAwesomeIcon icon={faUpload} />
              </IconButton>
            </Layout.Box>

            <S.HeadButtonContainer>
              <S.EditButton
                onClick={() => {
                  console.log('수정하기 버튼 클릭');
                  mutate({
                    id: device.data.id,
                    name: deviceName,
                    desc: devicedesc,
                    address: `${
                      addressList.country?.find(({ id }) => id === deviceCountry)?.value || ''
                    }, ${
                      addressList?.[deviceCountry]?.find(({ id }) => id === deviceCity)?.value || ''
                    }, ${
                      addressList?.[deviceCity]?.find(({ id }) => id === deviceRegion)?.value || ''
                    }`,
                    isCategoryVisible,
                    isWidgetVisible,
                    builtinWidgetAddress: `${
                      addressList.country?.find(({ id }) => id === country)?.value || ''
                    }, ${addressList?.[country]?.find(({ id }) => id === city)?.value || ''}, ${
                      addressList?.[city]?.find(({ id }) => id === region)?.value || ''
                    }`,
                    orientation,
                    autoScale,
                  });
                }}
                disabled={isButtonDiabled}
              >
                수정
              </S.EditButton>
            </S.HeadButtonContainer>
          </S.Head>

          <S.Body>
            {/* 기기정보 */}
            <Layout.Box>
              <S.InfoTitle>기기정보</S.InfoTitle>
              <S.InfoContent>
                <S.TextLabel>기기명</S.TextLabel>
                <Form.Input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />

                <S.TextLabel>소유자</S.TextLabel>
                <Form.Input as='div'>{device.data?.owner?.displayName || '-'}</Form.Input>

                {/* 설명 */}
                <S.TextLabel>설명</S.TextLabel>
                {/* <Form.Input as='div'>{device.data.desc || '-'}</Form.Input> */}
                <Form.Input value={devicedesc} onChange={(e) => setDevicedesc(e.target.value)} />
                {/* 보기 모드 */}
                <S.TextLabel htmlFor='orientation-radio-buttons-group-label'>
                  {t('app-device.orientation')}
                </S.TextLabel>
                {/* <Form.Input as='div'>{device.data.orientation || '-'}</Form.Input> */}
                <RadioGroup
                  aria-labelledby='orientation-radio-buttons-group-label'
                  value={orientation}
                  name='orientation-buttons-group'
                  onChange={(e) => setOrientation(e.target.value)}
                  sx={{ flexDirection: 'row' }}
                >
                  <S.FormControlLabel
                    value='LANDSCAPE'
                    control={<Radio />}
                    label={t('app-device.orientation.landscape')}
                  />
                  <S.FormControlLabel
                    value='PORTRAIT'
                    control={<Radio />}
                    label={t('app-device.orientation.portrait')}
                  />
                </RadioGroup>

                {/* 종횡비 */}
                <Form.Label htmlFor='address-country'>종횡비</Form.Label>
                <Form.Select
                  id='address-country'
                  value={autoScale}
                  onChange={(e) => {
                    setAutoScale(e.target?.value as string);
                  }}
                  defaultValue={''}
                >
                  <Form.Option key='FULL_STRETCH' value={'FULL_STRETCH'}>
                    화면에 맞게 늘리기
                  </Form.Option>
                  <Form.Option key='ASPECT_RATIO' value={'ASPECT_RATIO'}>
                    종횡비에 맞게 늘리기
                  </Form.Option>
                  <Form.Option key='NONE' value={'NONE'}>
                    없음
                  </Form.Option>
                </Form.Select>

                <Form.Label htmlFor='address-country'>기기 주소</Form.Label>
                <S.SelectContainer>
                  <Form.Select
                    id='address-country'
                    value={deviceCountry}
                    onChange={(e) => {
                      setDeviceCountry(e.target.value as string);
                      setCity('');
                      setRegion('');
                    }}
                    defaultValue={''}
                  >
                    {addressList?.country.map((item) => (
                      <Form.Option key={item.id} value={item.id}>
                        {item.value}
                      </Form.Option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    id='address-city'
                    value={deviceCity}
                    onChange={(e) => {
                      setDeviceCity(e.target.value as string);
                      setRegion('');
                    }}
                    defaultValue={''}
                  >
                    {addressList?.[deviceCountry]?.map((item) => (
                      <Form.Option key={item.id} value={item.id}>
                        {item.value}
                      </Form.Option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    id='address-region'
                    value={deviceRegion}
                    onChange={(e) => {
                      setDeviceRegion(e.target.value as string);
                    }}
                    defaultValue={''}
                  >
                    {addressList?.[deviceCity]?.map((item) => (
                      <Form.Option key={item.id} value={item.id}>
                        {item.value}
                      </Form.Option>
                    ))}
                  </Form.Select>
                </S.SelectContainer>

                <S.TextLabel>{t('app-device.pinCode')}</S.TextLabel>
                <Form.Input as='div'>{device.data.pinCode || '-'}</Form.Input>

                <S.TextLabel>{t('app-device.storage')}</S.TextLabel>
                <Form.Input as='div'>{storageCapacityText}</Form.Input>

                <S.TextLabel>최초 등록시각</S.TextLabel>
                <Form.Input as='div'>
                  {dayjs(device.data.activatedDate).format('YYYY-MM-DD HH:mm:ss') || '-'}
                </Form.Input>

                <S.TextLabel>최초 연결시각</S.TextLabel>
                <Form.Input as='div'>
                  {dayjs(device.data.createdDate).format('YYYY-MM-DD HH:mm:ss') || '-'}
                </Form.Input>

                <S.TextLabel>{t('app-device.detail.tab.features.sleep')}</S.TextLabel>
                <Form.Input
                  value={`${device.data.autoActions?.[0]?.endTime || '--:--'} ~ ${
                    device.data.autoActions?.[0]?.startTime || '--:--'
                  }`}
                  onClick={openDeviceSleepModeDialog}
                  readOnly
                />

                <S.TextLabel>SW 버전</S.TextLabel>
                <Form.Input as='div'>{device.data?.swVersion || '-'}</Form.Input>

                <S.TextLabel>OS 종류</S.TextLabel>
                <Form.Input as='div'>{device.data?.os || '-'}</Form.Input>

                <S.TextLabel>OS 버전</S.TextLabel>
                <Form.Input as='div'>{device.data?.osVersion || '-'}</Form.Input>

                {/* <S.TextLabel>{t('app-device.liveStatus')}</S.TextLabel>
                <Form.Input as='div'>
                  <S.CheckIcon icon={faCheckCircle} checked={device.data.liveStatus === 'ONLINE'} />
                  &nbsp;
                  {device.data.liveStatus === 'ONLINE'
                    ? t('app-device.liveStatus-online')
                    : t('app-device.liveStatus-offline')}
                </Form.Input> */}

                <S.TextLabel>{t('app-device.sleep.status')}</S.TextLabel>
                <Form.Input as='div'>
                  <S.CheckIcon icon={faCheckCircle} checked={device.data.playStatus === 'SLEEP'} />
                  &nbsp;
                  {device.data.playStatus === 'SLEEP' ? t('app-device.on') : t('app-device.off')}
                </Form.Input>

                <S.TextLabel>공인 IP 주소</S.TextLabel>
                <Form.Input as='div'>{device.data?.publicIpAddress || '-'}</Form.Input>

                <S.TextLabel>{t('app-device.ipAddress')}</S.TextLabel>
                <Form.Input as='div'>{device.data?.ipAddress || '-'}</Form.Input>

                <S.TextLabel>MAC</S.TextLabel>
                <Form.Input as='div'>{device.data?.macAddress || '-'}</Form.Input>

                {/* <S.TextLabel>그룹 ID</S.TextLabel> */}
                {/* <Form.Input as='div'>{device.data.group.id || '-'}</Form.Input> */}

                {/* <S.TextLabel>그룹 이름</S.TextLabel> */}
                {/* <Form.Input as='div'>{device.data.group.name || '-'}</Form.Input> */}

                {/* <Form.Label htmlFor='weather-Bar'>빌트인 위젯 표시</Form.Label>
                <Form.Select
                  value={isWidgetVisible}
                  onChange={(e) => setIsWidgetVisible(e.target.value as string)}
                  defaultValue={device.data?.isWidgetVisible.toString()}
                >
                  <Form.Option value='true'>on</Form.Option>
                  <Form.Option value='false'>off</Form.Option>
                </Form.Select>

                <Form.Label htmlFor='category-Bar'>카테고리 표시</Form.Label>
                <Form.Select
                  value={isCategoryVisible}
                  onChange={(e) => setIsCategoryVisible(e.target.value as string)}
                  defaultValue={device.data?.isCategoryVisible.toString()}
                >
                  <Form.Option value='true'>on</Form.Option>
                  <Form.Option value='false'>off</Form.Option>
                </Form.Select> */}

                <Form.Label htmlFor='isWidgetVisible-switch'>빌트인 위젯 표시</Form.Label>
                <Form.Switch
                  id='isWidgetVisible-switch'
                  checked={isWidgetVisible === 'true'}
                  onChange={(e) => setIsWidgetVisible(e.target.checked ? 'true' : 'false')}
                  name='빌트인 위젯 표시'
                />

                <Form.Label htmlFor='isCategoryVisible-switch'>카테고리 표시</Form.Label>
                <Form.Switch
                  id='isCategoryVisible-switch'
                  checked={isCategoryVisible === 'true'}
                  onChange={(e) => setIsCategoryVisible(e.target.checked ? 'true' : 'false')}
                  name='카테고리 표시'
                />

                <S.TextLabel>빌트인 위젯 주소</S.TextLabel>

                <S.SelectContainer>
                  <Form.Select
                    id='address-country'
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value as string);
                      setCity('');
                      setRegion('');
                    }}
                    defaultValue={''}
                  >
                    {addressList?.country.map((item) => (
                      <Form.Option key={item.id} value={item.id}>
                        {item.value}
                      </Form.Option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    id='address-city'
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value as string);
                      setRegion('');
                    }}
                    defaultValue={''}
                  >
                    {addressList?.[country]?.map((item) => (
                      <Form.Option key={item.id} value={item.id}>
                        {item.value}
                      </Form.Option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    id='address-region'
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value as string);
                    }}
                    defaultValue={''}
                  >
                    {addressList?.[city]?.map((item) => (
                      <Form.Option key={item.id} value={item.id}>
                        {item.value}
                      </Form.Option>
                    ))}
                  </Form.Select>
                </S.SelectContainer>
              </S.InfoContent>
            </Layout.Box>

            {/* 재생정보 */}
            <Layout.Box>
              <S.InfoTitle>재생정보</S.InfoTitle>

              {device.data.categoryManagement.map((category) => (
                <>
                  <S.InfoTitle>{'카테고리 : ' + category.name}</S.InfoTitle>

                  <S.InfoContainer>
                    {device.data.contentManagement
                      .filter((content) => content.category === category.id)
                      .map((content) => (
                        <S.InfoBox key={content.id}>
                          <Page.ThumbnailImage
                            src={config.EXTERNAL.CUBLICK.CONTENT.THUMBNAIL(content.id, authToken)}
                            alt='썸네일'
                            onError={onErrorImg}
                          />
                          <S.TextLabel>{content.name}</S.TextLabel>
                          <S.DeleteButton
                            as='div'
                            onClick={() => {
                              deletePlayingContent(
                                content.id,
                                content.name,
                                {
                                  id: category.id,
                                  name: category.name,
                                },
                                device.data.id
                              );
                            }}
                          >
                            삭제
                          </S.DeleteButton>
                        </S.InfoBox>
                      ))}
                  </S.InfoContainer>
                  {device.data.presentations.map((presentation) => (
                    <S.InfoContainer key={presentation.id}>
                      <Page.ThumbnailImage
                        src={config.EXTERNAL.CUBLICK.PRESENTATION.THUMBNAIL(
                          presentation.id,
                          authToken
                        )}
                        alt='썸네일'
                        onError={onErrorImg}
                      />
                      <S.TextLabel>{'프리젠테이션명 : ' + presentation.name}</S.TextLabel>
                      <S.DeleteButton
                        as='div'
                        onClick={() => {
                          console.log('프리젠테이션 삭제 클릭');
                          deletePlayingPresentation(
                            presentation.id,
                            presentation.name,
                            {
                              id: category.id,
                              name: category.name,
                            },
                            device.data.id
                          );
                        }}
                      >
                        삭제
                      </S.DeleteButton>
                    </S.InfoContainer>
                  ))}
                  {device.data.assets.map((asset) => (
                    <S.InfoContainer key={asset.id}>
                      <Page.ThumbnailImage
                        src={config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(asset.id, authToken)}
                        alt='썸네일'
                        onError={onErrorImg}
                      />
                      <S.TextLabel>{'자료명 : ' + asset.name}</S.TextLabel>
                      <S.DeleteButton
                        as='div'
                        onClick={() => {
                          console.log('자료 삭제 클릭');
                          deletePlayingAsset(
                            asset.id,
                            asset.name,
                            asset.startDate,
                            asset.endDate,
                            device.data.id,
                            {
                              id: category.id,
                              name: category.name,
                            }
                          );
                        }}
                      >
                        삭제
                      </S.DeleteButton>
                    </S.InfoContainer>
                  ))}
                </>
              ))}
              {/* <img src={imageSrc} alt='Loading.....' /> */}
              <DeviceSnapshot deviceId={device.data._id} />
              <S.InfoTitle>메세지</S.InfoTitle>
              <S.TextLabel>{device.data.data}</S.TextLabel>
            </Layout.Box>
          </S.Body>
        </Page.Container>
      )}
    </div>
  );
}
