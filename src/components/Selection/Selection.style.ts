import styled from '@emotion/styled';
import { Tab as MuiTab } from '@mui/material';
import { Content as BaseContent } from '@app/src/components/Modal.style';

export const Tab = styled(MuiTab)`
  &.MuiTab-root {
    font-size: 14px;
  }
`;

export const Content = styled(BaseContent)`
  background-color: ${(props) => props.theme?.mode?.modalBackground};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};
  padding: 16px;
`;
