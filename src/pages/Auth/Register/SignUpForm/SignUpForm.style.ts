import MuiButton from '@mui/material/Button';
import { Box as BaseBox } from '@app/src/components/Layout.style';
import { Select as BaseSelect, Input as BaseInput } from '@app/src/components/Form.style';
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

export const Title = styled.h1`
  all: unset;
  display: block;
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
  /* padding-left: 17px; */
  font-size: 20px;
  font-weight: bold;
  /* text-align: center; */
  color: hsl(0, 0%, 44%);
`;

export const EmailInput = styled(BaseInput)`
  width: auto;
  flex: 1;
`;

export const Select = styled(BaseSelect)`
  width: 150px;
`;

export const SendButton = styled(MuiButton)`
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

export const SuccessContent = styled.div`
  margin: auto;
`;

export const SuccessEmail = styled.h3`
  display: flex;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: #06f;
`;

export const SuccessText = styled.div`
  text-align: center;
  font-size: 14px;
  line-height: 32px;
`;
