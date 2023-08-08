import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Container = styled.div`
  text-align: center;
  /* height: 30px; */
  padding: 8px 0 4px;
`;

export const PaginateButton = styled.button`
  display: inline-block;
  outline: none;
  border: none;
  background: transparent;
  border-radius: 8px;
  padding: 0px;
  width: 30px;
  height: 30px;
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};

  &:hover {
    background-color: ${(props) => props.theme?.mode?.backgroundNavMenuHover};
  }
  &:active {
    background: hsl(220, 65%, 60%);
  }
  &:disabled {
    cursor: unset;
    opacity: 0.5;
  }
  &:disabled:active,
  &:disabled:hover {
    background: transparent;
  }
`;

export const PaginateIcon = styled(FontAwesomeIcon)`
  font-size: 12px;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;

export const Pages = styled.ol`
  display: inline-block;
  padding: 0px;
  margin: 0px 10px;

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`;

type PageProps = {
  selected?: boolean;
};

export const Page = styled.li<PageProps>`
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration},
    background-color ${(props) => props.theme?.modeTransition?.duration};

  &:hover {
    background-color: ${(props) => props.theme?.mode?.backgroundNavMenuHover};
  }

  ${(props) =>
    props.selected &&
    css`
      background: #3e70d6;
      color: white;

      &:hover {
        background: hsl(220, 65%, 45%);
      }
    `}
`;
