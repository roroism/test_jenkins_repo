import styled from '@emotion/styled';
import type { SerializedStyles } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { spin } from '@app/src/components/Global.style';

interface PreviewBoxProps {
  css?: SerializedStyles;
}

export const PreviewBox = styled.div<PreviewBoxProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  background-color: ${(props) => props.theme?.mode?.previewBackground};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};

  ${(props) => props.css};
`;

export const OriginalImage = styled.img`
  width: 100%;
  object-fit: contain;
  transition: 500ms;
`;

export const FaLoading = styled(FontAwesomeIcon)`
  animation: ${spin} 1s linear infinite;
`;
