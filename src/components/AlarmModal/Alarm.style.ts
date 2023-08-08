import {
  CloseButton as BaseCloseButton,
  Title as BaseTitle,
} from '@app/src/components/Modal.style';
import styled from '@emotion/styled';

export const Title = styled(BaseTitle)`
  background-color: rgb(0, 150, 103);
`;

export const Paragraph = styled.p`
  margin: 0px;
  font-size: 14px;
`;

export const CloseButton = styled(BaseCloseButton)`
  &:hover {
    background-color: rgb(0, 150, 103);
  }
`;
