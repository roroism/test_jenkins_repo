import MuiButton from '@mui/material/Button';
import { Box as BaseBox } from '@app/src/components/Layout.style';
import { Select as BaseSelect, Input as BaseInput } from '@app/src/components/Form.style';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';

export const carouselWrapper = styled.div`
  overflow: hidden;
  background: var(--color-lightgrey);
  position: relative;
`;
export const carousel = styled.div`
  width: var(--carouselWidth);
  margin: 0 0 0 var(--carouselLeftMargin);
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;

  &.prev {
    animation-duration: 0.6s;
    animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
    animation-name: prev;
  }

  &.next {
    animation-duration: 0.6s;
    animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
    animation-name: next;
  }

  li {
    padding: 50px;
    text-align: center;
    width: calc(var(--cardWidth) - var(--card-margin) * 2);
    box-sizing: border-box;
  }
`;

export const ui = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  width: calc(100% - var(--card-margin) * 2);
  justify-content: space-between;
  padding: var(--card-margin);
  z-index: 100;
`;

export const button = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-ui);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--color-white);
  box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.25);
  border: 0;
  transition: all 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
`;

export const card = styled.li` {
    box-shadow: 0px 1px 2px 0px var(--card-shadow);
    border-radius: 4px;
    margin: var(--card-margin);
    background:var(--color-white);
  `;

export const next = keyframes`
  from {
    transform:translateX(0px);
  }
  to {
    transform:translateX(calc(0px + var(--cardWidth)));
  }
`;

export const prev = keyframes`
  from {
    transform:translateX(0px);
  }
  to {
    transform:translateX(calc(0px - var(--cardWidth)));
  }
`;
