import React from 'react';
import { ErrorBox, LoadingImg, LoadingImgBox, PreviewBox, PreviewImg } from './devicePreview.style';
import { Carousel } from '../Carousel/Carousel';
export const devicePreview = (data) => {
  return <Carousel data={data}></Carousel>;
};
