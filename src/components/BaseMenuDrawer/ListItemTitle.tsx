import ListItem, { ListItemProps } from '@mui/material/ListItem';
import React from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import * as S from './BaseMenuDrawer.style';

interface ListItemTitleProps extends ListItemProps {
  to?: string;
  open?: boolean;
  title?: string;
}

export function ListItemTitle(props: ListItemTitleProps) {
  const { to, open, title, ...other } = props;

  let icon = null;
  if (open != null) {
    icon = open ? <ExpandLess className='icon-arrow' /> : <ExpandMore className='icon-arrow' />;
  }

  return (
    <S.StyledListItem {...other}>
      <S.StyledListItemTitleInnerWrapper>
        <div className='leftbox'>
          {/* <S.StyledFontAwesomeIcon icon={faUserCheck} /> */}
          <S.StyledListItemText className='title'>{title || ''}</S.StyledListItemText>
        </div>
        <div>{icon}</div>
      </S.StyledListItemTitleInnerWrapper>
    </S.StyledListItem>
  );
}
