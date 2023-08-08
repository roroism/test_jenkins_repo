import React, { useCallback, useMemo, useState } from 'react';
import { SocietyUserType } from '@app/src/apis/societyManagement';
import * as Page from '@app/src/components/Page.style';
import * as Table from '@app/src/components/DataTable.style';
import * as S from './SocietyUserManage.style';

import Button from '../../Button/Button';
import { Checkbox } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/pro-regular-svg-icons';

export interface SocietyUsersManagePropsType {
  users: SocietyUserType[];
}

/**
 * society user data table, action buttons
 */
const SocietyUsersManage = ({ users }: SocietyUsersManagePropsType) => {
  const [selectedUserIdList, setSelectedUserIdList] = useState([]);
  const usersIdList = useMemo(() => users.map((u) => u.userId), [users]);

  const allChecked = useMemo(
    () => selectedUserIdList.length === usersIdList.length,
    [selectedUserIdList, usersIdList]
  );

  const toggleAllSelect = useCallback(() => {
    if (selectedUserIdList.length > 0) {
      setSelectedUserIdList([]);
      return;
    }
    setSelectedUserIdList(usersIdList);
  }, [selectedUserIdList]);

  const onCheck = useCallback(
    (userId: string, checked: boolean) => {
      if (checked) {
        setSelectedUserIdList((prev) => prev.filter((id) => id !== userId));
        return;
      }
      setSelectedUserIdList((prev) => [...prev, userId]);
    },
    [selectedUserIdList]
  );

  return (
    <>
      <Page.Actions>
        <Button
          title='사용자 추가'
          icon={<FontAwesomeIcon icon={faPlusCircle} size='lg' />}
          disabled={false}
          onClick={() => {}}
        />
        <Button
          title='선택한 유저 퇴출'
          icon={<FontAwesomeIcon icon={faTrash} size='lg' />}
          disabled={false}
          onClick={() => {}}
        />
      </Page.Actions>
      <Table.Table>
        <Table.THead>
          <Table.THeadTr sx={S.THeadGrid}>
            <Table.Th>
              <Checkbox checked={allChecked} onClick={toggleAllSelect} />
            </Table.Th>
            {['ID', '이메일', '권한', '만료일', '전화번호', ''].map((title, index) => (
              <Table.Th key={`title-${index}`}>{title}</Table.Th>
            ))}
          </Table.THeadTr>
        </Table.THead>
        <Table.TBody>
          {users.map((row) => {
            const isChecked = selectedUserIdList.includes(row.userId);
            return makeRow(row, isChecked, onCheck);
          })}
        </Table.TBody>
      </Table.Table>
    </>
  );
};

// TODO : email, endDate, phoneNumber 추가하기
const makeRow = (
  user: SocietyUserType,
  isChecked: boolean,
  onChecked: (userId: String, checked: boolean) => void
) => {
  return (
    <Table.TBodyTr sx={S.THeadGrid} key={`${user.displayName}`}>
      <Table.Td>
        <Checkbox checked={isChecked} onChange={() => onChecked(user.userId, isChecked)} />
      </Table.Td>
      <Table.Td>{user.displayName}</Table.Td>
      <Table.Td>email@cublick.com</Table.Td>
      <Table.Td>{user.level}</Table.Td>
      <Table.Td>endDate</Table.Td>
      <Table.Td>010-0000-0000</Table.Td>
      <Table.Td>
        <S.ButtonBox>
          {/* <div>수정</div>
          <div>삭제</div> */}
          <Page.FunctionButton>
            <FontAwesomeIcon icon={faEdit} color='#3e70d6' onClick={() => {}} />
          </Page.FunctionButton>
          <Page.FunctionButton>
            <FontAwesomeIcon icon={faTrash} color='#e85050' onClick={() => {}} />
          </Page.FunctionButton>
        </S.ButtonBox>
      </Table.Td>
    </Table.TBodyTr>
  );
};

export default SocietyUsersManage;
