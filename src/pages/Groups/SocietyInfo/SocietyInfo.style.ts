import styled from '@emotion/styled';
import { Link as LinkBase } from 'react-router-dom';
import { toPaperStyle } from '@app/src/components/Global.style';

export const Link = styled(LinkBase)`
  all: unset;
  cursor: pointer;
  font-size: 3rem;
  padding-right: 10px;
`;

export const Head = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15px;
`;

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

export const Contents = styled.div`
  margin: 1rem 2rem;
`;
