import { ModalPlacer } from '@app//src/ModalPlacer';
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 0 20px;
  width: 100%;
  height: 100vh;
  overflow: auto;
  /* background: #f2f2f2; */
  background: #fff;
  transition: 500ms;
`;

export function Auth() {
  return (
    <>
      <Container>
        <Outlet />
      </Container>
      <ModalPlacer />
    </>
  );
}
