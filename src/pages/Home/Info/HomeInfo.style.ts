import { ImageList as BaseImageList } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px 24px;
  background-color: ${(props) => props.theme?.mode?.background};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'total total total total online online online online offline offline offline offline'
    'list list list list list list storage storage storage storage storage storage';
  grid-gap: 20px;
`;

interface InfoItemProps {
  area?: string;
}

export const InfoItem = styled(Link)<InfoItemProps>`
  display: flex;
  text-decoration: none;
  cursor: pointer;
  background-color: ${(props) => props.theme?.mode?.backgroundHomeItem};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration},
    color ${(props) => props.theme?.modeTransition?.duration};
  border-radius: 15px;
  padding: 2rem;
  gap: 1rem;
  align-items: center;
  color: ${(props) => props.theme?.mode?.text};
  transition: 300ms;
  box-shadow: 0px 3px 6px #00000029;
  grid-area: ${(props) => props.area};

  &:hover {
    background: #3e70d6;
    color: white;
  }
  & h3 {
    transition: 300ms;
    color: #3e70d6;
    margin: 0;
    font-size: 2.5rem;
    font-weight: bold;
    font-family: auto;
  }
  &:hover h3 {
    color: white;
  }
  & span {
    font-size: 2rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

interface TableWrapperProps {
  area?: string;
}

export const TableWrapper = styled.div<TableWrapperProps>`
  position: relative;
  overflow: hidden;
  background-color: ${(props) => props.theme?.mode?.backgroundHomeItem};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};
  border-radius: 15px;
  box-shadow: 0px 3px 6px #00000029;
  padding: 3rem;
  grid-area: ${(props) => props.area};

  display: flex;
  flex-flow: column nowrap;
`;

export const TableTitle = styled.h3`
  font-weight: bold;
  font-size: 2.5rem;
  margin: 0px;
  margin-bottom: 1rem;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const Table = styled.table`
  all: unset;
  display: block;
  box-sizing: border-box;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
  flex: 1;
  width: 100%;

  display: grid;
  align-content: start;
  align-items: center;
  justify-items: center;
  grid-gap: 1rem;
  grid-template-columns: 1fr auto auto;
  grid-template-rows: auto;
`;

export const THead = styled.thead`
  display: contents;
`;

export const TBody = styled.tbody`
  display: contents;
`;

export const Tr = styled.tr`
  display: contents;
`;

type ThProps = {
  justifySelf?: string;
};

export const Th = styled.th<ThProps>`
  all: unset;
  display: block;
  box-sizing: border-box;

  justify-self: ${(props) => props.justifySelf};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #afaeae;
`;

type TdProps = {
  justifySelf?: string;
};

export const Td = styled.td<TdProps>`
  font-size: 1.2rem;
  justify-self: ${(props) => props.justifySelf};
`;

export const TdIcon = styled.img`
  height: 2.4rem;
  margin-right: 0.5rem;
  vertical-align: middle;
`;

export const FaTdIcon = styled(FontAwesomeIcon)`
  height: 2.4rem;
  margin-right: 0.5rem;
  vertical-align: middle;
`;

type DWProps = {
  storageText1?: string;
  storageText2?: string;
};

export const DoughnutWrapper = styled.div<DWProps>`
  position: relative;
  &::before {
    display: block;
    content: ${(props) => `'${props.storageText1}'`};
    position: absolute;
    top: -40px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 100px;
    height: 35px;
    font-size: 3rem;
    text-align: center;
    color: #333;
    font-weight: 700;
  }
  &::after {
    display: block;
    content: ${(props) => `'${props.storageText2}'`};
    position: absolute;
    top: 25px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 130px;
    height: 25px;
    font-size: 1.5rem;
    text-align: center;
    color: #666;
    font-weight: 300;
  }
`;

export const StorageChartWrapper = styled.div`
  height: 320px;
  font-size: 1.5rem;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;
