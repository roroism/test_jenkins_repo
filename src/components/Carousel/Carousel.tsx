import React from 'react';
import react, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as S from './Carousel.style';
import { config } from '@app/src/config';
import { useSelector } from 'react-redux';
import { selectToken } from '@app/src/store/slices/authSlice';
import { modulo } from '@app/src/utils';

export const Carousel = (props) => {
  const [currentAsset, setCurrentAsset] = useState(0);
  const authToken = useSelector(selectToken());

  return (
    <S.carouselWrapper>
      <img
        src={config.EXTERNAL.CUBLICK.ASSET.THUMBNAIL(props.data[currentAsset].id, authToken)}
      ></img>
      <button onClick={() => setCurrentAsset((prev) => modulo(prev - 1, props.data.length))}>
        Back
      </button>
      <button onClick={() => setCurrentAsset((prev) => modulo(prev + 1, props.data.length))}>
        Forward
      </button>
      <p>{props.data.name}</p>
    </S.carouselWrapper>
  );
};
