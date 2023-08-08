import { toPaperStyle } from '@app/src/components/Global.style';
import styled from '@emotion/styled';

export const Container = styled.div`
  min-height: 100%;
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    'device-container content-container'
    'actions actions';
  gap: 20px;
`;

export const DeviceContainer = styled.div`
  ${toPaperStyle}
  /* width: 400px; */
  grid-area: device-container;
`;

export const ContentContainer = styled.div`
  ${toPaperStyle};
  grid-area: content-container;
`;

export const Actions = styled.div`
  width: 100%;
  height: 35px;
  grid-area: actions;
`;
