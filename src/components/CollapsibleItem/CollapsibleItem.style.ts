import styled from '@emotion/styled';
import { Icon, ListItemText } from '@mui/material';

export const Container = styled.div`
  background-color: ${(props) => props.theme?.mode?.background};
  transition: background-color ${(props) => props.theme?.modeTransition?.duration};
  width: 100%;

  border: 1px solid ${(props) => props.theme?.mode?.actionButtonBorder};
`;

export const TitleBox = styled.div`
  display: flex;
  padding: 1.5rem 3rem;
  justify-content: space-between;

  &:hover {
    background: ${(props) => props.theme?.mode?.backgroundAsideHover};
    cursor: pointer;
  }

  /* title text */
  & span {
    font-size: 2.5rem;
    color: ${(props) => props.theme?.mode?.text};
  }

  & svg {
    width: 1.5rem;
    height: auto;
  }
`;

export const CollapsibleContent = styled.div`
  padding: 2rem 3rem;
  height: fit-content;
`;
