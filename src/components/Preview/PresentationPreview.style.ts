import styled from '@emotion/styled';
import type { SerializedStyles } from '@emotion/react';

interface PreviewBoxProps {
  css?: SerializedStyles;
}

export const PreviewBox = styled.div<PreviewBoxProps>`
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};

  ${(props) => props.css};

  & > div:first-of-type {
    background-color: ${(props) => props.theme?.mode?.previewBackground};
  }
`;
