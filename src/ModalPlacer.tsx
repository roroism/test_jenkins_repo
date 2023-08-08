import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { modalActions, selectModals } from './store/slices/modalSlice';

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 1;
`;

export const ModalPlacer: React.FC = () => {
  const dispatch = useDispatch();
  const modals = useSelector(selectModals());

  return (
    <Container>
      {modals.map((modal) => ({
        ...modal.ui,
        key: modal.key,
        props: {
          ...modal.ui.props,
          modalId: modal.key,
          closeSelf: () => {
            dispatch(modalActions.close(modal.key));
          },
        },
      }))}
    </Container>
  );
};
