import address from '@app/resources/address/korea.json';
import IMG_Delete from '@app/resources/icons/icon_delete.png';
import { Asset } from '@app/src/apis/assets';
import { postWidgetInstance, putWidgetInstance } from '@app/src/apis/widget/widgetApi';
import {
  WidgetBaseSingle,
  WidgetInstance,
  WidgetDataItem,
  WidgetAsset,
} from '@app/src/apis/widget/widgetApi.model';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { Selection } from '@app/src/components/Selection';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { ModalProps } from '@app/src/store/model';
import { selectUserDataByKey } from '@app/src/store/slices/authSlice';
import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { SelectChangeEvent } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '../Alert';
import { FaLoading } from '../Loading';
import * as S from './GeneralWidgetDialog.style';

type Props = ModalProps &
  (
    | { mode: 'ADD'; widget: WidgetBaseSingle }
    | { mode: 'EDIT'; widget: WidgetInstance }
    | { mode: 'EDITOR'; widget: WidgetInstance; onConfirmed: (widget: WidgetInstance) => void }
  );

const cityToSmallCityIndexMapper = {
  서울특별시: 'CitySeoul',
  부산광역시: 'CityBusan',
  대구광역시: 'CityDaegu',
  인천광역시: 'CityIncheon',
  광주광역시: 'CityGwangju',
  대전광역시: 'CityDaejeon',
  울산광역시: 'CityUlsan',
  경기도: 'CityGyeonggi',
  강원도: 'CityGangwon',
  충청북도: 'CityChungcheongbuk',
  충청남도: 'CityChungcheongnam',
  전라북도: 'CityJeollabuk',
  전라남도: 'CityJeollanam',
  경상북도: 'CityGyeongsangbuk',
  경상남도: 'CityGyeongsangnam',
  제주도: 'CityJeju',
};

export function GeneralWidgetDialog(props: Props) {
  const { mode, widget, closeSelf } = props;

  const { t } = useTranslation();
  const modalCtrl = useModal();
  const userLang = useSelector(selectUserDataByKey('lang'));
  const queryClient = useQueryClient();

  const putWidgetApi = useMutation({
    mutationFn: putWidgetInstance,
    onMutate: () => queryClient.invalidateQueries(['widget_instants']),
    onSuccess: () => closeSelf(),
    onError: () => modalCtrl.open(<Alert text='위젯 수정에 실패하였습니다.' />),
  });
  const postWidgetApi = useMutation({
    mutationFn: postWidgetInstance,
    onMutate: () => queryClient.invalidateQueries(['widget_instants']),
    onSuccess: () => closeSelf(),
    onError: () => modalCtrl.open(<Alert text='위젯 추가에 실패하였습니다.' />),
  });

  const defaultProperties = useMemo(() => {
    if (mode !== 'ADD') return widget.properties;
    return widget.propertyPatterns.map((pattern) => ({
      code: pattern.code,
      dataType: pattern.dataType,
      value: pattern.defVal,
    }));
  }, [widget, mode]);

  const [other, otherActions] = useTypeSafeReducer(widget, {
    onNameChange: (state, e: React.ChangeEvent<HTMLInputElement>) => {
      state.name[userLang] = e.target.value;
    },
  });
  const [data, dataActions] = useTypeSafeReducer(widget.data, {
    addData: (state, payload: WidgetDataItem) => {
      state.push({ zOrder: state.length, item: [payload] });
    },
    updateData: (state, payload: { index: number; value: WidgetDataItem }) => {
      state[payload.index].item[0] = payload.value;
    },
    removeData: (state, payload: number) => {
      state.splice(payload, 1);
      state.forEach((datum, index) => (datum.zOrder = index));
    },
  });

  const [widgetAsset, widgetAssetAction] = useTypeSafeReducer(widget.assets, {
    addAsset: (state, payload: WidgetAsset) => {
      state.push({
        id: payload.id,
        md5: payload.md5,
        name: payload.name,
        fileType: payload.fileType,
        mimeType: payload.mimeType,
      });
    },
    updateAsset: (state, payload: { index: number; value: WidgetAsset }) => {
      state[payload.index] = payload.value;
    },
  });

  const [properties, propertyActions] = useTypeSafeReducer(defaultProperties, {
    set: (state, payload: { code: string; value: string }) => {
      const property = state.find((property) => property.code === payload.code);
      property.value = payload.value;
    },
    onChange: (state, e: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>) => {
      const property = state.find((property) => property.code === e.target.name);
      property.value = e.target.value;
    },
    onAddressCityChange: (state, e: SelectChangeEvent) => {
      const property = state.find((property) => property.code === 'address');
      const [country, _, __] = property.value.split(', ');
      console.log('제주 e.target.value : ', e.target.value);
      const smallCityIndex = cityToSmallCityIndexMapper[e.target.value];
      const smallCity = address[smallCityIndex][0];
      property.value = [country, e.target.value, smallCity].join(', ');
    },
    onAddressSmallCityChange: (state, e: SelectChangeEvent) => {
      const property = state.find((property) => property.code === 'address');
      const [country, city, _] = property.value.split(', ');
      property.value = [country, city, e.target.value].join(', ');
    },
  });

  const addImageContent = () => {
    modalCtrl.open(
      <Selection
        availables={['ASSET']}
        onSelect={(data: Asset) => {
          dataActions.addData({
            code: 'PHOTO',
            dataType: 'IMAGE',
            value: data.id,
            dataSrc: 'SDSS',
            dataName: data.name,
            srcLink: data.srcLink,
            srcType: data.srcType,
            mimeType: data.mimeType,
          });
          widgetAssetAction.addAsset({
            id: data.id,
            md5: data.md5,
            name: data.name,
            fileType: data.fileType,
            mimeType: data.mimeType,
          });
        }}
      />
    );
  };

  const editImageContent = (index: number) => {
    modalCtrl.open(
      <Selection
        availables={['ASSET']}
        onSelect={(data: Asset) => {
          dataActions.updateData({
            index: index,
            value: {
              code: 'PHOTO',
              dataType: 'IMAGE',
              value: data.id,
              dataSrc: 'SDSS',
              dataName: data.name,
              srcLink: data.srcLink,
              srcType: data.srcType,
              mimeType: data.mimeType,
            },
          });
          widgetAssetAction.updateAsset({
            index: index,
            value: {
              id: data.id,
              md5: data.md5,
              name: data.name,
              fileType: data.fileType,
              mimeType: data.mimeType,
            },
          });
        }}
      />
    );
  };

  const addVideoContent = () => {
    modalCtrl.open(
      <Selection
        availables={['ASSET']}
        onSelect={(data: Asset) => {
          dataActions.addData({
            code: 'VIDEO',
            dataType: 'VIDEO',
            value: data.id,
            dataSrc: 'SDSS',
            dataName: data.name,
            srcLink: data.srcLink,
            srcType: data.srcType,
            mimeType: data.mimeType,
          });
          widgetAssetAction.addAsset({
            id: data.id,
            md5: data.md5,
            name: data.name,
            fileType: data.fileType,
            mimeType: data.mimeType,
          });
        }}
      />
    );
  };

  const editVideoContent = (index: number) => {
    modalCtrl.open(
      <Selection
        availables={['ASSET']}
        onSelect={(data: Asset) => {
          dataActions.updateData({
            index: index,
            value: {
              code: 'VIDEO',
              dataType: 'VIDEO',
              value: data.id,
              dataSrc: 'SDSS',
              dataName: data.name,
              srcLink: data.srcLink,
              srcType: data.srcType,
              mimeType: data.mimeType,
            },
          });
          widgetAssetAction.updateAsset({
            index: index,
            value: {
              id: data.id,
              md5: data.md5,
              name: data.name,
              fileType: data.fileType,
              mimeType: data.mimeType,
            },
          });
        }}
      />
    );
  };

  const onSaveClick = () => {
    if (mode === 'ADD') {
      postWidgetApi.mutate({
        widget: widget.id,
        name: other.name[userLang],
        data: data,
        properties: properties,
      });

      return;
    }
    if (mode === 'EDIT') {
      putWidgetApi.mutate({
        id: widget.id,
        name: other.name,
        data: data,
        properties: properties,
      });

      return;
    }
    if (mode === 'EDITOR') {
      props.onConfirmed({
        ...widget,
        name: other.name,
        data: data,
        properties: properties,
        assets: widgetAsset,
      });
      console.log('name: ', name);
      console.log('data: ', data);
      console.log('properties: ', properties);
      console.log('????!@#!: ', widgetAsset);
      closeSelf();
      return;
    }
  };

  const isLoading = postWidgetApi.isLoading || putWidgetApi.isLoading;
  const isNameValid = other.name[userLang] !== '';
  const isButtonDiabled = isLoading || !isNameValid;

  return (
    <Modal.Container>
      <Modal.Background onClick={closeSelf} />
      <Modal.Body>
        <Modal.Title>
          {mode === 'ADD' ? `${widget.code} 위젯 추가` : null}
          {mode === 'EDIT' ? `${widget.code} 위젯 수정` : null}
          {mode === 'EDITOR' ? `${widget.code} 위젯 수정` : null}
        </Modal.Title>
        <Modal.Content>
          <S.Box>
            <S.TextLabel htmlFor='name'>이름</S.TextLabel>
            <S.Desc>위젯의 이름</S.Desc>
            {!isNameValid ? <Form.ErrMsg>위젯의 이름을 입력해주세요.</Form.ErrMsg> : null}
            <Form.Input
              id='name'
              defaultValue={other.name[userLang]}
              onChange={otherActions.onNameChange}
            />
          </S.Box>
          {widget.propertyPatterns
            .filter((pattern) => !pattern.isHidden)
            .map((pattern) => (
              <S.Box key={pattern.code}>
                <S.TextLabel htmlFor={pattern.code}>
                  {pattern.name[userLang] || pattern.name['en']}
                </S.TextLabel>
                {!!pattern.desc ? (
                  <S.Desc>{pattern.desc[userLang] || pattern.desc['en']}</S.Desc>
                ) : null}

                {pattern.ctrType === 'INPUT' &&
                pattern.dataType === 'STRING' &&
                pattern.code !== 'address' ? (
                  <Form.Input
                    id={pattern.code}
                    name={pattern.code}
                    defaultValue={pattern.defVal}
                    onChange={propertyActions.onChange}
                    autoComplete='off'
                    autoCorrect='off'
                  />
                ) : null}

                {pattern.ctrType === 'SWITCH' ? (
                  <Form.Select
                    color='secondary'
                    name={pattern.code}
                    id={pattern.code}
                    defaultValue={String(pattern.defVal)}
                    onChange={propertyActions.onChange}
                  >
                    <Form.Option value='true'>Yes</Form.Option>
                    <Form.Option value='false'>No</Form.Option>
                  </Form.Select>
                ) : null}

                {pattern.ctrType === 'SELECT' ? (
                  <Form.Select
                    color='secondary'
                    id={pattern.code}
                    name={pattern.code}
                    defaultValue={pattern.defVal}
                    onChange={propertyActions.onChange}
                  >
                    {pattern.options.map((option) => (
                      <Form.Option value={option.key} key={option.key}>
                        {option.value[userLang] || option.value['en']}
                      </Form.Option>
                    ))}
                  </Form.Select>
                ) : null}

                {pattern.ctrType === 'NUMBER' ? (
                  <Form.Input
                    id={pattern.code}
                    name={pattern.code}
                    type='number'
                    defaultValue={pattern.defVal}
                    onChange={propertyActions.onChange}
                    autoComplete='off'
                    autoCorrect='off'
                  />
                ) : null}

                {pattern.ctrType === 'COLOR' ? (
                  <Layout.ChromePicker
                    disableAlpha
                    color={properties.find((p) => p.code === pattern.code)?.value}
                    onChange={(colorResult) => {
                      propertyActions.set({ code: pattern.code, value: colorResult.hex });
                    }}
                  />
                ) : null}

                {pattern.ctrType === 'INPUT' && pattern.dataType === 'IMAGE' ? (
                  <>
                    <Layout.Box mb='10px'>
                      <S.ContentAddButton onClick={addImageContent}>컨탠츠 선택</S.ContentAddButton>
                    </Layout.Box>
                    {data.map((datum, dataIndex) => (
                      <S.ImageItem key={datum.item[0].value + dataIndex}>
                        <div className='name'>{datum.item[0].dataName}</div>
                        <button className='edit' onClick={() => editImageContent(dataIndex)}>
                          {t('app-common.edit')}
                        </button>
                        <img
                          src={IMG_Delete}
                          alt='delete-single-playlist-content'
                          className='delete'
                          onClick={() => dataActions.removeData(dataIndex)}
                        />
                      </S.ImageItem>
                    ))}
                  </>
                ) : null}

                {pattern.ctrType === 'INPUT' && pattern.dataType === 'VIDEO' ? (
                  <>
                    <Layout.Box mb='10px'>
                      <S.ContentAddButton onClick={addVideoContent}>컨탠츠 선택</S.ContentAddButton>
                    </Layout.Box>
                    {data.map((datum, dataIndex) => (
                      <S.ImageItem key={datum.item[0].value + dataIndex}>
                        <div className='name'>{datum.item[0].dataName}</div>
                        <button className='edit' onClick={() => editVideoContent(dataIndex)}>
                          {t('app-common.edit')}
                        </button>
                        <img
                          src={IMG_Delete}
                          alt='delete-single-playlist-content'
                          className='delete'
                          onClick={() => dataActions.removeData(dataIndex)}
                        />
                      </S.ImageItem>
                    ))}
                  </>
                ) : null}

                {pattern.ctrType === 'INPUT' &&
                pattern.dataType === 'STRING' &&
                pattern.code === 'address' ? (
                  <Layout.Box mb='10px' display='flex'>
                    <Form.Select color='secondary' value={'대한민국'}>
                      <Form.Option value={'대한민국'}>대한민국</Form.Option>
                    </Form.Select>
                    <Form.Select
                      color='secondary'
                      value={properties.find((p) => p.code === pattern.code)?.value.split(', ')[1]}
                      onChange={propertyActions.onAddressCityChange}
                    >
                      {address.CityArray.map((city) => (
                        <Form.Option value={city} key={city}>
                          {city}
                        </Form.Option>
                      ))}
                    </Form.Select>
                    <Form.Select
                      color='secondary'
                      value={properties.find((p) => p.code === pattern.code)?.value.split(', ')[2]}
                      onChange={propertyActions.onAddressSmallCityChange}
                    >
                      {address[
                        cityToSmallCityIndexMapper[
                          properties.find((p) => p.code === pattern.code)?.value.split(', ')[1]
                        ]
                      ]?.map((smallCity: string) => (
                        <Form.Option value={smallCity} key={smallCity}>
                          {smallCity}
                        </Form.Option>
                      ))}
                    </Form.Select>
                  </Layout.Box>
                ) : null}
              </S.Box>
            ))}
        </Modal.Content>
        <Modal.Actions>
          <Modal.SaveButton disabled={isButtonDiabled} onClick={onSaveClick}>
            {isLoading ? <FaLoading icon={faSpinnerThird} color='#ffffff' /> : t('app-common.save')}
          </Modal.SaveButton>
          <Modal.CloseButton disabled={isButtonDiabled} onClick={closeSelf}>
            {t('app-common.close')}
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}
