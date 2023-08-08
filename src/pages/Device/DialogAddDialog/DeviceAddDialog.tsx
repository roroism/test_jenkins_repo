import { activateDeivce, assignGroup, editDevice } from '@app/src/apis/device';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { ModalProps } from '@app/src/store/model';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useRef, useState } from 'react';
import * as S from './DeviceAddDialog.style';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import addressList from '@app/src/addressList';
import { Alert } from '@app/src/components/Alert';
import { useModal } from '@app/src/hooks/useModal';
import { Alarm } from '@app/src/components/AlarmModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

type DeviceAddDialogProps = {
  groupId: string;
  closeDialog?: Function;
  closeAnimation?: boolean;
} & ModalProps;

const createDefaultPincCodeArray = () => {
  const defaultPinCodeArray = new Array(8).fill('[A-Z0-9]{4}');
  defaultPinCodeArray[2] = '';
  defaultPinCodeArray[5] = '';
  return defaultPinCodeArray.sort(() => Math.random() - 0.5);
};

export function DeviceAddDialog(props: DeviceAddDialogProps) {
  const { closeDialog, groupId, closeSelf, closeAnimation = true } = props;
  const modalCtrl = useModal();
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const [pinCodeArray, setPinCodeArray] = useState(createDefaultPincCodeArray());
  const [deviceName, setDeviceName] = useState('');
  const [deviceDesc, setDeviceDesc] = useState('');
  const [deviceCountry, setDeviceCountry] = useState('');
  const [deviceCity, setDeviceCity] = useState('');
  const [deviceRegion, setDeviceRegion] = useState('');
  const [orientation, setOrientation] = useState('');
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);

  const isButtonDiabled =
    pinCodeArray.join('').length < 74 ||
    deviceName.length < 1 || //4
    deviceDesc.length < 1 || //4
    groupId.length < 1 ||
    deviceCountry.length < 1 ||
    deviceCity.length < 1 ||
    deviceRegion.length < 1;

  /** save device all data a for activate */
  const saveDeviceData = () => {
    const resultPinCode = pinCodeArray.join('-');

    const deviceData = {
      pinCode: resultPinCode,
      name: deviceName,
      desc: deviceDesc,
      villageCode: '',
      // address: '대한민국, 전라남도, 곡성군',
      address: `${addressList.country.find(({ id }) => id === deviceCountry).value}, ${
        addressList?.[deviceCountry].find(({ id }) => id === deviceCity).value
      }, ${addressList?.[deviceCity]?.find(({ id }) => id === deviceRegion).value}`,
      orientation,
    };

    setTimeout(() => {
      activateDeivce(deviceData)
        .then((res) => {
          setTimeout(() => {
            editDevice(deviceData, res).then((res) => {
              // if (groupId !== '') {
              //   assignGroup(res, groupId).then(() => {
              //     closeDialog?.(false, true);
              //     closeSelf?.();
              //   });
              // } else {
              //   closeDialog?.(false, true);
              //   closeSelf?.();
              // }
              // closeDialog?.(false, true);
              // closeSelf?.();

              closeDialog?.(false, true);
              modalCtrl.open(<Alarm text='기기가 등록되었습니다.' onClose={closeSelf} />);
            });
          }, 500);
        })
        .catch(() => {
          closeDialog?.(false, true);
          modalCtrl.open(
            <Alert
              text='기기를 등록하는데 실패했습니다.'
              extraText='Pin Code 등이 맞게 입력됐는지 확인해주세요.'
              onClose={closeSelf}
            />
          );
        })
        .finally(() => {
          queryClient.invalidateQueries(['device', 'all']);
        });
    }, 100);
  };

  const changePinCode = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setPinCodeArray((prev) => {
      const newPinCodeArray = [...prev];
      newPinCodeArray[index] = e.target.value.toUpperCase();
      return newPinCodeArray;
    });
  };

  const onDeviceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(e.target.value);
  };

  const onDeviceDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceDesc(e.target.value);
  };

  const hendleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceCountry(e.target.value);
    setDeviceCity('');
    setDeviceRegion('');
  };

  const hendleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceCity(e.target.value);
    setDeviceRegion('');
  };

  const hendleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceRegion(e.target.value);
  };

  const closeWithAnimation = useCallback(() => {
    modalBodyRef.current.classList.add('close');
    modalBackgroundRef.current.classList.add('close');

    setTimeout(() => {
      closeDialog?.(false);
      closeSelf?.();
    }, 400);
  }, []);

  const close = () => {
    if (closeAnimation) {
      closeWithAnimation();
    } else {
      closeDialog?.(false);
      closeSelf?.();
    }
  };

  return (
    <Modal.Container>
      <Modal.Background ref={modalBackgroundRef} onClick={close} />
      <Modal.Body ref={modalBodyRef} width='700px'>
        <Modal.Title>기기추가</Modal.Title>
        <Modal.Content>
          <Layout.Box mb='20px'>
            <Form.Label>기기를 계정에 등록하려면 기기의 핀코드를 입력하세요.</Form.Label>
            <S.PinCodeInputContainer>
              {pinCodeArray?.map((pin, index, arr) => {
                return (
                  <>
                    {pin !== '[A-Z0-9]{4}' ? (
                      <S.PinCodeInput
                        key={index}
                        value={pin}
                        onChange={(e) => changePinCode(e, index)}
                        autoComplete='off'
                        maxLength={4}
                      />
                    ) : (
                      <S.PinCodeSpan>XXXX</S.PinCodeSpan>
                    )}

                    {arr.length - 1 !== index && <S.PinCodeSpan>-</S.PinCodeSpan>}
                  </>
                );
              })}
            </S.PinCodeInputContainer>
          </Layout.Box>

          {/* <Layout.Box>
            <Form.Label htmlFor='group-name'>그룹명</Form.Label>
            <Form.Select id='group-name' color='secondary' value={groupId} onChange={saveGroupName}>
              {groupList.map((group: any) => (
                <Form.Option value={group.id}>{group.name}</Form.Option>
              ))}
            </Form.Select>
          </Layout.Box> */}

          <Layout.Box mb='20px'>
            <Form.Label htmlFor='device-name'>기기명</Form.Label>
            <Form.Input id='device-name' value={deviceName} onChange={onDeviceNameChange} />
          </Layout.Box>

          <Layout.Box>
            <Form.Label htmlFor='device-desc'>기기 설명</Form.Label>
            <Form.Input id='device-desc' value={deviceDesc} onChange={onDeviceDescChange} />
          </Layout.Box>
          <Layout.Box>
            <Form.Label>기기 주소</Form.Label>
            <Layout.Box display='flex' flexDirection='row' justifyContent='space-between'>
              <Layout.Box w='32.5%'>
                <FormControl sx={{ m: 1, width: '100%', margin: '8px 0' }}>
                  <InputLabel
                    id='device-country-label'
                    sx={{ color: '#707070', fontSize: '1.3rem' }}
                  >
                    국가
                  </InputLabel>
                  <Select
                    labelId='device-country-label'
                    id='device-country'
                    value={deviceCountry}
                    label='국가'
                    onChange={hendleCountryChange}
                  >
                    {addressList?.country.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>Required</FormHelperText> */}
                </FormControl>
              </Layout.Box>
              <Layout.Box w='32.5%'>
                <FormControl sx={{ m: 1, width: '100%', margin: '8px 0' }}>
                  <InputLabel id='device-city-label' sx={{ color: '#707070', fontSize: '1.3rem' }}>
                    시/도
                  </InputLabel>
                  <Select
                    labelId='device-city-label'
                    id='device-city'
                    value={deviceCity}
                    label='시/도'
                    onChange={hendleCityChange}
                    disabled={deviceCountry === '' ? true : false}
                  >
                    {addressList?.[deviceCountry]?.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>Required</FormHelperText> */}
                </FormControl>
              </Layout.Box>
              <Layout.Box w='32.5%'>
                <FormControl sx={{ m: 1, width: '100%', margin: '8px 0' }}>
                  <InputLabel
                    id='device-region-label'
                    sx={{ color: '#707070', fontSize: '1.3rem' }}
                  >
                    시군구
                  </InputLabel>
                  <Select
                    labelId='device-region-label'
                    id='device-region'
                    value={deviceRegion}
                    label='시군구'
                    onChange={hendleRegionChange}
                    disabled={deviceCity === '' ? true : false}
                  >
                    {addressList?.[deviceCity]?.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.value}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* <FormHelperText>Required</FormHelperText> */}
                </FormControl>
              </Layout.Box>
            </Layout.Box>
          </Layout.Box>
          {/* <Layout.Box>
            <Form.Label>{t('app-device.orientation')}</Form.Label>
            <RadioGroup
              aria-labelledby='orientation-radio-buttons-group-label'
              value={orientation}
              name='orientation-buttons-group'
              onChange={(e) => setOrientation(e.target.value)}
              sx={{ flexDirection: 'row' }}
            >
              <S.StyledFormControlLabel
                value='LANDSCAPE'
                control={<Radio />}
                label={t('app-device.orientation.landscape')}
              />
              <S.StyledFormControlLabel
                value='PORTRAIT'
                control={<Radio />}
                label={t('app-device.orientation.portrait')}
              />
            </RadioGroup>
          </Layout.Box> */}
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton onClick={saveDeviceData} disabled={isButtonDiabled}>
            추가
          </Modal.SaveButton>
          <Modal.CloseButton onClick={close}>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
