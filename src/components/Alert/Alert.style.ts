import {
  CloseButton as BaseCloseButton,
  Title as BaseTitle,
} from '@app/src/components/Modal.style';
import styled from '@emotion/styled';

export const Title = styled(BaseTitle)`
  background: hsl(0, 65%, 60%);
`;

export const Paragraph = styled.p`
  margin: 0px;
  font-size: 14px;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const CloseButton = styled(BaseCloseButton)`
  color: #373a37;
  &:hover {
    background: hsl(0, 65%, 60%);
  }
`;
