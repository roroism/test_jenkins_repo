import * as Form from '@app/src/components/Form.style';
import { clear, toDivStyle } from '@app/src/components/Global.style';
import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { MenuItem as BaseMenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  min-height: 100%;
  padding: 16px 24px;
  gap: 16px;
  background-color: ${(props) => props.theme?.mode?.background};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};
`;

export const SemiContainer = styled.div`
  display: flex;
`;

export const SubContainer = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  gap: 15px;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0px;

  display: flex;
  align-items: center;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

interface ActionsProps {
  css?: SerializedStyles;
}

export const Actions = styled.div<ActionsProps>`
  display: flex;
  flex-flow: row wrap;
  gap: 10px;

  ${(props) => props.css}
`;

export const CloudTemplateWrap = styled.div`
  display: flex;
  width: 100%;
`;

export const MultifacetedSearch = styled.div`
  width: 15%;
  border: 1px solid gray;
`;
type SelectedProps = {
  selected: boolean;
};

export const Arrow = styled.div<SelectedProps>`
  width: 10px;
  height: 10px;
  margin: 5px;
  border-top: 1px solid black;
  border-right: 1px solid black;
  transition: 300ms;
  transform: rotate(45deg);
  ${(props) =>
    props.selected
      ? css`
          width: 10px;
          height: 10px;
          margin: 5px;
          transition: 300ms;
          transform: rotate(135deg);
        `
      : ''}
`;

export const RangeBarWrap = styled.div`
  padding: 15px;
`;

export const Slider = styled.div`
  height: 5px;
  background-color: #ddd;
  border-radius: 5px;
  position: relative;
`;

export const Progress = styled.div`
  height: 5px;
  left: 25%;
  right: 25%;
  position: absolute;
`;
export const BarWrap = styled.div`
  position: relative;
`;
export const Bar = styled.input`
  position: absolute;
  top: -5px;
  height: 5px;
  width: 100%;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  ::-webkit-slider-thumb {
    height: 17px;
    width: 17px;
    border-radius: 50%;
    pointer-events: auto;
    -webkit-appearance: none;
    background-color: #3e70d6;
  }
  ::-moz-range-thumb {
    height: 17px;
    width: 17px;
    border: none;
    border-radius: 50%;
    pointer-events: auto;
    -moz-appearance: none;
    background-color: #3e70d6;
  }
`;

export const ApplyBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  height: 25px;
  background-color: #7393d4;
  color: white;
  cursor: pointer;
  :hover {
    background-color: #3e70d6;
  }
`;

export const RangeNumberDiv = styled.div`
  font-weight: 700;
`;

export const MultifacetedSearchDetailDiv = styled.div<SelectedProps>`
  cursor: pointer;
  :hover {
    background-color: #7393d4;
    color: white;
  }
  ${(props) =>
    props.selected
      ? css`
          border: 2px solid #3e70d6;
        `
      : ''}
`;

export const PriceMsg = styled.div`
  display: flex;
  font-size: 1.4rem;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const MiddleCategoryList = styled.div<SelectedProps>`
  cursor: pointer;
  :hover {
    background-color: #7393d4;
    color: white;
  }
  ${(props) =>
    props.selected
      ? css`
          border: 2px solid #3e70d6;
        `
      : ''}
`;

export const BigCategoryList = styled.div<SelectedProps>`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  font-size: 1.4rem;
  border-top: 0.5px solid black;
  cursor: pointer;
  :hover {
    background-color: #7393d4;
    color: white;
  }
  ${(props) =>
    props.selected
      ? css`
          background-color: #3e70d6;
          color: white;
        `
      : ''}
`;

export const MultifacetedSearchBox = styled.div`
  width: 100%;
`;

export const MiddleStage = styled.div`
  display: flex;
  flex-flow: column;
`;

export const MultifacetedSearchTitle = styled.div`
  width: 100%;
  font-size: 1.6rem;
  text-align: left;
  background-color: #2f2f2f;
  color: white;
`;
export const MultifacetedSearchDetail = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  font-size: 1.4rem;
`;

export const Table = styled.table`
  all: unset;
  display: block;
  flex: 1;

  width: 100%;
`;

export const THead = styled.thead`
  all: unset;
  display: block;

  width: 100%;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 15px;
  background: white;
  padding: 1rem 0rem;
`;

interface TrProps {
  padding?: string;
  sx?: SerializedStyles;
  selectable?: boolean;
  selected?: boolean;
}

export const Tr = styled.tr<TrProps>`
  all: unset;
  box-sizing: border-box;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-flow: row nowrap;

  width: 100%;
  min-height: 30px;
  padding: ${(props) => props.padding || '0px 20px'};

  background: ${({ selected }) => (selected ? 'white' : 'transparent')};
  ${(props) => props.sx}
  ${(props) =>
    props.selectable &&
    css`
      border-radius: 5px;
      margin-bottom: 5px;
      transition: 500ms;
      cursor: pointer;
    `}
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
  padding: 0px 20px;

  ${(props) => props.sx}
`;

type TBodyTr = {
  padding?: string;
  selected?: boolean;
};

export const TBodyTr = styled(THeadTr) <TBodyTr>`
  border-radius: 5px;
  margin-bottom: 5px;
  transition: 500ms;
  cursor: pointer;

  padding: ${(props) => props.padding || '0px 20px'};
  background: ${({ selected }) => (selected ? 'white' : 'transparent')};
`;

export const Th = styled.th`
  all: unset;
  display: block;
  box-sizing: border-box;

  width: 100%;

  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  color: #707070;
`;

export const AddButton = styled.button`
  border: none;
  outline: none;

  width: 100%;
  height: 60px;
  opacity: 0.6;
  background: white;
  text-align: center;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 15px;
  margin: 20px 0;
  transition: 300ms;

  &:hover {
    opacity: 0.9;
  }
`;

export const AddIcon = styled(FontAwesomeIcon)`
  width: 30px;
  height: 30px;
  font-size: 2rem !important;
  color: #3e70d6;
`;

export const TBody = styled.tbody`
  all: unset;
  display: block;
  box-sizing: border-box;

  padding: 10px 0px;
`;

export const Td = styled.td`
  all: unset;
  display: block;
  box-sizing: border-box;

  font-size: 14px;
  text-align: center;
  color: #707070;
`;

export const TdIcon = styled.img`
  display: inline-block;
  vertical-align: bottom;
  font-size: 30px;
  width: 1em;
  vertical-align: middle;
  height: 100%;
  margin-right: 10px;
`;

export const FaTdIcon = styled(FontAwesomeIcon)`
  display: inline-block;
  vertical-align: bottom;
  font-size: 18px;
  width: 1em;
  height: 100%;
  margin-right: 10px;
`;

export const TdActions = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: row nowrap;
`;

export const FunctionButton = styled.button`
  border: none;
  outline: none;
  padding: 0px;
  margin: 0px;
  width: 30px;
  height: 30px;
  background: none;
  transition: 500ms;
  border-radius: 8px;

  &:hover {
    background: #eaeaea;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

type ActionButtonProps = {
  disabled?: boolean;
};

export const ActionButton = styled.button<ActionButtonProps>`
  border: 1px solid ${(props) => props.theme?.mode?.actionButtonBorder};
  transition: border-color ${(props) => props.theme?.modeTransition?.duration};
  outline: none;
  background-color: ${(props) => props.theme?.mode?.actionButtonBackground};

  height: 35px;
  padding: 0px 10px;
  font-size: 1.4rem;
  border-radius: 8px;
  font-size: 1.4rem;
  /* box-shadow: inset 0px 0px 0px 1px hsl(0, 0%, 75%); */
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration}, border ${(props) => props.theme?.modeTransition?.duration}, background-color ${(props) => props.theme?.modeTransition?.duration};
  /* text-transform: uppercase; */
  gap: 0.5rem;

  &:active {
    /* box-shadow: inset 0px 0px 0px 2px hsl(220, 65%, 54%); */
  }
  &:hover {
    border: 1px solid ${(props) => props.theme?.mode?.actionButtonBorderHover};
    background-color: ${(props) => props.theme?.mode?.actionButtonBackgroundHover};
    /* transition: 300ms; */
    /* box-shadow: inset 0px 0px 0px 1px black; */
  }
  &:hover svg {
    color: ${(props) => props.theme?.mode?.iconActionButtonHover};
  }
  & svg {
    color: ${(props) => props.theme?.mode?.iconActionButton};
    transition: color ${(props) => props.theme?.modeTransition?.duration}
  }

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
    `}
`;

type ActionSelectProps = {
  mw?: string;
};

export const ActionSelect = styled(Form.Select) <ActionSelectProps>`
  width: auto;
  min-width: ${(props) => props.mw || '100px'};
  border-radius: 8px;
  height: 35px;
`;

export const SearchInput = styled(Form.Input)`
  width: 150px;
  height: 35px;
  border-radius: 8px;
`;

export const SendButton = styled(ActionButton)`
  & img {
    width: 35px;
    height: 35px;
  }
`;

export const MenuItem = styled(BaseMenuItem)`
  font-size: 1.4rem;
`;

export const ThumbnailGrid = styled.ul`
  ${toDivStyle}

  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  justify-content: start;
  align-content: start;

  justify-items: center;
  align-items: center;
  grid-gap: 10px;
`;

type ImageCardProps = {
  selected?: boolean;
  inACart?: boolean;
};

export const Thumbnail = styled.li<ImageCardProps>`
  ${toDivStyle}

  position: relative;
  display: flex;
  width: 160px;
  height: 120px;
  transition: 300ms;
  cursor: pointer;

  ${(props) =>
    props.selected
      ? css`
          box-shadow: 0px 0px 0px 4px hsl(220, 65%, 54%);
        `
      : ''}
  ${(props) =>
    props.inACart
      ? css`
          border: 1px solid green;
        `
      : ''}
  border-radius: 8px;
  overflow: hidden;
`;

export const ThumbnailInfo = styled.p`
  ${toDivStyle}

  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  font-size: 14px;
  backdrop-filter: blur(0px);
  transition: 300ms;

  &:hover {
    opacity: 1;
    backdrop-filter: blur(1px);
  }
`;

export const ThumbnailImage = styled.img`
  object-fit: contain;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
`;
