import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';

interface PanelProps {
  open: boolean;
}

export const Container = styled.div<PanelProps>`
  position: absolute;
  background: #e0e0e0;
  left: 100%;
  width: 0px;
  /* max-width: 20vw; */
  height: 100%;
  overflow: auto;
  /* background: white; */
  transition: 700ms;
  filter: blur(3px);

  display: flex;
  flex-flow: column nowrap;
  gap: 2px;

  ${(props) =>
    props.open
      ? css`
          width: 350px;
          padding: 0px 2px;
          filter: none;
        `
      : null};
`;

export const ItemWrap = styled.div`
  width: 100%;
  height: 90%;
`;

export const LodingDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const LoadingMsg = styled.div`
  font-size: 1.5rem;
`;

export const Ul = styled.ul`
  all: unset;
  list-style: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const SemiContainer = styled.li`
  width: 80%;
  height: 10%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: end;
`;
export const Theme = styled.div`
  display: flex;
  font-size: 1.5rem;
  height: 25%;
`;

export const ValueBox = styled.input`
  width: 100%;
  height: 40%;
  border-radius: 8px;
  text-align: center;
  ::placeholder {
    text-align: center;
  }
`;
export const SearchBox = styled.input`
  width: 100%;
  height: 40%;
  margin-bottom: 10px;
  border: none;
  border-bottom: 2px solid black;
  ::placeholder {
    text-align: center;
  }
`;
export const SelectBox = styled.select`
  width: 100%;
  height: 40%;
  border-radius: 8px;
  text-align: center;
  ::placeholder {
    text-align: center;
  }
`;

export const Options = styled.option`
`

export const CreateButton = styled(Button)`
  width: 80px;
  height: 40%;
  border: none;
  border-radius: 8px;
  background: #7393d4;
  color: white;
  font-size: 1.4rem;
  &:hover {
    background: #3e70d6;
  }
`;

export const DownloadReqMsg = styled.div`
  width: 100%;
  font-size: 1.2rem;
`;
export const BeforeDownloadMsg = styled.div`
  width: 100%;
  font-size: 1.4rem;
  color: white;
  background-color: #f58080;
  border-radius: 2px;
  text-align: center;
`;
export const AfterDownloadMsg = styled.div`
  width: 100%;
  font-size: 1.4rem;
  color: white;
  background-color: #3e70d6;
  border-radius: 2px;
  text-align: center;
`;

export const BeforeDownload = styled.div`
  width: 100%;
  height: 50%;
`;
export const AfterDownload = styled.div`
  width: 100%;
  height: fit-content;
`;
export const DownloadNullMsg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  height: 100%;
`;
