import styled from '@emotion/styled';
import * as Form from '@app/src/components/Form.style';
import FormControlLabel from '@mui/material/FormControlLabel';

export const PinCodeInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4rem;
`;

export const PinCodeInput = styled(Form.Input)`
  width: 100px;
`;

export const PinCodeSpan = styled.span`
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
  & span {
    color: #707070;
    font-size: 14px;
  }
`;