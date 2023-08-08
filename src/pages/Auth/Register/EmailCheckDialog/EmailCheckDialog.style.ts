import MuiButton from '@mui/material/Button';
import styled from '@emotion/styled';

export const Text = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;

export const ToLogInButton = styled(MuiButton)`
  font-size: 12px;
  font-weight: bold;
  color: #888888;

  &:hover {
    background: #e0e0e0;
  }
`;
