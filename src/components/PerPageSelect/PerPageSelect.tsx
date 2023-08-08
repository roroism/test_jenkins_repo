import { useMuiSafeMenu } from '@app/src/hooks/useMuiSafeMenu';
import { Menu, Tooltip, Typography } from '@mui/material';
import * as Page from '@app/src/components/Page.style';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faListOl } from '@fortawesome/pro-solid-svg-icons';

export interface PerPageSelectProps {
  selectedN: number;
  fromToArray: number[];
  onClick: any;
}

const PerPageSelect = ({ selectedN, fromToArray, onClick }) => {
  const perPageMenu = useMuiSafeMenu();

  const onSelected = (num: number) => {
    onClick(num);
  };

  return (
    <>
      <Tooltip title={<Typography>n개씩 보기</Typography>} placement='top'>
        <Page.ActionButton {...perPageMenu.triggerProps}>
          <FontAwesomeIcon icon={faListOl} />
          &nbsp; {selectedN}개씩 보기
        </Page.ActionButton>
      </Tooltip>
      <Menu {...perPageMenu.popperProps}>
        {fromToArray.map((perPage: number) => (
          <Page.MenuItem key={perPage} onClick={() => onSelected(perPage)}>
            {selectedN === perPage ? <FontAwesomeIcon icon={faCheck} /> : null}
            &nbsp;{perPage}개씩 보기
          </Page.MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default React.memo(PerPageSelect);
// export default PerPageSelect;
