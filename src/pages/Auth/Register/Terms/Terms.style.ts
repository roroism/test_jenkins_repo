import { Box as BaseBox } from '@app/src/components/Layout.style';
import MuiButton from '@mui/material/Button';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import MuiPaper from '@mui/material/Paper';
import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const Content = styled.div`
  margin: auto;
  width: 400px;
  max-width: 80%;
`;

export const BrandButton = styled(MuiButton)`
  display: inline-block;
  height: 60px;
  border-radius: 8px;
  background: transparent;

  &:hover {
    background: #eaeaea;
  }

  & > img {
    width: 100%;
    height: 100%;
  }
`;

export const Form = styled(BaseBox)`
  /* background: radial-gradient(hsl(0, 0%, 98%), hsl(0, 0%, 95%)); */
  box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 70%);
  border-radius: 8px;
  padding: 30px;
`;

export const BoxTitle = styled.h3`
  font-size: 14px;
  margin-bottom: 10px;
`;

export const Paper = styled(MuiPaper)`
  padding: 15px;
  font-size: 10px;
  width: 100%;
  height: 300px;
  margin-bottom: 10px;
  text-align: left;
  overflow: auto;
`;

export const FormControlLabel = styled(MuiFormControlLabel)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin: 0px;
`;

export const ToNextButton = styled(MuiButton)`
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 20px;
  /* margin-bottom: 20px; */
  border-radius: 5px;
  font-weight: bold;
  text-decoration: none;
  padding: 0px;
  text-transform: none;

  /* box-shadow: 0px 3px 6px hsla(0, 0%, 0%, 0.3); */
  color: white;
  /* background: hsl(229, 100%, 60%); */
  background: hsl(209, 100%, 41%);
  transition: box-shadow background-color 500ms ease-in-out;

  &:hover {
    background: hsl(229, 100%, 60%);
  }

  &.Mui-disabled {
    color: #e2e2e2;
    background: hsl(209, 70%, 60%);
    box-shadow: none;
  }
`;

export const ToLogInButton = styled(MuiButton)`
  font-size: 12px;
  font-weight: bold;
  color: #888888;

  &:hover {
    background: #e0e0e0;
  }
`;
