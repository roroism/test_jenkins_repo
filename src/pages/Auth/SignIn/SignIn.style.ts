import { Input as BaseInput, Label as BaseTextLabel } from '@app/src/components/Form.style';
import { Box as BaseBox } from '@app/src/components/Layout.style';
import MuiButton from '@mui/material/Button';
import { Link as BaseLink } from 'react-router-dom';
import styled from '@emotion/styled';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const Content = styled.div`
  margin: auto;
  min-width: 400px;
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

export const TextLabel = styled(BaseTextLabel)`
  color: black;
`;

export const Input = styled(BaseInput)`
  width: 100%;
  height: 40px;
  font-size: 14px;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 5px;
  outline: none;
  color: #707070;

  &::placeholder {
    color: #c0c0c0;
    font-size: 14px;
  }
`;

export const Error = styled.div`
  font-size: 14px;
  color: hsl(0, 65%, 60%);
  margin-bottom: 20px;
`;

export const SignInButton = styled(MuiButton)`
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

export const FootBox = styled.div`
  display: flex;
  justify-content: center;
`;

export const Separator = styled.div`
  width: 30px;
  font-size: 14px;
  color: #888888;
  text-align: center;
`;

export const Link = styled(BaseLink)`
  display: block;
  /* margin-bottom: 20px; */
  font-size: 14px;
  font-weight: bold;
  color: #888888;
  text-align: right;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const BrandButton = styled(MuiButton)`
  display: inline-block;
  /* width: 150px; */
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
