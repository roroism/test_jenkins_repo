import { TextField as MuiTextField } from '@mui/material';
import styled from '@emotion/styled';

export const TextField = styled(MuiTextField)`
  color: '#fff';
  
  & input {
    color: ${(props) => props.theme?.mode?.text};
    transition: color ${(props) => props.theme?.modeTransition?.duration};
    &::-webkit-calendar-picker-indicator {
      filter: ${(props) => props.theme?.isDarkmode ? 'invert(1)' : 'invert(0)'}
    }
  }
`;