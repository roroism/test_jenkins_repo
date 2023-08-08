import { Confirm } from '@app/src/components/Confirm';
import * as Form from '@app/src/components/Form.style';
import { useModal } from '@app/src/hooks/useModal';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { createHexID } from '@app/src/utils';
import { CircularProgress, ImageListItem } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as S from './Ai.styled';
import { PanelProps } from '../../pages/LayoutEditor/LayoutEditorMain/PanelTab';
import { config } from '@app/src/config';
import {
  getAssetUploadPolicy,
  uploadAssetToCDN,
  uploadAssetToLocalServer,
} from '@app/src/apis/assets';
import { store } from '@app/src/store';

export const Ai = (props: PanelProps) => {
  const { open, closePanel, canvas } = props;
  const { t } = useTranslation();
  const modalCtrl = useModal();
  const [mood, setMood] = useState<string>('신나는');
  const [theme, setTheme] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const [object, setObject] = useState<string>('');
  const [act, setAct] = useState<string>('');
  const [style, setStyle] = useState<string>('사진');
  const [number, setNumber] = useState<string>('4');
  const [size, setSize] = useState<string>('256');
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageTrigger, setPageTrigger] = useState<boolean>(false);
  const [downloadSucc, setDownloadSucc] = useState([]);
  const [ngrokRes, setNgrokRes] = useState(null);
  const num = parseInt(number);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const uri = config.EXTERNAL.CUBLICK.ASSET.AI;
  //     const response = await axios.get(uri, {
  //       headers: { 'X-Access-Token': store.getState().appAuth.token },
  //     });
  //     setNgrokRes(response.data);
  //   };

  //   fetchData();
  // }, []);

  // const uri = config.EXTERNAL.CUBLICK.ASSET.AI;
  // const ngrokRes = await axios.get(uri, {
  //   headers: { 'X-Access-Token': store.getState().appAuth.token },
  // });

  const createImage = async () => {
    try {
      setDownloadSucc([]);
      setPageTrigger(true);
      setIsLoading(true);
      const body = {
        moods: mood,
        theme: theme,
        background: background,
        object: object,
        act: act,
        styles: style,
        number: number,
        size: size,
        search: search,
      };

      // const sessClear = await axios.post(`${ngrokRes.data.ngrokAddress}/session_clear?clear=true`);
      // const res = await axios.post(`${ngrokRes.data.ngrokAddress}/openai_query?r=${Math.random()}`);
      const sessClear = await axios.get('http://192.168.0.28:3001/session_clear?clear=true');
      const res = await axios.post(
        `http://192.168.0.28:3001/openai_query?r=${Math.random()}`,
        body
      );
      setPageTrigger(true);
      setIsLoading(false);
    } catch (error) {
      setPageTrigger(true);
      setIsLoading(false);
    }
  };

  const imgReset = async () => {
    setDownloadSucc([]);
    setPageTrigger(false);
    // const sessClear = await axios.post(`${ngrokRes.data.ngrokAddress}/session_clear?clear=true`);
    const sessClear = await axios.get('http://192.168.0.28:3001/session_clear?clear=true');
  };

  const downloadImg = async (url) => {
    modalCtrl.open(
      <Confirm
        id='app-showmessagebox.download'
        onConfirmed={async () => {
          try {
            setIsLoading(true);
            // 이미지 id
            const id = createHexID(24);
            // 무조건 png파일
            const response = await fetch(url);
            if (response.ok) {
              const blob = await response.blob();
              const file = new File([blob], 'filename'); // Blob 객체를 File 객체로 변환
              getAssetUploadPolicy(file.name + '.png')
                .then((policy) => uploadAssetToCDN(policy, file))
                .catch(() => uploadAssetToLocalServer(file));

              const aiFileData = {
                id: id,
                name: 'Ai Sample Image',
                fileType: '.png',
                mimeType: 'IMAGE',
                width: +size,
                height: +size,
                mood: mood,
                style: style,
                tag: [''],
              };
              setDownloadSucc((prev) => [
                ...prev,
                {
                  _id: id,
                  FileData: aiFileData,
                },
              ]);
              setIsLoading(false);
            } else {
              console.log(`HTTP error! status: ${response.status}`);
            }
          } catch (error) {
            console.log('Error fetching image:', error);
          }
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <S.Container open={open}>
        <S.LodingDiv>
          <CircularProgress color='inherit' size={50} />
          <S.LoadingMsg>불러오는 중입니다.</S.LoadingMsg>
        </S.LodingDiv>
      </S.Container>
    );
  }

  if (pageTrigger === false) {
    const isValid = object !== '' && number !== '' && size !== '';
    return (
      <S.Container open={open}>
        <S.Ul>
          <S.SemiContainer>
            <S.Theme>주제</S.Theme>
            <S.ValueBox
              onChange={(e) => setTheme(e.target.value)}
              value={theme}
              type='text'
              placeholder='ex) 봄'
            />
          </S.SemiContainer>
          <S.SemiContainer>
            <S.Theme>분위기</S.Theme>
            <S.SelectBox
              onChange={(e) => setMood(e.target.value)}
              value={mood}
              placeholder='ex) 따뜻한'
            >
              <S.Options value='3D'>신나는</S.Options>
              <S.Options value='2D'>즐거운</S.Options>
              <S.Options value='스케치'>슬픈</S.Options>
              <S.Options value='파스텔'>잔잔한</S.Options>
              <S.Options value='사진'>설레는</S.Options>
              <S.Options value='동양화'>고요한</S.Options>
              <S.Options value='서양화'>밝은</S.Options>
              <S.Options value='네온'>깔끔한</S.Options>
              <S.Options value='고딕'>모던한</S.Options>
              <S.Options value='미래'>귀여운</S.Options>
              <S.Options value='판타지'>어두운</S.Options>
              <S.Options value='클로즈업'>선명한</S.Options>
              <S.Options value='항공샷'> 연한</S.Options>
              <S.Options value='흑백'>부드러운</S.Options>
              <S.Options value='영화'>차분한</S.Options>
              <S.Options value='드로잉'>진한</S.Options>
              <S.Options value='어린아이그림'>평화로운</S.Options>
              <S.Options value='스티커'>지루한</S.Options>
              <S.Options value='일러스트'>우울한</S.Options>
              <S.Options value='포스터'>역동적인</S.Options>
              <S.Options value='캐릭터'>답답한</S.Options>
              <S.Options value='축제'>축제</S.Options>
              <S.Options value='로맨틱'>로맨틱</S.Options>
              <S.Options value='열정적인'>열정적인</S.Options>
              <S.Options value='시끄러운'>시끄러운</S.Options>
              <S.Options value='혼돈스러운'>혼돈스러운</S.Options>
              <S.Options value='무서운'>무서운</S.Options>
              <S.Options value='위급한'>위급한</S.Options>
              <S.Options value='단조로운'>단조로운</S.Options>
              <S.Options value='고독한'>고독한</S.Options>
              <S.Options value='공허한'>공허한</S.Options>
              <S.Options value='낙관적'>낙관적</S.Options>
              <S.Options value='비관적'>비관적,</S.Options>
              <S.Options value='당황한'>당황한</S.Options>
              <S.Options value='따뜻한'>따뜻한</S.Options>
              <S.Options value='차가운'>차가운</S.Options>
              <S.Options value='싸이크펑크'>싸이크펑크</S.Options>
            </S.SelectBox>
          </S.SemiContainer>
          <S.SemiContainer>
            <S.Theme>배경</S.Theme>
            <S.ValueBox
              onChange={(e) => setBackground(e.target.value)}
              value={background}
              type='text'
              placeholder='ex) 숲속'
            />
          </S.SemiContainer>
          <S.SemiContainer>
            <S.Theme>
              사물{!isValid ? <Form.ErrMsg>{t('app-common.essential')}</Form.ErrMsg> : null}
            </S.Theme>
            <S.ValueBox
              onChange={(e) => setObject(e.target.value)}
              value={object}
              type='text'
              placeholder='ex) 버스, 사람'
            />
          </S.SemiContainer>
          <S.SemiContainer>
            <S.Theme>행동</S.Theme>
            <S.ValueBox
              onChange={(e) => setAct(e.target.value)}
              value={act}
              type='text'
              placeholder='ex) 달리고 있는'
            />
          </S.SemiContainer>
          <S.SemiContainer>
            <S.Theme>스타일</S.Theme>
            <S.SelectBox
              onChange={(e) => setStyle(e.target.value)}
              value={style}
              placeholder='ex) 3D'
            >
              <S.Options value='3D'>3D</S.Options>
              <S.Options value='2D'>2D</S.Options>
              <S.Options value='스케치'>스케치</S.Options>
              <S.Options value='파스텔'>파스텔</S.Options>
              <S.Options value='사진'>사진</S.Options>
              <S.Options value='동양화'>동양화</S.Options>
              <S.Options value='서양화'>서양화</S.Options>
              <S.Options value='네온'>네온</S.Options>
              <S.Options value='고딕'>고딕</S.Options>
              <S.Options value='미래'>미래</S.Options>
              <S.Options value='판타지'>판타지</S.Options>
              <S.Options value='클로즈업'>클로즈업</S.Options>
              <S.Options value='항공샷'>항공샷</S.Options>
              <S.Options value='흑백'>흑백</S.Options>
              <S.Options value='영화'>영화</S.Options>
              <S.Options value='드로잉'>드로잉</S.Options>
              <S.Options value='어린아이그림'>어린아이그림</S.Options>
              <S.Options value='스티커'>스티커</S.Options>
              <S.Options value='일러스트'>일러스트</S.Options>
              <S.Options value='포스터'>포스터</S.Options>
              <S.Options value='캐릭터'>캐릭터</S.Options>
              <S.Options value='싸이버펑크'>싸이버펑크</S.Options>
            </S.SelectBox>
          </S.SemiContainer>
          <S.SemiContainer>
            <S.Theme>개수</S.Theme>
            <S.SelectBox
              onChange={(e) => setNumber(e.target.value)}
              value={number}
              placeholder='ex) 4'
            >
              <S.Options value='4'>4</S.Options>
              <S.Options value='6'>6</S.Options>
              <S.Options value='8'>8</S.Options>
              <S.Options value='10'>10</S.Options>
            </S.SelectBox>
          </S.SemiContainer>
          <S.SemiContainer>
            <S.Theme>사이즈</S.Theme>
            <S.SelectBox
              onChange={(e) => setSize(e.target.value)}
              value={size}
              placeholder='ex) 256x256'
            >
              <S.Options value='256'>256x256</S.Options>
              <S.Options value='512'>512x512</S.Options>
              <S.Options value='1024'>1024x1024</S.Options>
            </S.SelectBox>
          </S.SemiContainer>
          <S.SemiContainer style={{ alignItems: 'center' }}>
            <S.SearchBox
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder='search'
            />
            <S.CreateButton disabled={!isValid} onClick={createImage}>
              만들기
            </S.CreateButton>
          </S.SemiContainer>
        </S.Ul>
      </S.Container>
    );
  }

  return (
    <S.Container open={open}>
      <S.ItemWrap>
        <S.BeforeDownload>
          <S.BeforeDownloadMsg>다운로드 전</S.BeforeDownloadMsg>
          <ImageList cols={2}>
            {new Array(num).fill(0).map((img, i) => (
              <ImageListItem key={i}>
                <img
                  style={{ cursor: 'pointer' }}
                  // src={`${ngrokRes.data.ngrokAddress}/${i}?r=${Math.random()}`}
                  src={`http://192.168.0.28:3001/Image_download/${i}?r=${Math.random()}`}
                  alt={img.toString()}
                  onClick={() =>
                    // downloadImg(`${ngrokRes.data.ngrokAddress}/${i}?r=${Math.random()}`)
                    downloadImg(`http://192.168.0.28:3001/Image_download/${i}?r=${Math.random()}`)
                  }
                  draggable={false}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </S.BeforeDownload>
        <S.AfterDownload>
          <S.AfterDownloadMsg>다운로드 후</S.AfterDownloadMsg>
          <ImageList cols={2}>
            {downloadSucc.map((asset) => (
              <ImageListItem key={asset.FileData.id} draggable>
                <img
                  style={{ cursor: 'pointer' }}
                  src={asset.FileData.id}
                  alt={asset.FileData.id}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </S.AfterDownload>
      </S.ItemWrap>
      <S.SemiContainer style={{ width: '100%', alignItems: 'center' }}>
        <S.CreateButton onClick={createImage}>더 찾기</S.CreateButton>
        <S.CreateButton onClick={imgReset}>돌아가기</S.CreateButton>
      </S.SemiContainer>
    </S.Container>
  );
};
