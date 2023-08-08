import fontList from '@app/resources/fontList.json';
import {
  AlignModeType,
  InstantMessageAPIResponse,
  InstantMessageDataType,
  InstantmessageRequestBody,
  RepeatModeType,
} from '@app/src/apis/instantMessage';
import {
  createInstantMessageApi,
  editInstantMessageApi,
} from '@app/src/apis/instantMessage/instantMessageApi';
import { Alert } from '@app/src/components/Alert';
import * as Form from '@app/src/components/Form.style';
import * as Layout from '@app/src/components/Layout.style';
import * as Modal from '@app/src/components/Modal.style';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useTypeSafeReducer } from '@app/src/hooks/useTypeSafeReducer';
import { ModalProps } from '@app/src/store/model';
import { hexaToRgba, isNumberBetween, rgbaToHexa } from '@app/src/utils';
import { faBold } from '@fortawesome/pro-regular-svg-icons/faBold';
import { faItalic } from '@fortawesome/pro-regular-svg-icons/faItalic';
import { faStrikethrough } from '@fortawesome/pro-regular-svg-icons/faStrikethrough';
import { faUnderline } from '@fortawesome/pro-regular-svg-icons/faUnderline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as S from './InstantMessageDialog.style';
import { css } from '@emotion/react';
import Popover from '@mui/material/Popover';
import { formattingDate } from '@app/src/utils/dayUtils';


type InstantMessageDialogProps = {
  instantMessageId?: String;
  messageData?: InstantMessageAPIResponse;
  closeAnimation?: boolean;
  mode: 'ADD' | 'EDIT';
} & ModalProps;

interface KeyValueType {
  key: string;
  value?: any;
}
const fontSizeCandidates = [
  9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96, 120, 144, 168, 192, 216, 240, 264,
];

const alignOutList: InstantmessageRequestBody['data']['align'][] = [
  'TOP_LEFT',
  'TOP_CENTER',
  'TOP_RIGHT',
  'MIDDLE_LEFT',
  'MIDDLE_CENTER',
  'MIDDLE_RIGHT',
  'BOTTOM_LEFT',
  'BOTTOM_CENTER',
  'BOTTOM_RIGHT',
];

export function InstantMessageDialog(props: InstantMessageDialogProps) {
  const { instantMessageId, messageData, mode, closeSelf, closeAnimation = true } = props;

  const { t } = useTranslation();
  const modalBodyRef = useRef(null);
  const modalBackgroundRef = useRef(null);
  const modalCtrl = useModal();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const [ism, ismActions] = useTypeSafeReducer(instantMessageDefaultObj, {
    onDefaultValue: (state, value: InstantMessageAPIResponse) => {
      const instantMessageData: InstantMessageDataType = JSON.parse(value.data);
      state.name = value.name;
      state.duration = value.duration;
      state.data = { ...instantMessageData };
    },

    /**
     * Description
     * @author jaehee
     * @date 2023-08-02
     * @param {any} state
     * @param {any} keyValue:KeyValueType[]
     * @returns {void}
     * @description state의 key에 value를 할당한다.
     *              key는 중첩 object에도 값을 할당할 수 있다. 구분자는 '.' 이다
     */
    onChangeValue: (state, keyValue: KeyValueType[]): void => {
      keyValue.forEach((kv) => {
        const { key, value } = kv;
        const keyList = key.split('.');
        let currentObj = state;

        keyList.forEach((splitedKey) => {
          if (
            !currentObj.hasOwnProperty(splitedKey) ||
            typeof currentObj[splitedKey] !== 'object'
          ) {
            return;
          }
          currentObj = currentObj[splitedKey];
        });

        const lastIndex = keyList.length - 1;

        // boolean toggle인 경우
        if (!value) {
          const booleanValue = currentObj[keyList[lastIndex]];
          currentObj[keyList[lastIndex]] = !booleanValue;
          return;
        }
        //특정 value를 편집하는 경우
        currentObj[keyList[lastIndex]] = value;
      });
    },

    onDurationBlur: (state) => {
      if (state.data.duration >= 10) return;
      state.duration = 10;
      state.data.duration = 10;
    },
  });
  const [fontColorAnchorEl, setFontColorAnchorEl] = useState<null | HTMLElement>(null);
  const [backColorAnchorEl, setBackColorAnchorEl] = useState<null | HTMLElement>(null);

  const onSaveClick = () => {
    setIsLoading(true);
    createInstantMessageApi(ism)
      .then(() => closeSelf?.())
      // TODO: translation required
      .catch(() => modalCtrl.open(<Alert text='인스턴트 메시지 저장에 실패하였습니다.' />))
      .finally(() => {
        queryClient.invalidateQueries(['instantMessage']);
        setIsLoading(false);
      });
  };

  const onEditClick = () => {
    setIsLoading(true);
    editInstantMessageApi(ism, instantMessageId)
      .then(() => closeSelf?.())
      // TODO: translation required
      .catch(() => modalCtrl.open(<Alert text='인스턴트 메시지 수정에 실패하였습니다.' />))
      .finally(() => {
        queryClient.invalidateQueries(['instantMessage']);
        setIsLoading(false);
      });
  };

  const hasIsmNameError = !isNumberBetween(ism.name.length, 4, 128);
  const hasIsmMessageError = !isNumberBetween(ism.data.message.length, 4, 128);
  const hasIsmDurationError = ism.data.duration < 10;
  const hasIsmTextEffectSpeedError =
    ism.data.textEffect.code !== 'none' && !isNumberBetween(ism.data.textEffect.speed, 1, 100);
  const hasIsmTTSVolError = ism.data.TTSEnable && !isNumberBetween(ism.data.TTSVol, 0, 100);
  const hasIsmTTSMsgError = ism.data.TTSEnable && !isNumberBetween(ism.data.TTSMsg.length, 4, 128);
  const isStartDateValid = dayjs(ism.startDate).diff(Date.now()) > 0;

  const isActionButtonDisabled =
    hasIsmNameError ||
    hasIsmMessageError ||
    hasIsmDurationError ||
    hasIsmTextEffectSpeedError ||
    hasIsmTTSVolError ||
    hasIsmTTSMsgError ||
    !isStartDateValid ||
    isLoading;

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

  useEffect(() => {
    if (mode === 'EDIT') ismActions.onDefaultValue(messageData);
  }, []);

  return (
    <Modal.Container>
      <Modal.Background ref={modalBackgroundRef} onClick={onClose} />
      <Modal.Body ref={modalBodyRef} width='95%'>
        <Modal.Title>
          {mode === 'ADD' ? '인스턴트 메세지 추가' : null}
          {mode === 'EDIT' ? '인스턴트 메세지 수정' : null}
        </Modal.Title>
        <S.Content>
          {/* Basic Settings */}
          <Layout.Box minWidth='250px'>
            <Layout.SubTitle>{t('app-common.basic-setting')}</Layout.SubTitle>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='ism.name'>{t('app-common.name')}</Form.Label>
              {hasIsmNameError ? (
                <Form.ErrMsg>{t('app-instantMessage.errorName')}</Form.ErrMsg>
              ) : null}
              <Form.Input
                id='ism.name'
                onChange={(e) => ismActions.onChangeValue([{ key: 'name', value: e.target.value }])}
                value={ism.name}
                minLength={4}
                maxLength={128}
                autoComplete='off'
                autoCorrect='off'
                placeholder={t('app-auth.enterusername')}
                autoFocus
              />
            </Layout.Box>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='ism.data.message'>{t('app-instantMessage-message')}</Form.Label>
              {hasIsmMessageError ? (
                <Form.ErrMsg>{t('app-instantMessage.errorDesc')}</Form.ErrMsg>
              ) : null}
              <Form.TextArea
                id='ism.data.message'
                rows={8}
                onChange={(e) =>
                  ismActions.onChangeValue([{ key: 'data.message', value: e.target.value }])
                }
                defaultValue={ism.data.message}
                minLength={4}
                maxLength={128}
                autoComplete='off'
                autoCorrect='off'
                placeholder={t('app-auth.enteruserdesc')}
              />
            </Layout.Box>
            <Layout.Box mb='20px'>
              <Form.Label htmlFor='duration'>{t('app-common.duration')}</Form.Label>
              {hasIsmDurationError ? (
                <Form.ErrMsg>{t('app-instantMessage.errorDuration')}</Form.ErrMsg>
              ) : null}
              <Form.Input
                id='duration'
                onChange={(e) =>
                  ismActions.onChangeValue([
                    { key: 'data.duration', value: e.target.value },
                    { key: 'duration', value: e.target.value },
                  ])
                }
                onBlur={() => ismActions.onDurationBlur}
                value={String(ism.data.duration)}
                type='number'
                min={10}
                autoComplete='off'
                autoCorrect='off'
                placeholder={t('app-auth.enteruserdesc')}
              />
            </Layout.Box>
          </Layout.Box>

          {/* Fonts */}
          <Layout.Box minWidth='250px'>
            <Layout.SubTitle>{t('app-instantMessage-font')}</Layout.SubTitle>
            <Layout.Box>
              <Layout.Box mb='20px'>
                <Form.Label>{t('app-instantMessage-fontsize')}</Form.Label>
                <Form.Select
                  color='secondary'
                  value={String(ism.data.fontSize)}
                  onChange={(e) =>
                    ismActions.onChangeValue([{ key: 'data.fontSize', value: e.target.value }])
                  }
                >
                  {fontSizeCandidates.map((value) => (
                    <Form.Option value={value} key={value}>
                      {value}
                    </Form.Option>
                  ))}
                </Form.Select>
              </Layout.Box>

              <Layout.Box mb='20px'>
                <Form.Label>{t('app-common.name')}</Form.Label>
                <Form.Select
                  color='secondary'
                  value={ism.data.fontName}
                  onChange={(e) =>
                    ismActions.onChangeValue([{ key: 'data.font', value: e.target.value }])
                  }
                  style={{ fontFamily: `${ism.data.fontName}` }}
                >
                  {Object.entries(fontList).map(([key, value]) => (
                    <Form.Option value={key} key={value} style={{ fontFamily: key }}>
                      {value}
                    </Form.Option>
                  ))}
                </Form.Select>
              </Layout.Box>

              {/* <Layout.Box mb='20px'>
                <Form.Label>{t('app-instantMessage-fontcolor')}</Form.Label>
                <Layout.ChromePicker
                  disableAlpha={true}
                  color={ism.data.fontColor}
                  onChange={(e) =>
                    ismActions.onChangeValue([{ key: 'data.fontColor', value: e.hex }])
                  }
                />
              </Layout.Box> */}

              <Layout.Box mb='20px'>
                <Layout.Box mb='20px'>
                  <Layout.Box display='flex' alignItems='center'>
                    <Form.Label
                      htmlFor='fontcolorpicker'
                      css={css`
                        height: 30px;
                        margin-bottom: 0;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                      `}
                    >
                      {t('app-instantMessage-fontcolor')}
                    </Form.Label>
                    <S.ColorPickerPopperButton
                      id='fontcolorpicker'
                      type='button'
                      backgroundColor={ism.data.fontColor}
                      onClick={(e) =>
                        setFontColorAnchorEl(fontColorAnchorEl ? null : e.currentTarget)
                      }
                    >
                      <div></div>
                    </S.ColorPickerPopperButton>
                  </Layout.Box>
                  <Popover
                    open={Boolean(fontColorAnchorEl)}
                    onClose={() => setFontColorAnchorEl(null)}
                    anchorEl={fontColorAnchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    id='fontcolorpicker-popover'
                    sx={{ zIndex: 1 }}
                  >
                    <Layout.ChromePicker
                      disableAlpha={true}
                      color={ism.data.fontColor}
                      // onChange={ismActions.onFontColorChange}
                      onChange={(e) => ismActions.onChangeValue([{ key: 'data.fontColor', value: e.hex}])}
                    />
                  </Popover>
                </Layout.Box>
              </Layout.Box>

              <Layout.Box mb='20px'>
                <Form.Label>{t('app-instantMessage-fontstyle')}</Form.Label>
                <S.FontStyleBox>
                  <S.FontStyle
                    selected={ism.data.fontStyle.bold}
                    onClick={() => ismActions.onChangeValue([{ key: 'data.fontStyle.bold' }])}
                  >
                    <FontAwesomeIcon icon={faBold} />
                  </S.FontStyle>
                  <S.FontStyle
                    selected={ism.data.fontStyle.italic}
                    onClick={() => ismActions.onChangeValue([{ key: 'data.fontStyle.italic' }])}
                  >
                    <FontAwesomeIcon icon={faItalic} />
                  </S.FontStyle>
                  <S.FontStyle
                    selected={ism.data.fontStyle.underline}
                    onClick={() => ismActions.onChangeValue([{ key: 'data.fontStyle.underline' }])}
                  >
                    <FontAwesomeIcon icon={faUnderline} />
                  </S.FontStyle>
                  <S.FontStyle
                    selected={ism.data.fontStyle.strikeThrough}
                    onClick={() =>
                      ismActions.onChangeValue([{ key: 'data.fontStyle.strikeThrough' }])
                    }
                  >
                    <FontAwesomeIcon icon={faStrikethrough} />
                  </S.FontStyle>
                </S.FontStyleBox>
              </Layout.Box>
            </Layout.Box>

            {ism.data.message ? (
              <Layout.Box>
                <Form.TextArea defaultValue={t('app-instantMessageContent-preview')} />
                <div className='preview-textEffect-area'>
                  <div
                    className={ism.data.textEffect.code}
                    style={{
                      fontWeight: ism.data.fontStyle.bold ? 'bold' : 'normal',
                      fontStyle: ism.data.fontStyle.italic ? 'Italic' : 'normal',
                      textDecoration:
                        ism.data.fontStyle.underline && ism.data.fontStyle.strikeThrough
                          ? 'underline line-through'
                          : ism.data.fontStyle.strikeThrough
                          ? 'line-through'
                          : ism.data.fontStyle.underline
                          ? 'underline'
                          : 'none',
                      fontSize: '4rem',
                      textAlign: 'center',
                      color: ism.data.fontColor,
                      fontFamily: ism.data.fontName,
                    }}
                  >
                    {ism.data.message}
                  </div>
                </div>
              </Layout.Box>
            ) : null}
          </Layout.Box>

          {/* Display */}
          <Layout.Box minWidth='250px'>
            <Layout.SubTitle>{t('app-instantMessage-display')}</Layout.SubTitle>
            {/* <Layout.Box mb='20px'>
              <Form.Label>{t('app-instantMessage-background')}</Form.Label>
              <Layout.ChromePicker
                color={hexaToRgba(ism.data.bgColor)}
                onChangeComplete={(color) => {
                  const { r, g, b, a } = color.rgb;
                  const hexa = rgbaToHexa({ r, g, b, a });
                  ismActions.onChangeValue([{ key: 'data.bgColor', value: hexa }]);
                }}
              />
            </Layout.Box> */}

            <Layout.Box mb='20px'>
              <Layout.Box mb='20px'>
                <Layout.Box display='flex' alignItems='center'>
                  <Form.Label
                    htmlFor='backcolorpicker'
                    css={css`
                      height: 30px;
                      margin-bottom: 0;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                    `}
                  >
                    {t('app-instantMessage-background')}
                  </Form.Label>
                  <S.ColorPickerPopperButton
                    id='backcolorpicker'
                    type='button'
                    backgroundColor={ism.data.bgColor}
                    onClick={(e) =>
                      setBackColorAnchorEl(backColorAnchorEl ? null : e.currentTarget)
                    }
                  >
                    <div></div>
                  </S.ColorPickerPopperButton>
                </Layout.Box>
                <Popover
                  open={Boolean(backColorAnchorEl)}
                  onClose={() => setBackColorAnchorEl(null)}
                  anchorEl={backColorAnchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  id='backcolorpicker-popover'
                  sx={{ zIndex: 1 }}
                >
                  <Layout.ChromePicker
                    // color={hexaToRgba(ism.data.bgColor)}
                    onChange={
                      (color) => {
                        const { r, g, b, a } = color.rgb;
                        const hexa = rgbaToHexa({ r, g, b, a });
                        ismActions.onChangeValue([{key: 'data.bgColor', value: hexa}]);
                      }
                    }
                  />
                </Popover>
              </Layout.Box>
            </Layout.Box>

            <Layout.Box mb='20px'>
              <Form.Label>{t('app-instantMessage-position')}</Form.Label>
              <S.AlignOutItem
                onClick={() => ismActions.onChangeValue([{ key: 'data.align', value: 'FULL' }])}
                selected={ism.data.align === 'FULL'}
                style={{ marginBottom: 10 }}
              >
                {t('app-instantMessage-fullscreen')}
              </S.AlignOutItem>
              <S.AlignContainer>
                {alignOutList.map((item) => (
                  <S.AlignOutItem
                    key={item}
                    onClick={() => ismActions.onChangeValue([{ key: 'data.align', value: item }])}
                    selected={item === ism.data.align}
                  >
                    {t(`app-instantMessage-${item.split('_').join('-').toLowerCase()}`)}
                  </S.AlignOutItem>
                ))}
              </S.AlignContainer>
            </Layout.Box>
          </Layout.Box>

          {/* Text Effect */}
          <Layout.Box minWidth='250px'>
            <Layout.SubTitle>{t('app-instantMessage.Texteffect')}</Layout.SubTitle>

            <Layout.Box mb='20px'>
              <Form.Label>{t('app-instantMessage.Texteffect')}</Form.Label>
              <Form.Select
                color='secondary'
                id='demo-simple-textEffect'
                value={ism.data.textEffect.code}
                onChange={(e) =>
                  ismActions.onChangeValue([{ key: 'data.textEffect.code', value: e.target.value }])
                }
              >
                <Form.Option value='none'>{t('app-common.none')}</Form.Option>
                <Form.Option value='ANIM_TEXT_RAINBOW'>
                  {t('app-instantMessage-effect.rain')}
                </Form.Option>
                <Form.Option value='ANIM_TEXT_HSCROLL'>
                  {t('app-instantMessage-effect.horizontalScroll')}
                </Form.Option>
                <Form.Option value='ANIM_TEXT_VSCROLL'>
                  {t('app-instantMessage-effect.verticalScroll')}
                </Form.Option>
                <Form.Option value='ANIM_TEXT_BLINK'>
                  {t('app-instantMessage-effect.flicker')}
                </Form.Option>
              </Form.Select>
            </Layout.Box>

            <S.SubBox disabled={ism.data.textEffect.code === 'none'}>
              <Layout.Box mb='20px'>
                <Form.Label htmlFor='inst-fast'>{t('app-instantMessage-effect.speed')}</Form.Label>
                {hasIsmTextEffectSpeedError ? (
                  <Form.ErrMsg>{t('app-instantMessage.errorSpeed')}</Form.ErrMsg>
                ) : null}
                <Form.Input
                  id='inst-fast'
                  type='number'
                  value={String(ism.data.textEffect.speed)}
                  onChange={(e) =>
                    ismActions.onChangeValue([
                      { key: 'data.textEffect.speed', value: e.target.value },
                    ])
                  }
                  placeholder={t('app-common.one')}
                  min={1}
                  max={50}
                  disabled={ism.data.textEffect.code === 'none'}
                />
              </Layout.Box>

              <Layout.Box>
                <Form.Label htmlFor='texteffect.repeat'>{t('app-common-repeat')}</Form.Label>
                <Form.Select
                  color='secondary'
                  id='texteffect.repeat'
                  value={String(ism.data.textEffect.repeat)}
                  onChange={(e) =>
                    ismActions.onChangeValue([
                      { key: 'data.textEffect.repeat', value: e.target.value === 'true' },
                    ])
                  }
                  // disabled={ism.data.textEffect.code === 'none'}
                  disabled={true}
                >
                  <Form.Option value='true'>{t('app-playlist.inRepetition')}</Form.Option>
                  <Form.Option value='false'>{t('app-playlist.noRepetition')}</Form.Option>
                </Form.Select>
              </Layout.Box>
            </S.SubBox>
          </Layout.Box>

          {/* Schedule */}
          <Layout.Box minWidth='250px'>
            <Layout.SubTitle>{t('app-common.schedule')}</Layout.SubTitle>
            <Switch
              onClick={() => ismActions.onChangeValue([{ key: 'data.isSchedule' }])}
              checked={ism.data.isSchedule}
              sx={{ marginBottom: 3 }}
            />

            <S.SubBox disabled={!ism.data.isSchedule}>
              <Layout.Box mb='20px'>
                <Form.Label htmlFor='schedule-repeat'>{t('app-common-repeat')}</Form.Label>
                <Form.Select
                  id='schedule-repeat'
                  value={ism.data.repeat}
                  onChange={(e) =>
                    ismActions.onChangeValue([{ key: 'data.repeat', value: e.target.value }])
                  }
                  disabled={!ism.data.isSchedule}
                >
                  <Form.Option value='none'>{t('app-common.none')}</Form.Option>
                  <Form.Option value='daily'>{t('app-common.daily')}</Form.Option>
                  <Form.Option value='weekly'>{t('app-common.weekly')}</Form.Option>
                  <Form.Option value='monthly'>{t('app-common.monthly')}</Form.Option>
                  <Form.Option value='yearly'>{t('app-common.yearly')}</Form.Option>
                </Form.Select>
              </Layout.Box>

              <Layout.Box>
                <Form.Label htmlFor='start-time'>{t('app-common-starttime')}</Form.Label>
                {!isStartDateValid ? (
                  // TODO: translation required
                  <Form.ErrMsg>과거로는 스케쥴을 설정할 수 없습니다.</Form.ErrMsg>
                ) : null}
                <TextField
                  id='start-time'
                  color='secondary'
                  type='datetime-local'
                  defaultValue={dayjs(ism.data.startDate).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => {
                    const dateStr = e.target.value;
                    const formattedStr = formattingDate(dateStr);
                    ismActions.onChangeValue([
                      { key: 'data.startDate', value: formattedStr },
                      { key: 'startDate', value: formattedStr },
                    ]);
                  }}
                  disabled={!ism.data.isSchedule}
                  fullWidth
                  inputProps={{ style: { fontSize: '1.4rem', padding: 10 } }}
                  sx={{ fontSize: '1.4rem' }}
                  // max='9999-12-31T23:59:59'
                />
              </Layout.Box>
            </S.SubBox>
          </Layout.Box>

          {/* Voice Message */}
          <Layout.Box minWidth='250px'>
            <Layout.SubTitle>{t('app-instantMessage-voice-message')}</Layout.SubTitle>
            <Switch
              onClick={() => ismActions.onChangeValue([{ key: 'data.TTSEnable' }])}
              checked={ism.data.TTSEnable}
              sx={{ marginBottom: 3 }}
            />

            <S.SubBox disabled={!ism.data.TTSEnable}>
              <Layout.Box mb='20px'>
                <Form.Label htmlFor='tts-repeat'>{t('app-common-repeat')}</Form.Label>
                <Form.Select
                  color='secondary'
                  id='tts-repeat'
                  value={String(ism.data.TTSRepeat)}
                  onChange={(e) =>
                    ismActions.onChangeValue([
                      { key: 'data.TTSRepeat', value: e.target.value === 'true' },
                    ])
                  }
                  disabled={!ism.data.TTSEnable}
                >
                  <Form.Option value='true'>{t('app-playlist.inRepetition')}</Form.Option>
                  <Form.Option value='false'>{t('app-playlist.noRepetition')}</Form.Option>
                </Form.Select>
              </Layout.Box>

              <Layout.Box mb='20px'>
                <Form.Label htmlFor='tts-message'>
                  {t('app-instantMessage-message.voice')}
                </Form.Label>
                {hasIsmTTSMsgError ? (
                  <Form.ErrMsg>{t('app-instantMessage.errorTTSMsg')}</Form.ErrMsg>
                ) : null}
                <Form.Input
                  id='tts-message'
                  value={ism.data.TTSMsg}
                  onChange={(e) =>
                    ismActions.onChangeValue([{ key: 'data.TTSMsg', value: e.target.value }])
                  }
                  disabled={!ism.data.TTSEnable}
                  autoComplete='off'
                  autoCorrect='off'
                />
              </Layout.Box>

              <Layout.Box mb='20px'>
                <Form.Label htmlFor='tts-volume'>
                  {t('app-instantMessage-TTS.volume-size')}
                </Form.Label>
                {hasIsmTTSVolError ? (
                  <Form.ErrMsg>{t('app-instantMessage.errorVolum')}</Form.ErrMsg>
                ) : null}
                <Form.Input
                  id='tts-volume'
                  type='number'
                  value={String(ism.data.TTSVol)}
                  onChange={(e) => {
                    const newVol = Number(e.target.value);
                    if (newVol < 0 || newVol > 100) return;
                    ismActions.onChangeValue([{ key: 'data.TTSVol', value: newVol }]);
                  }}
                  disabled={!ism.data.TTSEnable}
                  min={0}
                  max={100}
                  autoComplete='off'
                  autoCorrect='off'
                />
              </Layout.Box>
            </S.SubBox>
          </Layout.Box>
        </S.Content>
        <Modal.Actions>
          {mode === 'ADD' ? (
            <Modal.SaveButton onClick={onSaveClick} disabled={isActionButtonDisabled}>
              {t('app-common.save')}
            </Modal.SaveButton>
          ) : null}
          {mode === 'EDIT' ? (
            <Modal.SaveButton onClick={onEditClick} disabled={isActionButtonDisabled}>
              {t('app-common.edit')}
            </Modal.SaveButton>
          ) : null}
          <Modal.CloseButton onClick={onClose} disabled={isLoading}>
            {t('app-common.close')}
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal.Body>
    </Modal.Container>
  );
}

const instantMessageDefaultObj: InstantmessageRequestBody = {
  name: '',
  eventType: 'INSTANT_MESSAGE',
  startDate: formattingDate(),
  duration: 10,
  iDList: undefined,
  data: {
    message: '',
    fontSize: 9,
    fontName: 'Anton',
    fontColor: '#000000',
    bgColor: '#ffffff',
    textEffect: {
      code: 'none',
      speed: 1,
      repeat: false,
    },
    fontStyle: {
      bold: false,
      italic: false,
      underline: false,
      strikeThrough: false,
    },
    align: 'MIDDLE_CENTER',
    fullScreen: false,
    isSchedule: false,
    startDate: formattingDate(),
    repeat: 'none',
    TTSEnable: false,
    TTSRepeat: false,
    TTSMsg: '',
    TTSVol: 0,
    duration: 10,
    x: 0,
    y: 0,
  },
};
