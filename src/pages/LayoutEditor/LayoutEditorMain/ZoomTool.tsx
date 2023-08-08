import styled from '@emotion/styled';
import { faSearchMinus, faSearchPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';
import { CanvasObject } from '../lib/objects/fabric.canvas';

const Container = styled.div`
  z-index: 1;
  grid-area: canvas;
  place-self: end end;
  padding: 5px;

  font-size: 1.4rem;
  color: grey;

  & > *:not(:last-child) {
    margin-right: 5px;
  }
`;

const IconButton = styled.button`
  outline: none;
  border: none;
  padding: 0px;
  background: transparent;

  width: 30px;
  height: 30px;
  font-size: 1.4rem;
  transition: 300ms;
  border-radius: 8px;
  color: grey;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  &:active {
    background: '#3e70d6';
  }
`;

export function ZoomTool(props: { canvas: CanvasObject }) {
  const { canvas } = props;

  const currentZoom = canvas?.getZoom();

  const zoomOut = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const zoomStep = e.altKey ? (e.shiftKey ? 'BIG' : 'SMALL') : 'NORMAL';
    canvas.zoomHandler.zoom(-1, zoomStep);
  }, []);

  const zoomIn = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const zoomStep = e.altKey ? (e.shiftKey ? 'BIG' : 'SMALL') : 'NORMAL';
    canvas.zoomHandler.zoom(1, zoomStep);
  }, []);

  return (
    <Container>
      <IconButton onClick={zoomOut}>
        <FontAwesomeIcon icon={faSearchMinus} />
      </IconButton>
      <span style={{ color: 'grey' }}>{(Math.floor(currentZoom * 100) || 0) + ' %'}</span>
      <IconButton onClick={zoomIn}>
        <FontAwesomeIcon icon={faSearchPlus} />
      </IconButton>
    </Container>
  );
}
