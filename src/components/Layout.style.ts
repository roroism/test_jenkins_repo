import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { ChromePicker as BaseChromePicker } from 'react-color';

interface BoxProps extends React.CSSProperties {
  mb?: string;
  mr?: string;
  ml?: string;
  mt?: string;
  pb?: string;
  pr?: string;
  pl?: string;
  pt?: string;
  w?: string;
  h?: string;
  minW?: string;
  maxW?: string;
  minH?: string;
  maxH?: string;
}

type MainCategoryProps = {
  select?: boolean;
};

export const Box = styled.div<BoxProps>`
  ${(props) => (props.position ? `position: ${props.position};` : '')}

  ${(props) => (props.display ? `display: ${props.display};` : '')}
  ${(props) => (props.flex ? `flex: ${props.flex};` : '')}
  ${(props) => (props.justifyContent ? `justify-content: ${props.justifyContent};` : '')}
  ${(props) => (props.flexDirection ? `flex-direction: ${props.flexDirection};` : '')}
  ${(props) => (props.flexGrow ? `flex-grow: ${props.flexGrow};` : '')}
  ${(props) => (props.flexWrap ? `flex-wrap: ${props.flexWrap};` : '')}
  ${(props) => (props.alignItems ? `align-items: ${props.alignItems};` : '')}
  ${(props) => (props.alignContent ? `align-content: ${props.alignContent};` : '')}
  ${(props) => (props.gap ? `gap: ${props.gap};` : '')}
  ${(props) => (props.overflow ? `overflow: ${props.overflow};` : '')}

  ${(props) => (props.margin ? `margin: ${props.margin};` : '')}
  ${(props) => (props.mb ? `margin-bottom: ${props.mb};` : '')}
  ${(props) => (props.mr ? `margin-right: ${props.mr};` : '')}
  ${(props) => (props.ml ? `margin-left: ${props.ml};` : '')}
  ${(props) => (props.mt ? `margin-top: ${props.mt};` : '')}
  ${(props) => (props.padding ? `padding: ${props.padding};` : '')}
  ${(props) => (props.pb ? `padding-bottom: ${props.pb};` : '')}
  ${(props) => (props.pr ? `padding-right: ${props.pr};` : '')}
  ${(props) => (props.pl ? `padding-left: ${props.pl};` : '')}
  ${(props) => (props.pt ? `padding-top: ${props.pt};` : '')}

  ${(props) => (props.width ? `width: ${props.width};` : '')}
  ${(props) => (props.height ? `height: ${props.height};` : '')}
  ${(props) => (props.maxWidth ? `max-width: ${props.maxWidth};` : '')}
  ${(props) => (props.maxHeight ? `max-height: ${props.maxHeight};` : '')}
  ${(props) => (props.minWidth ? `min-width: ${props.minWidth};` : '')}
  ${(props) => (props.maxHeight ? `min-height: ${props.maxHeight};` : '')}
  ${(props) => (props.w ? `width: ${props.w};` : '')}
  ${(props) => (props.h ? `height: ${props.h};` : '')}
  ${(props) => (props.maxW ? `max-width: ${props.maxW};` : '')}
  ${(props) => (props.maxH ? `max-height: ${props.maxH};` : '')}
  ${(props) => (props.minH ? `min-width: ${props.minH};` : '')}
  ${(props) => (props.maxH ? `min-height: ${props.maxH};` : '')}

  ${(props) => (props.border ? `border: ${props.border};` : '')}
  ${(props) => (props.borderTop ? `border-top: ${props.borderTop};` : '')}
  ${(props) => (props.borderBottom ? `border-bottom: ${props.borderBottom};` : '')}
  ${(props) => (props.borderLeft ? `border-left: ${props.borderLeft};` : '')}
  ${(props) => (props.borderRight ? `border-right: ${props.borderRight};` : '')}
  ${(props) => (props.borderRadius ? `border-radius: ${props.borderRadius};` : '')}
  ${(props) => (props.textAlign ? `text-align: ${props.textAlign};` : '')}

  ${(props) => (props.backgroundColor ? `background-color: ${props.backgroundColor};` : '')}
`;

export const SubTitle = styled.h2`
  margin: 0px 0px 20px 0px;
  font-size: 18px;
  font-weight: bold;

  display: flex;
`;

export const ChromePicker = styled(BaseChromePicker)`
  & * {
    z-index: auto !important;
  }
  box-shadow: 0px 0px 8px 0px hsl(0, 0%, 75%) !important;
  border-radius: 8px !important;
  overflow: hidden !important;
`;
export const CategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
`;

export const CategoryItem = styled.div<MainCategoryProps>`
  border: 1px solid gray;
  width: 60px;
  height: 25px;
  font-size: 14px;
  margin: 3px;
  border-radius: 5px;
  text-align: center;
  color: gray;
  ${(props) =>
    props.select
      ? css`
          background-color: #3e70d6;
          color: white;
        `
      : ''}
  :hover {
    background-color: #3e70d6;
    color: white;
    cursor: pointer;
  }
`;
