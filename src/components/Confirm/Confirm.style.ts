import styled from '@emotion/styled';

export const Paragraph = styled.p`
  margin: 0px;
  font-size: 14px;
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};
`;
