import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CollapsibleTableRow from './CollapsibleTableRow';
import * as S from './CollapsibleTable.style';
import { SocietyManagementAPIResponse } from '@app/src/apis/societyManagement/societyManagementApi.model';

const rowName = ['그룹이름', '그룹매니저', '그룹유저', '그룹디바이스', '그룹카테고리', '동작'];

interface CollapsibleTableProps {
  societies: SocietyManagementAPIResponse[];
  userData: any;
  openSocietyEditDialog: (society: SocietyManagementAPIResponse) => void;
  openSocietyDeleteConfirm: (selectedSocieties: SocietyManagementAPIResponse[]) => void;
  tableStyle?: any;
}

export default function CollapsibleTable({ societies, userData, openSocietyEditDialog, openSocietyDeleteConfirm, tableStyle }: CollapsibleTableProps) {
  console.log('societies : ', societies);
  return (
    // <TableContainer component={Paper}>
    <Table aria-label="collapsible table" sx={{ '& th, td': { fontSize: '1.4rem' } }} >
      <TableHead>
        <TableRow>
          <S.TableCell />
          {rowName?.map((headingRow, idx) => <S.TableCell key={`$headingRow${idx}`} align='center'>{headingRow}</S.TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {societies?.map((row) => (
          <CollapsibleTableRow key={row?.id} row={row} userData={userData} openSocietyEditDialog={openSocietyEditDialog} openSocietyDeleteConfirm={openSocietyDeleteConfirm} tableStyle={tableStyle} />
        ))}
      </TableBody>
    </Table >
    // </TableContainer>
  );
}