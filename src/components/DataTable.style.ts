import * as Form from '@app/src/components/Form.style';
import { clear, toDivStyle } from '@app/src/components/Global.style';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MenuItem as BaseMenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { SerializedStyles } from '@emotion/react';


export const THead = styled.thead`
  all: unset;
  display: block;

  width: 100%;
  /* box-shadow: 0px 3px 6px #00000029; */
  /* border-radius: 15px; */
  /* background: white; */
  padding: 1rem 0rem;
  border-bottom: 2px solid #aaa;
`;

type THeadTrProps = {
  sx?: SerializedStyles;
};

export const THeadTr = styled.tr<THeadTrProps>`
  all: unset;
  box-sizing: border-box;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-flow: row nowrap;

  width: 100%;
  min-height: 30px;
  padding: 0;
  /* padding-left: 5px; */

  ${(props) => props.sx}
`;

export const Th = styled.th`
  all: unset;
  display: block;
  box-sizing: border-box;

  width: 100%;

  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const Table = styled.table`
  all: unset;
  display: block;
  flex: 1;
  /* box-shadow: 0px 3px 6px #00000029; */
`;

export const TBody = styled.tbody`
  all: unset;
  display: block;
  box-sizing: border-box;

  padding: 0 0 10px 0;
`;

type TBodyTr = {
  padding?: string;
  selected?: boolean;
  css?: SerializedStyles;
};

export const TBodyTr = styled(THeadTr) <TBodyTr>`
  position: relative;
  cursor: pointer;
  padding: 8px 0;
  box-sizing: border-box;
  border-bottom: 1px solid ${(props) => props.theme?.mode?.tableTrBorderBottom};
  transition: border-bottom ${(props) => props.theme?.modeTransition?.duration};
  /* border-left: ${({ selected }) => (selected ? '5px solid #3e70d6' : '5px solid transparent')}; */
  margin: 0;

  ${(props) => props.css};
  
  ${(props) => (props?.selected ? `background-color: ${props?.theme?.mode?.tableTrBackgroundHover}` : null)};
  &:hover {
    background-color: ${(props) => props.theme?.mode?.tableTrBackgroundHover};
  }
  &::before {
    ${({ selected }) => (selected ? `content: ''` : null)};
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background-color: #3e70d6;
  }
`;

export const Td = styled.td`
  all: unset;
  display: block;
  box-sizing: border-box;

  font-size: 14px;
  text-align: center;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const TdActions = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row wrap;
`;

export const ThumbnailWrapper = styled.div`
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 16px 0 16px;
`;

export const ThumbnailImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
`;

export const CategoryNameInnerTd = styled.div`
  display: flex;
  align-items: center;
`;

export const CategoryNameWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
`;
