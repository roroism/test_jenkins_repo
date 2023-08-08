import { spin } from '@app/src/components/Global.style';
import * as Modal from '@app/src/components/Modal.style';
import styled from '@emotion/styled';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const FaLoading = styled(FontAwesomeIcon)`
  animation: ${spin} 1s linear infinite;
`;

export const Body = styled(Modal.Body)`
  font-size: 100px;
  background: transparent;
`;

export function Loading() {
  return (
    <Modal.Container>
      <Modal.Background />
      <Body width='auto'>
        <FaLoading icon={faSpinnerThird} color='#3e70d6' />
      </Body>
    </Modal.Container>
  );
}
