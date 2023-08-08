import styled from '@emotion/styled';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import { FormControlLabel as MuiFormControlLabel } from '@mui/material';

export const StyledButton = styled.button`
  display: flex;
  background: inherit;
  border:none;
  box-shadow:none;
  border-radius:0;
  padding:0;
  cursor:pointer;
  width: 102px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex-grow: 1;
  align-items: center;
`;

export const StyledListItemText = styled(ListItemText)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  & span {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
    text-align: left;
  }
`;

export const Search = styled('div')(({ theme }) => ({
  // position: 'relative',
  // borderRadius: theme.shape.borderRadius,
  // backgroundColor: alpha(theme.palette.common.white, 0.15),
  // '&:hover': {
  //   backgroundColor: alpha(theme.palette.common.white, 0.25),
  // },
  // marginRight: theme.spacing(2),
  // marginLeft: 0,
  // width: '100%',
  // [theme.breakpoints.up('sm')]: {
  //   marginLeft: theme.spacing(3),
  //   width: 'auto',
  // },
  position: 'relative',
  borderRadius: '4px',
  backgroundColor: '#fff',
  marginRight: '16px',
  marginLeft: '0',
  width: '100%',
  marginBottom: '4px',
  '& div.MuiInputBase-root': {
    width: '100%'
  }
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  // padding: theme.spacing(0, 2),
  padding: '0 16px',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  borderRadius: '4px',
  border: '1px solid #333',
  '& .MuiInputBase-input': {
    // padding: theme.spacing(1, 1, 1, 0),
    padding: '8px 8px 8px 32px',
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    // paddingLeft: '4px',
    // transition: theme.transitions.create('width'),
    width: '20ch',
    // width: '100%',
    // [theme.breakpoints.up('md')]: {
    //   width: '20ch',
    // },
    fontSize: '14px'
  },

}));

export const CheckboWxrapper = styled.div`
  display: flex;
  flex-grow: 0;
  
  & div.MuiListItemIcon-root {
    min-width: 0;
  }
`;

interface FormControlLabelProps {
  isSelected?: boolean;
}

export const FormControlLabel = styled(MuiFormControlLabel) <FormControlLabelProps>`
  margin: 0;
    
  & span.MuiFormControlLabel-label {
    color : ${(props) => props.isSelected ? '#3E70D6' : '#BBB'};
    font-weight: 700;
    font-size: 1.3rem;
    letter-spacing: .5px;
  }
  & span.MuiCheckbox-root {
    display: none;         
  }
`;

export const SlashText = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 .5rem;
  font-size: 1.3rem;
`;

export const TransferListWrapper = styled.div`

  & .MuiPaper-elevation {
    min-width: 250px;
  }
`;