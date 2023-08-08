import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import * as Layout from '@app/src/components/Layout.style';
import * as Page from '@app/src/components/Page.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '@app/src/hooks/useTranslation';
import { useModal } from '@app/src/hooks/useModal';
import { faEdit } from '@fortawesome/pro-solid-svg-icons/faEdit';
// import { faTrash } from '@fortawesome/pro-solid-svg-icons/faTrash';
import { faTrash } from '@fortawesome/pro-regular-svg-icons/faTrash';
import { PermissionsLookup } from '../Groups';
import { UserData } from '@app/src/store/model';
import * as S from './CollapsibleTable.style';
import {
  Level,
  SocietyManagementAPIResponse,
} from '@app/src/apis/societyManagement/societyManagementApi.model';

// const rowName = ['그룹이름', '그룹매니저', '그룹유저', '그룹디바이스', '그룹카테고리'];
const rowName = [
  '그룹이름',
  ['유저이름', '유저레벨'],
  ['유저이름', '유저레벨'],
  ['디바이스', '소유자'],
  ['카테고리이름', '스피드'],
];

interface CollapsibleTableRow {
  row: SocietyManagementAPIResponse;
  userData: UserData;
  openSocietyEditDialog: (society: SocietyManagementAPIResponse) => void;
  openSocietyDeleteConfirm: (selectedSocieties: SocietyManagementAPIResponse[]) => void;
  tableStyle: any;
}

// function CollapsibleTableRow(props: { row: ReturnType<typeof createData> }) {
export default function CollapsibleTableRow(props: CollapsibleTableRow) {
  const { row, userData, openSocietyEditDialog, openSocietyDeleteConfirm, tableStyle } = props;
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <S.TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <S.TableCell align='center'>
          <S.IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </S.IconButton>
        </S.TableCell>
        <S.TableCell align='center'>{row?.name}</S.TableCell>
        <S.TableCell align='center'>
          {row?.users
            .filter(({ level }) => level === Level.MANAGER)
            .map((user, idx, array) => (
              <span key={user?.id}>{`${user?.userName}${
                array.length !== idx + 1 ? `, ` : ``
              }`}</span>
            ))}
        </S.TableCell>
        <S.TableCell align='center'>
          {row?.users
            .filter(({ level }) => level === Level.USER)
            .map((user, idx, array) => (
              <span key={user?.id}>{`${user?.userName}${
                array.length !== idx + 1 ? `, ` : ``
              }`}</span>
            ))}
        </S.TableCell>
        {/* <S.TableCell align="center">{row?.societyDevices.map((device) => <span key={device?.deviceId}>{`${device?.deviceName} `}</span>)}</S.TableCell> */}
        <S.TableCell align='center'>소속디바이스출력란</S.TableCell>
        <S.TableCell align='center'>
          {row?.categories.map(({ id, categoryName }, idx, array) => (
            <span key={`category${id}`}>{`${categoryName}${
              array.length !== idx + 1 ? `, ` : ``
            }`}</span>
          ))}
        </S.TableCell>
        <S.TableCell align='center'>
          <Page.TdActions>
            <Page.FunctionButton onClick={() => openSocietyEditDialog(row)}>
              <FontAwesomeIcon icon={faEdit} color='#3e70d6' />
            </Page.FunctionButton>
            {PermissionsLookup[userData.userRight] >= PermissionsLookup['SUPER_ADMIN'] && (
              <Page.FunctionButton onClick={() => openSocietyDeleteConfirm([row])}>
                <FontAwesomeIcon icon={faTrash} color='#e85050' />
              </Page.FunctionButton>
            )}
          </Page.TdActions>
        </S.TableCell>
      </S.TableRow>
      <TableRow>
        <S.TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <S.TitleGroup>{row?.name}</S.TitleGroup>
              <Layout.Box display='flex' gap='10px'>
                <Layout.Box flexGrow='1'>
                  <S.TitleGroupInfo>Managers</S.TitleGroupInfo>
                  <Table size='small' aria-label='purchases'>
                    <TableHead>
                      <TableRow>
                        <S.TableCell align='center'>유저이름</S.TableCell>
                        <S.TableCell align='center'>유저레벨</S.TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row?.users
                        .filter(({ level }) => level === Level.MANAGER)
                        .map((item) => (
                          <TableRow key={item?.id}>
                            <S.TableCell align='center'>{item?.userName}</S.TableCell>
                            <S.TableCell align='center'>{item?.level}</S.TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Layout.Box>
                <Layout.Box flexGrow='1'>
                  <S.TitleGroupInfo>Users</S.TitleGroupInfo>
                  <Table size='small' aria-label='purchases'>
                    <TableHead>
                      <TableRow>
                        <S.TableCell align='center'>유저이름</S.TableCell>
                        <S.TableCell align='center'>유저레벨</S.TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row?.users
                        .filter(({ level }) => level === Level.USER)
                        .map((item) => (
                          <TableRow key={item?.id}>
                            <S.TableCell align='center'>{item?.userName}</S.TableCell>
                            <S.TableCell align='center'>{item?.level}</S.TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Layout.Box>
                <Layout.Box flexGrow='1'>
                  <S.TitleGroupInfo>Devices</S.TitleGroupInfo>
                  <Table size='small' aria-label='purchases'>
                    <TableHead>
                      <TableRow>
                        <S.TableCell align='center'>디바이스</S.TableCell>
                        <S.TableCell align='center'>소유자</S.TableCell>
                      </TableRow>
                    </TableHead>
                    {/* <TableBody>
                      {row?.societyDevices.map((item) => (
                        <TableRow key={item?.deviceId}>
                          <S.TableCell align="center">
                            {item?.deviceName}
                          </S.TableCell>
                          <S.TableCell align="center">{item?.owner}</S.TableCell>
                        </TableRow>
                      ))}
                    </TableBody> */}
                    <TableBody>소속디바이스출력란</TableBody>
                  </Table>
                </Layout.Box>
                <Layout.Box flexGrow='1'>
                  <S.TitleGroupInfo>Categories</S.TitleGroupInfo>
                  <Table size='small' aria-label='purchases'>
                    <TableHead>
                      <TableRow>
                        <S.TableCell align='center'>카테고리이름</S.TableCell>
                        <S.TableCell align='center'>스피드</S.TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row?.categories.map((item) => (
                        <TableRow key={item?.id}>
                          <S.TableCell align='center'>{item?.categoryName}</S.TableCell>
                          <S.TableCell align='center'>{item?.id}</S.TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Layout.Box>
              </Layout.Box>
            </Box>
          </Collapse>
        </S.TableCell>
      </TableRow>
    </>
  );
}
