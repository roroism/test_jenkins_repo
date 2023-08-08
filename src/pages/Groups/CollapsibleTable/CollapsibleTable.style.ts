import styled from '@emotion/styled';
import { TableCell as MuiTableCell, TableRow as MuiTableRow, IconButton as MuiIconButton } from '@mui/material';

export const TableCell = styled(MuiTableCell)`
  color: ${(props) => props.theme?.mode?.text};
  transition: color ${(props) => props.theme?.modeTransition?.duration};

  /* &:nth-child(3) {
    word-wrap: break-word;
  } */
`;

export const TableRow = styled(MuiTableRow)`
  /* cursor: pointer; */
  &:hover {
    background-color: ${(props) => props.theme?.mode?.tableTrBackgroundHover};
  }
`;

export const IconButton = styled(MuiIconButton)`
  & svg {
    color: ${(props) => props.theme?.mode?.text};
    transition: color ${(props) => props.theme?.modeTransition?.duration};
  }
`;

export const TitleGroup = styled.div`
  font-size: 2.0rem;
  font-weight: 700;
  margin: 16px 0; 
`;

export const TitleGroupInfo = styled.div`
  font-size: 1.6rem;
  margin: 0 0 16px;
`;